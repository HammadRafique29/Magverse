import { generateScenes, refreshScene, updateScene, getStory, refreshImagePrompt, updateImagePrompt } from './api.js';

export async function generate_scenes(prompt, duration) {
    const res = await generateScenes(prompt, duration);
    return res;
}

export async function refresh_scene(story_id, scene_id) {
    const res = await refreshScene(story_id, scene_id);
    return res;
}

export async function refresh_image_prompt(story_id, scene_id) {
    const res = await refreshImagePrompt(story_id, scene_id);
    return res;
}

export async function update_scene(story_id, scene_id, new_scene) {
    const res = await updateScene(story_id, scene_id, new_scene);
    return res;
}

export async function update_image_prompt(story_id, scene_id) {
    const res = await updateImagePrompt(story_id, scene_id);
    return res;
}

export async function get_story(story_id) {
    const res = await getStory(story_id);
    return res;
}