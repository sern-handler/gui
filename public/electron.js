const path = require('path');
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		icon: './icons/icon.png',
		show: false,
		autoHideMenuBar: true,
		title: 'sern',
	});
	if (isDev) {
		mainWindow.loadURL('http://localhost:3000');
	} else {
		mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
	}

	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.on('page-title-updated', function (e) {
		e.preventDefault();
	});

	ipcMain.on('openFolder', (event, arg) => {
		dialog
		  .showOpenDialog({
			properties: ['openDirectory'],
		  })
		  .then((result) => {
			event.reply('folderData', result.filePaths);
		  })
		  .catch((error) => {
			console.error(error);
			event.reply('folderData', []);
		  });
	  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});