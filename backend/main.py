from fastapi import FastAPI, UploadFile, File
from search import search
from image_search import search_image
from whisper_model import model
import shutil
import uuid
import os

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve images
app.mount("/images", StaticFiles(directory="../dataset/images"), name="images")


@app.get("/")
def home():
    return {"message": "Multimodal CLIP AI Search API running"}


# =========================
# TEXT SEARCH
# =========================
@app.post("/search/text")
def text_search(query: str):

    results = search(query)

    return {
        "query": query,
        "results": results
    }


# =========================
# IMAGE SEARCH (FIXED)
# =========================
@app.post("/search/image")
async def image_search_endpoint(file: UploadFile = File(...)):

    file_ext = file.filename.split(".")[-1]
    file_path = f"temp_{uuid.uuid4()}.{file_ext}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = search_image(file_path)

    # ✅ cleanup
    os.remove(file_path)

    return {
        "results": results
    }


# =========================
# VOICE SEARCH (FIXED)
# =========================
@app.post("/search/voice")
async def voice_search(file: UploadFile = File(...)):

    file_ext = file.filename.split(".")[-1]
    file_path = f"temp_{uuid.uuid4()}.{file_ext}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = model.transcribe(file_path)
    query = result["text"]

    results = search(query)

    # ✅ cleanup
    os.remove(file_path)

    return {
        "transcription": query,
        "results": results
    }