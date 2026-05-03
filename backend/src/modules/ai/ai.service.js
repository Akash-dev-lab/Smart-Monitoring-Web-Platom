import axios from "axios";

const GEMINI_API = process.env.GEMINI_API_KEY;

export const callAI = async (prompt) => {
  try {
    const res = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API   // 🔥 IMPORTANT
        }
      }
    );

    return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  } catch (err) {
    console.error("❌ Gemini Error:", err.response?.data || err.message);
    return null;
  }
};