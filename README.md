## Technology Stack

- **Backend**: Python with Django, FastAPI.
- **Frontend**: React
- **Database**: Sqlite
- **Other Tools**: Git,Git-Hub, etc.

## Installation

To set up the project locally, follow these steps:



1. **Clone the repository**:
   ```bash
   git clone https://github.com/pratham8530/ Hackathon.git
   cd  Hackathon
   ```

2. **Create a virtual environment** (optional):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

### Backend

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   Create a `.env` file in the `backend` directory and include the necessary environment variables. Example:
   ```
   DATABASE_URL=your_database_url
   SECRET_KEY=your_secret_key
   ```

3. **Run the backend server**:
   ```bash
   uvicorn app:app --reload  # Adjust this command based on your main file
   ```

### Frontend

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the frontend application**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and go to `http://localhost:8080` to view the application.

## Usage

Once both the backend and frontend are running, you can interact with the application through your web browser. [Add any specific usage instructions or features here.]

## Project Structure

```
 Hackathon/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.py  # Main file for the backend
│   ├── tests/
│   ├── requirements.txt
│   ├── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
├── README.md
└── .gitignore
```

# 🚀 Day 1 Progress Log

## ✅ Checkpoint 1
**Features:**
- Backend initialized with **FastAPI**
- **SQLite** database with initial schema
- Frontend layout started – **Sidebar + Header**

**🔧 Next:**
- Implement **JD/CV parser** logic
- Start **Candidate Preview** & **Upload** components

---

## ✅ Checkpoint 2
**Features:**
- **JD Parser** logic + Summarizer agent implemented
- JD **Upload & Preview** components integrated

**🔧 Next:**
- Integrate **CV Matcher** and logic pipeline

---

## ✅ Checkpoint 3
**Features:**
- CV Matching (Phase 1): **Sentence Transformer** model loaded
- Frontend: **Candidate Card** display + **CV Uploader**

**🔧 Next:**
- Complete **Matcher Logic** & **Scoring Utils**
- Integrate backend APIs

---

## ✅ Checkpoint 4
**Features:**
- Added **Scoring Mechanism** for CV Matching
- Started **Email Automation** module
- Frontend: **Loading States** & Layout enhancements

**🔧 Next:**
- Finish **Email + Feedback** loop
- Integrate **Insights Dashboard**

---

## ✅ Checkpoint 5
**Features:**
- Manual **Skill Boost** logic for feedback tuning
- UI: **Tuners & Feedback Actions**
- Initial **Analytics Route** ready

**🔧 Next:**
- Build full **Insights Dashboard View**
