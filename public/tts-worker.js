// public/tts-worker.js

let modelLoaded = false;

// Simulate loading the TTS model (replace this with real TTS code or library)
function loadModel() {
  modelLoaded = true;
  console.log("✅ TTS model loaded");
}

function synthesizeSpeech(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

onmessage = async function (e) {
  if (!modelLoaded) loadModel();

  const { text } = e.data;
  console.log("🗣️ TTS input received:", text);

  // Use browser's built-in TTS (replace with Coqui model if desired)
  synthesizeSpeech(text);

  postMessage({ status: "done" });
};
