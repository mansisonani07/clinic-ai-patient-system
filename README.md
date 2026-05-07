🏥 Clinic AI Patient System - Prototype
A lightweight, responsive front-end prototype demonstrating an AI-driven patient communication system for medical clinics. Built as a real startup assignment to automate appointment reminders, generate personalized medical advice, and reduce patient no-shows.

🚀 What This System Does

Doctor adds a patient with their name and medical condition
AI instantly generates a personalized WhatsApp reminder based on that patient's specific condition (for example: fasting instructions for a blood test patient)
One click opens WhatsApp with the AI-generated message pre-filled and ready to send
Patient records are saved automatically — the clinic never loses data even after page refresh
Dashboard statistics update in real time as patients are added

## 📺 Demo Walkthrough


https://github.com/user-attachments/assets/059d3950-a7af-43d7-8fd8-edc68d0ed292

https://github.com/user-attachments/assets/9ef6019d-9c9b-42b1-a8da-dbc2467ea176


📺 Demo Videos
Video 1 — Data Persistence (Raj Patel)
Added a new patient and refreshed the page to show data stays saved in the system.
Video 2 — AI Logic and Resend (Priya Shah)
Used the Resend feature for Priya Shah. AI instantly generated a personalized reminder with specific medical advice and opened WhatsApp — showing how the system nudges patients who forget their appointments.

✅ Key Features
Data Persistence
Patient records saved using browser localStorage. Data stays saved even after page refresh. Clinic never loses a record.
AI Message Generation
AI generates personalized reminders based on each patient's specific medical condition. Not generic templates — condition-specific advice every time.
WhatsApp Integration
One-click button opens WhatsApp with the AI-generated message pre-filled. Works on both WhatsApp Web and WhatsApp mobile app.
Real-time Dashboard
Statistics update instantly as new patients are added. Shows total patients, pending reminders, and sent reminders.
Enterprise UI
Fully responsive dark-mode interface with CSS animations and simulated AI typing effect.

🛠️ Tech Stack

Frontend — HTML5, CSS3, Vanilla JavaScript
Storage — Browser localStorage API
AI Logic — Rule-based personalized message generation
Integration — WhatsApp wa.me URL scheme


💡 Next Steps for Full Production Automation
To take this prototype to full production the next steps would be:

Connect to an n8n workflow via webhooks for full backend automation
Integrate Groq API (Llama 3) for dynamic real-time AI message generation
Connect a cloud database like Supabase or PostgreSQL for real data storage
Add Twilio WhatsApp API for automated sending without manual click
Add appointment scheduling and follow-up sequence automation


👩‍💻 Built By
Mansi Sonani — AI Automation Developer
sonanimansi05@gmail.com
github.com/mansisonani07
linkedin.com/in/mansi-sonani-0993513a6
