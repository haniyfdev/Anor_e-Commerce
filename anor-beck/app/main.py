import os
import shutil
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from app.routers import auth, products, categories, images, avatars

app = FastAPI(title="Anor", description="Anor dehqonchilik va chorvachilikka"\
                "asoslangan e-Commerce loyihasi", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("static"):
    os.makedirs("static")

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(avatars.router, prefix="/api", tags=["avatars"])
app.include_router(categories.router, prefix="/api", tags=["categories"])
app.include_router(products.router, prefix="/api", tags=["products"])
app.include_router(images.router, prefix="/api", tags=["images"])

# ------------------------------------------------------------------
