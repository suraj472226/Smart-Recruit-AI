
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import docx
from agents.jd_summarizer import summarize_job_description


app = FastAPI()


# Root endpoint to confirm the API is running
@app.get("/")
@app.head("/")
async def root():
    return {"message": "API is running"}

