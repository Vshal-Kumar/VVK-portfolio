# 🚀 Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide walks you through deploying your **React Frontend on Vercel** and your **Flask API Backend on Render**, connecting them securely, and enabling the **24/7 Keep-Alive heartbeat** to prevent Render free-tier cold starts.

---

## 📋 Architecture Overview

- **Frontend**: [Vercel](https://vercel.com) (React 19 + Vite SPA, Global Edge CDN, SSL, Zero Sleep).
- **Backend**: [Render](https://render.com) (Flask 3 API Web Service, Gunicorn WSGI, CORS Enabled).
- **Connection**: Frontend makes HTTPS requests to `https://<YOUR_RENDER_APP>.onrender.com/send_email`.
- **Keep-Alive**: Automatic 14-minute heartbeat via frontend visitor pre-warm + GitHub Actions cron.

---

## Part 1: Deploy Backend on Render (Step-by-Step)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository (`VVK-portfolio`).
3. Configure the settings:
   - **Name**: `vvk-portfolio-backend` (or your preferred name)
   - **Region**: Closest to your users (e.g. *Singapore* or *Frankfurt*)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn wsgi:app`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   | Key | Example Value | Description |
   |---|---|---|
   | `SECRET_KEY` | *(Click Generate)* | Flask secret key |
   | `ALLOWED_ORIGINS` | `*` (or your Vercel URL) | CORS allowed domain |
   | `MAIL_SERVER` | `smtp.gmail.com` | SMTP Server |
   | `MAIL_PORT` | `465` | SSL Port (465 is recommended on Render) |
   | `MAIL_USE_SSL` | `true` | Enable SSL (set to `true` when port is 465) |
   | `MAIL_USE_TLS` | `false` | Disable TLS (when SSL is true) |
   | `MAIL_USERNAME` | `your.email@gmail.com` | Your Gmail address |
   | `MAIL_PASSWORD` | `xxxx xxxx xxxx xxxx` | [Google App Password](https://myaccount.google.com/apppasswords) |
   | `MAIL_RECIPIENT` | `your.email@gmail.com` | Where form submissions arrive (also supports `RECIPIENT_EMAIL`) |

5. Click **Create Web Service**.
6. Once deployed, copy your Render URL (e.g., `https://vvk-portfolio-backend.onrender.com`).

---

## Part 2: Deploy Frontend on Vercel (Step-by-Step)

1. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import** on your `VVK-portfolio` repository.
2. Under **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   | Key | Value | Description |
   |---|---|---|
   | `VITE_API_URL` | `https://vvk-portfolio-backend.onrender.com` | Your live Render backend URL |

4. Click **Deploy**.
5. Vercel will build and launch your live portfolio domain (e.g. `https://vvk-portfolio.vercel.app`).

---

## Part 3: Keep-Alive Heartbeat (Prevent Render 15-Min Sleep)

Render's free tier spins down after 15 minutes of inactivity. We have implemented **two layers** to keep it active 24/7:

### Layer 1: Automatic Frontend Pre-Warm & Tab Heartbeat
- Included in [`frontend/src/utils/keepAlive.js`](file:///home/vishal-kumar/Desktop/VVK-portfolio/frontend/src/utils/keepAlive.js).
- Pings `GET /health` the instant a user opens the site and every 14 minutes while viewing.

### Layer 2: 24/7 GitHub Actions Cron Heartbeat
1. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. Name: `RENDER_BACKEND_URL`
4. Value: `https://vvk-portfolio-backend.onrender.com` (without trailing slash).
5. GitHub will now automatically send a lightweight ping every 14 minutes via [`.github/workflows/keep_alive.yml`](file:///home/vishal-kumar/Desktop/VVK-portfolio/.github/workflows/keep_alive.yml), ensuring your backend is **always awake and responds in milliseconds**.

---

## 🧪 Testing the Live Connection

1. Open your live Vercel URL.
2. Scroll to the **Contact** section.
3. Fill out the contact form and hit **Send Message**.
4. You will see a success toast and receive the email in your inbox instantly.
