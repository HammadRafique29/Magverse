import { transcribeScene } from './api.js';

export async function transcribe_scene(story_id, scene_id) {
    const res = await transcribeScene(story_id, scene_id);
    return res;
}