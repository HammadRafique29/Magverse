const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const setupRoutes = require('./backend/routes');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
  });

  // win.removeMenu();
  win.loadFile('renderer/index.html');
  // win.loadFile('renderer/image_render.html');
  // Register shortcut for opening DevTools
  // globalShortcut.register('CommandOrControl+Shift+I', () => {
  //   win.webContents.toggleDevTools();
  // });

}

app.whenReady().then(() => {
  createWindow();
  setupRoutes(ipcMain); // Register backend routes

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
