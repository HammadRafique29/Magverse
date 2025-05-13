const axios = require('axios');
const { spawn } = require('child_process');

const OLLAMA_URL = 'http://localhost:11434';
const BEST_MODELS_PRIORITY = ["llama3", "gemma", "mistral", "llama2", "phi", "codellama", "qwen"];
let CONTEXT = `CONTEXT HERE`;


// Check Ollama Server running Locally
async function isOllamaRunning() {
    try {
        await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 2000 });
        return true;
    } catch (error) {
        return false;
    }
}


// Start Ollama Server Locally
async function startOllama() {
    console.log("Starting Ollama server...");
    spawn('ollama', ['serve'], { stdio: 'ignore', detached: true });

    for (let i = 0; i < 20; i++) {
        if (await isOllamaRunning()) {
            console.log("Ollama is now running.");
            return true;
        }
        await new Promise(res => setTimeout(res, 1000));
    }

    throw new Error("Ollama server failed to start.");
}


// List all avaiable ollama models
async function getLocalModels() {
    try {
        const response = await axios.get(`${OLLAMA_URL}/api/tags`);
        const models = response.data.models || [];
        return models.map(model => model.name);
    } catch (error) {
        console.error("Failed to get models:", error.message);
        return [];
    }
}

// Select Best Language Model
function selectBestModel(localModels) {
    for (const preferred of BEST_MODELS_PRIORITY) {
        for (const model of localModels) {
            if (model.includes(preferred)) {
                console.log("Selected model:", model);
                return model;
            }
        }
    }
    throw new Error("No suitable model found in local Ollama models.");
}

async function sendChatPrompt(model, prompt, context = null) {
    try {
        const payload = {
            model: model,
            messages: [
                // Optionally add a system message for context
                ...(context ? [{ role: "system", content: context }] : []),
                { role: "user", content: prompt }
            ],
            stream: false
        };

        console.log("Payload:", payload);

        const response = await axios.post(`${OLLAMA_URL}/api/chat`, payload);
        console.log("Response:", response.data);

        // Return the assistant's reply
        return response.data.message?.content || "";

    } catch (error) {
        console.error("Error in sendChatPrompt:", error.message);
        if (error.response) {
            console.error("Details:", error.response.data);
        }
        throw error;
    }
}


const temp_scenes = `
        Ollama Morning mist curled around the roots of ancient trees as a young girl named Elara wandered deeper into the heart of the forest, drawn by a melody only she could hear. (a young girl walking through a misty magical forest with ancient trees and soft morning light)
      
        Ollama A fox with silver fur and wise eyes appeared before her, motioning with its head as if to say, “Follow me.” (a silver-furred fox with glowing eyes standing on a forest path, early sunlight streaming through the trees)
      
        Ollama They reached a clearing where flowers glowed in soft blues and purples, swaying gently despite the still air. (a mystical forest clearing filled with glowing blue and purple flowers under a soft twilight sky)
      
        Ollama At the center stood a hollow tree with a spiral staircase leading deep underground, its bark carved with glowing runes. (an ancient hollow tree with glowing runes and a spiral staircase descending inside)
      
        Ollama Elara hesitated, then stepped into the tree, her heart pounding as the air shimmered around her. (a girl entering a glowing tree with a magical aura, the inside illuminated by mysterious light)`;


async function generate_scenes() {
    try {
        CONTEXT = `
You are a story scene generator AI.
Your task is to create a story based on a given idea and video duration (e.g., 30 minutes).
Based on the length, divide the story into short, vivid, and descriptive scenes (around 30-35 for 30 minutes).

Each output block must include:
- A short, immersive story scene (suitable for subtitles and TTS voice over)
- A corresponding image prompt that visually represents the scene, placed in brackets next to scene.
- Separate each scene block with two newlines — no numbering, no extra titles, and no comments.
- Do not add intros, summaries, or explanations.
- The story scene should feel natural and flowing, while the image prompt should be descriptive for an AI image model but not break the storytelling tone.

Example format:

She stepped into the glowing forest, where every tree shimmered with tiny orbs of light drifting through the air. (a glowing fantasy forest filled with floating light orbs and magical trees)
 
A shadowy figure watched from the edge of a stone bridge, its eyes glowing faintly under the moonlight.  (a shadowy hooded figure standing on an old stone bridge under the moon)`

        if (!await isOllamaRunning()) {
            await startOllama();
        }

        const localModels = await getLocalModels();
        const bestModel = await selectBestModel(localModels);
        console.log("Best Model:", bestModel);

        const res = await sendChatPrompt("tinyllama:latest", "Tell me a joke.", CONTEXT);
        console.log("Ollama Language Model Response: ", res);
        return temp_scenes;
        
    } catch (err) {
        console.error("Error:", err.message);
        return temp_scenes
    }
}



module.exports = { generate_scenes };


// SAMPLE:

// (async () => {
//     try {
//         CONTEXT = `
// You are a story scene generator AI.
// Your task is to create a story based on a given idea and video duration (e.g., 30 minutes).
// Based on the length, divide the story into short, vivid, and descriptive scenes (around 30-35 for 30 minutes).

// Each output block must include:
// - A short, immersive story scene (suitable for subtitles and TTS voice over)
// - A corresponding image prompt that visually represents the scene, placed in brackets next to scene.
// - Separate each scene block with two newlines — no numbering, no extra titles, and no comments.
// - Do not add intros, summaries, or explanations.
// - The story scene should feel natural and flowing, while the image prompt should be descriptive for an AI image model but not break the storytelling tone.

// Example format:

// She stepped into the glowing forest, where every tree shimmered with tiny orbs of light drifting through the air. (a glowing fantasy forest filled with floating light orbs and magical trees)
 
// A shadowy figure watched from the edge of a stone bridge, its eyes glowing faintly under the moonlight.  (a shadowy hooded figure standing on an old stone bridge under the moon)`

//         if (!await isOllamaRunning()) {
//             await startOllama();
//         }

//         await sendChatPrompt(null, "Tell me a joke.", CONTEXT);
//     } catch (err) {
//         console.error("Error:", err.message);
//     }
// })();
