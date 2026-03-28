# 🚀 SchoolHub: Next-Gen Educational OS

**SchoolHub** is a high-performance, futuristic school management system built with React, Tailwind CSS, and Firebase. It features real-time data syncing, and a robust permission-based architecture.

---

## ✨ Key Features

### 🔐 **Advanced Security & Permissions**
- **Email-Based Access**: Permissions are synced directly to faculty login emails, ensuring seamless access across devices.
- **Granular Control**: Admins can toggle individual module access (Dashboard, Staff, Students, Library, etc.) for each teacher.
- **Permission Presets**: One-click configuration for common roles like "Teaching" or "Full Access."

### 📊 **Core Modules**
- **Treasury Insights**: High-visibility financial tracking with automated balance calculations and mass disbursement for salaries.
- **Student Directory**: Organized by academic class with real-time fee status tracking and detailed student profiles.
- **Faculty Management**: Comprehensive staff onboarding with category-based organization and salary tracking.
- **Communication Hub**: Integrated messaging system for school-wide or individual email notifications.
- **Library OS**: Digital inventory management with book issuance and return tracking.
- **Attendance 2.0**: Live daily tracking for both faculty and students with monthly performance stats.

---

## 🛠️ Technical Stack
- **Frontend**: React 18, Tailwind CSS, Lucide Icons.
- **Backend**: Firebase Auth, Firestore (Real-time DB).
- **Design**: Plus Jakarta Sans (Typography), Custom Modern Shadows.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js installed.
- A Firebase project set up.

### 2. Installation
```bash
npm install
```

### 3. Firebase Configuration
Update `src/firebase-config.js` with your project credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ... rest of your config
};
```

### 4. Development
```bash
npm run dev
```

---


## 🏗️ Project Structure
```text
src/
├── components/          # Reusable UI components
├── auth-context.jsx     # Global authentication & permission state
├── auth-pages.jsx       # Login & Registration flows
├── App.jsx              # Main Application & Section routing
├── permission-management.jsx # Access Control dashboard
└── firebase-config.js   # Database & Auth initialization
```

---

## ⚖️ License
Licensed under the MIT License. Created for the next generation of educational management.
