
const ollama_model = require('../scripts/ollama_');
const { dialog }  = require('electron');
const { generateSpeechWithSpeaker } = require('../scripts/docker_tts');
const { 
  pythontranscribeScene, sendVideoRequest, py_generate_scenes, 
  py_refresh_scene, py_update_scene, py_generate_image, py_refresh_imagePrompt } = require('../scripts/pybackend');



function parseScenes(text, scene_id) {
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const match = line.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        return {
              scene: match[1].trim(),
              imagePrompt: match[2].trim(),
              scene_id: typeof scene_id === 'function' ? scene_id() : scene_id
            };
      }
      return null;
    })
    .filter(Boolean);
}


exports.getStory = async (event, args) => {
  return stories_database[args.story_id] || null;
};

exports.generateScenes = async (event, args) => {
  const { prompt, duration, category } = args;
  try {
    // const scenes = await ollama_model.generate_scenes();
    console.log(prompt, duration);
    const scenes = await py_generate_scenes(prompt, duration, category);
    const result = parseScenes(scenes, () => Math.floor(Math.random() * 99999));
    console.log(result)
    const story_id = Math.floor(Math.random() * 99999);
    stories_database[story_id] = { scenes: result, story_id };
    return { scenes: result, story_id };
  } catch (error) {
      throw error;
  }  
};


exports.refreshScene = async (event, args) => {
  const { story_id, scene_id } = args;
  try {
    if (!stories_database[story_id]) {
      console.log("Story not found");
      throw new Error(`Story not found with ID ${story_id}`);
    }
    const scenesArray = stories_database[story_id].scenes;
    const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
    if (index === -1) {
      throw new Error(`Scene not found with ID ${scene_id}`);
    }
    const target_scene = scenesArray[index];
    const refresh_scene_text = await py_refresh_scene(stories_database[story_id].scenes, target_scene);
    const updatedScene = parseScenes(refresh_scene_text, target_scene.scene_id)[0];
    stories_database[story_id].scenes[index] = updatedScene;
    return updatedScene;

  } catch (error) {
    throw error;
  }  
};

exports.updateScene = async (event, args) => {
  const { story_id, scene_id, new_scene } = args;
  try {
    if (!stories_database[story_id]) {
        console.log("Story not found");
        throw new Error(`Story not found with ID ${story_id}`);
    }
    const scenesArray = stories_database[story_id].scenes;
    const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
    if (index === -1) {
        throw new Error(`Scene not found with ID ${scene_id}`);
    }
    const target_scene = scenesArray[index];
    const refresh_scene_text = await py_update_scene(target_scene.imagePrompt, new_scene);
    const updatedScene = parseScenes(refresh_scene_text, target_scene.scene_id)[0];
    stories_database[story_id].scenes[index] = updatedScene;
    return updatedScene;
    
  } catch (error) {
      throw error;
  } 
};


exports.refreshImagePrompt = async (event, args) => {
  const { story_id, scene_id } = args;
  try {
    if (!stories_database[story_id]) {
      console.log("Story not found");
      throw new Error(`Story not found with ID ${story_id}`);
    }
    const scenesArray = stories_database[story_id].scenes;
    const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
    if (index === -1) {
      throw new Error(`Scene not found with ID ${scene_id}`);
    }
    const target_scene = scenesArray[index];
    const refresh_scene_text = await py_refresh_imagePrompt(target_scene.scene, target_scene.imagePrompt);
    const updatedScene = parseScenes(refresh_scene_text, target_scene.scene_id)[0];
    stories_database[story_id].scenes[index] = updatedScene;
    return updatedScene;

  } catch (error) {
    throw error;
  }  
};

exports.updateImagePrompt = async (event, args) => {
  const { story_id, scene_id, new_prompt } = args;
  try {
    if (!stories_database[story_id]) {
        console.log("Story not found");
        throw new Error(`Story not found with ID ${story_id}`);
    }
    const scenesArray = stories_database[story_id].scenes;
    const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
    if (index === -1) {
        throw new Error(`Scene not found with ID ${scene_id}`);
    }
    const target_scene = scenesArray[index];
    const updatedScene = parseScenes(`${target_scene.scene}(${target_scene.imagePrompt})`, target_scene.scene_id)[0];
    stories_database[story_id].scenes[index] = updatedScene;
    return updatedScene;
    
  } catch (error) {
      throw error;
  } 
};



exports.transcribeScene = async (event, args) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const { story_id, scene_id, speaker_path } = args;

        if (!stories_database[story_id]) {
          throw new Error(`Story not found with ID ${story_id}`);
        }
        const scenesArray = stories_database[story_id].scenes;
        const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
        if (index === -1) {
          throw new Error(`Scene not found with ID ${scene_id}`);
        }
        const target_scene = scenesArray[index];
        const text = target_scene.scene;
        const speakerAudioPath = speaker_path;
        // const result = generateSpeechWithSpeaker(text, speakerAudioPath);
        const result = await pythontranscribeScene(text, speakerAudioPath);
        if (!result) {
          console.log("Error generating speech");
          throw new Error("Error generating speech");
        }
        stories_database[story_id]['scenes'][index]['audio'] = result;
        resolve(result);
        
      } catch (error) {
        console.log("Second here is here..")
        reject(error);
      }
    }, 10);
  });
};


exports.generateImage = async (event, args) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {

      try {
        const { story_id, scene_id, width, height } = args;

        if (!stories_database[story_id]) {
          throw new Error(`Story not found with ID ${story_id}`);
        }
        const scenesArray = stories_database[story_id].scenes;
        const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
        if (index === -1) {
          throw new Error(`Scene not found with ID ${scene_id}`);
        }
        const target_scene = scenesArray[index];
        const image_path = await py_generate_image(target_scene.imagePrompt, width, height, false);
        stories_database[story_id]['scenes'][index]['img'] = image_path;
        resolve(image_path);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};


exports.regenerateImage = async (event, args) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const { story_id, scene_id, width, height } = args;

        if (!stories_database[story_id]) {
          console.log("Story not found");
          resolve(null);
          return;
        }
        const scenesArray = stories_database[story_id].scenes;
        const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
        if (index === -1) {
          throw new Error(`Scene not found with ID ${scene_id}`);
        }
        const target_scene = scenesArray[index];
        const image_path = await py_generate_image(target_scene.imagePrompt, width, height, true)
        stories_database[story_id]['scenes'][index]['img'] = image_path;
        resolve(image_path);

      } catch (error) {
        reject(error);
      }
      
    }, 1000);
  });
};


exports.generateVideo = async (event, args) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const { story_id, video_resolution } = args;
        if (!stories_database[story_id]) {
          throw new Error(`Story not found with ID ${story_id}`);
        }
        const res = await sendVideoRequest({
          draft_story: stories_database[story_id],
          video_res: video_resolution
        });
        resolve(res);
      } catch (error) {
        reject(error);
      }
    }, 2000);
  });
};



exports.filePicker = async (event, args) => {
  const fileType = args?.file_type || ['mp3', 'wav'];
  const scene_id = args?.scene_id || null;
  const story_id = args?.story_id || null;
  const image_path = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Files', extensions: fileType }]
  });
  if (scene_id) {
    if (!stories_database[story_id]) {
      console.log("Story not found");
      resolve(null);
      return;
    }
    const scenesArray = stories_database[story_id].scenes;
    const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
    if (index === -1) {
      throw new Error(`Scene not found with ID ${scene_id}`);
    }
    stories_database[story_id]['scenes'][index]['img'] = image_path.filePaths[0];
  }
  return image_path;
};