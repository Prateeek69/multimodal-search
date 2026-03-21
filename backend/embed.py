import json
import torch
import numpy as np
from PIL import Image
from tqdm import tqdm
from transformers import CLIPProcessor, CLIPModel

# paths
DATASET_PATH = "../dataset/dataset.json"
IMAGE_FOLDER = "../dataset/"
OUTPUT_EMBEDDINGS = "../index/embeddings.npy"
OUTPUT_PATHS = "../index/image_paths.json"

# load dataset
with open(DATASET_PATH) as f:
    dataset = json.load(f)

device = "cuda" if torch.cuda.is_available() else "cpu"

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

embeddings = []
image_paths = []

print("Generating embeddings...")

seen = set()

for item in tqdm(dataset):

    path = item["image"]

    # avoid duplicate images (COCO has multiple captions)
    if path in seen:
        continue

    seen.add(path)

    image_path = IMAGE_FOLDER + path
    image = Image.open(image_path).convert("RGB")

    inputs = processor(images=image, return_tensors="pt").to(device)

    with torch.no_grad():
        image_features = model.get_image_features(**inputs)

    embedding = image_features.cpu().numpy()[0]

    embeddings.append(embedding)
    image_paths.append(path)

embeddings = np.array(embeddings)

np.save(OUTPUT_EMBEDDINGS, embeddings)

with open(OUTPUT_PATHS, "w") as f:
    json.dump(image_paths, f)

print("Embeddings saved")
print("Total embeddings:", len(embeddings))