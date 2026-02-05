const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	getServerPort: () => ipcRenderer.invoke('get-server-port'),
	onServerReady: (callback) => ipcRenderer.on('server-ready', (event, port) => callback(port))
});
