from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class Opportunity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True)
    status: str  # "New" | "Contacted" | "Follow-Up" | "Won" | "Lost"
    value: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to interactions: deleting an Opportunity deletes its history
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