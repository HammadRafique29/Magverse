const exampleRoute = require('./example');

module.exports = function setupRoutes(ipcMain) {
  ipcMain.handle('example:getMessage', exampleRoute.getMessage);
  ipcMain.handle('example:generateScenes', exampleRoute.generateScenes);
};
