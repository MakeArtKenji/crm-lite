from sqlmodel import Session, select
from database import engine
from models import Opportunity, Interaction, User
from datetime import datetime

# Your actual Clerk ID from the dashboard
CLERK_USER_ID = "user_39iln2zh89jDKdDcBr3x2CuCmdP"

# Seed Data updated to include floating-point values and consistent naming
SEED_OPPORTUNITIES = [
    {"name": "John Doe", "email": "john@email.com", "status": "Contacted", "value": 1200.0},
    {"name": "Jane Smith", "email": "jane@company.com", "status": "New", "value": 4500.0},
    {"name": "Acme Corp", "email": "deals@acme.com", "status": "Follow-Up", "value": 12000.0},
    {"name": "Sarah Lee", "email": "sarah@startup.io", "status": "Won", "value": 8500.0},
    {"name": "Bob Williams", "email": "bob@enterprise.co", "status": "Lost", "value": 3200.0},
]

def seed_database():
    with Session(engine) as session:
        # 1. Create or verify the Clerk User exists in Neon
        db_user = session.get(User, CLERK_USER_ID)
        if not db_user:
            print(f"Creating seed user: {CLERK_USER_ID}")
            db_user = User(
                id=CLERK_USER_ID,
                email="kennonirom@gmail.com",
                full_name="Kenn Onirom",
                created_at=datetime.utcnow()
            )
            session.add(db_user)
            session.commit()
            session.refresh(db_user)

        # 2. Check for existing opportunities to prevent duplicates
        statement = select(Opportunity).where(Opportunity.user_id == CLERK_USER_ID)
        existing_data = session.exec(statement).first()
        
        if existing_data:
            print("Database already contains opportunities for this user. Skipping seed.")
            return

        print(f"Seeding opportunities for user {CLERK_USER_ID}...")
        
        # 3. Add Opportunities linked to your User ID
        db_opportunities = []
        for opp_data in SEED_OPPORTUNITIES:
            opp = Opportunity(
                **opp_data,
                user_id=CLERK_USER_ID  # This is the critical link you were missing
            )
            session.add(opp)
            db_opportunities.append(opp)
        
        # Flush to get primary keys for interactions
        session.flush()

        # 4. Add Sample Interactions (mapping to the first opportunity)
        first_opp = db_opportunities[0]
        interactions = [
            Interaction(
                opportunity_id=first_opp.id,
                type="Phone Call",
                notes="Client interested in our premium plan. Asked about pricing tiers.",
                timestamp=datetime.utcnow()
            ),
            Interaction(
                opportunity_id=first_opp.id,
                type="Email Sent",
                notes="Sent detailed pricing breakdown with comparison chart.",
                timestamp=datetime.utcnow()
            )
        ]
        
        for interaction in interactions:
            session.add(interaction)

        session.commit()
        print("Successfully seeded Neon database with user-linked data!")

if __name__ == "__main__":
    seed_database()