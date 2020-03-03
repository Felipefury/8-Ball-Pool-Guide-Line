const { app, BrowserWindow, screen, ipcMain} = require("electron");
const shell = require("electron").shell;

let win;
let location = null

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 670,
    transparent: true,
    opacity: 1,
    frame: false,
    icon: "./img/icon.png",
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile("./src/index.html");


  win.on("closed", () => {win = null});
  win.setIgnoreMouseEvents(true)
  win.setAlwaysOnTop(true, "floating", 1);

  win.webContents.on("before-input-event", (event, input) => {
    win.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta);

    if(input.control === true) {
      let mousePos = screen.getCursorScreenPoint();
      win.setPosition(mousePos.x, mousePos.y)
    }

    if(location !== "bot") {
      return;
    }
    
    if(input.key === "b" || input.key === "n" || input.key === "v" || input.key === "c" || input.key === "f") {
      if(input.type === "keyDown") {
      win.setIgnoreMouseEvents(false)
      } else win.setIgnoreMouseEvents(true);
    }

  })
}

app.on("ready", createWindow);

app.on("activate", () => {
  if (win === null) { 
    createWindow();
  }
});

ipcMain.on("synchronous-message", (event, arg) => {

  if(typeof arg === "string") {
    if(arg == "mouseOn") win.setIgnoreMouseEvents(false);
    if(arg == "mouseOff") win.setIgnoreMouseEvents(true);
  }

  else if(typeof arg == "object") {
    if(arg.info === "reSize") {
      win.setSize(arg.width,arg.height)
      location = arg.location;
    } else if(arg.info === "ad") {
      shell.openExternal(arg.link);
      win.minimize();
    }
  }

  event.returnValue = arg;
});
