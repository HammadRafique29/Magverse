export async function fetchExample(name) {
    return await window.api.call('example:getMessage', { name });
  }
  