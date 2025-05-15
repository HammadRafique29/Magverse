import { transcribeScene } from './api.js';

export async function transcribe_scene(story_id, scene_id, speaker_path) {
    const res = await transcribeScene(story_id, scene_id, speaker_path);
    return res;
}