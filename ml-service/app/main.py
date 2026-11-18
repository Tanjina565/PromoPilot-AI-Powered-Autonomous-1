from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Microservice for predicting best posting times and social media engagement levels using Random Forest Classifier.",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to PromoPilot Machine Learning Prediction Microservice",
        "health": "/health",
        "docs": "/docs",
    }

# Include API Router
app.include_router(api_router)
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
