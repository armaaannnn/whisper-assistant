// pages/api/transcribe.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { OpenAI } from "openai";

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set this in your .env.local
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err || !files.audio) {
      return res.status(400).json({ error: "Audio file not found." });
    }

    const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio;

    const fileStream = fs.createReadStream(audioFile.filepath);

    try {
      const response = await openai.audio.transcriptions.create({
        file: fileStream,
        model: "whisper-1",
      });

      return res.status(200).json({ transcript: response.text });
    } catch (error) {
      console.error("❌ Transcription error:", error);
      return res.status(500).json({ error: "Transcription failed." });
    }
  });
}
