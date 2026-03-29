
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
from google.auth.exceptions import RefreshError
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from app.database.connection import get_db
from app.core.security import get_current_user
from app.models.user import User

from app.services.gmail_service import authenticate_gmail, move_to_spam

router = APIRouter(prefix="/connect", tags=["Gmail"])

SCOPES           = ["https://www.googleapis.com/auth/gmail.modify"]
CREDENTIALS_FILE = "credentials.json"
RISK_ENGINE_URL  = "http://127.0.0.1:5000/detect"


# ── helper: get a valid, refreshed credential object ──────────────────────────

def _get_valid_creds(current_user, db: Session) -> Credentials:
    """
    Loads credentials from DB, refreshes if needed.
    Raises HTTPException(401) if the token is gone or can't be refreshed.
    """
    if not current_user.gmail_token:
        raise HTTPException(status_code=400, detail="Gmail not connected")

    try:
        creds = Credentials.from_authorized_user_info(
            json.loads(current_user.gmail_token), SCOPES
        )
    except Exception:
        _clear_gmail(current_user, db)
        raise HTTPException(
            status_code=401,
            detail="Stored Gmail token is corrupt. Please reconnect your Gmail account."
        )

    # Refresh whenever expired OR when there's no valid access token at all
    if not creds.valid:
        if creds.refresh_token:
            try:
                creds.refresh(Request())
                current_user.gmail_token = creds.to_json()
                db.commit()
            except RefreshError:
                # Token was revoked or expired beyond recovery
                _clear_gmail(current_user, db)
                raise HTTPException(
                    status_code=401,
                    detail="Gmail permission revoked. Please reconnect your Gmail account."
                )
        else:
            # No refresh token available — need a fresh OAuth flow
            _clear_gmail(current_user, db)
            raise HTTPException(
                status_code=401,
                detail="Gmail session expired. Please reconnect your Gmail account."
            )

    return creds


def _clear_gmail(current_user, db: Session):
    current_user.gmail_token     = None
    current_user.gmail_connected = False
    db.commit()


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

        flow.oauth2session._client.code_challenge_method = None

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
    _clear_gmail(current_user, db)
    return {"message": "Gmail disconnected"}


# ── 4. SCAN ────────────────────────────────────────────────────────────────────

@router.post("/scan")
def scan_emails(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # ✅ Single place for credential validation & refresh
    creds   = _get_valid_creds(current_user, db)
    service = build("gmail", "v1", credentials=creds)

    # Fetch latest 10 emails
    try:
        results  = service.users().messages().list(userId="me", maxResults=10).execute()
    except HttpError as e:
        if e.resp.status == 401:
            _clear_gmail(current_user, db)
            raise HTTPException(
                status_code=401,
                detail="Gmail access was revoked during scan. Please reconnect."
            )
        raise HTTPException(status_code=500, detail=str(e))

    messages = results.get("messages", [])
    scanned  = []

    for message in messages:
        msg_id = message["id"]

        try:
            msg = service.users().messages().get(
                userId="me", id=msg_id, format="full"
            ).execute()
        except HttpError:
            # Skip emails we can't fetch individually
            continue

        headers = msg["payload"]["headers"]

        subject = next(
            (h["value"] for h in headers if h["name"] == "Subject"),
            "(No Subject)"
        )
        sender = next(
            (h["value"] for h in headers if h["name"] == "From"),
            "Unknown"
        )

        # ── Extract plain-text body ────────────────────────────────────────────
        body = _extract_body(msg["payload"])

        # ── Risk engine call ───────────────────────────────────────────────────
        risk, risk_error = _call_risk_engine(subject, body)

        # ── Mitigation ────────────────────────────────────────────────────────
        action_taken = "none"

        if risk_error:
            # Don't auto-spam if we couldn't classify — log and skip mitigation
            action_taken = f"skipped_mitigation: {risk_error}"
        else:
            category   = risk.get("category", "").lower()
            risk_score = risk.get("risk_score", 0)

            if category == "phishing" or risk_score > 70:
                label_ids = msg.get("labelIds", [])
                if "SPAM" not in label_ids:
                    try:
                        move_to_spam(service, msg_id)
                        action_taken = "moved_to_spam"
                    except Exception as e:
                        action_taken = f"spam_error: {str(e)}"
                else:
                    action_taken = "already_in_spam"

        scanned.append({
            "id":         msg_id,
            "subject":    subject,
            "sender":     sender,
            "category":   risk.get("category", "Unknown"),
            "risk_score": risk.get("risk_score", 0),
            "action":     action_taken,
        })

    return {
        "emails": scanned,
        "total":  len(scanned),
    }


# ── private helpers ────────────────────────────────────────────────────────────

def _extract_body(payload: dict) -> str:
    """Recursively extract the first text/plain part from a Gmail payload."""
    if "parts" in payload:
        for part in payload["parts"]:
            # Recurse into nested multipart payloads
            result = _extract_body(part)
            if result:
                return result
    else:
        if payload.get("mimeType") == "text/plain":
            data = payload["body"].get("data")
            if data:
                return base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
    return ""


def _call_risk_engine(subject: str, body: str):
    """
    Returns (risk_dict, error_string).
    error_string is None on success, a message on failure.
    """
    try:
        resp = requests.post(
            RISK_ENGINE_URL,
            json={"email": subject + " " + body},
            timeout=30,
        )
        if resp.status_code == 200:
            return resp.json(), None

        # Non-200 from the risk engine — surface the actual status code
        return {"category": "Unknown", "risk_score": 0}, \
               f"risk engine returned HTTP {resp.status_code}"

    except requests.exceptions.ConnectionError:
        return {"category": "Unknown", "risk_score": 0}, \
               "risk engine unreachable (connection refused)"
    except requests.exceptions.Timeout:
        return {"category": "Unknown", "risk_score": 0}, \
               "risk engine timed out"
    except Exception as e:
        return {"category": "Unknown", "risk_score": 0}, str(e)
