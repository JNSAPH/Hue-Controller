const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 414,
    height: 736,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Open Dev Tools
  //win.webContents.openDevTools()

  // Load HTML File
  win.loadFile('views/index.html')
}

app.whenReady().then(createWindow)
