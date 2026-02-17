# database.py
import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Engine configuration for Neon
engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    """Initializes the database and creates tables if they don't exist."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency for FastAPI to provide a database session."""
    with Session(engine) as session:
        yield session