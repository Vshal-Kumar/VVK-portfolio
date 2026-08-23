# VVK Portfolio — Vadrangi Vishal Kumar

A personal portfolio website showcasing research in **Quantum Computing**, **Post-Quantum Cryptography (PQC)**, and **Software Engineering**. Restructured into a decoupled architecture with a modern **React (Vite)** frontend and a **Python / Flask** API backend optimized for **PythonAnywhere** and cloud hosting.

---

## 📁 Repository Structure

```
VVK-portfolio/
├── frontend/                          # React + Vite Frontend Application
│   ├── public/
│   │   └── images/                    # Profile images and assets
│   ├── src/
│   │   ├── components/                # Modular React components
│   │   │   ├── Preloader.jsx          # Initial animation and loading bar
│   │   │   ├── CustomCursor.jsx       # Smooth RAF lerp cursor and element expansion
│   │   │   ├── Navbar.jsx             # Floating bottom dock with scrollspy
│   │   │   ├── Hero.jsx               # Hero section, marquee text, and photo frame
│   │   │   ├── About.jsx              # Bio, social buttons, and status cards
│   │   │   ├── Skills.jsx             # Categorized skill chips
│   │   │   ├── Experience.jsx         # Journey timeline (Experience & Education)
│   │   │   ├── Projects.jsx           # Featured quantum and software projects
│   │   │   ├── Certifications.jsx     # PROJECT-Q credential card with badges
│   │   │   ├── Contact.jsx            # Validated contact form with honeypot & API dispatch
│   │   │   ├── Footer.jsx             # Footer copyright and branding
│   │   │   ├── ScrollTop.jsx          # Floating scroll-to-top button
│   │   │   └── Toast.jsx              # Animated feedback toasts
│   │   ├── App.jsx                    # Root app with intersection observers
│   │   ├── index.css                  # Slate-grey design system & animations
│   │   └── main.jsx                   # React mounting entry point
│   ├── index.html                     # HTML5 template with Google Fonts & SEO tags
│   ├── package.json                   # React, Vite, Lucide dependencies
│   ├── vite.config.js                 # Vite config with dev API proxy
│   ├── .env.example                   # Frontend environment configuration template
│   └── README.md                      # Frontend setup guide
│
├── backend/                           # Flask REST API Backend (Hostable on PythonAnywhere)
│   ├── app.py                         # Flask application (CORS, Rate Limiting, Mail Dispatch)
│   ├── wsgi.py                        # Standard WSGI entry point
│   ├── pythonanywhere_wsgi.py         # Ready-to-copy PythonAnywhere WSGI configuration
│   ├── requirements.txt               # Backend Python dependencies
│   ├── Procfile                       # Production process file (Render / Gunicorn)
│   ├── .env.example                   # Backend environment configuration template
│   └── README.md                      # Backend setup & PythonAnywhere deployment guide
│
├── .gitignore                         # Repository gitignore covering both stacks
└── README.md                          # Main project documentation
```

---

## 🚀 Quick Start (Local Development)

### 1. Start Backend API
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Configure SMTP settings if needed
python app.py
```
> The backend runs at `http://localhost:5000`.

### 2. Start Frontend App
```bash
cd frontend
npm install
npm run dev
```
> The frontend runs at `http://localhost:5173` and automatically proxies `/send_email` and `/health` requests to the local backend.

---

## ☁️ Deployment Guide

### Backend: PythonAnywhere Hosting
1. Clone the repository into your PythonAnywhere account.
2. Create a virtual environment and install `backend/requirements.txt`.
3. Set your environment variables in `backend/.env`.
4. In the **Web** tab:
   - Set virtualenv path to your created virtual environment.
   - Set source directory to `/home/<username>/VVK-portfolio/backend`.
   - Update the WSGI file using the provided template in `backend/pythonanywhere_wsgi.py`.
5. Click **Reload**. Your backend API will be live at `https://<username>.pythonanywhere.com`.
*(For detailed steps, see [backend/README.md](backend/README.md))*

### Frontend: Vercel / Netlify / Cloudflare Pages
1. Connect your repository to **Vercel** or **Netlify**.
2. Set **Root Directory** to `frontend`.
3. Set Build Command to `npm run build` and Output Directory to `dist`.
4. Add environment variable:
   ```ini
   VITE_API_URL=https://<your-username>.pythonanywhere.com
   ```
5. Deploy!

---

## 📄 License
This project is licensed under the MIT License.
