
export async function generateScenes(prompt, duration) {
  return await window.api.call('model:generateScenes', { prompt, duration });
}

export async function refreshScene(story_id, scene_id) {
  return await window.api.call('model:refreshScene', { story_id, scene_id });
}

export async function updateScene(story_id, scene_id, new_scene) {
  return await window.api.call('model:updateScene', { story_id, scene_id, new_scene });
}

export async function getStory(story_id) {
  return await window.api.call('model:getStory', { story_id });
}

export async function transcribeScene(story_id, scene_id, speaker_path) {
  return await window.api.call('model:transcribeScene', { story_id, scene_id, speaker_path });
}

export async function generateImage(story_id, scene_id) {
  return await window.api.call('model:generateImage', { story_id, scene_id });
}

export async function regenerateImage(story_id, scene_id) {
  return await window.api.call('model:regenerateImage', { story_id, scene_id });
}
