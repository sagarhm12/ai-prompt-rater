import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat"; // or use "deepseek-coder" or other DeepSeek models if needed

app.post("/api/rate", async (req, res) => {
  const { prompt } = req.body;
  console.log("Received prompt:", prompt);

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required." });
    return;
  }

  // System prompt for the assistant
  const systemPrompt = `You are a prompt expert. Given a user's prompt, rate it from 1 to 10, explain the reasoning, and rewrite it to be more clear, specific, and effective. Respond in JSON with keys: score, feedback, improved.`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log("Raw DeepSeek API response:", data);

    const text = data.choices?.[0]?.message?.content || "";
    let parsed = { score: "", feedback: "", improved: "" };
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.log("Failed to parse DeepSeek response as JSON:", text);
    }
    res.json(parsed);
  } catch (e) {
    console.error("API error:", e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));