from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class User(SQLModel, table=True):
    # We use 'str' here because Clerk IDs are strings (e.g., 'user_2NPa...')
    id: str = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # One user can have many opportunities
    opportunities: List["Opportunity"] = Relationship(back_populates="user")

class Opportunity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True)
    status: str  # "New" | "Contacted" | "Follow-Up" | "Won" | "Lost"
    value: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # LINK TO USER
    user_id: str = Field(foreign_key="user.id", index=True)
    user: Optional[User] = Relationship(back_populates="opportunities")

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
    
    # Foreign Key setup
    opportunity_id: int = Field(foreign_key="opportunity.id")
    opportunity: Optional[Opportunity] = Relationship(back_populates="interactions")