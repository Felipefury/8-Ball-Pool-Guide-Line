const { app, BrowserWindow, screen } = require('electron')

let win

function createWindow () {
  win = new BrowserWindow({
    width: 1100,
    height: 430,
    transparent: true,
    opacity: 1,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('./src/index.html')

  win.on('closed', () => {win = null})
  win.setIgnoreMouseEvents(true)
  win.setAlwaysOnTop(true, "floating", 1);

  win.webContents.on('before-input-event', (event, input) => {
    win.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta)

    if(input.control == true) {
      let mousePos = screen.getCursorScreenPoint();
      win.setPosition(mousePos.x, mousePos.y)
    }

    if(input.key == 'b' || input.key == 'n' || input.key == 'v' || input.key == 'c') {
      if(input.type == 'keyDown') {
      win.setIgnoreMouseEvents(false)
      } else win.setIgnoreMouseEvents(true)
    }

  })
}

app.on('ready', createWindow)

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})