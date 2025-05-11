export async function fetchExample(name) {
    return await window.api.call('example:getMessage', { name });
}
  
export async function generateScenes(prompt, duration) {
  return await window.api.call('example:generateScenes', { prompt, duration });
}