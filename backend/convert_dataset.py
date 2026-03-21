import json
import os

# paths
ANNOTATION_FILE = "../dataset/annotations/captions_val2017.json"
IMAGE_FOLDER = "../dataset/images"
OUTPUT_FILE = "../dataset/dataset.json"

# load annotations
with open(ANNOTATION_FILE) as f:
    data = json.load(f)

annotations = data["annotations"]

dataset = []

for item in annotations:
    image_id = item["image_id"]
    caption = item["caption"]

    image_name = f"{image_id:012d}.jpg"
    image_path = os.path.join("images", image_name)

    full_image_path = os.path.join(IMAGE_FOLDER, image_name)

    if os.path.exists(full_image_path):
        dataset.append({
            "image": image_path,
            "caption": caption
        })

# save new dataset
with open(OUTPUT_FILE, "w") as f:
    json.dump(dataset, f, indent=2)

print("Dataset created")
print("Total pairs:", len(dataset))