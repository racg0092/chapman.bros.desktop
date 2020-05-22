const { BrowserWindow, ipcMain: ipc } = require('electron');
const Server = require('../db/core/server');
const crypto = require('crypto');
const path = require('path');

let welcomeWindow;

const createWelcomeWindow = () => {
    welcomeWindow = new BrowserWindow({
        webPreferences: {
          nodeIntegration: true
        },
        height: 700,
        width: 1300,
        frame: false,
        resizable: false,
      });
    
      // and load the index.html of the app.
      welcomeWindow.loadFile(path.join(__dirname, '../gui/welcome/index.html'));
}

ipc.on('minimize-welcome-window', _=>{
    welcomeWindow.minimize();
})
ipc.on('close-welcome-window', _=> {
    welcomeWindow.close();
})
ipc.on('sign-in', (event, credentials) => {
  credentials.password = crypto.createHash('sha256').update(credentials.password).digest('hex');
  const query = {username: credentials.username, password: credentials.password};
  console.log(query);
  (async ()=>{
    const server = await new Server('ragc0092','lucky.number.Slevin').connect();
    const database = await server.db('Profile');
    const collection = await database.collection('Universal');
    const doc = await collection.findOne(query, {projection: {password: 0}});
    console.log(doc);
    global.sharedObject = { user: doc };
    server.close();
  })()
})
ipc.on('sign-up', (event, profile) => {
  // need to salt the password.
  profile.password = crypto.createHash('sha256').update(profile.password).digest('hex');
  (async () => {
    const server = await new Server('ragc0092', 'lucky.number.Slevin').connect();
    const database = server.db('Profile');
    const collection = database.collection('Universal');
    const result = await collection.insertOne(profile);
    console.log(result);
    server.close(); 
  })()
})

module.exports = createWelcomeWindow;