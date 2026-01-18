from sqlmodel import SQLModel, create_engine, Session

import os

# Check for DATABASE_URL env var (Railway/Prod), else fallback to SQLite (Local)
database_url = os.environ.get("DATABASE_URL")

if database_url and database_url.startswith("postgres"):
    # Fix for SQLAlchemy (requires postgresql:// instead of postgres://)
    database_url = database_url.replace("postgres://", "postgresql://")
    connect_args = {} # No check_same_thread for Postgres
    engine = create_engine(database_url, echo=False)
else:
    sqlite_file_name = "database.db"
    database_url = f"sqlite:///{sqlite_file_name}"
    connect_args = {"check_same_thread": False}
    engine = create_engine(database_url, echo=True, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
