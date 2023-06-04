const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
    icon: './icons/icon.png',
    show: false,
    autoHideMenuBar: true,
    title: 'sern init'
  });

  mainWindow.loadFile(path.join(__dirname, 'public/index.html'));

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('page-title-updated', function(e) {
    e.preventDefault()
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("newData", (event, data) => {
  console.log(data.value); // Will output whatever was inside input element in HTML
});

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log( arg );
  
  // send message to index.html
  event.sender.send('asynchronous-reply', 'hello' );
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.