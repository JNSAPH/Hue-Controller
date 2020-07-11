const { app, BrowserWindow } = require('electron')
const { dialog } = require('electron')
const settings = require('./settings.json')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 414,
    height: 736,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Open Dev Tools
  //win.webContents.openDevTools()
  if (settings.username == "") {
    const options = {
      type: 'error',
      buttons: ['Ok'],
      defaultId: 2,
      title: 'An Error Occured!',
      message: 'You dont seem to have a Username defined in settings.json',
      detail: 'Please follow the Steps in README.md under Installation to fix this Problem.',
    };
  
    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      console.log(response);
      console.log(checkboxChecked);
    });
  }

  // Load HTML File
  win.loadFile('views/index.html')
}

app.whenReady().then(createWindow)
