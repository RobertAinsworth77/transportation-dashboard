const { app, BrowserWindow, ipcMain, protocol, nativeImage } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('allow-file-access');
app.commandLine.appendSwitch('allow-cross-origin-auth-prompt');
function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      icon: 'icon',
      nodeIntegration: true,
    },
  });

  mainWindow.maximize();
  mainWindow.show();

  mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
});
