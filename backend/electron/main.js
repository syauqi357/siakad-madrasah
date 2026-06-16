import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import electronUpdaterPkg from 'electron-updater';
const { autoUpdater } = electronUpdaterPkg;
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

let mainWindow;
let serverStarted = false;

// Determine if we're in development or production
const isDev = !app.isPackaged;

// Get paths for packaged app
function getAppPaths() {
	if (isDev) {
		return {
			backend: path.join(__dirname, '..'),
			database: path.join(__dirname, '..', 'siakad.db'),
			uploads: path.join(__dirname, '..', 'public', 'upload'),
			build: path.join(__dirname, '..', 'build')
		};
	} else {
		// In production (asar: false): files are in resources/app/
		const userDataPath = app.getPath('userData');
		const appPath = path.join(process.resourcesPath, 'app');
		return {
			backend: appPath,
			database: path.join(userDataPath, 'siakad.db'),
			uploads: path.join(userDataPath, 'upload'),
			build: path.join(appPath, 'build'),
			sourceDb: path.join(appPath, 'siakad.db'),
			sourceUploads: path.join(appPath, 'public', 'upload')
		};
	}
}

// Copy folder recursively
function copyFolderSync(source, target) {
	if (!fs.existsSync(target)) {
		fs.mkdirSync(target, { recursive: true });
	}

	if (!fs.existsSync(source)) return;

	const files = fs.readdirSync(source);
	for (const file of files) {
		const sourcePath = path.join(source, file);
		const targetPath = path.join(target, file);

		if (fs.statSync(sourcePath).isDirectory()) {
			copyFolderSync(sourcePath, targetPath);
		} else {
			fs.copyFileSync(sourcePath, targetPath);
		}
	}
}

// Initialize user data directory (copy database and uploads on first run)
function initializeUserData() {
	const paths = getAppPaths();

	if (!isDev) {
		const userDataPath = app.getPath('userData');

		// Ensure userData directory exists
		if (!fs.existsSync(userDataPath)) {
			fs.mkdirSync(userDataPath, { recursive: true });
		}

		// Copy database if it doesn't exist in userData
		if (!fs.existsSync(paths.database)) {
			console.log('Looking for database at:', paths.sourceDb);
			if (fs.existsSync(paths.sourceDb)) {
				fs.copyFileSync(paths.sourceDb, paths.database);
				console.log('Database copied to:', paths.database);
			} else {
				console.error('Source database not found at:', paths.sourceDb);
			}
		}

		// Create upload directories if they don't exist
		if (!fs.existsSync(paths.uploads)) {
			console.log('Looking for uploads at:', paths.sourceUploads);
			if (fs.existsSync(paths.sourceUploads)) {
				copyFolderSync(paths.sourceUploads, paths.uploads);
				console.log('Uploads copied to:', paths.uploads);
			}
		}
	}

	return paths;
}

// Poll localhost until the Express server is accepting connections
async function waitForServer(port, maxAttempts = 40, intervalMs = 250) {
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			const response = await fetch(`http://localhost:${port}/`);
			if (response.ok) return;
		} catch {
			// server not ready yet — keep waiting
		}
		await new Promise((resolve) => setTimeout(resolve, intervalMs));
	}
	throw new Error(`Server did not respond after ${(maxAttempts * intervalMs) / 1000}s`);
}

// Start Express server in the same process
async function startServer() {
	const paths = initializeUserData();

	process.env.DATABASE_URL = paths.database;
	process.env.UPLOAD_PATH = paths.uploads;
	process.env.BUILD_PATH = paths.build;
	process.env.PORT = process.env.PORT || '3000';
	process.env.NODE_ENV = isDev ? 'development' : 'production';
	process.env.ELECTRON_RUN = 'true';
	process.env.ADDRESS_SERVER = 'http://localhost';

	if (!process.env.JWT_SECRET) {
		process.env.JWT_SECRET = 'siakad-electron-secret-key';
	}

	console.log('Starting Express server...');
	console.log('Database:', paths.database);
	console.log('Build path:', paths.build);

	try {
		const appPath = isDev
			? path.join(__dirname, '..', 'app.js')
			: path.join(process.resourcesPath, 'app', 'app.js');

		const workingDir = isDev
			? path.join(__dirname, '..')
			: path.join(process.resourcesPath, 'app');
		process.chdir(workingDir);

		console.log('App path:', appPath);
		console.log('Working directory:', workingDir);
		console.log('File exists:', fs.existsSync(appPath));

		const appUrl = pathToFileURL(appPath).href;
		await import(appUrl);

		// Wait until the server is actually accepting connections
		await waitForServer(process.env.PORT);

		serverStarted = true;
		console.log('Express server ready on port', process.env.PORT);
	} catch (error) {
		console.error('Failed to start Express server:', error);
		console.error('Error stack:', error.stack);
		throw error;
	}
}

