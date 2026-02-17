from sqlmodel import Session, select
from database import engine
from models import Opportunity, Interaction
from datetime import datetime

# Seed Data from your frontend demo
SEED_OPPORTUNITIES = [
    {"name": "John Doe", "email": "john@email.com", "status": "Contacted", "value": 1200.0},
    {"name": "Jane Smith", "email": "jane@company.com", "status": "New", "value": 4500.0},
    {"name": "Acme Corp", "email": "deals@acme.com", "status": "Follow-Up", "value": 12000.0},
    {"name": "Sarah Lee", "email": "sarah@startup.io", "status": "Won", "value": 8500.0},
    {"name": "Bob Williams", "email": "bob@enterprise.co", "status": "Lost", "value": 3200.0},
]

def seed_database():
    with Session(engine) as session:
        # 1. Check if we already have data to avoid duplicates
        statement = select(Opportunity)
        existing_data = session.exec(statement).first()
        
        if existing_data:
            print("Database already contains data. Skipping seed.")
            return

        print("Seeding opportunities...")
        
        # 2. Add Opportunities
        db_opportunities = []
        for opp_data in SEED_OPPORTUNITIES:
            opp = Opportunity(**opp_data)
            session.add(opp)
            db_opportunities.append(opp)
        
        # Flush to get IDs for foreign keys
        session.flush()

        # 3. Add Sample Interactions (mapping to John Doe)
        john_doe = db_opportunities[0]
        interactions = [
            Interaction(
                opportunity_id=john_doe.id,
                type="Phone Call",
                notes="Client interested in our premium plan. Asked about pricing tiers.",
                timestamp=datetime.utcnow()
            ),
            Interaction(
                opportunity_id=john_doe.id,
                type="Email Sent",
                notes="Sent detailed pricing breakdown with comparison chart.",
                timestamp=datetime.utcnow()
            )
        ]
        
        for interaction in interactions:
            session.add(interaction)

        session.commit()
        print("Successfully seeded Neon database!")

if __name__ == "__main__":
    seed_database()