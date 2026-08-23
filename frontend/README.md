# VVK Portfolio — React Frontend

Modern React application built with **Vite**, replicating the cinematic slate-grey design system, fluid cursor lerp micro-animations, bottom floating dock navigation, and interactive quantum computing showcases.

---

## 🛠 Tech Stack

- **Framework:** React 19 + Vite
- **Icons:** Lucide React (`lucide-react`)
- **Typography:** `DM Sans`, `Bebas Neue`, `Cormorant Garamond` (Google Fonts)
- **Styling:** Custom Modular CSS / Design Tokens (`src/index.css`)

---

## 🚀 Getting Started Locally

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```
   The compiled static bundle will be generated in `frontend/dist/`.

---

## 🌐 Connecting to Backend (PythonAnywhere / Local)

- **Local Development:** Vite automatically proxies `/send_email` and `/health` requests to `http://localhost:5000` via `vite.config.js`.
- **Production (Vercel / Netlify / Cloudflare Pages):**
  Create a `.env` file in the `frontend/` directory (or set Environment Variables in your hosting dashboard):
  ```ini
  VITE_API_URL=https://<your-username>.pythonanywhere.com
  ```
