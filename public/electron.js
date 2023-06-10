const path = require('path')
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: './icons/icon.png',
    show: false,
    autoHideMenuBar: true,
    title: 'sern'
  });

  isDev ? mainWindow.loadURL('http://localhost:3000') : mainWindow.loadFile(path.join(__dirname, '../build/index.html'))

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('page-title-updated', function(e) {
    e.preventDefault()
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