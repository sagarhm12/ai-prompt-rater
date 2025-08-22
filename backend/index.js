import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

app.post("/api/rate", async (req, res) => {
  const { prompt } = req.body;
  console.log("Received prompt:", prompt);

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required." });
    return;
  }

  const systemPrompt =
    "You are a prompt expert. Given a user's prompt, rate it from 1 to 10, explain the reasoning, and rewrite it to be more clear, specific, and effective. Respond in JSON with keys: score, feedback, improved.";

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "user", parts: [{ text: `Prompt: "${prompt}"` }] }
        ]
      })
    });

    const data = await response.json();
    console.log("Raw AI API response:", data);

    // --- Gemini response parsing with code block removal ---
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    // Remove code block marks if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    console.log("Cleaned AI response text:", text);

    let parsed = { score: "", feedback: "", improved: "" };
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.log("Failed to parse AI response as JSON:", text);
    }
    res.json(parsed);
  } catch (e) {
    console.error("API error:", e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
