const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  call: (route, data) => ipcRenderer.invoke(route, data)
});
