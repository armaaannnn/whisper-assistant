# 🎙️ Whisper Voice Assistant App

A full-featured voice assistant built with Next.js, running **mostly offline** using Whisper WASM, TTS, and OpenAI GPT. It records audio, transcribes it locally, sends it to GPT, and reads the response aloud. Fully installable as a PWA.

---

## 🧠 Features

- ✅ Record and stream mic input directly in browser
- ✅ Local transcription using Whisper WASM in a Web Worker
- ✅ Send transcript to OpenAI Chat Completion API
- ✅ Receive and read aloud GPT response using TTS
- ✅ Fallback to browser `speechSynthesis` if TTS model fails
- ✅ Progressive Web App (PWA) with offline model caching
- ✅ Works offline after first load (except GPT API)

---

## ⚙️ Technologies

- Next.js 15 + TypeScript
- OpenAI API (Chat Completion)
- WebAssembly (Whisper.cpp)
- Web Workers
- Coqui TTS model or Web Speech API fallback
- next-pwa

---

## 📦 Installation & Setup

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/whisper-assistant.git
cd whisper-assistant

## Install dependencies

npm install

##Run the Development Server

npm run dev

visit: http://localhost:3000