const modelRoute = require('./model');
const { ipcMain, dialog } = require('electron');

module.exports = function setupRoutes(ipcMain) {
  ipcMain.handle('model:getMessage', modelRoute.getMessage);
  ipcMain.handle('model:generateScenes', modelRoute.generateScenes);
  ipcMain.handle('model:refreshScene', modelRoute.refreshScene);
  ipcMain.handle('model:updateScene', modelRoute.updateScene);
  ipcMain.handle('model:getStory', modelRoute.getStory);
  ipcMain.handle('model:transcribeScene', modelRoute.transcribeScene);
  ipcMain.handle('dialog:pickFile', async () => {
    return await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'WAV Files', extensions: ['wav', 'mp3'] }]
    });
  });
};