// Create the main window
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1400,
		height: 900,
		minWidth: 1024,
		minHeight: 768,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.cjs')
		},
		icon: isDev
			? path.join(__dirname, '..', 'build-resources', 'icon.ico')
			: path.join(process.resourcesPath, 'app', 'build-resources', 'icon.ico'),
		title: 'Platform Akademik Madrasah',
		show: false,
		autoHideMenuBar: true
	});

	const port = process.env.PORT;

	// Load the app from Express server
	mainWindow.loadURL(`http://localhost:${port}`);

	// Show window, signal renderer, then check for updates
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.webContents.send('server-ready', parseInt(process.env.PORT));
		setupAutoUpdater();
	});

	// Handle load failures
	mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
		console.error('Failed to load:', errorDescription);
		// Retry after a delay
		setTimeout(() => {
			mainWindow.loadURL(`http://localhost:${port}`);
		}, 2000);
	});

	// Open DevTools in development
	if (isDev) {
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

// App lifecycle
app.whenReady().then(async () => {
	try {
		console.log('=================================');
		console.log('SIAKAD Madrasah - Starting...');
		console.log('Development mode:', isDev);
		console.log('=================================');

		await startServer();
		createWindow();
	} catch (error) {
		console.error('Failed to start application:', error);
		dialog.showErrorBox(
			'Startup Error',
			`Failed to start SIAKAD Madrasah:\n\n${error.message}\n\nPlease check the console for details.`
		);
		app.quit();
	}
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null && serverStarted) {
		createWindow();
	}
});

// Auto-updater — only runs in packaged builds, skipped in dev
function setupAutoUpdater() {
	if (isDev) return;

	autoUpdater.autoDownload = false;
	autoUpdater.autoInstallOnAppQuit = true;

	autoUpdater.on('update-available', (info) => {
		dialog
			.showMessageBox(mainWindow, {
				type: 'info',
				title: 'Pembaruan Tersedia',
				message: `Versi ${info.version} tersedia.`,
				detail: 'Unduh sekarang dan pasang saat aplikasi ditutup?',
				buttons: ['Unduh', 'Nanti'],
				defaultId: 0,
				cancelId: 1
			})
			.then(({ response }) => {
				if (response === 0) autoUpdater.downloadUpdate();
			});
	});

	autoUpdater.on('update-downloaded', () => {
		dialog
			.showMessageBox(mainWindow, {
				type: 'info',
				title: 'Siap Diperbarui',
				message: 'Pembaruan telah diunduh.',
				detail: 'Restart aplikasi sekarang untuk menerapkan pembaruan?',
				buttons: ['Restart Sekarang', 'Nanti'],
				defaultId: 0,
				cancelId: 1
			})
			.then(({ response }) => {
				if (response === 0) autoUpdater.quitAndInstall();
			});
	});

	autoUpdater.on('error', (error) => {
		console.error('Auto-updater error:', error.message);
	});

	// Check silently — no dialog if already up to date
	autoUpdater.checkForUpdates().catch((error) => {
		console.error('Update check failed:', error.message);
	});
}

// IPC handlers
ipcMain.handle('get-server-port', () => parseInt(process.env.PORT || '3000'));
ipcMain.handle('get-app-path', () => app.getPath('userData'));
ipcMain.handle('get-version', () => app.getVersion());
ipcMain.handle('get-is-dev', () => isDev);
