import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  useEffect(() => {
    const loadModels = async () => {
      try {
        await fetch("/whisper/whisper.wasm");
        console.log("✅ whisper.wasm fetched");

        await fetch("/tts/tts-model.bin");
        console.log("✅ tts-model.bin fetched");
      } catch (error) {
        console.error("❌ Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  // 🎙️ Recorder function
  const recordAudio = async (duration = 5000): Promise<Blob> => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    return new Promise((resolve) => {
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        resolve(audioBlob);
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, duration);
    });
  };

  // 🔁 Whisper Web Worker + GPT + TTS Worker integration with fallback TTS
  const handleRecord = async () => {
    const audioBlob = await recordAudio(5000);
    console.log("🎤 Audio blob recorded:", audioBlob);

    const whisperWorker = new Worker("/whisper-worker.js");

    whisperWorker.onmessage = async (event) => {
      const { transcript } = event.data;
      console.log("📝 Transcript:", transcript);

      try {
        const resGPT = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: transcript }),
        });

        const gptData = await resGPT.json();

        if (resGPT.ok) {
          const reply = gptData.reply;
          console.log("🤖 GPT Reply:", reply);

          // 🔊 Fallback TTS with speechSynthesis
          const utterance = new SpeechSynthesisUtterance(reply);
          utterance.lang = "en-US";
          utterance.pitch = 1;
          utterance.rate = 1;
          speechSynthesis.speak(utterance);
        } else {
          console.error("❌ GPT failed:", gptData.error);
          alert("GPT failed to respond.");
        }
      } catch (err) {
        console.error("❌ Network error:", err);
        alert("Network error while contacting GPT.");
      }
    };

    whisperWorker.postMessage({ audioBlob });
  };

  return (
    <>
      <Head>
        <title>Voice Assistant App</title>
        <meta name="description" content="Voice assistant using Whisper + GPT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />

      </Head>
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        <main className={styles.main}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol>
            <li>Speak a command using <code>🎙️ Record & Transcribe</code>.</li>
            <li>Wait for transcription and GPT response.</li>
          </ol>

          <div style={{ marginTop: "2rem" }}>
            <button
              onClick={handleRecord}
              style={{
                padding: "12px 24px",
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🎙️ Record & Transcribe
            </button>
          </div>

          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image className={styles.logo} src="/vercel.svg" alt="Vercel" width={20} height={20} />
              Deploy now
            </a>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              Read our docs
            </a>
          </div>
        </main>
        <footer className={styles.footer}>
          <a href="https://nextjs.org/learn" target="_blank" rel="noopener noreferrer">
            <Image aria-hidden src="/file.svg" alt="File" width={16} height={16} /> Learn
          </a>
          <a
            href="https://vercel.com/templates?framework=next.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/window.svg" alt="Window" width={16} height={16} /> Examples
          </a>
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/globe.svg" alt="Globe" width={16} height={16} /> Go to nextjs.org →
          </a>
        </footer>
      </div>
    </>
  );
}
