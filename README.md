# PromoPilot – AI-Powered Autonomous E-commerce Product Marketing Automation

**PromoPilot** is an end-to-end full-stack SaaS platform designed for autonomous e-commerce product marketing, content generation, engagement timing prediction, and continuous campaign optimization.

## System Architecture

PromoPilot is engineered as a decoupled, multi-tier system:
- **`frontend/`**: Single Page Application built with React.js, Vite, Tailwind CSS, Recharts, and Lucide React.
- **`backend/`**: Node.js & Express.js REST API using strict MVC + Service Layer architecture, MongoDB Atlas with Mongoose, Zod validation, JWT authentication, and Google Gemini integration.
- **`ml-service/`**: Python FastAPI microservice utilizing Scikit-learn, Pandas, and NumPy for best posting time and engagement level classification.

---

## Assigned Capstone Modules (Member 2)
1. **Module 1: M1-FR2** – Business Profile Management (Complete CRUD, connected social pages, target audience, brand tone, preferred language).
2. **Module 2: M2-FR1** – AI Content Generation (Google Gemini API integration, prompt orchestration, tone, goal, multilingual Bangla/English support, draft saving, edit & history).
3. **Module 2: M2-FR4** – ML-based Best Posting Time and Engagement Prediction (FastAPI service, Random Forest Classifier, model evaluation with Precision, Recall, F1, Confusion Matrix, and Admin dashboard metrics).
4. **Module 3: M3-FR3** – AI Performance Recommendations and Content History (Actionable analytics recommendations, multi-criteria filtering, platform-level admin monitoring).
5. **Shared Foundation**: Authentication, Role-based Authorization (Business Owner & Admin), Business ownership isolation, Product foundation schema.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB Atlas cluster or local MongoDB instance

### 2. Environment Configuration
Copy `.env.example` to `backend/.env` and `frontend/.env`:
```bash
cp .env.example backend/.env
cp .env.example frontend/.env
```

### 3. Running Services
- **Backend**:
  ```bash
  cd backend
  npm install
  npm run dev
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- **ML Service**:
  ```bash
  cd ml-service
  uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  ```
