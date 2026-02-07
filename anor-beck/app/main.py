import os
import shutil
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from app import routers
from app.routers import auth, products, categories, images, avatars

app = FastAPI(title="Anor", description="Anor dehqonchilik va chorvachilikka"\
                "asoslangan e-Commerce loyihasi", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("static"):
    os.makedirs("static")

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(avatars.router, prefix="/api/avatars", tags=["avatars"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(images.router, prefix="/api/images", tags=["images"])

