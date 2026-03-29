
import re
from phishing_model import predict_email


def calculate_risk(email_text: str) -> dict:


    risk_score = 0
    email_lower = email_text.lower()  

    # ── Model prediction ──────────────────────────────────────────────────────
    result = predict_email(email_text)

    if result["label"] == "PHISHING":
        risk_score += 50 * result["score"]

    # ── Keyword signals ───────────────────────────────────────────────────────
    scam_words = [
        "winner", "prize", "reward", "gift card",
        "lottery", "claim", "congratulations"
    ]
    if any(word in email_lower for word in scam_words):
        risk_score += 15

    urgent_words = [
        "verify", "urgent", "suspend", "immediately", "password",
        "bank", "login", "update", "confirm", "security",
        "alert", "action required"
    ]
    if any(word in email_lower for word in urgent_words):
        risk_score += 10

    # ── URL signals ───────────────────────────────────────────────────────────
    urls = re.findall(r'https?://\S+', email_text)
    if urls:
        risk_score += 15

    # ── Suspicious domain keywords ────────────────────────────────────────────
    suspicious_domain_words = ["login", "secure", "verify", "account", "update"]
    if any(word in email_lower for word in suspicious_domain_words):
        risk_score += 10

    # ── Cap score at 100 ──────────────────────────────────────────────────────
    risk_score = min(round(risk_score, 2), 100)

    # ── Category ──────────────────────────────────────────────────────────────
    if risk_score >= 30:
        category = "Phishing"
    elif risk_score >= 20:
        category = "Suspicious"
    else:
        category = "Safe"

    return {
        "risk_score": risk_score,
        "category":   category,
    }