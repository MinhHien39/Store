# app/db/session.py
from sqlmodel import create_engine, Session
from app.core import logger, settings

# Create once the database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True, # for MySQL, Avoid "MySQL server has gone away" error

    # --- SQLAlchemy QueuePool defaults ---
    pool_size=5,         # Default: keep 5 connections in the pool
    max_overflow=10,     # Default: allow up to 10 extra connections above pool_size
    pool_timeout=30,     # Default: seconds to wait for a connection before raising
    pool_recycle=-1,     # Default: never recycle connections automatically

    connect_args={
        "charset": "utf8mb4",                           # for MySQL, Ensure UTF-8 encoding
        "init_command": "SET time_zone = '+09:00'"      # for MySQL, Set timezone to JST
    }
)

# For read-only operations
def get_read_session():
    with Session(engine) as db:
        yield db

# For operations that may modify data, with commit/rollback
def get_write_session():
    db = Session(engine)
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Database session error: {e}")
        raise 
    finally:
        db.close()

# For background tasks that need a separate session
def get_worker_session():
    db = Session(engine)
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Database session error: {e}")
        raise 
    finally:
        db.close()