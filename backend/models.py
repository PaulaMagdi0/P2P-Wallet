from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from .db import Base
import datetime

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    user_name = Column(String(50), unique=True, nullable=False)
    initial_balance_usd = Column(Float, nullable=False)

    # Relationships for transactions
    transactions_sent = relationship("Transaction", back_populates="sender", foreign_keys='Transaction.sender_id')
    transactions_received = relationship("Transaction", back_populates="receiver", foreign_keys='Transaction.receiver_id')

class Transaction(Base):
    __tablename__ = 'transactions'
    __table_args__ = (
        CheckConstraint('amount > 0', name='positive_amount'),
    )
    
    id = Column(Integer, primary_key=True)
    sender_id = Column(String, ForeignKey('users.id'), nullable=False)
    receiver_id = Column(String, ForeignKey('users.id'), nullable=False)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="transactions_sent")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="transactions_received")