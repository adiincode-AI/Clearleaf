from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.pdf import router as pdf_router
from app.routes.ask import router as ask_router
from app.routes.timers import router as timer_router


app = FastAPI(
    title="ClearLeaf AI Backend",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router)
app.include_router(pdf_router)
app.include_router(ask_router)
app.include_router(timer_router)


@app.get("/")
def root():
    return {
        "message": "ClearLeaf AI Backend Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }