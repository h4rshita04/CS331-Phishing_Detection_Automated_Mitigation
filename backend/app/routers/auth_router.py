from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.user import UserCreate
from app.services.auth_service import register_user, authenticate_user
from app.database.connection import get_db


router = APIRouter(prefix="/auth", tags=["Authentication"])


# SIGNUP (Still uses JSON — correct)
@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):

    new_user = register_user(db, user.email, user.password)

    if not new_user:
        raise HTTPException(status_code=400, detail="User already exists")

    return {"message": "User created successfully"}


# LOGIN (NOW OAuth Compatible)
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    token = authenticate_user(
        db,
        form_data.username,   # OAuth uses "username"
        form_data.password
    )

    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": token,
        "token_type": "bearer"
    }

