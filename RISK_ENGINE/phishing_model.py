
from transformers import pipeline

classifier = pipeline(
    "text-classification",
    model="ealvaradob/bert-finetuned-phishing"
)

def predict_email(email_text: str) -> dict:
    # ✅ truncation=True + max_length=512 prevents the "1266 > 512" crash
    result = classifier(
        email_text,
        truncation=True,
        max_length=512,
    )[0]
    return result