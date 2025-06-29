from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Create database engine
engine = create_engine('sqlite:///wallet.db', connect_args={"check_same_thread": False})

# Create scoped session
db_session = scoped_session(sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
))

# Create base class for models
Base = declarative_base()
Base.query = db_session.query_property()

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def init_db():
    # Import models before creating tables
    from .models import User, Transaction
    Base.metadata.create_all(bind=engine)