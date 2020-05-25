const { BrowserWindow, ipcMain: ipc } = require('electron');
const Server = require('../db/core/server');
const crypto = require('crypto');
const path = require('path');
const Salt = require('../core/salt');
const createMainWindow = require('../main/main');

let welcomeWindow;

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
      welcomeWindow.loadFile(path.join(__dirname, '../gui/welcome/index.html'));
}

ipc.on('minimize-welcome-window', _=>{
    welcomeWindow.minimize();
})
ipc.on('close-welcome-window', _=> {
    welcomeWindow.close();
})
ipc.on('sign-in', (event, credentials) => {
  const query = {username: credentials.username};
  (async ()=>{
    const server = await new Server('ragc0092','lucky.number.Slevin').connect();
    const database =  server.db('Profile');
    const collection = database.collection('Universal');
    const userEncryption = await collection.findOne(query, {projection: {salt: 1, password: 1}});
    if(userEncryption !== null) {
      const salt = Salt.decrypt(userEncryption.salt.encrypted, userEncryption.salt.sequence);
      const inputPassword = crypto.createHash('sha256').update(credentials.password + salt).digest('hex');
      if(inputPassword === userEncryption.password) {
        const doc = await collection.findOne(query, {projection: {password:0, salt:0}});
        global.sharedObject = { user: doc };
        welcomeWindow.webContents.send('login-result', 'Succesfully logged in')
        createMainWindow();
        welcomeWindow.close();
      } else {
        // TODO implement code for incorrect password. Implement a try log in and password limit.
        welcomeWindow.webContents.send('login-result', 'Incorrect password');
      }
    } else {
      // TODO implement code for incorrect username. Implement a try log in and password limit.
      welcomeWindow.webContents.send('login-result', 'Username not found in the database.');     
    }
    server.close();
  })()
})
ipc.on('sign-up', (event, profile) => {
  let salt = Salt.salt({beg: 0, end: 50,}, 50);
  profile.salt = {
    encrypted: salt.encrypted,
    sequence: salt.sequence
  }
  profile.password = crypto.createHash('sha256').update(profile.password + salt.salt).digest('hex');
  (async () => {
    const server = await new Server('ragc0092', 'lucky.number.Slevin').connect();
    const database = server.db('Profile');
    const collection = database.collection('Universal');
    const result = await collection.insertOne(profile);
    server.close(); 
  })()
})



module.exports = createWelcomeWindow;