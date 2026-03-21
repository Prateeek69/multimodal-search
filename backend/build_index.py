import numpy as np
import faiss

# paths
EMBEDDINGS_PATH = "../index/embeddings.npy"
INDEX_PATH = "../index/faiss.index"

# load embeddings
embeddings = np.load(EMBEDDINGS_PATH)

# normalize embeddings for cosine similarity
faiss.normalize_L2(embeddings)

print("Embeddings shape:", embeddings.shape)

dimension = embeddings.shape[1]

# create FAISS index
index = faiss.IndexFlatIP(dimension)

print("Building index...")

index.add(embeddings)

# save index
faiss.write_index(index, INDEX_PATH)

print("Index built successfully")
print("Total vectors:", index.ntotal)