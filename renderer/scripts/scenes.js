import { generateScenes, refreshScene, updateScene } from './api.js';

export async function generate_scenes(prompt, duration) {
    const res = await generateScenes(prompt, duration);
    console.log("Getting scenes: ", res);
    return res;
}

export async function refresh_scene(story_id, scene_id) {
    const res = await refreshScene(story_id, scene_id);
    console.log("Refreshing scenes: ", res);
    return res;
}


export async function update_scene(story_id, scene_id, new_scene) {
    const res = await updateScene(story_id, scene_id, new_scene);
    console.log("Updating scene: ", res);
    return res;
}