# from flask import Flask, request, jsonify
# from risk_engine import calculate_risk

# app = Flask(__name__)

# @app.route("/detect", methods=["POST"])
# def detect():
#     data = request.get_json()

#     if not data or "email" not in data:
#         return jsonify({"error": "No email text provided"}), 400

#     email_text = data["email"]

#     if not email_text.strip():
#         return jsonify({"error": "Email text is empty"}), 400

#     try:
#         result = calculate_risk(email_text)
#         return jsonify({
#             "category": result["category"],
#             "risk_score": result["risk_score"]
#         }), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @app.route("/health", methods=["GET"])
# def health():
#     return jsonify({"status": "Risk engine running"}), 200


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)
from flask import Flask, request, jsonify
from risk_engine import calculate_risk

app = Flask(__name__)

# BERT hard limit — truncate email text before sending to the model
MAX_CHARS = 1500  # ~512 tokens ≈ 1500–2000 characters; safe conservative limit


def safe_truncate(text: str, max_chars: int = MAX_CHARS) -> str:
    """Truncate at a word boundary so the tokenizer never exceeds 512 tokens."""
    if len(text) <= max_chars:
        return text
    truncated = text[:max_chars]
    # Cut at last whitespace to avoid splitting mid-word
    last_space = truncated.rfind(" ")
    return truncated[:last_space] if last_space != -1 else truncated


@app.route("/detect", methods=["POST"])
def detect():
    data = request.get_json()

    if not data or "email" not in data:
        return jsonify({"error": "No email text provided"}), 400

    email_text = data["email"]

    if not email_text.strip():
        return jsonify({"error": "Email text is empty"}), 400

    # ✅ Truncate BEFORE passing to the model
    email_text = safe_truncate(email_text)

    try:
        result = calculate_risk(email_text)
        return jsonify({
            "category":   result["category"],
            "risk_score": result["risk_score"]
        }), 200

    except Exception as e:
        app.logger.error(f"Risk engine error: {e}")
        # Return Safe/0 instead of 500 so the scanner doesn't skip the email
        return jsonify({
            "category":   "Safe",
            "risk_score": 0,
            "warning":    f"Classification failed, defaulted to Safe: {str(e)}"
        }), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Risk engine running"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)