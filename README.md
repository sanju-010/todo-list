# 📋 My ToDo App

A simple, mobile-friendly **Progressive Web App (PWA)** ToDo List with Firebase authentication, task management, calendar view, dark mode, and offline support. Built using HTML, CSS, and JavaScript.

🔗 **Live Site**: [sanju-010.github.io/To-do-list](https://sanju-010.github.io/To-do-list)

## ✨ Features

- ✅ Add, view, and manage tasks
- 📆 Calendar view with task count per day
- ☁️ Firebase authentication & Firestore database
- 🌙 Light/Dark mode toggle
- 📱 PWA support – installable on Android devices
- 📶 Offline-friendly (via Service Worker)
- 🔔 Toast notifications
- 📦 Clean modular structure (HTML, JS, CSS separated)

## 🚀 Try It Out

> Open in mobile browser → "Add to Home Screen" → Use as native app!

## 📸 Screenshots

| Home Tasks | Calendar View | Add Task Modal |
|------------|----------------|----------------|
| ![Home](./screenshots/home.png) | ![Calendar](./screenshots/calendar.png) | ![Add](./screenshots/add.png) |

*(You can add actual screenshots inside a `screenshots/` folder)*

## 🔧 Installation & Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanju-010/To-do-list.git
   cd To-do-list
   ```
2. Open in Live Server
You can use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code:

Right-click `index.html` → “Open with Live Server”

3. Setup Firebase
  Create a Firebase project at firebase.google.com
  Enable Authentication (Email/Password) and Firestore
  Add your domain (127.0.0.1, github.io) to Authentication > Settings > Authorized Domains
  Replace your firebase.js config with your actual Firebase credentials

4. Enable PWA Features
  Ensure you have manifest.json and sw.js properly set
  Add icons under icons/ folder

📦 Tech Stack
  HTML, CSS, JavaScript (Vanilla)
  Firebase Authentication + Firestore
  Progressive Web App (PWA)
  GitHub Pages for hosting

📲 Add to Home Screen (PWA)
  Open the app in Chrome on mobile
  Tap the three-dot menu → "Add to Home Screen"
  Enjoy a native-like app!
