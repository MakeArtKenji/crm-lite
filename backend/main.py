# main.py
from fastapi import FastAPI, Depends
from sqlmodel import SQLModel, Field, create_engine, Session, select, Relationship
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Neon requires standard sync engine for this setup
engine = create_engine(DATABASE_URL)

# --- DATABASE MODELS ---

class Opportunity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True)
    status: str  # "New" | "Contacted" | "Follow-Up" | "Won" | "Lost"
    value: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to interactions
    interactions: List["Interaction"] = Relationship(
        back_populates="opportunity", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

class Interaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str # "Phone Call" | "Email Sent" | "Meeting Notes" | "Custom Note"
    notes: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign Key
    opportunity_id: int = Field(foreign_key="opportunity.id")
    opportunity: Optional[Opportunity] = Relationship(back_populates="interactions")

# --- DATABASE SYNC ---

def create_db_and_tables():
    # This is the command that "pushes" the schema to Neon
    SQLModel.metadata.create_all(engine)

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"status": "CRM Lite API is Online", "database": "Connected to Neon"}

# Dependency to get DB session
def get_session():
    with Session(engine) as session:
        yield session

# Example route to see your data
@app.get("/opportunities", response_model=List[Opportunity])
def get_opps(session: Session = Depends(get_session)):
    return session.exec(select(Opportunity)).all()