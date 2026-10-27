# Production Deployment Guide — Agri-Tech 🚀

This repository is structured for **zero-friction production deployment**. The Express backend serves both the RESTful API endpoints and the compiled React production bundle as a single cohesive unit, with Helmet security headers, Gzip compression, and graceful shutdowns.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
1. **MongoDB Atlas URI** (or any cloud MongoDB instance).
   - Sign up free at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free `M0` cluster
   - In *Network Access*, add IP `0.0.0.0/0` (Allow access from anywhere)
   - In *Database Access*, create a user and copy the connection string:
     `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/agritech?retryWrites=true&w=majority`
2. **JWT Secret**: Any secure 32+ character random string.

---

## 🌐 Option 1: Deploy to Render.com (Recommended — Simplest & Free)

Render can build the React frontend and run the Node.js backend under a single unified web service.

1. Push your repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New → Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name:** `agritech-platform`
   - **Environment:** `Node`
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/agritech?retryWrites=true&w=majority`
   - `JWT_SECRET` = `<your_random_secret_string>`
6. Click **Create Web Service**. Render will build the frontend assets, install dependencies, and launch your live application URL (e.g., `https://agritech-platform.onrender.com`).
7. *(Optional)* To seed initial demo data, run in the Render Shell:
   ```bash
   npm run seed
   ```

---

## 🚂 Option 2: Deploy to Railway.app

1. Go to [Railway.app](https://railway.app/) and create a **New Project**.
2. Select **Deploy from GitHub repo**.
3. Railway automatically detects `package.json` and runs `npm run build` followed by `npm start`.
4. Add environment variables in the Railway dashboard:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `<your_mongo_connection_string>`
   - `JWT_SECRET` = `<your_jwt_secret>`
5. Generate a public domain under service settings.

---

## 🐳 Option 3: Deploy with Docker & Docker Compose (VPS, AWS, DigitalOcean)

The repository includes a production multi-stage [Dockerfile](file:///c:/Users/CHANDRABHAN/OneDrive/Desktop/AgriTech/Dockerfile) and [docker-compose.yml](file:///c:/Users/CHANDRABHAN/OneDrive/Desktop/AgriTech/docker-compose.yml) with an isolated MongoDB container and persistent volume.

1. Install Docker and Docker Compose on your server.
2. Clone your repository:
   ```bash
   git clone <your-repo-url>
   cd AgriTech
   ```
3. Start the entire containerized stack:
   ```bash
   docker compose up -d --build
   ```
4. Verify running containers:
   ```bash
   docker compose ps
   ```
5. *(Optional)* Seed initial data inside the container:
   ```bash
   docker compose exec agritech-app npm run seed
   ```
Your app will be live on port `5000` (can be reversed-proxied via Nginx with SSL/Certbot).

---

## ⚡ Option 4: Split Deployment (Vercel Frontend + Render/Heroku Backend)

If you prefer hosting the frontend separately on Vercel:

1. **Deploy Backend:**
   - Deploy the `backend/` directory to Render or Railway.
   - Note the backend live URL (e.g., `https://agritech-api.onrender.com`).
2. **Deploy Frontend on Vercel:**
   - Import the `frontend/` directory to Vercel.
   - Set Environment Variable: `VITE_API_URL` = `https://agritech-api.onrender.com`
   - Framework preset: `Vite`.
3. In `backend/.env`, set:
   `ALLOWED_ORIGINS=https://your-vercel-app.vercel.app`

---

## 🛡️ Production Health & Monitoring

Once deployed, you can verify backend and database telemetry anytime via:
```http
GET /api/health
```

Sample production response:
```json
{
  "status": "online",
  "timestamp": "2026-10-27T16:39:55.097Z",
  "service": "Agri-Tech Smart Farming API",
  "environment": "production",
  "uptimeSeconds": 1420,
  "database": {
    "status": "connected",
    "host": "cluster0.abcde.mongodb.net"
  },
  "version": "1.0.0"
}
```
