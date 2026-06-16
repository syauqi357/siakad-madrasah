const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	getServerPort: () => ipcRenderer.invoke('get-server-port'),
	getAppPath: () => ipcRenderer.invoke('get-app-path'),
	getVersion: () => ipcRenderer.invoke('get-version'),
	getIsDev: () => ipcRenderer.invoke('get-is-dev'),
	onServerReady: (callback) => {
		ipcRenderer.on('server-ready', (_event, port) => callback(port));
	}
});
