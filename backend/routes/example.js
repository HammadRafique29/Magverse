
let stories_database = {};


exports.getMessage = async (event, args) => {
    return { msg: `Hello from the backend! Received: ${args.name}` };
};
  
exports.generateScenes = async (event, args) => {
  let scenes = `
  Morning mist curled around the roots of ancient trees as a young girl named Elara wandered deeper into the heart of the forest, drawn by a melody only she could hear. (a young girl walking through a misty magical forest with ancient trees and soft morning light)

  A fox with silver fur and wise eyes appeared before her, motioning with its head as if to say, “Follow me.” (a silver-furred fox with glowing eyes standing on a forest path, early sunlight streaming through the trees)

  They reached a clearing where flowers glowed in soft blues and purples, swaying gently despite the still air. (a mystical forest clearing filled with glowing blue and purple flowers under a soft twilight sky)

  At the center stood a hollow tree with a spiral staircase leading deep underground, its bark carved with glowing runes. (an ancient hollow tree with glowing runes and a spiral staircase descending inside)

  Elara hesitated, then stepped into the tree, her heart pounding as the air shimmered around her. (a girl entering a glowing tree with a magical aura, the inside illuminated by mysterious light)`;

  // Split, clean, and transform the scenes
  const result = scenes
    .split('\n')                     // Split into lines
    .map(line => line.trim())        // Trim whitespace
    .filter(line => line.length > 0) // Remove empty lines
    .map(line => {
      const match = line.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        const scene = match[1].trim();
        const imagePrompt = match[2].trim();
        return {scene: scene, imagePrompt: imagePrompt, scene_id: Math.floor(Math.random() * 99999)};
      }
      return null;
    })
    .filter(item => item !== null); // Remove any non-matching lines (just in case)
    
    const story_id = Math.floor(Math.random() * 99999);
    stories_database[story_id] = { scenes: result, story_id: story_id };
    return { scenes: result, story_id: story_id };
};


 
exports.refreshScene = async (event, args) => {

  const story_id = args.story_id;
  const scene_id = args.scene_id;
  let target_scene = null;
  let target_scene_index = null;

  let temp_index = -1;

  try {
    console.log(stories_database, story_id, scene_id);
    stories_database[`${story_id}`]["scenes"].some((scene, i) => {
        if (scene.scene_id == scene_id) {
            target_scene = scene;
            temp_index = i; // Store the index
            return true; // Stop iteration
        }
        return false;
    });


    console.log("Target Scene: ", target_scene);
    if (!target_scene) {
        console.log("Scene not found");
        return null;
    }

    let refresh_scene = `Testing! Morning mist curled around the roots of ancient trees as a young girl named Elara wandered deeper into the heart of the forest, drawn by a melody only she could hear. (Testing! a young girl walking through a misty magical forest with ancient trees and soft morning light)`;

    // Split, clean, and transform the scenes
    const result = refresh_scene
      .split('\n') 
      .map(line => line.trim())      
      .filter(line => line.length > 0)
      .map(line => {
        const match = line.match(/^(.*?)\s*\((.*?)\)$/);
        if (match) {
          const scene = match[1].trim();
          const imagePrompt = match[2].trim();
          return {scene: scene, imagePrompt: imagePrompt, scene_id: target_scene.scene_id};
        }
        return null;
      })
      .filter(item => item !== null);

    stories_database[story_id]['scenes'][temp_index] = result[0]; // Update the Stories Database
    console.log("Final Database Results: ", stories_database[story_id]['scenes'][temp_index]);
    return result[0];
    
  } catch (error) {
      console.error("Error in refreshScene: ", error);
      return null
  }
  
};



exports.updateScene = async (event, args) => {
  const story_id = args.story_id;
  const scene_id = args.scene_id;
  const new_scene = args.new_scene;

  let target_scene = null;
  let temp_index = -1;

  try {

    console.log(stories_database, story_id, scene_id);
    stories_database[`${story_id}`]["scenes"].some((scene, i) => {
        if (scene.scene_id == scene_id) {
            target_scene = scene;
            temp_index = i; 
            return true; 
        }
        return false;
    });

    console.log("Update Scene: ", target_scene);
    if (!target_scene) {
        console.log("Scene not found");
        return null;
    }

    const result = {
      scene: new_scene,
      imagePrompt: "Testing Prompt",
      scene_id: target_scene.scene_id
    }
    
    stories_database[story_id]['scenes'][temp_index] = result; // Update the Stories Database
    console.log("Final Updating Database Results: ", stories_database[story_id]['scenes'][temp_index]);
    return result;

  } catch (error) {
    console.error("Error in updateScene: ", error);
    return null;
  }
}