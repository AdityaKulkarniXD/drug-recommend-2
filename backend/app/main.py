import app.config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import prediction,interaction

app = FastAPI(title="Drug Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(prediction.router, prefix="/api")
app.include_router(interaction.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the Drug Recommendation API"}



