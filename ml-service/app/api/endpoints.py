from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from app.services.ml_engine import ml_engine

router = APIRouter()

class PostPredictionRequest(BaseModel):
    platform: str = Field(default="Instagram")
    category: str = Field(default="Fashion")
    day_of_week: str = Field(default="Wednesday")
    hour_of_day: int = Field(default=18, ge=0, le=23)
    caption_length: int = Field(default=120, ge=1)
    hashtag_count: int = Field(default=5, ge=0)
    has_cta: int = Field(default=1, ge=0, le=1)
    media_type: str = Field(default="Image")

@router.get("/health", tags=["Health"])
async def health_check():
    return {
        "service": "PromoPilot ML Service (FastAPI)",
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "model_engine": "Scikit-Learn Random Forest",
        "version": "1.0.0",
        "model_loaded": ml_engine.model is not None,
        "assignedMember": "Member 2 (M2-FR4 ML Prediction)",
    }

@router.post("/predict", tags=["ML Prediction"])
async def predict_posting(data: PostPredictionRequest):
    try:
        result = ml_engine.predict(data.dict())
        return {
            "success": True,
            "data": result,
            "message": "Prediction generated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model/metrics", tags=["Model Evaluation"])
async def get_metrics():
    try:
        return {
            "success": True,
            "data": ml_engine.metrics,
            "message": "Evaluation metrics retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/model/train", tags=["Model Training"])
async def train_model():
    try:
        metrics = ml_engine.train_and_save()
        return {
            "success": True,
            "data": metrics,
            "message": "Random Forest model retrained and saved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
