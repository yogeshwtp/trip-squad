# 🚀 TripSquad: Student Travel Planner

**Plan epic trips across India with your squad! Track budgets, split bills, and build itineraries—all in one place.**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📱 About

TripSquad is a cross-platform mobile app designed for Indian college students to plan budget-friendly trips across India. Built as a portfolio piece demonstrating proficiency in modern mobile development using React Native, Expo, and neo-brutalism design.

---

## ✨ Core Features

### 🗺️ Trip Management
Full CRUD functionality for trips with destination, dates, budget, and status tracking (Upcoming, Ongoing, Completed).

### 📅 Itinerary Builder
Day-wise activity planning with time, location, and cost tracking. Visual timeline view with per-day cost calculations.

### 💰 Budget Tracker
Real-time expense tracking with category-wise budgets (Transport, Food, Accommodation, Activities). Built-in bill splitting calculator for group expenses.

---

## 💻 Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend** | React Native (Expo) | Cross-platform mobile development |
| **Styling** | NativeWind (Tailwind CSS) | Utility-first CSS for responsive UI |
| **State Management** | Zustand | Lightweight global state management |
| **Data Storage** | AsyncStorage | Local data persistence |
| **Navigation** | React Navigation | Stack & tab navigation |
| **Icons** | Lucide React Native | Icon library |
| **Design** | Neo-Brutalism | Bold, high-contrast UI |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Yarn or npm
- Expo Go app on your mobile device

### Installation

```bash
# Clone repository
git clone https://github.com/YourUsername/TripSquad.git
cd TripSquad

# Install dependencies
yarn install

# Start development server
npx expo start

# Scan QR code with Expo Go app to run
```

### Project Structure

```
TripSquad/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI primitives
│   │   ├── trip/           # Trip components
│   │   ├── budget/         # Budget components
│   │   └── itinerary/      # Itinerary components
│   ├── screens/            # App screens
│   ├── store/              # Zustand state
│   ├── utils/              # Helper functions
│   └── App.jsx
├── assets/
├── app.json
└── package.json
```

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP
- [x] Trip CRUD operations
- [x] Itinerary builder
- [x] Budget tracker
- [x] Group collaboration
- [x] Neo-brutalism UI

### 🚧 Phase 2: Enhanced Features
- [ ] Discover destinations
- [ ] Transportation planning
- [ ] Accommodation management
- [ ] Export trip summaries

### 📅 Phase 3: Advanced Features
- [ ] Map integration
- [ ] Weather forecast
- [ ] Photo gallery
- [ ] Cloud sync
- [ ] Dark mode



<div align="center">

**Made with ❤️ for students who love to explore India**

⭐ Star this repo if you find it helpful!

</div>
