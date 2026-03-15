from sqlalchemy import Column, Integer, String, Boolean, Text
from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Gmail OAuth fields
    gmail_token     = Column(Text, nullable=True)
    gmail_connected = Column(Boolean, default=False)