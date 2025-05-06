import { fetchExample } from './api.js';

document.getElementById('fetchBtn').addEventListener('click', async () => {
  const res = await fetchExample('Electron User');
  document.getElementById('response').textContent = res.msg;
});
