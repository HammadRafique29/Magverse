
export async function generateScenes(prompt, duration, category) {
  try { return await window.api.call('model:generateScenes', { prompt, duration, category }) }
  catch (error) {
    throw error;
  }
}
export async function refreshScene(story_id, scene_id) {
  try { return await window.api.call('model:refreshScene', { story_id, scene_id }) }
  catch (error) {
    throw error;
  }
}
export async function updateScene(story_id, scene_id, new_scene) {
  try { return await window.api.call('model:updateScene', { story_id, scene_id, new_scene }) }
  catch (error) {
    throw error;
  }
}
export async function refreshImagePrompt(story_id, scene_id) {
  try { return await window.api.call('model:refreshImagePrompt', { story_id, scene_id }) }
  catch (error) {
    throw error;
  }
}
export async function updateImagePrompt(story_id, scene_id, new_scene) {
  try{ return await window.api.call('model:updateImagePrompt', { story_id, scene_id, new_scene }) }
  catch (error) {
    throw error;
  }
}
export async function getStory(story_id) {
  try{ return await window.api.call('model:getStory', { story_id }) }
  catch (error) {
    throw error;
  }
}
export async function transcribeScene(story_id, scene_id, speaker_path) {
  try {return await window.api.call('model:transcribeScene', { story_id, scene_id, speaker_path })}
  catch (error) {
    throw error;
  }
}
export async function generateImage(story_id, scene_id, width, height) {
  try {return await window.api.call('model:generateImage', { story_id, scene_id, width, height }) }
  catch (error) {
    throw error;
  }
}
export async function regenerateImage(story_id, scene_id, width, height) {
  try {return await window.api.call('model:regenerateImage', { story_id, scene_id, width, height }) }
  catch (error) {
    throw error;
  }
}
export async function generateVideo(story_id, video_resolution ) {
  try {
    return await window.api.call('model:generateVideo', { story_id, video_resolution  });
  } catch (error) {
    throw error;
  }
}

export async function electronFilePicker(story_id, video_resolution ) {
  try {
    return await window.api.call('model:generateVideo', { story_id, video_resolution  });
  } catch (error) {
    throw error;
  }
}