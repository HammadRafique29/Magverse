
const ollama_model = require('../scripts/ollama_');
const { generateSpeechWithSpeaker } = require('../scripts/docker_tts');
const { pythontranscribeScene, sendVideoRequest } = require('../scripts/pybackend');

let stories_database = {
  "50800": {
        "scenes": [
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
        ],
        "story_id": 50800
    },
};


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
      try {
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
        const result = await pythontranscribeScene(text, speakerAudioPath);
        console.log("Transcription result:", result);
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





exports.generateVideo = async (event, args) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const { story_id, rendered_images, transcribed_audios, video_resolution } = args;

        if (!stories_database[story_id]) {
          console.log("Story not found");
          throw new Error("Story not found!");
          return;
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