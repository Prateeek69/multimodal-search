<div align="center">

# 🔍 Multimodal AI Search Engine

### Search images with your words, your camera, or your voice.

*Inspired by Google Lens & Pinterest Visual Search — built from scratch.*

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-CUDA-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org)
[![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-0064A5?style=flat-square)](https://github.com/facebookresearch/faiss)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 📌 What Is This?

A production-style **full-stack AI system** that lets users find images semantically — not by filename or tags, but by *meaning*. Type `"a dog playing in snow"`, or upload a photo, or speak a query — the engine finds visually and semantically relevant results in milliseconds.

Under the hood, it uses **OpenAI's CLIP model** to encode both images and queries into a shared 512-dimensional vector space, and **Facebook's FAISS** to perform blazing-fast nearest-neighbor search across thousands of indexed images.

> **This is how modern visual search engines work at scale.**

---

## ✨ Features

| Modality | Input | How It Works |
|---|---|---|
|  **Text Search** | `"red sports car"` | CLIP text encoder → vector → FAISS search |
|  **Image Search** | Upload any image | CLIP image encoder → vector → FAISS search |
|  **Voice Search** | Speak your query | Whisper STT → text → CLIP → FAISS search |

-  **~5–10 ms** search latency over 25,000+ indexed images
-  **Semantic retrieval** — understands context, not just keywords
-  **GPU-accelerated** embedding generation via PyTorch CUDA
-  **512-dimensional** CLIP embeddings with cosine similarity
-  **Modality-agnostic** — same search pipeline for all input types

---

## 🏗️ System Architecture
```
┌─────────────────────────────────────────────────┐
│              User Input Layer                   │
│        Text  │  Image Upload  │  Voice          │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│           Encoding Layer (CLIP)                 │
│  openai/clip-vit-base-patch32 · 512D vectors    │
│  GPU-accelerated · PyTorch CUDA                 │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│        Vector Search Layer (FAISS)              │
│  IndexFlatIP · Cosine Similarity · Top-K        │
│  Pre-built index from COCO dataset              │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│             API Layer (FastAPI)                 │
│  REST endpoints · Async · Image serving         │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│           Frontend (React + TailwindCSS)        │
│  Drag-and-drop · Live results · Voice input     │
└─────────────────────────────────────────────────┘
```

---

## 🧠 Tech Stack

**Backend**
- `Python 3.10+` · `FastAPI` · `Uvicorn`
- `PyTorch` (CUDA) · `Transformers`
- `CLIP` (`openai/clip-vit-base-patch32`)
- `FAISS` (Facebook AI Similarity Search)
- `Whisper` (OpenAI Speech-to-Text)
- `NumPy` · `Pillow`

**Frontend**
- `React 18` · `TailwindCSS` · `Axios`

**Dataset & Index**
- COCO Dataset (subset, ~25K images)
- Pre-built FAISS index (`faiss.index`)
- Embeddings stored as `.npy` arrays

---

## 📁 Project Structure
```
multimodal-search/
│
├── backend/                        # Backend services (FastAPI + ML models)
│   ├── embed.py                   # CLIP embedding generation
│   ├── build_index.py             # FAISS index construction
│   ├── search.py                  # Text-based similarity search logic
│   ├── image_search.py            # Image-based search logic
│   ├── whisper_model.py           # Whisper model loading & transcription
│   └── main.py                   # FastAPI app & API endpoints
│
├── dataset/                       # Dataset storage
│   ├── images/                   # COCO image subset
│   └── dataset.json              # Image metadata
│
├── index/                         # Search index artifacts
│   └── image_paths.json          # Mapping: index → image paths
│
├── frontend/                      # Frontend application (React + TS + Tailwind)
│   ├── src/
│   │   │
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Header.tsx        # App header / hero section
│   │   │   ├── SearchBar.tsx     # Text search input
│   │   │   ├── ImageUpload.tsx   # Image upload component
│   │   │   ├── VoiceSearch.tsx   # Voice recording UI
│   │   │   ├── ResultsGrid.tsx   # Displays search results
│   │   │   ├── Loader.tsx        # Loading indicator
│   │   │   └── ErrorMessage.tsx  # Error display
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   └── useVoiceRecorder.ts  # Mic access & recording logic
│   │   │
│   │   ├── services/             # API communication layer
│   │   │   └── api.ts            # Axios calls (text, image, voice search)
│   │   │
│   │   ├── types/                # TypeScript types & interfaces
│   │   │   └── index.ts          # Shared types (API responses, props)
│   │   │
│   │   ├── App.tsx               # Main app logic & state management
│   │   ├── main.tsx              # React entry point
│   │   └── index.css             # Global styles (Tailwind CSS)
│   │
│   ├── index.html               # HTML template
│   ├── package.json             # Project dependencies & scripts
│   └── tailwind.config.js       # Tailwind configuration
│
└── README.md                    # Project documentation

```

---

## ⚙️ How It Works

**Offline (Index Building)**
1. COCO images are passed through CLIP's image encoder
2. 512D embeddings are stored in `embeddings.npy`
3. FAISS builds a searchable vector index

**Online (Search)**
1. User submits a query (text / image / voice)
2. Voice is transcribed to text via Whisper (if applicable)
3. Query is encoded into a 512D vector via CLIP
4. FAISS performs cosine similarity search across the index
5. Top-K matching image paths are returned and rendered

---

## 📸 Demo

### Main FrontEnd

<img width="1920" height="1080" alt="Screenshot (279)" src="https://github.com/user-attachments/assets/33b9dbc2-0da6-4b19-a08f-76079994cdb2" />


###  Text → Image Search
> *Query: "Dog playing in a Park"*
<img width="1920" height="1080" alt="Screenshot (280)" src="https://github.com/user-attachments/assets/46269969-3e5c-4330-bc43-7342156cf06a" />


###  Image → Image Search
> *Upload any image — find visually similar results*
<img width="1920" height="1080" alt="Screenshot (282)" src="https://github.com/user-attachments/assets/994f8eef-859a-44c9-a6d9-92ceda85e017" />


###  Voice → Image Search
> *Speak your query — results appear instantly*


---

## ⚡ Performance

| Metric | Value |
|---|---|
| Dataset Size | ~25,000 images (COCO subset) |
| Embedding Dimensions | 512D (CLIP ViT-B/32) |
| Index Build Time | ~10-15 min (GPU) |
| Search Latency | **~5–10 ms** per query |
| Embedding Throughput | ~200 images/sec (GPU) |
| Model | `openai/clip-vit-base-patch32` |

---

## 🚀 Getting Started
```bash
# Clone the repo
git clone https://github.com/Prateeek69/multimodal-search.git
cd multimodal-search

# Install backend dependencies
pip install -r requirements.txt

# Build the FAISS index
python backend/build_index.py

# Start the API server
uvicorn backend.main:app --reload

# Start the frontend
cd frontend && npm install && npm start
```

> ⚠️ GPU recommended for embedding generation. CPU fallback is supported but slower.

---

## 🔮 Future Roadmap

- [ ] Deploy with scalable vector DB (Pinecone / Milvus)
- [ ] Add cross-modal re-ranking for precision improvement
- [ ] Scale to 1M+ images with FAISS IVF indexing
- [ ] Add metadata filters (category, date, source)
- [ ] Containerize with Docker + deploy on AWS/GCP

---

## 💡 Key Concepts Demonstrated

- **Multimodal AI** — unified embedding space for images, text, and audio
- **Vector similarity search** — semantic retrieval over dense representations
- **FAISS internals** — index types, approximate nearest neighbors, cosine similarity
- **Full-stack AI system design** — ML pipeline integrated with REST API and React UI
- **GPU inference optimization** — batched encoding, CUDA acceleration

---

## 👨‍💻 Author

**Prateek Mishra**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/prateeek-mishra/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/Prateeek69)

---

<div align="center">

⭐ **Star this repo if you found it useful** — it helps others discover it!

*Built with curiosity and a lot of GPU hours.*

</div>
