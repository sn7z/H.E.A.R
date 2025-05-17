from fastapi import FastAPI, Request, File, UploadFile, Form
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from docx import Document
from io import BytesIO
import smtplib
from email.message import EmailMessage
import requests
from typing import List
import base64                   # uvicorn final_back:app --reload
import mimetypes

app = FastAPI()

# Allow CORS (so HTML/JS can call these APIs)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Replace with real values
SENDER_EMAIL = "mustafataj13@gmail.com"
SENDER_APP_PASSWORD = ""
GROQ_API_KEY = ""
MODEL_NAME = "llama-3.3-70b-versatile"

class ReportData(BaseModel):
    date: str
    time: str
    location: str
    person: str
    reporter: str
    recipient: str
    description: str
    evidence: str = ""

class EmailData(BaseModel):
    report: str
    emails: str

@app.post("/generate-report")
async def generate_report(data: ReportData):
    prompt = f"""
You are a professional assistant tasked with generating a formal harassment report. Use the following inputs to write a structured report:

Date of Incident: {data.date}
Time of Incident: {data.time}
Place of Incident: {data.location}
Person Involved: {data.person}
Name of Reporter: {data.reporter}
Recipient: {data.recipient}
Description: {data.description}
Evidence: {data.evidence}

Instructions:
- Include a Subject, Introduction, Incident Details, Supporting Evidence (if provided), Request for Action, Closing Statement, Signature.
- Maintain professional tone.
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3
    }

    response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
    if response.status_code == 200:
        report_text = response.json()['choices'][0]['message']['content']
        return {"report": report_text.strip()}
    return JSONResponse(status_code=500, content={"error": "Groq API call failed"})

@app.post("/download-report")
async def download_report(req: Request):
    body = await req.json()
    report = body.get("report", "")
    doc = Document()
    doc.add_heading("Harassment Report", level=1)
    doc.add_paragraph(report)
    buf = BytesIO()
    doc.save(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document', headers={"Content-Disposition": "attachment; filename=harassment_report.docx"})

@app.post("/send-email")
async def send_email(data: EmailData):
    try:
        email_list = [email.strip() for email in data.emails.split(',') if email.strip()]
        doc = Document()
        doc.add_heading("Harassment Report", level=1)
        doc.add_paragraph(data.report)
        buf = BytesIO()
        doc.save(buf)
        buf.seek(0)

        for email in email_list:
            msg = EmailMessage()
            msg['Subject'] = "Harassment Report Submission"
            msg['From'] = SENDER_EMAIL
            msg['To'] = email
            msg.set_content("Please find the attached harassment report.")
            msg.add_attachment(buf.getvalue(), maintype='application', subtype='vnd.openxmlformats-officedocument.wordprocessingml.document', filename="harassment_report.docx")

            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(SENDER_EMAIL, SENDER_APP_PASSWORD)
                server.send_message(msg)

        return {"message": "Email(s) sent successfully."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/send-email-with-attachments")
async def send_email_with_attachments(
    report: str = Form(...),
    emails: str = Form(...),
    files: List[UploadFile] = File(None),
    photos: List[UploadFile] = File(None),
    audio: List[UploadFile] = File(None)
):
    try:
        # Process email recipients
        email_list = [email.strip() for email in emails.split(',') if email.strip()]
        
        # Create Word document from report
        doc = Document()
        doc.add_heading("Harassment Report", level=1)
        doc.add_paragraph(report)
        doc_buf = BytesIO()
        doc.save(doc_buf)
        doc_buf.seek(0)
        
        for email in email_list:
            # Create email message
            msg = EmailMessage()
            msg['Subject'] = "Harassment Report Submission"
            msg['From'] = SENDER_EMAIL
            msg['To'] = email
            
            # Add email body text
            msg.set_content("""
            Please find the attached harassment report and supporting files.
            
            This is an automated message sent from the SafeGuard reporting system.
            """)
            
            # Add Word document attachment
            msg.add_attachment(doc_buf.getvalue(), 
                              maintype='application', 
                              subtype='vnd.openxmlformats-officedocument.wordprocessingml.document', 
                              filename="harassment_report.docx")
            
            # Add document file attachments
            if files:
                for file in files:
                    file_content = await file.read()
                    content_type = file.content_type or 'application/octet-stream'
                    maintype, subtype = content_type.split('/', 1)
                    msg.add_attachment(file_content, 
                                      maintype=maintype, 
                                      subtype=subtype, 
                                      filename=file.filename)
            
            # Add photo attachments
            if photos:
                for photo in photos:
                    photo_content = await photo.read()
                    content_type = photo.content_type or 'image/jpeg'
                    maintype, subtype = content_type.split('/', 1)
                    msg.add_attachment(photo_content, 
                                      maintype=maintype, 
                                      subtype=subtype, 
                                      filename=photo.filename)
            
            # Add audio attachments
            if audio:
                for audio_file in audio:
                    audio_content = await audio_file.read()
                    content_type = audio_file.content_type or 'audio/mpeg'
                    maintype, subtype = content_type.split('/', 1)
                    msg.add_attachment(audio_content, 
                                      maintype=maintype, 
                                      subtype=subtype, 
                                      filename=audio_file.filename)
            
            # Send the email
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(SENDER_EMAIL, SENDER_APP_PASSWORD)
                server.send_message(msg)
                
        return {"message": f"Email(s) sent successfully to {len(email_list)} recipient(s) with attachments."}
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
