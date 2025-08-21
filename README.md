# AI Prompt Rater

A web app to rate your prompt and suggest a well-structured version using AI (OpenAI GPT-4).

---

## Features

- Submit any prompt
- Get AI rating (score out of 10) with feedback
- Receive a well-structured improved prompt

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
# Add your OpenAI API key to .env
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
node index.js
```
Backend will run on [http://localhost:5000](http://localhost:5000)

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```
Frontend will run on [http://localhost:3000](http://localhost:3000)

---

## Usage

1. Visit [http://localhost:3000](http://localhost:3000)
2. Enter a prompt and click "Rate Prompt"
3. View your score, feedback, and improved prompt!

---

## Deployment

- **Frontend:** Vercel, Netlify, etc.
- **Backend:** Render, Heroku, etc.

---

## License

MIT