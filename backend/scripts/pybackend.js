const { execSync } = require('child_process');
const { error } = require('console');
const fs = require('fs');
const path = require('path');
const { getUserDocuments } = require("platform-folders");

const image = 'ghcr.io/coqui-ai/tts';
const outputAudio = path.resolve(__dirname, 'output.wav');
const default_container_name = "ai-video-generator-tts";

const PY_SERVER_URL = "http://localhost:8098"

async function py_generate_scenes(story_idea, duration) {
  const res = await fetch(`${PY_SERVER_URL}/generate-scenes`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        story_idea: story_idea,
        duration: duration
      }),
  });
  const responseData = await res.json();
  if (!res.ok) throw new Error(`Server returned error: ${res.status} - ${res.statusText} - ${responseData['error']}`);
  if (responseData.status != "success" ) throw new Error(responseData.error);
  console.log("API Response:", responseData);
  return responseData.data.story_data;
}


async function py_refresh_scene(story_scenes, refresh_scene) {
  const res = await fetch(`${PY_SERVER_URL}/refresh-scene`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        story_scenes: story_scenes,
        refresh_scene: refresh_scene
      }),
  });
  if (!res.ok) throw new Error(`Server returned error: ${res.status} - ${res.statusText} - ${res.json()['error']}`);
  const responseData = await res.json();
  if (responseData.status != "success" ) throw new Error(responseData.error);
  console.log("API Response:", responseData);
  return responseData.data.scene;
}

async function py_refresh_imagePrompt(prompt_scene, img_prompt) {
  const res = await fetch(`${PY_SERVER_URL}/refresh-prompt`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt_scene: prompt_scene,
        img_prompt: img_prompt
      }),
  });
  if (!res.ok) throw new Error(`Server returned error: ${res.status} - ${res.statusText} - ${res.json()['error']}`);
  const responseData = await res.json();
  if (responseData.status != "success" ) throw new Error(responseData.error);
  console.log("API Response:", responseData);
  return responseData.data.scene;
}


async function py_update_scene(image_prompt, update_scene) {
  const res = await fetch(`${PY_SERVER_URL}/update-scene`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_prompt: image_prompt,
        update_scene: update_scene
      }),
  });
  if (!res.ok) throw new Error(`Server returned error: ${res.status} - ${res.statusText} - ${res.json()['error']}`);
  const responseData = await res.json();
  if (responseData.status != "success" ) throw new Error(responseData.error);
  console.log("API Response:", responseData);
  return responseData.data.scene;
}


// async function pythontranscribeScene(text, speakerAudioFile) {
//   const controller = new AbortController();
//   const timeoutMs = 530000;
//   const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

//   try {
//     const formData = new FormData();
//     formData.append("text", text);
//     formData.append("speaker", speakerAudioFile);

//     const res = await fetch(`${PY_SERVER_URL}/transcribe-text`, {
//       method: "POST",
//       body: formData,
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);
//     if (!res.ok) {
//       const errText = await res.text();
//       throw new Error(`Server returned error: ${res.status} - ${res.statusText} - ${errText}`);
//     }

//     const buffer = await res.arrayBuffer();
//     const uniqueName = `output_audio_${Date.now()}_${Math.floor(Math.random() * 10000)}.wav`;

//     const userDocs = getUserDocuments();
//     const targetDir = path.join(userDocs, "story_teller");
//     if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

//     const fullPath = path.join(targetDir, uniqueName);
//     fs.writeFileSync(fullPath, Buffer.from(buffer));
//     return fullPath;

//   } catch (error) {
//     clearTimeout(timeoutId);
//     if (error.name === 'AbortError') {
//       console.error('Request timed out');
//       throw new Error('Transcription request timed out');
//     }
//     console.error("Fetch Error:", error.message);
//     throw error;
//   }
// }


async function pythontranscribeScene(text, speakerAudioPath) {
  const controller = new AbortController();
  const timeoutMs = 530000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${PY_SERVER_URL}/transcribe-text`, {
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
    const responseData = await res.json();
    if (!res.ok) throw new Error(`Server returned error: ${res.status} - ${res.statusText} - ${responseData['error']}`);
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
    const res = await fetch(`${PY_SERVER_URL}/generate-video`, {
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
    if (!res.ok) throw new Error(`Server returned error: ${res.status} - ${res.statusText} - ${res.json()['error']}`);
    const responseData = await res.json();
    if (responseData.status != "success" ) throw new Error(responseData.error);
    console.log("API Response:", responseData);
    return responseData;
}


async function py_generate_image(image_prompt, img_width, img_height, regenerate=false) {
  const res = await fetch(`${PY_SERVER_URL}/generate-image`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_prompt: image_prompt,
        img_width: img_width,
        img_height: img_height,
        regenerate: regenerate
      }),
  });
  if (!res.ok) throw new Error(`Server returned error: ${res.status} - ${res.statusText} - ${res.json()['error']}`);
  const responseData = await res.json();
  if (responseData.status != "success" ) throw new Error(responseData.error);
  console.log("API Response:", responseData.data.img);
  return responseData.data.img;
}


module.exports = { pythontranscribeScene, sendVideoRequest, py_generate_scenes, py_update_scene, py_refresh_scene, py_generate_image, py_refresh_imagePrompt };