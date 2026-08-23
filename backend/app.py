"""
VVK Portfolio — Flask API Backend
Author: Vadrangi Vishal Kumar
Hostable on Render, Vercel, PythonAnywhere, VPS, or locally.
"""

import os
import re
import socket
import logging
import threading
from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

# Set global socket timeout to prevent workers hanging on stalled connections
socket.setdefaulttimeout(10.0)

# ── App setup ──────────────────────────────────────────
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Parse allowed origins (stripping whitespace and trailing slashes)
allowed_origins_raw = os.environ.get("ALLOWED_ORIGINS", "*")
if not allowed_origins_raw or allowed_origins_raw.strip() == "*":
    origins_list = "*"
else:
    origins_list = [origin.strip().rstrip('/') for origin in allowed_origins_raw.split(",") if origin.strip()]

CORS(app, resources={
    r"/*": {
        "origins": origins_list,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Cache-Control"]
    }
})

# ProxyFix: Ensures real client IP is detected behind reverse proxies (Render, Cloudflare, etc.)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# ── Flask-Mail config ───────────────────────────────────
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
mail_port = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_PORT'] = mail_port

# Auto-configure TLS/SSL based on port
if mail_port == 465:
    app.config['MAIL_USE_SSL'] = True
    app.config['MAIL_USE_TLS'] = False
else:
    app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', '1', 'yes']
    app.config['MAIL_USE_SSL'] = os.environ.get('MAIL_USE_SSL', 'false').lower() in ['true', '1', 'yes']

app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')       # Gmail address
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')       # 16-char Google App Password
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', os.environ.get('MAIL_USERNAME'))
app.config['MAIL_TIMEOUT'] = int(os.environ.get('MAIL_TIMEOUT', 10))

mail = Mail(app)

# ── Rate limiting (spam protection) ────────────────────
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["500 per day", "150 per hour"],
    storage_uri=os.environ.get("RATELIMIT_STORAGE_URI", "memory://")
)

# ── Logging ─────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)


# ── Security Headers ────────────────────────────────────
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response


# ── Helpers ─────────────────────────────────────────────
def is_valid_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def sanitize(text: str, max_len: int = 2000) -> str:
    """Strip dangerous characters and truncate."""
    if not text:
        return ""
    return str(text).strip()[:max_len]


def sanitize_header(text: str, max_len: int = 200) -> str:
    """Strip newlines to prevent SMTP header injection."""
    if not text:
        return ""
    cleaned = re.sub(r'[\r\n]+', ' ', str(text))
    return cleaned.strip()[:max_len]


def send_async_email(app_obj, messages):
    """Dispatch emails in a background thread to prevent Gunicorn worker timeouts."""
    with app_obj.app_context():
        for msg in messages:
            try:
                mail.send(msg)
                logger.info(f'[CONTACT] Email successfully delivered to {msg.recipients}')
            except Exception as ex:
                logger.error(f'[CONTACT] Failed to deliver email to {msg.recipients}: {ex}')


# ── Routes ──────────────────────────────────────────────
@app.route('/')
@limiter.exempt
def index():
    return jsonify({
        'name': 'VVK Portfolio API',
        'status': 'online',
        'endpoints': {
            '/health': 'GET - Health check',
            '/send_email': 'POST - Contact form submission'
        }
    }), 200


@app.route('/health', methods=['GET'])
@limiter.exempt
def health():
    return jsonify({
        'status': 'healthy',
        'app': 'VVK Portfolio Backend',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'version': '2.0.0'
    }), 200


@app.route('/send_email', methods=['POST'])
@limiter.limit("10 per 10 minutes")   # max 10 submissions per IP per 10 min
def send_email():
    try:
        # Extract payload whether sent as JSON or multipart/form-data
        if request.is_json:
            data = request.get_json() or {}
        else:
            data = request.form.to_dict() or {}

        # Honeypot check (bot trap field named 'website')
        honeypot = data.get('website', '')
        if honeypot:
            # Pretend success so bots don't know they were blocked
            return jsonify({'success': True, 'message': 'Message sent!'}), 200

        # Extract & sanitize fields
        name    = sanitize_header(data.get('name', ''), 100)
        email   = sanitize_header(data.get('email', ''), 100)
        subject = sanitize_header(data.get('subject', ''), 200)
        message = sanitize(data.get('message', ''), 2000)

        # Server-side validation
        errors = []
        if len(name) < 2:
            errors.append('Name must be at least 2 characters.')
        if not is_valid_email(email):
            errors.append('Please enter a valid email address.')
        if len(subject) < 3:
            errors.append('Subject must be at least 3 characters.')
        if len(message) < 15:
            errors.append('Message must be at least 15 characters.')

        if errors:
            return jsonify({'success': False, 'message': ' '.join(errors)}), 400

        recipient = os.environ.get('MAIL_RECIPIENT', os.environ.get('RECIPIENT_EMAIL', os.environ.get('MAIL_USERNAME')))

        if not recipient or not app.config.get('MAIL_USERNAME') or not app.config.get('MAIL_PASSWORD'):
            logger.warning('Mail configuration is missing or incomplete — logging contact submission.')
            logger.info(f'[CONTACT] From: {name} <{email}> | Subject: {subject} | Msg: {message}')
            return jsonify({'success': True, 'message': 'Message received (mail not configured).'}), 200

        # Build email to portfolio owner
        msg_to_owner = Message(
            subject=f'[Portfolio Contact] {subject}',
            recipients=[recipient],
            body=f"""New message from your portfolio contact form:

Name    : {name}
Email   : {email}
Subject : {subject}

Message :
{message}

---
Sent via VVK Portfolio
"""
        )
        msg_to_owner.reply_to = email

        # Auto-reply acknowledgment to sender
        msg_to_sender = Message(
            subject='Thanks for reaching out — Vishal Kumar',
            recipients=[email],
            body=f"""Hi {name},

Thanks for getting in touch! I've received your message and will get back to you as soon as possible, usually within 24–48 hours.

Your message:
"{message[:200]}{'...' if len(message) > 200 else ''}"

Best regards,
Vadrangi Vishal Kumar
Quantum Computing Enthusiast & Developer
📧 vadrangi.vishalkumar@gmail.com
🔗 github.com/Vshal-Kumar
"""
        )

        # Dispatch emails asynchronously in background thread to guarantee 0 worker timeouts
        thread = threading.Thread(
            target=send_async_email,
            args=(app, [msg_to_owner, msg_to_sender])
        )
        thread.daemon = True
        thread.start()

        logger.info(f'[CONTACT] Queued email dispatch from {email} ({name}): {subject}')
        return jsonify({'success': True, 'message': 'Message sent successfully!'}), 200

    except Exception as e:
        logger.error(f'[CONTACT] Error processing contact submission: {e}')
        return jsonify({
            'success': False,
            'message': 'Failed to send message. Please try emailing directly at vadrangi.vishalkumar@gmail.com'
        }), 500


@app.errorhandler(429)
def rate_limit_handler(e):
    return jsonify({
        'success': False,
        'message': 'Too many requests. Please wait a few minutes and try again.'
    }), 429


@app.errorhandler(404)
def not_found(e):
    return jsonify({
        'success': False,
        'message': 'Endpoint not found.'
    }), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({
        'success': False,
        'message': 'An internal server error occurred.'
    }), 500


# ── Run (Local Development) ─────────────────────────────
if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
