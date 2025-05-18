const modelRoute = require('./model');
const { ipcMain, dialog } = require('electron');

module.exports = function setupRoutes(ipcMain) {
  ipcMain.handle('model:generateScenes', modelRoute.generateScenes);
  ipcMain.handle('model:refreshScene', modelRoute.refreshScene);
  ipcMain.handle('model:updateScene', modelRoute.updateScene);
  ipcMain.handle('model:getStory', modelRoute.getStory);
  ipcMain.handle('model:transcribeScene', modelRoute.transcribeScene);
  ipcMain.handle('model:generateImage', modelRoute.generateImage);
  ipcMain.handle('model:regenerateImage', modelRoute.regenerateImage);
  ipcMain.handle('model:generateVideo', modelRoute.generateVideo);
  ipcMain.handle('dialog:pickFile', async () => {
    return await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'WAV Files', extensions: ['wav', 'mp3'] }]
    });
  });
};
