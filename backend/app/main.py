from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, threat_router, gmail_router

from app.routers import auth_router, threat_router
from app.database.connection import Base, engine
from app.models import user


# Create FastAPI app FIRST
app = FastAPI(title="PhishGaurd Security Platform")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later you can restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)


# Include routers AFTER app creation
# app.include_router(auth_router.router)
app.include_router(auth_router.router)
app.include_router(threat_router.router)
app.include_router(gmail_router.router)

# OAuth scheme (tells FastAPI how to read the token)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@app.get("/")
def health_check():
    return {"status": "Backend running securely"}


# PROTECTED ROUTE
@app.get("/protected")
def protected(token: str = Depends(oauth2_scheme)):
    return {
        "message": "You are authenticated!",
        "token_received": token
    }






