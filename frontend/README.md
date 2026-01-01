# Kare Events - Campus Event Management Platform

A comprehensive platform for students to discover, track, and manage campus events, comprising a React frontend and a Python-based backend automation system.

**Repository:** [https://github.com/Venkatasai6789/Events_Kare.git](https://github.com/Venkatasai6789/Events_Kare.git)

## 🚀 Features

*   **Event Discovery:** Browse Internal and External events (Workshops, Hackathons, Fests).
*   **Automated Scraping:** Daily background jobs scrape upcoming fests from *KnowAFest* and update the dashboard.
*   **Student Dashboard:** Track attended events, earned certificates, and OD requests.
*   **Admin/HOD Panels:** Manage approvals and view analytics.

## 🛠️ Tech Stack

*   **Frontend:** React, Tailwind CSS, Lucide React, Vite.
*   **Backend:** Python (Requests, BeautifulSoup), JSON database.
*   **Automation:** Zero-dependency Python scheduler.

---

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)

### 1. Clone the Repository
```bash
git clone https://github.com/Venkatasai6789/Events_Kare.git
cd Events_Kare
```

### 2. Backend Setup (Scraper & Scheduler)
Navigate to the root directory and create a virtual environment (optional but recommended):
```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate
```

Install requirements (if any) or ensure you have `requests` and `beautifulsoup4`:
```bash
pip install requests beautifulsoup4
```

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
npm install
```

---

## 🏃‍♂️ Running the Application

### Start the Frontend
In the `frontend` directory:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Start the Backend Scheduler (Automation)
The scheduler runs in the background to scrape events daily at 18:00 (6 PM).
In the root directory (make sure your venv is active):
```bash
python backend/scheduler.py
```
*   **Logs:** Check `backend/scheduler.log` to monitor the scraping status.
*   **Test:** To run an immediate scraping job for testing: `python backend/scheduler.py test`

---

## 📁 Project Structure

*   `backend/` - Contains scraper scripts, scheduler, and raw data.
    *   `upcoming_scraper.py` - Scrapes KnowAFest.
    *   `knowafest_frontend_bridge.py` - Transforms data for frontend.
    *   `scheduler.py` - Manages daily execution.
*   `frontend/` - React application.
    *   `src/data/` - Contains `external_events.json` (generated).
    *   `components/` - React components (Student, Admin, HOD views).

## ⚠️ Notes
*   The `.env` file and generated JSON data files (`knowafest_complete_data.json`, `external_events.json`) are ignored in git to keep the repo clean. The system will regenerate the data automatically upon the first scheduler run.
