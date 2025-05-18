
const ollama_model = require('../scripts/ollama_');
const { generateSpeechWithSpeaker } = require('../scripts/docker_tts');
const { 
  pythontranscribeScene, sendVideoRequest, py_generate_scenes, 
  py_refresh_scene, py_update_scene, py_generate_image } = require('../scripts/pybackend');


  let stories_database = {  };



const test_results = [
  {
      "scene": "Morning mist curled around the roots of ancient trees as a young girl named Elara wandered deeper into the heart of the forest, drawn by a melody only she could hear.",
      "imagePrompt": "a young girl walking through a misty magical forest with ancient trees and soft morning light",
      "scene_id": 5469
  },
  {
      "scene": "A fox with silver fur and wise eyes appeared before her, motioning with its head as if to say, “Follow me.”",
      "imagePrompt": "a silver-furred fox with glowing eyes standing on a forest path, early sunlight streaming through the trees",
      "scene_id": 66333
  },
  {
      "scene": "They reached a clearing where flowers glowed in soft blues and purples, swaying gently despite the still air.",
      "imagePrompt": "a mystical forest clearing filled with glowing blue and purple flowers under a soft twilight sky",
      "scene_id": 40604
  },
  {
      "scene": "At the center stood a hollow tree with a spiral staircase leading deep underground, its bark carved with glowing runes.",
      "imagePrompt": "an ancient hollow tree with glowing runes and a spiral staircase descending inside",
      "scene_id": 5356
  },
  {
      "scene": "Elara hesitated, then stepped into the tree, her heart pounding as the air shimmered around her.",
      "imagePrompt": "a girl entering a glowing tree with a magical aura, the inside illuminated by mysterious light",
      "scene_id": 60029
  },
  {
      "scene": "They reached a clearing where flowers glowed in soft blues and purples, swaying gently despite the still air.",
      "imagePrompt": "a mystical forest clearing filled with glowing blue and purple flowers under a soft twilight sky",
      "scene_id": 66744
  }
]

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
          scene_id: scene_id
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
  const { prompt, duration } = args;
  try {
    // const scenes = await ollama_model.generate_scenes();
    console.log(prompt, duration);
    // const scenes = await py_generate_scenes(prompt, duration);
    // const result = parseScenes(scenes, Math.floor(Math.random() * 99999));
    const result = test_results
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


exports.transcribeScene = async (event, args) => {
  return new Promise((resolve) => {
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
        resolve(result);
      } catch (error) {
        throw error
      }
    }, 10);
  });
};


exports.generateImage = async (event, args) => {
  return new Promise((resolve) => {
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
        const image_path = await py_generate_image(target_scene.imagePrompt, width, height, false)
        resolve(image_path);
      } catch (error) {
        throw error;
      }
    }, 1000);
  });
};


exports.regenerateImage = async (event, args) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
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
      resolve(image_path);
    }, 1000);
  });
};


exports.generateVideo = async (event, args) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const { story_id, rendered_images, transcribed_audios, video_resolution } = args;
        if (!stories_database[story_id]) {
          throw new Error(`Story not found with ID ${story_id}`);
        }
        const res = await sendVideoRequest({
          draft_story: stories_database[story_id],
          render_images: rendered_images,
          transcribed_audios: transcribed_audios,
          video_res: video_resolution.split("x"),
        });
        resolve(res);
      } catch (error) {
        throw error;
      }
    }, 2000);
  });
};