const { execSync } = require('child_process');
const { error } = require('console');
const fs = require('fs');
const path = require('path');

const image = 'ghcr.io/coqui-ai/tts';
const outputAudio = path.resolve(__dirname, 'output.wav');
const default_container_name = "ai-video-generator-tts";


async function pythontranscribeScene(text, speakerAudioPath) {
  const controller = new AbortController();
  const timeoutMs = 530000; // 530 seconds
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("http://localhost:8098/transcribe-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        speaker: speakerAudioPath,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Server returned error: ${res.status} - ${res.statusText}`);
    const responseData = await res.json();
    if (responseData.status !== "success") throw new Error(`Error from API: ${responseData.error}`);
    return responseData.data.audio;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('Request timed out');
      throw new Error('Transcription request timed out');
    }
    console.error("Fetch Error:", error.message);
    throw error;
  }
}



async function sendVideoRequest(content) {
    const res = await fetch("http://localhost:8098/generate-video", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            story_data: content["draft_story"],
            rendered_images: content["render_images"],
            transcribed_audios: content["transcribed_audios"],
            video_resolution: content["video_res"],
            video_fps: 30
        }),
    });
    const responseData = await res.json();
    if (responseData.status != "success" ) {
        throw new Error(responseData.error);
    }
    console.log("API Response:", responseData);
    return responseData;
}



module.exports = { pythontranscribeScene, sendVideoRequest };