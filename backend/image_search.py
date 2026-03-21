import torch
import faiss
import json
import numpy as np
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

# Load CLIP model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Load FAISS index
index = faiss.read_index("../index/faiss.index")

# Load image paths (IMPORTANT FIX)
with open("../index/image_paths.json", "r") as f:
    image_paths = json.load(f)

def encode_image(image_path):

    image = Image.open(image_path).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        image_features = model.get_image_features(**inputs)

    image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)

    return image_features.cpu().numpy()

def search_image(image_path, k=5):

    query_vector = encode_image(image_path)

    distances, indices = index.search(query_vector, k)

    results = []

    for idx in indices[0]:
        results.append("../dataset/" + image_paths[idx])

    return results

#this is a local test that i am doing to check if it works or not
if __name__ == "__main__":

    query_image = "test.jpg"

    results = search_image(query_image, k=5)

    print("\nTop Results:\n")

    for r in results:
        print(r)