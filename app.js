// Electron Modules
const { app, BrowserWindow } = require('electron')
const touchbar = require('./modules/touchbar')

// other Modules
const fs = require('fs')


function successWindow () {
  let win = new BrowserWindow({
    width: 414,
    height: 736,
    resizable: false,
    webPreferences: {
      allowRunningInsecureContent: true,
      nodeIntegration: true
    }
  })
  
  win.loadFile('views/index.html')
  win.setTouchBar(touchbar)
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

app.allowRendererProcessReuse = true; 

if (fs.existsSync(app.getPath('userData') + '/settings.json')) {
  app.whenReady().then(successWindow)
} else {
  app.whenReady().then(errorWindow)
}

