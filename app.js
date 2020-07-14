// Electron Modules
const { app, BrowserWindow } = require('electron')

// other Modules
const fs = require('fs')
const settings = require('./settings.json')

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

app.whenReady().then(successWindow)
