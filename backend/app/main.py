from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from starlette.middleware.sessions import SessionMiddleware

from app.database.connection import Base, engine
from app.models import user

from app.routers import auth_router, threat_router
from app.routers.google_router import router as google_router


# --------------------------------------------------
# Create FastAPI App
# --------------------------------------------------
app = FastAPI(title="SentinelPhish Security Platform")


# --------------------------------------------------
# Session Middleware (REQUIRED for Google OAuth)
# --------------------------------------------------
app.add_middleware(
    SessionMiddleware,
    secret_key="super-secret-key-change-this-to-env-value"
)


# --------------------------------------------------
# Create Database Tables
# --------------------------------------------------
Base.metadata.create_all(bind=engine)


# --------------------------------------------------
# Include Routers
# --------------------------------------------------
app.include_router(auth_router.router)
app.include_router(threat_router.router)
app.include_router(google_router)


# --------------------------------------------------
# OAuth2 Password Scheme (for JWT login system)
# --------------------------------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# --------------------------------------------------
# Health Check
# --------------------------------------------------
@app.get("/")
def health_check():
    return {"status": "Backend running securely"}


# --------------------------------------------------
# Protected Route (JWT-based)
# --------------------------------------------------
@app.get("/protected")
def protected(token: str = Depends(oauth2_scheme)):
    return {
        "message": "You are authenticated!",
        "token_received": token
    }






