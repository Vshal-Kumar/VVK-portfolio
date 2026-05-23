# Vadrangi Vishal Kumar — Portfolio

A premium cinematic portfolio built with **Flask** backend and a custom **greyscale editorial** design.

---

## 📁 Project Structure

```
portfolio/
├── app.py                  # Flask application & email route
├── requirements.txt        # Python dependencies
├── Procfile                # For Render/Railway deployment
├── .env.example            # Environment variable template
├── .gitignore
├── README.md
├── templates/
│   └── index.html          # Main portfolio page
└── static/
    ├── css/
    │   └── style.css       # All styles
    ├── js/
    │   └── main.js         # All interactivity
    └── images/             # Your profile photos, project screenshots
        ├── profile.jpg     # Replace with your actual photo
        └── og-image.jpg    # Open Graph preview image
```

---

## 🖼️ Adding Your Photo

1. Add your photo to `static/images/profile.jpg`
2. In `templates/index.html`, find the hero `photo-frame` div and replace:
   ```html
   <span class="photo-initials">VVK</span>
   ```
   with:
   ```html
   <img src="/static/images/profile.jpg" alt="Vadrangi Vishal Kumar" style="width:100%;height:100%;object-fit:cover;object-position:top;">
   ```
3. Do the same in the about section's `about-photo-frame` div.

---

## 🛠️ Local Setup

### 1. Clone & enter
```bash
git clone https://github.com/Vshal-Kumar/portfolio.git
cd portfolio
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```



### 4. Configure environment
```bash
cp .env.example .env
# Edit .env with your Gmail credentials
```

### 5. Gmail App Password setup
1. Enable 2-Factor Authentication on your Google account
2. Go to: **Google Account → Security → 2-Step Verification → App Passwords**
3. Create an app password for "Mail"
4. Paste it as `MAIL_PASSWORD` in your `.env`

### 6. Run locally
```bash
flask run
# or
python app.py
```
Open `http://localhost:5000`

---

## 🚀 Deployment

### Option A — Render (Flask Backend + Static Files)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `gunicorn app:app`
   - **Environment:** Python 3
5. Add environment variables in Render dashboard:
   ```
   SECRET_KEY      = <your-random-key>
   MAIL_USERNAME   = your.email@gmail.com
   MAIL_PASSWORD   = xxxx-xxxx-xxxx-xxxx
   MAIL_RECIPIENT  = vadrangi.vishalkumar@gmail.com
   FLASK_ENV       = production
   ```
6. Deploy → Your site is live at `https://your-app.onrender.com`

### Option B — Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
2. Select your repo
3. Add environment variables in Railway dashboard (same as above)
4. Railway auto-detects `Procfile` and deploys

### Option C — Split (Netlify frontend + Render backend)

For this option, the HTML would need to be static. Recommended to keep as Flask on Render for simplicity since the contact form requires a backend.

---

## 🔄 GitHub Actions (Auto-deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Trigger Render deploy
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"
```

Add `RENDER_DEPLOY_HOOK` in GitHub repo → Settings → Secrets (get from Render dashboard → your service → Settings → Deploy Hook).

---

## 🌐 Custom Domain

1. In Render: Settings → Custom Domains → Add your domain
2. Update your DNS (add CNAME record pointing to your Render URL)
3. SSL is automatic

---

## ⚙️ Environment Variables Reference

| Variable | Description | Required |
|---|---|---|
| `SECRET_KEY` | Flask session secret | Yes |
| `MAIL_USERNAME` | Your Gmail address | Yes |
| `MAIL_PASSWORD` | Gmail App Password (16 chars) | Yes |
| `MAIL_RECIPIENT` | Email to receive messages | Yes |
| `FLASK_ENV` | `production` or `development` | No |
| `PORT` | Server port (default 5000) | No |

---

## 🎨 Customization Guide

### Colors
Edit CSS variables in `static/css/style.css` at the top:
```css
:root {
  --bg: #1a1a1a;        /* Dark background */
  --text: #f0f0f0;      /* Primary text */
  --accent-warm: #c8bfaa; /* Warm accent color */
}
```

### Content
All portfolio content is in `templates/index.html` — edit:
- Hero tagline
- About bio and personal details
- Skills and percentages
- Timeline (experience & education)
- Projects
- Certifications
- Contact details

### Adding Projects
Copy a `project-card` div in the projects section and update:
- `project-num` (01, 02, 03...)
- `project-tags` (tech stack)
- `project-name`
- `project-desc`
- `project-links` href values

---

## 📊 SEO & Performance

- Open Graph meta tags included
- Semantic HTML structure
- Lazy loading ready
- Minimal dependencies (no jQuery, no Bootstrap)
- CSS custom properties for consistency
- Mobile-first responsive design

---

## 📄 License

© 2025 Vadrangi Vishal Kumar. All rights reserved.
