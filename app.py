"""
VVK Portfolio — Flask Backend
Author: Vadrangi Vishal Kumar
"""

import os
import re
import logging
from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv

load_dotenv()

# ── App setup ──────────────────────────────────────────
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# ProxyFix: Ensures real client IP is detected behind Render's reverse proxy for rate limiting
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# ── Flask-Mail config ───────────────────────────────────
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')       # your Gmail
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')       # Google App Password
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_TIMEOUT'] = 10

mail = Mail(app)

# ── Rate limiting (spam protection) ────────────────────
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# ── Logging ─────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
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


def sanitize(text: str, max_len: int = 500) -> str:
    """Strip dangerous characters and truncate."""
    return text.strip()[:max_len]


def sanitize_header(text: str, max_len: int = 200) -> str:
    """Strip newlines to prevent SMTP header injection."""
    cleaned = re.sub(r'[\r\n]+', ' ', text)
    return cleaned.strip()[:max_len]


# ── Routes ──────────────────────────────────────────────
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'app': 'VVK Portfolio'}), 200


@app.route('/send_email', methods=['POST'])
@limiter.limit("5 per 10 minutes")   # max 5 submissions per IP per 10 min
def send_email():
    try:
        # Honeypot check (bot trap field named 'website')
        honeypot = request.form.get('website', '')
        if honeypot:
            # Pretend success so bots don't know they were blocked
            return jsonify({'success': True, 'message': 'Message sent!'})

        # Extract & sanitize fields
        name    = sanitize_header(request.form.get('name', ''), 100)
        email   = sanitize_header(request.form.get('email', ''), 100)
        subject = sanitize_header(request.form.get('subject', ''), 200)
        message = sanitize(request.form.get('message', ''), 2000)

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

        recipient = os.environ.get('MAIL_RECIPIENT', os.environ.get('MAIL_USERNAME'))

        if not recipient:
            logger.warning('MAIL_RECIPIENT not configured — logging message instead.')
            logger.info(f'[CONTACT] From: {name} <{email}> | Subject: {subject} | Msg: {message}')
            return jsonify({'success': True, 'message': 'Message received (mail not configured).'})

        # Build email to yourself
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
Sent via vadrangi-vishal-kumar.vercel.app
"""
        )
        msg_to_owner.reply_to = email

        # Auto-reply to sender
        msg_to_sender = Message(
            subject='Thanks for reaching out — Vishal Kumar',
            recipients=[email],
            body=f"""Hi {name},

Thanks for getting in touch! I've received your message and will get back to you as soon as possible, usually within 24–48 hours.

Your message:
"{message[:200]}{'...' if len(message) > 200 else ''}"

Best regards,
Vadrangi Vishal Kumar
Programmer & Web Developer
📧 vadrangi.vishalkumar@gmail.com
🔗 github.com/Vshal-Kumar
"""
        )

        mail.send(msg_to_owner)
        mail.send(msg_to_sender)

        logger.info(f'[CONTACT] Email sent from {email} ({name}): {subject}')
        return jsonify({'success': True, 'message': 'Message sent successfully!'})

    except Exception as e:
        logger.error(f'[CONTACT] Error sending email: {e}')
        return jsonify({
            'success': False,
            'message': 'Failed to send message. Please try emailing me directly.'
        }), 500


@app.errorhandler(429)
def rate_limit_handler(e):
    return jsonify({
        'success': False,
        'message': 'Too many requests. Please wait a few minutes and try again.'
    }), 429


@app.errorhandler(404)
def not_found(e):
    return render_template('index.html')


# ── Run ─────────────────────────────────────────────────
if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_ENV', 'production') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
