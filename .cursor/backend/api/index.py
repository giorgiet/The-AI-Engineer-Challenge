from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from openai import OpenAI
import os
from pathlib import Path
from dotenv import load_dotenv
import json

# Load .env file from project root (two levels up from api/index.py)
project_root = Path(__file__).parent.parent
env_path = project_root / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Lazy initialization of OpenAI client
_client = None

def get_openai_client():
    """Get or create OpenAI client instance"""
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not configured")
        _client = OpenAI(api_key=api_key)
    return _client

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="The user's message to send to the AI")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with better error messages"""
    errors = exc.errors()
    error_details = []
    for error in errors:
        if error["type"] == "json_invalid":
            error_details.append("Invalid JSON format. Please check your request body.")
        else:
            error_details.append(f"{error['loc']}: {error['msg']}")
    
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": error_details}
    )

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Handle chat requests from the frontend"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured. Please set it in your .env file.")
    
    try:
        client = get_openai_client()
        # Clean the message - remove any control characters that might cause issues
        user_message = request.message.strip()
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a supportive mental coach."},
                {"role": "user", "content": user_message}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")
