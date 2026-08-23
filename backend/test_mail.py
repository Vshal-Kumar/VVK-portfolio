import os
import smtplib
from dotenv import load_dotenv

load_dotenv()

server_host = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
port = int(os.environ.get('MAIL_PORT', 465))
username = os.environ.get('MAIL_USERNAME')
password = os.environ.get('MAIL_PASSWORD')
recipient = os.environ.get('MAIL_RECIPIENT', username)

print(f"Testing SMTP connection to {server_host}:{port} with user: {username}...")

try:
    if port == 465:
        server = smtplib.SMTP_SSL(server_host, port, timeout=10)
    else:
        server = smtplib.SMTP(server_host, port, timeout=10)
        server.starttls()
    
    server.login(username, password)
    print("✅ SMTP Login SUCCESSFUL!")
    
    msg = f"Subject: VVK Portfolio Test Verification\n\nSMTP is working perfectly on port {port}!"
    server.sendmail(username, recipient, msg)
    print(f"✅ Test email sent to {recipient} successfully!")
    server.quit()
except Exception as e:
    print(f"❌ SMTP Error: {e}")
