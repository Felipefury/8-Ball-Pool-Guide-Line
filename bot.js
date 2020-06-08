const { app, BrowserWindow, screen, globalShortcut,ipcMain} = require("electron");
const shell = require("electron").shell;

let win;
let location = "login"
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

  console.log('V3.1 coded By Zeedy and GM\nIf you have any suggestion message us on discord.\n\nDon\'t close the CMD while using the hack.');
  
})

function registerX() {
  globalShortcut.register('Shift+X', () => {
    if(win.getOpacity() <= 0) {
      win.setOpacity(1);
      register();
    } else { 
      win.setOpacity(0);
      globalShortcut.unregisterAll()
      setTimeout(registerX, 500);
    }
  });
}

function register() {
  globalShortcut.register('Z', () => {
    let mousePos = screen.getCursorScreenPoint();
    win.setPosition(mousePos.x, mousePos.y);
    winxy.x = mousePos.x
    winxy.y = mousePos.y
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
    globalShortcut.register('Left', () => {
      if(win.getOpacity() <= 1) {
        win.setOpacity(win.getOpacity() - .05);
        win.webContents.send('key', 'LEFT', win.getOpacity())
      } 
  })
    globalShortcut.register('Right', () => {
      if(win.getOpacity() >= 0) {
        win.setOpacity(win.getOpacity() + .05);
        win.webContents.send('key', 'RIGHT', win.getOpacity())
      } 
  })
}

ipcMain.on("synchronous-message", (event, arg) => {

  if(typeof arg === "string") {
    if(arg == "fullscreen") {
      win.setFullScreen(true);
      location = 'bot';
      register();
      registerX();
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
      if(location == 'bot') register();
    } else if(arg.info === "ad") {
      shell.openExternal(arg.link);
      win.minimize();
    } else if(arg.info === "console") {
        console.log(arg.log)
      }
  }

  event.returnValue = arg;
});
