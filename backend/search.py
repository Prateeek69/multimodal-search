import json
import faiss
import torch
import numpy as np
from transformers import CLIPProcessor, CLIPModel

# paths
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_PATH = os.path.join(BASE_DIR, "../index/faiss.index")
PATHS_PATH = os.path.join(BASE_DIR, "../index/image_paths.json")
# load FAISS index
index = faiss.read_index(INDEX_PATH)

# load image paths
with open(PATHS_PATH) as f:
    image_paths = json.load(f)

# load CLIP
device = "cuda" if torch.cuda.is_available() else "cpu"

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def search(query, k=5):

    inputs = processor(
        text=[query],
        return_tensors="pt",
        padding=True
    ).to(device)

    with torch.no_grad():
            text_features = model.get_text_features(**inputs)

    query_embedding = text_features.cpu().numpy()

    faiss.normalize_L2(query_embedding)

    D, I = index.search(query_embedding, k)

    results = []

    seen = set()

    for idx in I[0]:
        path = image_paths[idx]
        if path not in seen:
            results.append(path)
            seen.add(path)

    return results


if __name__ == "__main__":

    while True:
        query = input("\nEnter search query: ")

        results = search(query)

        print("\nTop results:")

        for r in results:
            print(r)