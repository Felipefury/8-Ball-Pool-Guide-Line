const { app, BrowserWindow, screen, ipcMain} = require('electron')

let win

function createWindow () {
  win = new BrowserWindow({
    width: 1100,
    height: 430,
    transparent: true,
    opacity: 1,
    frame: false,
    icon: "src/img/icon.png",
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

const shell = require('electron').shell;

ipcMain.on('asynchronous-message', (event, arg) => {
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  if(arg == 'ping') win.setIgnoreMouseEvents(false);
  if(arg == 'window') {
    shell.openExternal("http://purple-skirt.glitch.me/adfly")
    win.minimize();
  }
  event.returnValue = arg;
});
