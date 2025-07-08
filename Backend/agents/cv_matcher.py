import json
import sqlite3
from typing import Dict, List

DB_FILE = "job_descriptions.db"

def init_db():
    # Setup database
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
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

def save_jd_to_db(jd_data: dict):
    # Save JD
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO job_descriptions (title, skills, experience)
        VALUES (?, ?, ?)
    ''', (jd_data['title'], json.dumps(jd_data['skills']), jd_data['experience']))
    jd_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return jd_id

def parse_cv(cv_text: str) -> dict:
    # Parse CV
    # TODO: AI parsing
    return {
        "name": "Unknown",  # Placeholder
        "skills": cv_text.split(",")[:2],  # Basic split
        "experience": 0  # Placeholder
    }

def calculate_match_score(jd_data: Dict, cv_data: Dict) -> Dict[str, float]:
    # Match CV to JD
    jd_skills = jd_data.get('skills', [])
    cv_skills = cv_data.get('skills', [])
    skills_score = len(set(jd_skills) & set(cv_skills)) / len(jd_skills) if jd_skills else 0.0
    
    jd_exp = jd_data.get('experience', 0)
    cv_exp = cv_data.get('experience', 0)
    exp_score = min(cv_exp / jd_exp, 1.0) if jd_exp > 0 else 1.0
    
    # TODO: Weight config
    return {
        'overall_match': (0.6 * skills_score + 0.4 * exp_score),
        'skills_match': skills_score,
        'experience_relevance': exp_score
    }

def process_cv(jd_id: int, cv_text: str):
    # Fetch JD
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT title, skills, experience FROM job_descriptions WHERE id = ?", (jd_id,))
    jd_row = cursor.fetchone()
    conn.close()

    if not jd_row:
        return {"error": "JD not found"}

    jd_data = {
        "title": jd_row[0],
        "skills": json.loads(jd_row[1]),
        "experience": jd_row[2]
    }

    # Process CV
    cv_data = parse_cv(cv_text)
    scores = calculate_match_score(jd_data, cv_data)

    # Save CV
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO cvs (jd_id, name, skills, experience, match_score)
        VALUES (?, ?, ?, ?, ?)
    ''', (jd_id, cv_data['name'], json.dumps(cv_data['skills']), cv_data['experience'], scores['overall_match']))
    conn.commit()
    conn.close()

    return {
        "name": cv_data['name'],
        "match_score": scores['overall_match']
    }

# TODO: Add AI parsing
# TODO: Enhance matching
init_db()