import os
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Google OAuth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
]

CLIENT_CONFIG = {
    "web": {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
    }
}


@router.get("/google")
async def login_google(request: Request):

    flow = Flow.from_client_config(
        CLIENT_CONFIG,
        scopes=SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )

    # ONLY store serializable values
    request.session["state"] = state
    request.session["code_verifier"] = flow.code_verifier

    return RedirectResponse(authorization_url)


@router.get("/google/callback")
async def callback(request: Request):

    state = request.session.get("state")
    code_verifier = request.session.get("code_verifier")

    if not state or not code_verifier:
        raise HTTPException(status_code=400, detail="Session expired. Try again.")

    flow = Flow.from_client_config(
        CLIENT_CONFIG,
        scopes=SCOPES,
        state=state,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )

    flow.code_verifier = code_verifier

    try:
        flow.fetch_token(code=request.query_params.get("code"))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth failed: {str(e)}")

    credentials = flow.credentials

    # Clear session
    request.session.pop("state", None)
    request.session.pop("code_verifier", None)

    return {
        "message": "Google authentication successful",
        "access_token": credentials.token,
    }