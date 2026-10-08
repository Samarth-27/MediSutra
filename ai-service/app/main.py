"""
MediSutra AI Intelligence Service
FastAPI service providing OCR, medical document parsing, hybrid RAG retrieval,
claim extraction, evidence validation, and safety guardrails.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime

app = FastAPI(
    title="MediSutra Healthcare AI Service",
    version="1.0.0",
    description="Longitudinal Personal Health Intelligence AI & Evidence Reasoning Service"
)

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "MediSutra AI Engine",
        "version": "1.0.0",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.get("/api/v1/ai/models")
def get_supported_models():
    return {
        "models": [
            {"id": "qwen2.5-7b-instruct", "name": "Qwen 2.5 7B Instruct (Multilingual & Medical)", "status": "active"},
            {"id": "llama-3.1-8b-instruct", "name": "Meta Llama 3.1 8B Instruct", "status": "available"},
            {"id": "medisutra-lora-v1", "name": "MediSutra Fine-tuned LoRA Clinical Adapter", "status": "experimental"}
        ]
    }
