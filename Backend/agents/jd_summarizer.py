import json
import sqlite3

# Placeholder for API key
GEMINI_API_KEY = "YOUR_API_KEY_HERE"

DB_FILE = "job_descriptions.db"


def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Create job descriptions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS job_descriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            skills TEXT,
            experience INTEGER
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cvs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jd_id INTEGER,
            name TEXT,
            skills TEXT,
            experience INTEGER,
            match_score REAL
        )
    ''')
    conn.commit()
    conn.close()
    print("Database initialized")

def save_jd_to_db(jd_data):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO job_descriptions (title, skills, experience)
        VALUES (?, ?, ?)
    ''', (jd_data['title'], json.dumps(jd_data['skills']), jd_data['experience']))
    jd_id = cursor.lastrowid
    conn.commit()
    conn.close()
    print(f"Saved job description with ID: {jd_id}")
    return jd_id


def match_cv_to_jd(jd_data, cv_data):
    # TODO: Implement real matching logic (skills overlap, experience, etc.)
    skills_match = len(set(jd_data['skills']) & set(cv_data['skills'])) / len(jd_data['skills']) * 100
    return {"match_score": skills_match}


# TODO: Add file upload handling (PDF, DOCX, etc.)
# TODO: Integrate with AI API for better text parsing
# TODO: Add more fields (education, projects, etc.)
# TODO: Improve matching algorithm with weights
# TODO: Add API endpoints with FastAPI

# Example usage
if __name__ == "__main__":
    init_db()
    # Sample job description
    jd_data = {
        "title": "Software Engineer",
        "skills": ["Python", "JavaScript", "SQL"],
        "experience": 5
    }
    jd_id = save_jd_to_db(jd_data)
  