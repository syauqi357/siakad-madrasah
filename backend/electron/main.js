import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import dotenv from 'dotenv'
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

// Start Express server in the same process
async function startServer() {
	const paths = initializeUserData();

	// Set environment variables before importing the app
	process.env.DATABASE_URL = paths.database;
	process.env.UPLOAD_PATH = paths.uploads;
	process.env.BUILD_PATH = paths.build;
	process.env.PORT = process.env.PORT || '3000';
	process.env.NODE_ENV = isDev ? 'development' : 'production';
	process.env.ELECTRON_RUN = 'true';
	process.env.ADDRESS_SERVER = 'http://localhost';

	// JWT secret - use existing or generate
	if (!process.env.JWT_SECRET) {
		process.env.JWT_SECRET = 'siakad-electron-secret-key';
	}

	console.log('Starting Express server...');
	console.log('Database:', paths.database);
	console.log('Build path:', paths.build);

	try {
		// Dynamically import the Express app
		const appPath = isDev
			? path.join(__dirname, '..', 'app.js')
			: path.join(process.resourcesPath, 'app', 'app.js');

		// Change working directory to backend folder
		const workingDir = isDev ? path.join(__dirname, '..') : path.join(process.resourcesPath, 'app');
		process.chdir(workingDir);

		console.log('App path:', appPath);
		console.log('Working directory:', workingDir);
		console.log('File exists:', fs.existsSync(appPath));

		// Use pathToFileURL for proper Windows path conversion
		const appUrl = pathToFileURL(appPath).href;
		console.log('App URL:', appUrl);

		await import(appUrl);
		serverStarted = true;
		console.log('Express server started successfully');
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
			? path.join(__dirname, '..', 'build-resources', 'iconsiakad-01.ico')
			: path.join(process.resourcesPath, 'app', 'build-resources', 'iconsiakad-01.ico'),
		title: 'SIAKAD Madrasah',
		show: false,
		autoHideMenuBar: true
	});

	const port = process.env.PORT;

	// Load the app from Express server
	mainWindow.loadURL(`http://localhost:${port}`);

	// Show window when ready
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
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

		// Give the server a moment to fully initialize
		await new Promise((resolve) => setTimeout(resolve, 1000));

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

// IPC handlers
ipcMain.handle('get-app-path', () => {
	return app.getPath('userData');
});

ipcMain.handle('get-version', () => {
	return app.getVersion();
});

ipcMain.handle('get-is-dev', () => {
	return isDev;
});
