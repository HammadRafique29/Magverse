const exampleRoute = require('./example');

module.exports = function setupRoutes(ipcMain) {
  ipcMain.handle('example:getMessage', exampleRoute.getMessage);
  ipcMain.handle('example:generateScenes', exampleRoute.generateScenes);
  ipcMain.handle('example:refreshScene', exampleRoute.refreshScene);
  ipcMain.handle('example:updateScene', exampleRoute.updateScene);
  ipcMain.handle('example:getStory', exampleRoute.getStory);
};
