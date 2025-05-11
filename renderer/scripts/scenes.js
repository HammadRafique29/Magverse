import { generateScenes } from './api.js';

export async function generate_scenes(prompt, duration) {
    const res = await generateScenes(prompt, duration);
    console.log("Getting scenes: ", res)
}

window.addEventListener('DOMContentLoaded', () => {
});