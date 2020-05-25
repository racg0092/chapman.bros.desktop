const { BrowserWindow, ipcMain: ipc} = require('electron');
const path = require('path');

let mainWindow;

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        height: 500,
        width: 1000,
    });
    mainWindow.loadFile(path.join(__dirname, '../gui/main/index.html'));
}


module.exports = createMainWindow;