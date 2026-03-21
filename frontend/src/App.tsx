import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ImageUpload from "./components/ImageUpload";
import VoiceSearch from "./components/VoiceSearch";
import ResultsGrid from "./components/ResultsGrid";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";

import {
  searchByText,
  searchByImage,
  searchByVoice,
} from "./services/api";

function App() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transcription, setTranscription] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // 🔍 TEXT SEARCH
  const handleTextSearch = async (query: string) => {
    try {
      setLoading(true);
      setError("");
      setLastQuery(query);
      setUploadedPreview(null);
      setTranscription("");

      const data = await searchByText(query);
      setResults(data.results);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // 🖼 IMAGE SEARCH
  const handleImageSearch = async (file: File) => {
    try {
      setLoading(true);
      setError("");

      const previewUrl = URL.createObjectURL(file);
      setUploadedPreview(previewUrl);
      setLastQuery("");
      setTranscription("");

      const data = await searchByImage(file);
      setResults(data.results);
    } catch {
      setError("Image search failed.");
    } finally {
      setLoading(false);
    }
  };

  // 🎤 VOICE SEARCH
const handleVoiceSearch = async (audio: Blob) => {
  try {
    setLoading(true);
    setError("");

    const data = await searchByVoice(audio);

    console.log("FINAL DATA:", data);

    // ✅ FORCE SAFE UPDATE
    setResults([...data.results]);

    setTranscription(data.transcription || "No speech detected");

    setLastQuery("");
    setUploadedPreview(null);

  } catch (err) {
    console.error(err);
    setError("Voice search failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white px-4 md:px-10 lg:px-20 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Header />

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6">
          <SearchBar onSearch={handleTextSearch} loading={loading} />
          <ImageUpload onUpload={handleImageSearch} />
          <VoiceSearch onVoiceSearch={handleVoiceSearch} />
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {lastQuery && (
            <p className="text-center text-gray-300">
              You searched: <strong className="text-white">{lastQuery}</strong>
            </p>
          )}

          {uploadedPreview && (
            <div className="flex justify-center">
              <img
                src={uploadedPreview}
                className="w-40 h-40 object-cover rounded-xl border border-white/20 shadow-md"
                alt="Uploaded preview"
              />
            </div>
          )}

          {transcription && (
            <p className="text-center text-gray-300">
              You said: <strong className="text-white">{transcription}</strong>
            </p>
          )}

          {error && <ErrorMessage message={error} />}

          {loading ? <Loader /> : <ResultsGrid results={results} onSelectImage={(img) => setSelectedImage(img)} />}

          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={`http://127.0.0.1:8000/${selectedImage.replace("dataset/", "")}`}
                  alt="Selected"
                  className="w-full h-full max-h-[90vh] object-contain bg-black"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white border border-white/30 hover:bg-white/10 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;