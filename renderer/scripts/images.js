import { generateImage } from './api.js';

export async function generate_image(story_id, scene_id) {
    const res = await generateImage(story_id, scene_id);
    return res;
}