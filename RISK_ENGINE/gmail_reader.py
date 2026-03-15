import os
import base64
import requests
import time


from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

API_URL = "http://127.0.0.1:5000/detect"


def authenticate_gmail():

    creds = None

    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    if not creds or not creds.valid:

        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())

        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)

            creds = flow.run_local_server(port=0)

        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('gmail', 'v1', credentials=creds)

    return service


def get_emails(service):

    results = service.users().messages().list(
        userId='me',
        maxResults=10
    ).execute()

    messages = results.get('messages', [])

    return messages



def read_email(service, msg_id):

    msg = service.users().messages().get(
        userId='me',
        id=msg_id,
        format='full'
    ).execute()

    headers = msg['payload']['headers']

    subject = ""

    for header in headers:
        if header['name'] == 'Subject':
            subject = header['value']

    body = ""

    if 'parts' in msg['payload']:
        parts = msg['payload']['parts']

        for part in parts:
            if part['mimeType'] == 'text/plain':
                data = part['body'].get('data')

                if data:
                    body = base64.urlsafe_b64decode(data).decode('utf-8')

    else:
        data = msg['payload']['body'].get('data')

        if data:
            body = base64.urlsafe_b64decode(data).decode('utf-8')

    return subject, body

def analyze_emails():

    service = authenticate_gmail()

    messages = get_emails(service)

    for message in messages:

        subject, body = read_email(service, message['id'])

        email_text = subject + " " + body

        try:
            response = requests.post(API_URL, json={"email": email_text})

            if response.status_code == 200:
                result = response.json()

                print("\n---------------------------")
                print("Subject:", subject)
                print("Prediction:", result["category"])
                #print("Risk Score:", result["risk_score"])

            else:
                #print("API returned error:", response.text)
                continue

        except Exception as e:
            print("Request failed:", e)
            continue
if __name__ == "__main__":

        analyze_emails()
        