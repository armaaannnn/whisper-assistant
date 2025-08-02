// public/whisper-worker.js

self.onmessage = async (event) => {
    const { audioBlob } = event.data;
  
    // TODO: Replace with actual Whisper transcription logic
    const mockTranscript = "This is a placeholder transcript.";
    console.log("📩 Audio received in worker");
  
    self.postMessage({ transcript: mockTranscript });
  };
  