const { app, BrowserWindow, screen, globalShortcut,ipcMain} = require("electron");
const shell = require("electron").shell;

let win;
let location = "bot"
let winxy = {x:0,y:0}

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

  win.on("closed", () => {
    win = null
  });
  
  win.setIgnoreMouseEvents(true)
  win.setAlwaysOnTop(true, "floating", 1);
}

app.allowRendererProcessReuse = true

app.on("ready", createWindow);

app.on("activate", () => {
  if (win === null) { 
    createWindow();
  }
});

getxy = function() {
  return {x: screen.getCursorScreenPoint().x - winxy.x  - 2 * Math.PI,y: screen.getCursorScreenPoint().y - winxy.y - 2 * Math.PI}
}

app.whenReady().then(() => {
  console.clear();
  console.log('    _/        _/  _/       ');
  console.log('         _/_/_/  _/_/_/    ');
  console.log('  _/  _/    _/  _/    _/   ');
  console.log(' _/  _/    _/  _/    _/    ');
  console.log('_/    _/_/_/  _/_/_/       \n\n');

  console.log('(You can\'t type anymore while using the hack)\n\nV3 coded By Zeedy and GM\nIf you have any suggestion message us on discord.\n\nDon\'t close the CMD while using the hack.');
  globalShortcut.register('Z', () => {
    let mousePos = screen.getCursorScreenPoint();
    win.setPosition(mousePos.x, mousePos.y);
    winxy.x = mousePos.x
    winxy.y = mousePos.y
  })

  globalShortcut.register('X', () => {
    if(win.getOpacity() <= 0) {
      win.setOpacity(0.9)
    } else win.setOpacity(0)
  })
  globalShortcut.register('B', () => {
    win.webContents.send('key', 'B', getxy())
  })
  globalShortcut.register('N', () => {
    win.webContents.send('key', 'N', getxy())
  })
  globalShortcut.register('V', () => {
    win.webContents.send('key', 'V', getxy())
  })
  globalShortcut.register('F', () => {
    win.webContents.send('key', 'F', getxy())
  })
  globalShortcut.register('C', () => {
    win.webContents.send('key', 'C', getxy())
  })
  globalShortcut.register('M', () => {
    win.webContents.send('key', 'M', getxy())
  })
  globalShortcut.register('K', () => {
    win.webContents.send('key', 'K', getxy())
  })
  globalShortcut.register('Up', () => {
    win.webContents.send('key', 'UP', getxy())
  })
  globalShortcut.register('Down', () => {
    win.webContents.send('key', 'DOWN', getxy())
  })
})

ipcMain.on("synchronous-message", (event, arg) => {

  if(typeof arg === "string") {
    if(arg == "fullscreen") {
      win.setFullScreen(true);
    } else if(arg === "mouseOn") {
      win.setIgnoreMouseEvents(false);
    } else if(arg === "mouseOff") {
      win.setIgnoreMouseEvents(true);
    }
  }

  else if(typeof arg === "object") {
    if(arg.info === "reSize") {
      win.setSize(arg.width, arg.height);
      location = arg.location;
    } else if(arg.info === "ad") {
      shell.openExternal(arg.link);
      win.minimize();
    }
  }

  event.returnValue = arg;
});
