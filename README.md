# Venture Pakistan

Curated travel experiences across Pakistan — combining destination discovery, trip customization, group cost estimation, booking workflows, and AI travel assistance.

---

## Overview

**Venture Pakistan** is a full-stack web travel planning application built for exploring destinations across Pakistan (such as Hunza Valley) and building custom trips around traveler preferences rather than rigid bus schedules.

---

## Key Features

* **Hero & Destination Discovery:** Full-width visual landing experience highlighting curated journeys and featured destinations.
* **Interactive Trip Filter & Builder Bar:** Filter and configure trips by destination, dates, duration, travelers, and budget tier (`BUILD MY TRIP`).
* **Group Trip Cost Estimator:** Estimate travel costs dynamically based on group size and trip options.
* **Guided Booking Workflow:** Multi-step trip planning and booking flow with reference tracking and direct WhatsApp handoff.
* **AI Travel Concierge (`Sigma`):** Interactive assistant to help users explore routes, destinations, and trip questions.
* **Theme Support:** Dark-mode and light-mode theme switching across the interface.

---

## Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS, Lucide React
* **Backend & Database:** PostgreSQL / Supabase
* **Version Control & Hosting:** GitHub, Render

---

## Project Structure

> Update the paths below to match your repository layout.

```text
venture-pakistan/
├── public/          # Static assets and media
├── src/
│   ├── components/  # Navbar, hero, filter/booking bar, cards, chatbot (Sigma)
│   ├── pages/       # Route views (home, destinations, booking flow)
│   ├── styles/      # Theme variables and Tailwind configuration
│   └── App.tsx      # Main application root and routing
├── package.json
└── README.md
