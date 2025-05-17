
const ollama_model = require('../scripts/ollama_');
const { generateSpeechWithSpeaker } = require('../scripts/docker_tts');
let stories_database = {};



function parseScenes(text, getSceneId) {
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
          scene_id: getSceneId()
        };
      }
      return null;
    })
    .filter(Boolean);
}



exports.getMessage = async (event, args) => {
  return { msg: `Hello from the backend! Received: ${args.name}` };
};



exports.generateScenes = async (event, args) => {
  console.log("Generating scenes with args:", args);
  const scenes = await ollama_model.generate_scenes();
  const result = parseScenes(scenes, () => Math.floor(Math.random() * 99999));
  const story_id = Math.floor(Math.random() * 99999);
  stories_database[story_id] = { scenes: result, story_id };
  return { scenes: result, story_id };
};



exports.refreshScene = async (event, args) => {
  const { story_id, scene_id } = args;

  if (!stories_database[story_id]) {
    console.log("Story not found");
    return null;
  }
  const scenesArray = stories_database[story_id].scenes;
  const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
  if (index === -1) {
    console.log("Scene not found");
    return null;
  }
  // Retain the original scene_id.
  const target_scene = scenesArray[index];
  const refresh_scene_text = `Testing! Morning mist curled around the roots of ancient trees as a young girl named Elara wandered deeper into the heart of the forest, drawn by a melody only she could hear. (Testing! a young girl walking through a misty magical forest with ancient trees and soft morning light)`;

  const updatedScene = parseScenes(refresh_scene_text, () => target_scene.scene_id)[0];
  stories_database[story_id].scenes[index] = updatedScene;
  return updatedScene;
};



exports.updateScene = async (event, args) => {
  const { story_id, scene_id, new_scene } = args;

  if (!stories_database[story_id]) {
    console.log("Story not found");
    return null;
  }

  const scenesArray = stories_database[story_id].scenes;
  const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
  if (index === -1) {
    console.log("Scene not found");
    return null;
  }

  const updatedScene = {
    scene: new_scene,
    imagePrompt: "Testing Prompt",
    scene_id: scenesArray[index].scene_id
  };

  stories_database[story_id].scenes[index] = updatedScene;
  return updatedScene;
};


exports.getStory = async (event, args) => {
  return stories_database[args.story_id] || null;
};




exports.transcribeScene = async (event, args) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const { story_id, scene_id, speaker_path } = args;

      if (!stories_database[story_id]) {
        console.log("Story not found");
        resolve(null); // Resolve with null instead of returning
        return;
      }
      const scenesArray = stories_database[story_id].scenes;
      const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
      if (index === -1) {
        console.log("Scene not found");
        resolve(null);
        return;
      }
      const target_scene = scenesArray[index];
      const text = target_scene.scene;
      const speakerAudioPath = speaker_path;
      // const result = generateSpeechWithSpeaker(text, speakerAudioPath);
      resolve("/home/magician/Music/intro.mp3");
    }, 1000);
  });
};


exports.generateImage = async (event, args) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const { story_id, scene_id, speaker_path } = args;

      if (!stories_database[story_id]) {
        console.log("Story not found");
        resolve(null);
        return;
      }
      const scenesArray = stories_database[story_id].scenes;
      const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
      if (index === -1) {
        console.log("Scene not found");
        resolve(null);
        return;
      }
      resolve("/home/magician/Desktop/story_teller/assets/img/renderd_img.png");
    }, 2000);
  });
};


exports.regenerateImage = async (event, args) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const { story_id, scene_id, speaker_path } = args;

      if (!stories_database[story_id]) {
        console.log("Story not found");
        resolve(null);
        return;
      }
      const scenesArray = stories_database[story_id].scenes;
      const index = scenesArray.findIndex(scene => scene.scene_id == scene_id);
      if (index === -1) {
        console.log("Scene not found");
        resolve(null);
        return;
      }
      resolve("/home/magician/Desktop/story_teller/assets/img/renderd_img.png");
    }, 2000);
  });
};
