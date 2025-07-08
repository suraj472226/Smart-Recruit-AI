import os
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pdfminer.high_level import extract_text
import docx
from agents.jd_summarizer import summarize_job_description


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.head("/")
async def root():
    return {"message": "API is running"}

@app.post("/process-jd/")
async def process_job_description(file: UploadFile):
    supported_types = ["text/plain", "application/pdf"]
    
    # Check file type
    if file.content_type not in supported_types:
        logger.warning(f"Unsupported file: {file.content_type}")
        raise HTTPException(status_code=400, detail="Only text or PDF allowed")

    # Extract text from file
    try:
        if file.content_type == "text/plain":
            text = (await file.read()).decode("utf-8").strip()
        elif file.content_type == "application/pdf":
            text = "" 
        if not text:
            logger.warning(f"Empty file: {file.filename}")
            raise HTTPException(status_code=400, detail="File is empty")
    except Exception as e:
        logger.error(f"Error reading {file.filename}: {str(e)}")
        raise HTTPException(status_code=400, detail="Failed to read file")

    jd_data = {
        "title": "Sample Job",
        "skills": ["Python"],  
        "experience": 2        
    }
    jd_id = 1  # Placeholder: Simulate database save

    logger.info(f"Processed JD: {jd_data['title']}, ID: {jd_id}")
    return {"jd_data": jd_data, "jd_id": jd_id}

 # @app.post("/process-cvs/{jd_id}")
if __name__ == "__main__":
    import uvicorn
    logger.info("Starting FastAPI application...")
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)