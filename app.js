// Electron Modules
const { app, BrowserWindow } = require('electron')
var robot = require("robotjs");

// other Modules
const fs = require('fs')


function successWindow () {
  let win = new BrowserWindow({
    width: 414,
    height: 736,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('views/index.html')
}

function errorWindow () {
  let win = new BrowserWindow({
    width: 750,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('views/createuname.html')
}

if (fs.existsSync(app.getPath('userData') + '/settings.json')) {
  app.whenReady().then(successWindow)
} else {
  app.whenReady().then(errorWindow)
}

