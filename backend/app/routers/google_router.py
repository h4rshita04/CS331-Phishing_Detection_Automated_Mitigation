import os
import secrets
import hashlib
import base64

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
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


# =====================================================
# LOGIN ROUTE
# =====================================================
@router.get("/google")
async def login_google(request: Request):

    code_verifier = secrets.token_urlsafe(64)

    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).decode().rstrip("=")

    flow = Flow.from_client_config(
        CLIENT_CONFIG,
        scopes=SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
        code_challenge=code_challenge,
        code_challenge_method="S256",
    )

    request.session["oauth_state"] = state
    request.session["code_verifier"] = code_verifier

    return RedirectResponse(authorization_url)


# =====================================================
# CALLBACK ROUTE (AUTH + FETCH EMAILS)
# =====================================================
@router.get("/google/callback")
async def callback(request: Request):

    state = request.session.get("oauth_state")
    code_verifier = request.session.get("code_verifier")
    code = request.query_params.get("code")

    if not state or not code_verifier or not code:
        raise HTTPException(status_code=400, detail="OAuth session invalid.")

    flow = Flow.from_client_config(
        CLIENT_CONFIG,
        scopes=SCOPES,
        state=state,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )

    try:
        flow.fetch_token(
            code=code,
            code_verifier=code_verifier,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth failed: {str(e)}")

    credentials = flow.credentials

    # 🔥 Build Gmail service
    service = build("gmail", "v1", credentials=credentials)

    # Fetch latest 5 emails
    results = service.users().messages().list(
        userId="me",
        maxResults=5
    ).execute()

    messages = results.get("messages", [])

    email_list = []

    for msg in messages:
        msg_data = service.users().messages().get(
            userId="me",
            id=msg["id"]
        ).execute()

        headers = msg_data["payload"]["headers"]

        subject = next(
            (header["value"] for header in headers if header["name"] == "Subject"),
            "No Subject"
        )

        sender = next(
            (header["value"] for header in headers if header["name"] == "From"),
            "Unknown Sender"
        )

        email_list.append({
            "id": msg["id"],
            "subject": subject,
            "from": sender
        })

    request.session.clear()

    return {
        "message": "Google authentication successful",
        "emails": email_list
    }