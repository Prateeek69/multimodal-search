import { useRef, useState } from "react";

interface Props {
  onVoiceSearch: (audio: Blob) => void;
}

const VoiceSearch = ({ onVoiceSearch }: Props) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });

      console.log("Blob size:", blob.size);

      if (blob.size < 5000) {
        alert("Speak louder or longer!");
        return;
      }

      onVoiceSearch(blob);
    };

    mediaRecorder.start();

    setRecording(true);

    // ⏱️ increase recording time
    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);

      // stop mic
      stream.getTracks().forEach((track) => track.stop());
    }, 6000); // 🔥 increased from 4s → 6s

  } catch (err) {
    console.error(err);
    alert("Microphone access denied");
  }
};

  return (
    <div className="text-center mt-4">
      <button
        onClick={startRecording}
        className={`px-6 py-3 rounded-full font-semibold text-white ${recording ? "bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.55)]" : "bg-red-500/80 hover:bg-red-500 hover:scale-105 shadow-lg"} transition-all duration-300`}
      >
        {recording ? "● Recording..." : "🎤 Start Voice Search"}
      </button>
      {recording && <p className="text-sm text-gray-300 mt-2">Listening... speak clearly</p>}
    </div>
  );
};

export default VoiceSearch;