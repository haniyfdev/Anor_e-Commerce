from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings 
# .config - config.py shu papkada turibdi degani

# -----  database url  -----
DATABASE_URL = settings.DATABASE_URL

# -----  sqlalchemy engine  -----
engine = create_engine(DATABASE_URL)

# -----  sessionlocal (db session)  -----
SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

# -----  base class for models  -----
Base = declarative_base()

# -----  ?  -----
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
