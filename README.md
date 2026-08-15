# VVK Portfolio — Vadrangi Vishal Kumar

A personal portfolio website showcasing research in **Quantum Computing**, **Post-Quantum Cryptography (PQC)**, and **Software Engineering**. Built with a lightweight **Python/Flask** backend, cinematic slate-grey styling, fluid micro-animations, and full mobile responsiveness.

---

## 🚀 Live Demo & Deployment

- **Frontend / Full Stack:** Deployed on Render / Vercel
- **Author:** [Vadrangi Vishal Kumar](https://github.com/Vshal-Kumar)

---

## 🛠 Tech Stack

- **Backend:** Python 3, Flask 3, Gunicorn, Flask-Mail, Flask-Limiter (Rate Limiting)
- **Frontend:** Semantic HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+)
- **Security:** ProxyFix (Reverse Proxy IP handling), Input Sanitization, SMTP Header Injection Protection, Security Headers, Honeypot Spam Trap

---

## 📦 Features

- **Quantum & Research Focused Showcase:** Highlighted projects including Bell-State Quantum Mutual Authentication and Quantum Simulations with Qiskit.
- **Compact Credentials Card:** Dedicated verification badge for the PROJECT-Q 30-Day Quantum Computing Challenge.
- **Secure Contact Form:** Integrated Gmail SMTP mailing with auto-acknowledgment replies, rate limiting (5 req / 10 min), and a toast notification popup.
- **Production-Ready Cloud Configuration:** Built-in health checks (`/health`), reverse proxy support, and Gunicorn WSGI configuration.

---

## ⚙️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vshal-Kumar/VVK-portfolio.git
   cd VVK-portfolio
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your details in `.env`:
   ```ini
   SECRET_KEY=your-random-secret-key
   MAIL_USERNAME=your.email@gmail.com
   MAIL_PASSWORD=your-google-app-password
   MAIL_RECIPIENT=vadrangi.vishalkumar@gmail.com
   FLASK_ENV=development
   PORT=5000
   ```

5. **Run the application:**
   ```bash
   python app.py
   ```
   Open `http://localhost:5000` in your browser.

---

## ☁️ Deployment on Render (Step-by-Step)

1. Push your repository to **GitHub**.
2. Log in to **[Render.com](https://render.com)** and click **New +** → **Web Service**.
3. Connect your repository: `Vshal-Kumar/VVK-portfolio`.
4. Configure settings:
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app` (or it will automatically use `Procfile`)
   - **Health Check Path:** `/health`
5. Under the **Environment Variables** tab, add:
   - `SECRET_KEY` = `<any-random-string>`
   - `MAIL_USERNAME` = `your.email@gmail.com`
   - `MAIL_PASSWORD` = `<your-16-char-google-app-password>`
   - `MAIL_RECIPIENT` = `vadrangi.vishalkumar@gmail.com`
   - `FLASK_ENV` = `production`
6. Click **Deploy Web Service**. Your portfolio will be live in ~1 minute!

---

## 📄 License

This project is licensed under the MIT License — feel free to customize and use it for your own portfolio.
