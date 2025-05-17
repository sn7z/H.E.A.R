from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from twilio.rest import Client
from dotenv import load_dotenv
import os                          #run- uvicorn sos_backend:app --reload

import uvicorn                              
# Load environment variables from .env file
load_dotenv()

# Get Twilio credentials from environment
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
EMERGENCY_CONTACT = os.getenv("EMERGENCY_CONTACT")

# Ensure all credentials are present
if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, EMERGENCY_CONTACT]):
    raise EnvironmentError("Missing Twilio configuration in environment variables.")

# Initialize Twilio client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Create FastAPI app
app = FastAPI()

# CORS settings (adjust allow_origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data model
class SOSData(BaseModel):
    latitude: float
    longitude: float
    timestamp: str

# Endpoint to send SOS
@app.post("/api/send-sos")
async def send_sos(data: SOSData):
    maps_link = f"https://maps.google.com/?q={data.latitude},{data.longitude}"
    message_body = (
        "\n 🚨 SOS Alert!\n"
        f"Time: {data.timestamp}\n"
        f"Location: {maps_link}"
        "\n\nPlease respond immediately !"
    )

    try:
        message = client.messages.create(
            body=message_body,
            from_=TWILIO_PHONE_NUMBER,
            to=EMERGENCY_CONTACT
        )
        return {"message": "SOS alert sent via SMS", "sid": message.sid}
    except Exception as e:
        return {"error": str(e)}
