# 🏥 Clinic AI Patient System - Prototype

A lightweight, responsive front-end prototype demonstrating an AI-driven patient communication system for medical clinics. Designed to automate appointment reminders, provide personalized medical advice, and reduce patient no-shows.

## 🚀 Key Features

* **💾 Data Persistence (Local Database):** Built with browser `localStorage` to ensure patient records are saved instantly. The clinic will never lose a record even if the page refreshes.
* **🤖 AI Logic & Resend Nudges:** Simulates an AI assistant that instantly generates personalized reminders based on the patient's specific medical condition (e.g., specific fasting rules for blood tests). 
* **📱 WhatsApp API Integration:** One-click automated opening of WhatsApp Web/App pre-filled with the AI-generated patient message.
* **🎨 Enterprise UI/UX:** Fully responsive dark-mode interface with CSS animations, simulated AI typing effects, and state management.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3 (Custom UI with Flexbox/Grid)
* **Logic:** Vanilla JavaScript
* **Storage:** Browser LocalStorage API
* **Integrations:** WhatsApp `wa.me` URL scheme

## 📺 Demo Walkthrough


https://github.com/user-attachments/assets/059d3950-a7af-43d7-8fd8-edc68d0ed292

https://github.com/user-attachments/assets/9ef6019d-9c9b-42b1-a8da-dbc2467ea176


1.  **Patient Management:** Adding new patients updates the UI and dashboard statistics in real-time.
2.  **AI Generation:** Clicking "Send AI Reminder" triggers a customized medical message generation.

## 💡 Future Scope for Full Automation (n8n Integration)
To take this prototype to production, the next steps include:
* Connecting the UI to an **n8n workflow** via Webhooks.
* Integrating the **Groq API (Llama 3)** for dynamic, real-time message generation instead of static templates.
* Connecting a cloud database (like Supabase or PostgreSQL).
