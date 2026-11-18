import os

class Settings:
    PROJECT_NAME: str = "PromoPilot ML Prediction Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    HOST: str = os.getenv("ML_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("ML_PORT", "8000"))
    MODEL_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
    MODEL_PATH: str = os.path.join(MODEL_DIR, "engagement_rf_model.joblib")
    DATA_PATH: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "social_posts_dataset.csv")

settings = Settings()
