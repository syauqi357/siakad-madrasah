const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
	getAppPath: () => ipcRenderer.invoke('get-app-path'),
	getVersion: () => ipcRenderer.invoke('get-version'),
	platform: process.platform
});
