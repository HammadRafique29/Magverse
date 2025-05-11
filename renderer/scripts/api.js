export async function fetchExample(name) {
    return await window.api.call('example:getMessage', { name });
}
  
export async function generateScenes(prompt, duration) {
  return await window.api.call('example:generateScenes', { prompt, duration });
}

export async function refreshScene(story_id, scene_id) {
  return await window.api.call('example:refreshScene', { story_id, scene_id });
}

export async function updateScene(story_id, scene_id, new_scene) {
  return await window.api.call('example:updateScene', { story_id, scene_id, new_scene });
}

export async function getStory(story_id) {
  return await window.api.call('example:getStory', { story_id });
}