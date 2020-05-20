const { app, BrowserWindow, ipcMain: ipc } = require('electron');
const path = require('path');


let welcomeWindow;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWelcomeWindow = () => {
  welcomeWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    height: 700,
    width: 1300,
    frame: false,
    resizable: false
  });

  // and load the index.html of the app.
  welcomeWindow.loadFile(path.join(__dirname, '/gui/welcome/index.html'));
};


app.on('ready', createWelcomeWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWelcomeWindow();
  }
});

ipc.on('minimize-welcome-window', _=>{
  welcomeWindow.minimize();
})
ipc.on('close-welcome-window', _=> {
  welcomeWindow.close();
})
