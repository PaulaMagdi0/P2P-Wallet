import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

# Relative imports with fallback
try:
    from .models import User as UserModel, Transaction as TransactionModel
    from .db import db_session
except ImportError:
    from models import User as UserModel, Transaction as TransactionModel
    from db import db_session

class Transaction(SQLAlchemyObjectType):
    class Meta:
        model = TransactionModel

class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel

    current_balance = graphene.Float()
    transactions = graphene.List(Transaction)

    def resolve_current_balance(parent, info):
        incoming = db_session.query(func.sum(TransactionModel.amount)).filter(
            TransactionModel.receiver_id == parent.id
        ).scalar() or 0

        outgoing = db_session.query(func.sum(TransactionModel.amount)).filter(
            TransactionModel.sender_id == parent.id
        ).scalar() or 0

        return parent.initial_balance_usd + incoming - outgoing

    def resolve_transactions(parent, info):
        txns = db_session.query(TransactionModel).filter(
            (TransactionModel.sender_id == parent.id) |
            (TransactionModel.receiver_id == parent.id)
        ).order_by(TransactionModel.timestamp.desc()).all()
        return txns

class SendMoney(graphene.Mutation):
    class Arguments:
        from_user_id = graphene.ID(required=True)
        to_user_id = graphene.ID(required=True)
        amount = graphene.Float(required=True)

    ok = graphene.Boolean()
    message = graphene.String()
    transaction = graphene.Field(lambda: Transaction)

    def mutate(self, info, from_user_id, to_user_id, amount):
        # Validate amount
        if amount <= 0:
            return SendMoney(ok=False, message="Amount must be greater than zero.")
        
        # Check if sending to self
        if from_user_id == to_user_id:
            return SendMoney(ok=False, message="Cannot send money to yourself.")

        try:
            # Start transaction
            db_session.begin()
            
            # Lock sender row for update using the method directly
            sender = db_session.query(UserModel).filter(
                UserModel.id == from_user_id
            ).with_for_update().first()
            
            receiver = db_session.query(UserModel).filter(
                UserModel.id == to_user_id
            ).first()

            if not sender:
                return SendMoney(ok=False, message="Sender does not exist.")
            if not receiver:
                return SendMoney(ok=False, message="Receiver does not exist.")

            # Calculate sender balance
            incoming = db_session.query(func.sum(TransactionModel.amount)).filter(
                TransactionModel.receiver_id == sender.id
            ).scalar() or 0
            outgoing = db_session.query(func.sum(TransactionModel.amount)).filter(
                TransactionModel.sender_id == sender.id
            ).scalar() or 0

            current_balance = sender.initial_balance_usd + incoming - outgoing

            if current_balance < amount:
                return SendMoney(ok=False, message="Insufficient balance.")

            # Create transaction
            new_txn = TransactionModel(
                sender_id=from_user_id,
                receiver_id=to_user_id,
                amount=amount,
                timestamp=datetime.utcnow()
            )
            db_session.add(new_txn)
            db_session.commit()
            return SendMoney(ok=True, message="Transfer successful.", transaction=new_txn)
            
        except SQLAlchemyError as e:
            db_session.rollback()
            return SendMoney(ok=False, message=f"Database error: {str(e)}")
        except Exception as e:
            db_session.rollback()
            return SendMoney(ok=False, message=f"Transfer failed: {str(e)}")

class Mutations(graphene.ObjectType):
    send_money = SendMoney.Field()

class Query(graphene.ObjectType):
    user = graphene.Field(User, id=graphene.ID(required=True))
    all_users = graphene.List(User)

    def resolve_user(self, info, id):
        return db_session.query(UserModel).filter(UserModel.id == id).first()

    def resolve_all_users(self, info):
        return db_session.query(UserModel).all()

schema = graphene.Schema(query=Query, mutation=Mutations)