from flask import Flask, request, jsonify
from risk_engine import calculate_risk

app = Flask(__name__)

@app.route("/detect", methods=["POST"])
def detect():
    data = request.get_json()

    if not data or "email" not in data:
        return jsonify({"error": "No email text provided"}), 400

    email_text = data["email"]

    if not email_text.strip():
        return jsonify({"error": "Email text is empty"}), 400

    try:
        result = calculate_risk(email_text)
        return jsonify({
            "category": result["category"],
            "risk_score": result["risk_score"]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Risk engine running"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)