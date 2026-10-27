# Agri-Tech — Smart Farming Management System 🌾

Agri-Tech is a full-stack, enterprise-grade smart agricultural management platform built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js). It empowers farmers with digital tools to enhance productivity, monitor field operations, and practice precision sustainable farming.

---

## 🚀 Key Features (Mapped to PRD & Context)

1. **User Authentication & Role-Based Access Control (RBAC)**
   - Secure authentication via **JWT** and **bcrypt** password encryption.
   - Dual roles: **Farmer** and **Administrator**.
   - Language preferences (`English`, `हिन्दी`, `मराठी`, `Español`) stored in user profiles.

2. **Farm Profile Setup & Boundaries**
   - Manage farm parcels with total acreage, soil classification (Black Cotton, Loamy, Alluvial, Red Loam, etc.), micro-irrigation sources (Drip, Sprinkler, Canal), and GPS coordinates.

3. **Crop Lifecycle Monitoring & Field Analytics**
   - Track crop phenology through growth stages (*Germination*, *Vegetative*, *Flowering*, *Grain Filling*, *Maturity*, *Harvested*).
   - Real-time crop health assessment (*Optimal*, *Mild Stress*, *Attention Needed*, *Pest Risk*, *Critical*).
   - Field activity logs (*Sowing*, *Fertilization*, *Irrigation*, *Pesticide Sprays*, *Weeding*, *Harvesting*) with cost tracking.

4. **Soil Health Diagnostic & NPK Intelligence**
   - Automated chemical evaluation of **pH**, **Nitrogen (N)**, **Phosphorus (P)**, **Potassium (K)**, **Organic Carbon (%)**, and **Moisture (%)**.
   - Automated agronomic advisory generator and high-suitability crop matching based on soil chemistry.

5. **Weather Forecasting & Agricultural Advisory**
   - Real-time atmospheric conditions: Temperature, humidity, wind speed, UV index, and precipitation probability.
   - 5-day weather outlook with hyper-local agricultural advisories (spray windows, micro-irrigation timing, drainage alerts).

6. **Pest Outbreak Alerts & Disease Surveillance**
   - Regional pest tracking with severity grading (*Critical*, *High*, *Moderate*).
   - Detailed host crops, field diagnostic symptoms, preventive bio-controls, and recommended curative treatments.
   - Admin alert publishing console.

7. **Agricultural Resource Marketplace (Store)**
   - Curated agricultural catalog: Certified hybrid seeds, water-soluble bio-fertilizers, organic pesticides, drip laterals, and battery sprayers.
   - Search, category filters, real-time stock levels, and user ratings.

8. **Orders & Live Shipment Tracking**
   - Shopping cart drawer with subtotal calculations.
   - Checkout with farm delivery address and payment methods (*Kisan Pay Cash on Delivery*, *UPI/AgriCard*, *Net Banking*).
   - Visual step-by-step progress stepper: `Placed` → `Processing` → `Dispatched` → `Out for Delivery` → `Delivered`.

9. **Agronomist & Scientist Expert Desk**
   - Submit agricultural queries with crop type, urgency level, and problem descriptions.
   - Specialist diagnosis and prescription issuance by agricultural scientists.

10. **Kisan Community & Knowledge Exchange**
    - Discussion forum categorized into *Crop Care*, *Organic Farming*, *Machinery*, *Market MSP Rates*, and *Govt Schemes*.
    - Interactive replies, helpful upvotes, and content moderation.

11. **Administrator Command Console**
    - System metrics: Total users, registered farm acreage, monitored crops, active pest alerts, and gross platform revenue.
    - User management: View users, toggle roles (Farmer ↔ Admin), and account deletion.
    - Order status updates: Advance shipping milestones and append checkpoint notes.

12. **Multilingual & Responsive UI**
    - Dynamic language switcher supporting **English**, **हिन्दी (Hindi)**, **मराठी (Marathi)**, and **Español (Spanish)**.
    - Clean glassmorphism styling, curated agricultural palette, and mobile-friendly design.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 (Vite), Bootstrap 5.3, Vanilla CSS Design System, Lucide Icons, Axios, React Router v6 |
| **Backend** | Node.js (v22), Express.js (v4), RESTful APIs, JWT, bcryptjs, Morgan |
| **Database** | MongoDB v8 (Mongoose ODM) |
| **Security** | Role-Based Access Control (RBAC), bcrypt salt hashing, JWT Authorization Header Bearer |

---

## 🔑 Demo Login Credentials

For quick evaluation, use the one-click demo fill buttons on the login page or enter:

| Role | Email | Password |
|---|---|---|
| **Farmer** | `farmer@agritech.com` | `farmer123` |
| **Administrator** | `admin@agritech.com` | `admin123` |

---

## 🏃 Running the Application

### 1. Start MongoDB
Ensure MongoDB is running locally on port 27017:
```powershell
mongod
```

### 2. Backend Setup & Seeding
```powershell
cd backend
npm install
npm run seed     # Populates sample farms, crops, soil reports, pests, store items, and orders
npm run dev      # Starts API server on http://localhost:5000
```

### 3. Frontend Setup
```powershell
cd frontend
npm install
npm run dev      # Starts Vite development server on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.
