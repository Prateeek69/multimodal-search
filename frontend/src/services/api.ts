import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const searchByText = async (query: string) => {
  const res = await axios.post(`${API_BASE}/search/text`, null, {
    params: { query },
  });
  return res.data;
};

export const searchByImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_BASE}/search/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const searchByVoice = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append("file", audioBlob);

  const res = await axios.post(
    `${API_BASE}/search/voice`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  console.log("RAW API RESPONSE:", res); // ✅ ADD THIS

  return res.data;
};