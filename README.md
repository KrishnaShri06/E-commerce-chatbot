# ShopKart AI: E-commerce Platform with Llama 3 Chatbot

A modern, high-performance E-commerce website integrated with a real-time AI Customer Support chatbot powered by **Groq (Llama 3.3)** and **Supabase**.

## 🚀 Features
- **Modern UI**: Built with React, Vite, and glassmorphism design.
- **AI Chatbot**: Real-time support that tracks orders and handles refunds using Llama 3.
- **Supabase Integration**: Live database for products, user orders, and refund tracking.
- **Smart Escalation**: Automatically detects customer frustration and flags for human support.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/KrishnaShri06/E-commerce-chatbot.git
cd E-commerce-chatbot
```

### 2. Backend Setup (Flask & AI)
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows
   # or source venv/bin/activate # macOS/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` folder:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   GROQ_API_KEY=your_groq_api_key
   PORT=5000
   ```

### 3. Frontend Setup (React & Vite)
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` folder:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Run the SQL script found in `frontend/supabase_schema.sql` in the Supabase SQL Editor to set up the `orders` and `refunds` tables.

---

## 🏃 Running the Project

### 1. Start the Backend
```bash
cd backend
python app.py
```
The API will run on `http://127.0.0.1:5000`.

### 2. Start the Frontend
```bash
cd frontend
npm run dev # Or use npm.cmd run dev on Windows PowerShell
```
The website will be available at `http://localhost:5173`.

---

## 🤖 Chatbot Commands to Test
Once everything is running, try these queries:
- *"Where is my order 2bf128fa-0e44-4d63-9811-a2df63b19a24?"*
- *"I want to check my refund status for my recent order."*
- *"This order is taking too long, I'm very upset!"* (Triggers escalation)

---

## 🛡️ Security Note
This project uses a `.gitignore` to prevent your sensitive `.env` files from being pushed to GitHub. **Never share your API keys publically.**
