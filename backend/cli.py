#!/usr/bin/env python

import csv
import os
import sys
import typer

# Add parent directory to path to enable package imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from backend.db import db_session, init_db
    from backend.models import User, Transaction
except ImportError:
    # Fallback for direct execution
    from db import db_session, init_db
    from models import User, Transaction

# CLI command to seed the database
cli = typer.Typer()

@cli.command()
def seed():
    """Seeds the database with initial data."""
    print("Initializing database.")
    init_db()
    print("Database initialized.")

    # Clear existing data - transactions first due to foreign keys
    Transaction.query.delete()
    User.query.delete()

    # Get the path to the CSV file
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, 'data', 'users.csv')

    try:
        with open(data_path, mode='r') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                user = User(
                    id=row['user_id'],
                    user_name=row['user_name'],
                    initial_balance_usd=float(row['initial_balance_usd'])
                )
                db_session.add(user)
        db_session.commit()
        print("Users seeded successfully.")
    except FileNotFoundError:
        print(f"Error: Could not find the data file at {data_path}")
    except Exception as e:
        db_session.rollback()
        print(f"An error occurred during seeding: {e}")

if __name__ == "__main__":
    cli()