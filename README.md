# MedicApp 🏥

MedicApp is a modern, high-performance **React Native** mobile application built with **Expo**. It serves as a comprehensive scheduling platform where users can browse healthcare providers, view availability, and manage medical appointments with ease.

## 🚀 Features

### 1. User Authentication
- **Secure Registration:** Create an account with name, email, and password.
- **Smart Login:** Session persistence allows users to stay logged in across app restarts.
- **Local Persistence:** Uses `AsyncStorage` for secure local data management.

### 2. Doctor Discovery
- **Provider Listings:** A clean, searchable list of medical professionals.
- **Specialization Filters:** Categorize doctors by their field (Cardiology, Pediatrics, etc.).
- **Detailed Profiles:** View doctor ratings, experience, and availability at a glance.

### 3. Appointment Scheduling
- **Real-time Availability:** Choose dates and time slots that aren't already booked.
- **Instant Booking:** Seamlessly reserve a slot with immediate confirmation.
- **Slot Conflict Prevention:** Backend logic ensures that once a slot is booked, it's removed from availability for other users.

### 4. Appointment Management
- **Dashboard:** View all upcoming and past appointments in one place.
- **Cancellation:** Flexibility to cancel appointments with instant status updates.

---

## 🛠️ Technical Stack

- **Framework:** [React Native](https://reactnative.dev/)
- **Development Tooling:** [Expo SDK 54](https://expo.dev/)
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling:** Dynamic theme support with curated HSL color palettes.
- **Storage:** `@react-native-async-storage/async-storage` for local data persistence.
- **Icons:** `@expo/vector-icons` (Ionicons)

---

## 📂 Project Structure

```text
├── app/                # Expo Router Layouts & Main Routes
├── src/
│   ├── components/     # Reusable UI components (Buttons, Cards, etc.)
│   ├── screens/        # Full-page screens (Home, Booking, My Appointments)
│   ├── data/           # Mock data and provider information
│   ├── utils/          # Storage logic, themes, and helper functions
│   └── hooks/          # Custom React hooks
├── assets/             # Images, fonts, and static resources
└── app.json            # Expo configuration
```

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Expo Go app on your mobile device (to test on physical hardware)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/akshat0416/MedicApp.git
   cd MedicApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your device:
   - Scan the QR code with the **Expo Go** app (Android) or **Camera** app (iOS).
   - Alternatively, press `a` for Android Emulator or `i` for iOS Simulator.

---

## 📝 Problem Statement Compliance
This project satisfies all requirements for the **"PART II: Development of a Scheduling Platform"** task:
- ✅ Developed with React Native.
- ✅ Robust User Registration/Auth.
- ✅ Dynamic Service Provider Listings.
- ✅ Full Appointment Scheduling & Management.
- ✅ Clean, well-structured, and documented code.

---

## 👋 Contact
Developed by **Akshat**
