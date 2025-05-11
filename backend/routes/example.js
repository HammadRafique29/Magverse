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
        return {scene: scene, imagePrompt: imagePrompt};
      }
      return null;
    })
    .filter(item => item !== null); // Remove any non-matching lines (just in case)

  return { scenes: result };
};
