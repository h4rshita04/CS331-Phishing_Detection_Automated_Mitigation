import re
from phishing_model import predict_email

def calculate_risk(email_text):

    risk_score = 0
    result = predict_email(email_text)

    if result["label"] == "PHISHING":
        risk_score += 50* result["score"]

    scam_words = ["winner","prize","reward","gift card","lottery","claim","congratulations"]

    if any(word in email_text.lower() for word in scam_words):
        risk_score += 15
    urgent_words = ["verify","urgent","suspend","immediately","password","bank","login","update","confirm","security","alert","action required"]

    if any(word in email_text.lower() for word in urgent_words):
        risk_score += 10

    urls = re.findall(r'https?://\S+', email_text)

    if urls:
        risk_score += 15

    # if "http://" in email_text or "https://" in email_text:
    #     risk_score += 20

    # suspicious domain keywords
    suspicious_words = ["login","secure","verify","account","update"]

    if any(word in email_text.lower() for word in suspicious_words):
        risk_score += 10

    if risk_score >= 30:
        category = "Phishing"
    elif risk_score >=20:
        category = "Suspicious"
    else:
        category = "Safe"

    return {
        "risk_score": risk_score,
        "category": category
    }