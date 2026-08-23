# VVK Portfolio — Backend API

Lightweight, production-ready Flask REST API backend providing email dispatch, contact form validation, security headers, CORS support, and rate limiting for the VVK Portfolio.

---

## 📁 Directory Structure

```
backend/
├── app.py                     # Main Flask application with routes and configuration
├── wsgi.py                    # Standard WSGI entry point
├── pythonanywhere_wsgi.py     # Template WSGI configuration for PythonAnywhere
├── requirements.txt           # Python dependencies
├── Procfile                   # Process file for Render / Heroku
├── .env.example               # Template environment configuration
└── README.md                  # This documentation
```

---

## 🛠 Local Development Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your email credentials in `.env`.

5. **Run the server:**
   ```bash
   python app.py
   ```
   The backend API will run on `http://localhost:5000`.

---

## ☁️ Deploying on PythonAnywhere (Step-by-Step)

PythonAnywhere provides free and paid Python web app hosting. Follow these steps:

### 1. Upload or Clone Code to PythonAnywhere
Open a **Bash console** on PythonAnywhere and clone your repository:
```bash
cd ~
git clone https://github.com/Vshal-Kumar/VVK-portfolio.git
cd ~/VVK-portfolio/backend
```

### 2. Create a Virtual Environment
In the Bash console:
```bash
python3 -m venv ~/vvk-venv
source ~/vvk-venv/bin/activate
pip install -r ~/VVK-portfolio/backend/requirements.txt
```

### 3. Create your `.env` File
```bash
cp ~/VVK-portfolio/backend/.env.example ~/VVK-portfolio/backend/.env
nano ~/VVK-portfolio/backend/.env
```
Fill in your SMTP credentials (`MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_RECIPIENT`, and your frontend URL in `ALLOWED_ORIGINS`). Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

### 4. Configure Web App in the Web Tab
1. Go to the **Web** tab in the PythonAnywhere dashboard.
2. Click **Add a new web app** → choose **Manual configuration** → choose your **Python version** (e.g. Python 3.10 or 3.12).
3. Under **Virtualenv**, set path to:
   `/home/<your-username>/vvk-venv`
4. Under **Code**:
   - **Source code**: `/home/<your-username>/VVK-portfolio/backend`
   - **Working directory**: `/home/<your-username>/VVK-portfolio/backend`
5. Under **WSGI configuration file**, click the linked file (`/var/www/<your-username>_pythonanywhere_com_wsgi.py`).
6. Clear everything in that file and paste:
   ```python
   import sys
   import os
   from dotenv import load_dotenv

   username = '<your-username>'  # Replace with your PythonAnywhere username
   project_home = f'/home/{username}/VVK-portfolio/backend'

   if project_home not in sys.path:
       sys.path.insert(0, project_home)

   env_path = os.path.join(project_home, '.env')
   if os.path.exists(env_path):
       load_dotenv(env_path)

   from app import app as application
   ```
7. Click **Save** (top right) and return to the **Web** tab.
8. Click the green **Reload <your-username>.pythonanywhere.com** button.

Your backend API is now live at `https://<your-username>.pythonanywhere.com`!

---

## 📡 API Endpoints

### 1. `GET /health`
- **Description:** Uptime and health check.
- **Response:**
  ```json
  {
    "app": "VVK Portfolio Backend",
    "status": "healthy",
    "version": "2.0.0"
  }
  ```

### 2. `POST /send_email`
- **Description:** Submit contact form inquiry with rate limiting (5 requests per 10 mins).
- **Request Body (JSON or Form Data):**
  ```json
  {
    "name": "Alex Doe",
    "email": "alex@example.com",
    "subject": "Quantum Project Collaboration",
    "message": "Hi Vishal, I would love to collaborate on quantum algorithms..."
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Message sent successfully!"
  }
  ```
