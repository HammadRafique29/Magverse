const modelRoute = require('./model');
const { ipcMain } = require('electron');

module.exports = function setupRoutes(ipcMain) {
  ipcMain.handle('model:generateScenes', modelRoute.generateScenes);
  ipcMain.handle('model:refreshScene', modelRoute.refreshScene);
  ipcMain.handle('model:updateScene', modelRoute.updateScene);
  ipcMain.handle('model:refreshImagePrompt', modelRoute.refreshImagePrompt);
  ipcMain.handle('model:updateImagePrompt', modelRoute.updateImagePrompt);
  ipcMain.handle('model:getStory', modelRoute.getStory);
  ipcMain.handle('model:transcribeScene', modelRoute.transcribeScene);
  ipcMain.handle('model:generateImage', modelRoute.generateImage);
  ipcMain.handle('model:regenerateImage', modelRoute.regenerateImage);
  ipcMain.handle('model:generateVideo', modelRoute.generateVideo);
  ipcMain.handle('dialog:pickFile',  modelRoute.filePicker);
};
