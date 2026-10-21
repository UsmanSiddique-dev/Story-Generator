import uvicorn
from fastapi import FastAPI
# from fastapi.middlewares.cors import CORSMiddleware
from fastapi.middleware.cors import  CORSMiddleware
# from sqlalchemy.orm import DeclarativeBase;
from core.config import settings;
from routers import story,job
from db.database import create_tables


create_tables()


app = FastAPI(
    title="Choose Your own Adventure Game API",
    description="api to generate cool stories",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Routes
app.include_router(story.router,prefix=settings.API_PREFIX)
app.include_router(job.router,prefix=settings.API_PREFIX)


if __name__== "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


@app.get("/")
def read_root():
    return {"Hello": "World"}