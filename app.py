from flask import Flask, render_template, request
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "Missing required environment variables: SUPABASE_URL and SUPABASE_KEY"
    )

app = Flask(__name__, template_folder=".", static_folder=".")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True)

    print("DEBUG FORM:", request.form)
    print("DEBUG JSON:", data)

    if data:
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        email = data.get("email")
        subject = data.get("subject")
        message = data.get("message")
    else:
        first_name = request.form.get("firstName")
        last_name = request.form.get("lastName")
        email = request.form.get("email")
        subject = request.form.get("subject")
        message = request.form.get("message")

    if not first_name or not last_name or not email or not subject or not message:
        return "Please fill all fields.", 400

    try:
        response = supabase.table("contact_messages").insert({
            "firstName": first_name,
            "lastName": last_name,
            "email": email,
            "subject": subject,
            "message": message
        }).execute()

        print("SUPABASE RESPONSE:", response)

        return "Thank you for contacting us!", 200

    except Exception as error:
        print("SUPABASE ERROR DETAILS:", error)
        return "Error sending message. Please try again.", 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)