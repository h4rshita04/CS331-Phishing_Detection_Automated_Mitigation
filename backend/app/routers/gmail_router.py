import os
import base64
import requests
import json

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

from app.database.connection import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/connect", tags=["Gmail"])

SCOPES           = ["https://www.googleapis.com/auth/gmail.readonly"]
CREDENTIALS_FILE = "credentials.json"
RISK_ENGINE_URL  = "http://127.0.0.1:5000/detect"


# ── 1. CONNECT GMAIL ──────────────────────────────────────────────────────────

@router.post("/gmail/connect")
def connect_gmail(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        flow = InstalledAppFlow.from_client_secrets_file(
            CREDENTIALS_FILE,
            scopes=SCOPES
        )

        # Patch out PKCE before running
        flow.oauth2session._client.code_challenge_method = None

        # Opens browser, handles redirect on random localhost port
        creds = flow.run_local_server(
            port=0,
            authorization_prompt_message="",
            success_message="Auth complete. Return to PhishGuard.",
            open_browser=True
        )

        service       = build("gmail", "v1", credentials=creds)
        profile       = service.users().getProfile(userId="me").execute()
        gmail_address = profile["emailAddress"]

        if gmail_address.lower() != current_user.email.lower():
            raise HTTPException(
                status_code=400,
                detail=f"Gmail ({gmail_address}) does not match your account ({current_user.email})."
            )

        current_user.gmail_token     = creds.to_json()
        current_user.gmail_connected = True
        db.commit()

        return {"message": "Gmail connected successfully", "email": gmail_address}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── 2. STATUS ──────────────────────────────────────────────────────────────────

@router.get("/status")
def connection_status(current_user: User = Depends(get_current_user)):
    return {
        "connected": bool(current_user.gmail_connected),
        "email":     current_user.email,
    }


# ── 3. DISCONNECT ──────────────────────────────────────────────────────────────

@router.post("/gmail/disconnect")
def disconnect_gmail(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.gmail_token     = None
    current_user.gmail_connected = False
    db.commit()
    return {"message": "Gmail disconnected"}


# ── 4. SCAN ────────────────────────────────────────────────────────────────────

@router.post("/scan")
def scan_emails(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.gmail_token:
        raise HTTPException(status_code=400, detail="Gmail not connected")

    creds = Credentials.from_authorized_user_info(
        json.loads(current_user.gmail_token), SCOPES
    )

    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        current_user.gmail_token = creds.to_json()
        db.commit()

    service  = build("gmail", "v1", credentials=creds)
    results  = service.users().messages().list(userId="me", maxResults=10).execute()
    messages = results.get("messages", [])
    scanned  = []

    for message in messages:
        msg     = service.users().messages().get(userId="me", id=message["id"], format="full").execute()
        headers = msg["payload"]["headers"]
        subject = next((h["value"] for h in headers if h["name"] == "Subject"), "(No Subject)")
        sender  = next((h["value"] for h in headers if h["name"] == "From"), "Unknown")

        body = ""
        if "parts" in msg["payload"]:
            for part in msg["payload"]["parts"]:
                if part["mimeType"] == "text/plain":
                    data = part["body"].get("data")
                    if data:
                        body = base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
                        break
        else:
            data = msg["payload"]["body"].get("data")
            if data:
                body = base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")

        try:
            resp = requests.post(RISK_ENGINE_URL, json={"email": subject + " " + body}, timeout=10)
            risk = resp.json() if resp.status_code == 200 else {"category": "Unknown", "risk_score": 0}
        except Exception:
            risk = {"category": "Unknown", "risk_score": 0}

        scanned.append({
            "id":         message["id"],
            "subject":    subject,
            "sender":     sender,
            "category":   risk["category"],
            "risk_score": risk["risk_score"],
        })

    return {"emails": scanned, "total": len(scanned)}