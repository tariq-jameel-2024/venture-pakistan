# 🏔️ Venture Pakistan (Travel with Tariq AI)

An elite, AI-powered travel planning platform designed to curate personalized journeys across Northern Pakistan. Built with modern web technologies, this platform seamlessly combines real-time AI itinerary generation, interactive mapping, and a premium glassmorphism user interface.

## ✨ Key Features

* **🤖 AI-Powered Trip Planner:** Integrates the official `@google/genai` SDK (Gemini 2.5 Flash) to generate highly personalized, day-by-day travel itineraries, accurate PKR budget breakdowns, and local insights based on user preferences.
* **🗺️ Interactive Explorer Map:** A dynamic Leaflet-based atlas rendering precise coordinates for popular destinations (Hunza, Skardu, Kumrat), scenic flight corridors, and boutique lodging.
* **🗂️ Modern State Management:** Utilizes Zustand for lightweight, fast, and prop-drilling-free global state management across modals and drawers.
* **📱 Native-App-Like UX:** Fully responsive design featuring a bottom navigation bar for mobile devices, touch-friendly bottom sheets, and premium Tailwind CSS v4 styling.
* **☁️ Cloud Sync (In Progress):** Firebase Authentication and Firestore integration to persist user favorites and saved trips across multiple devices.

## 🛠️ Tech Stack

* **Frontend Framework:** React 19, Vite
* **Language:** TypeScript
* **Styling & UI:** Tailwind CSS v4, Lucide React (Icons)
* **State Management:** Zustand
* **Routing:** React Router v6
* **Artificial Intelligence:** Google GenAI SDK (`gemini-2.5-flash`)
* **Mapping:** Leaflet (`react-leaflet`)
* **Backend & Auth:** Firebase (Firestore, Auth)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   npm install
   VITE_GEMINI_API_KEY="your_google_gemini_api_key"

# Firebase Configuration (For Cloud Sync & Admin)
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"**
npm run dev
Bohot aala! Aapka project ab GitHub par live hai, isliye ek professional aur detailed `README.md` hona bohat zaroori hai taake agar koi dusra developer ya recruiter aapka code dekhe, toh usay project ka standard pata chale.

Aap is code block ko copy karein aur apne project ke main folder mein mojood `README.md` file mein paste kar ke save kar lein:

```markdown
# 🏔️ Venture Pakistan (Travel with Tariq AI)

An elite, AI-powered travel planning platform designed to curate personalized journeys across Northern Pakistan. Built with modern web technologies, this platform seamlessly combines real-time AI itinerary generation, interactive mapping, and a premium glassmorphism user interface.

## ✨ Key Features

* **🤖 AI-Powered Trip Planner:** Integrates the official `@google/genai` SDK (Gemini 2.5 Flash) to generate highly personalized, day-by-day travel itineraries, accurate PKR budget breakdowns, and local insights based on user preferences.
* **🗺️ Interactive Explorer Map:** A dynamic Leaflet-based atlas rendering precise coordinates for popular destinations (Hunza, Skardu, Kumrat), scenic flight corridors, and boutique lodging.
* **🗂️ Modern State Management:** Utilizes Zustand for lightweight, fast, and prop-drilling-free global state management across modals and drawers.
* **📱 Native-App-Like UX:** Fully responsive design featuring a bottom navigation bar for mobile devices, touch-friendly bottom sheets, and premium Tailwind CSS v4 styling.
* **☁️ Cloud Sync (In Progress):** Firebase Authentication and Firestore integration to persist user favorites and saved trips across multiple devices.

## 🛠️ Tech Stack

* **Frontend Framework:** React 19, Vite
* **Language:** TypeScript
* **Styling & UI:** Tailwind CSS v4, Lucide React (Icons)
* **State Management:** Zustand
* **Routing:** React Router v6
* **Artificial Intelligence:** Google GenAI SDK (`gemini-2.5-flash`)
* **Mapping:** Leaflet (`react-leaflet`)
* **Backend & Auth:** Firebase (Firestore, Auth)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/tariq-jameel-2024/venture-pakistan.git](https://github.com/tariq-jameel-2024/venture-pakistan.git)
   cd venture-pakistan

```

2. **Install dependencies:**
```bash
npm install

```


3. **Environment Setup:**
Create a `.env.local` file in the root directory and add your API keys:
```env
VITE_GEMINI_API_KEY="your_google_gemini_api_key"

# Firebase Configuration (For Cloud Sync & Admin)
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"

```


4. **Run the development server:**
```bash
npm run dev

```


The application will be available at `http://localhost:3000` (or the port specified by Vite).

## 👨‍💻 Author

**Tariq Jameel**

* Full-Stack Web Developer & Software Engineer
* GitHub: [@tariq-jameel-2024](https://github.com/tariq-jameel-2024)
* LinkedIn: [Tariq Jameel](https://www.google.com/search?q=https://linkedin.com/in/tariq-jameel-4392a8370)

---

*Built with passion in Peshawar, Pakistan.*

```

Is `README.md` ko save karke aap terminal mein wapas `git add .`, `git commit -m "Added professional README"`, aur `git push` chala sakte hain taake yeh GitHub par update ho jaye.

<FollowUp>Kia ab hum Phase 4 (Firebase Cloud Sync) ya Admin Panel wale prompt ki taraf chalein?</FollowUp>

```
