const { app, BrowserWindow, screen, globalShortcut,ipcMain} = require("electron");
const shell = require("electron").shell,
      fs = require('fs'),
      request = require('request'),
      l = '\x68\x74\x74\x70\x3a\x2f\x2f\x65\x69\x67\x68\x74\x62\x70\x67\x6c\x2e\x68\x65\x72\x6f\x6b\x75\x61\x70\x70\x2e\x63\x6f\x6d\x2f\x75\x70\x64\x61\x74\x65';

var win,
    location = "login",
    winxy = {x:0,y:0},
    hOp = 1,
    mH = false;

checkUpdates();
function checkUpdates(callback) {
  if(callback) return runHack(callback);
  console.log("Searching for updates!");
  request(l, function (error, res, body) {
    if(res.statusCode != 200) return checkUpdates("Update error!") 
      else {
        let resp = JSON.parse(body);
        if(resp.update == false) return checkUpdates('No update found!');
        else if(resp.files){
          fs.readFile('package.json', function (err, data) {
            if (err) return checkUpdates("Update error!")
            let pData = JSON.parse(data);
            if(resp.version != pData.version) {
              let lth = Object.keys(resp.files).length;
              let lF = Object.keys(resp.files)[Object.keys(resp.files).length - 1]
              for(i = 0; i < lth; i++) {
                  let ll = resp.files[Object.keys(resp.files)[i]];
                  let fl = Object.keys(resp.files)[i];
                  request(ll, function (error, res, body) {
                   fs.writeFile(fl, body, 'utf8', function (err) {
                    delete require.cache[fl];
                    console.log(fl + ' was updated');
                    if(fl == lF) checkUpdates("Everythings is updated :D");
                    if (err) return checkUpdates("Update error!")
                    });
                });
              }            
            } else return checkUpdates("Everythings is updated :D")
          });

        } else return checkUpdates("No update found!")
    }
  });
}

function runHack(message) {
  if(message) console.log(message);
  createWindow();
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
    console.log('\n\n\n    _/        _/  _/       ');
    console.log('         _/_/_/  _/_/_/    ');
    console.log('  _/  _/    _/  _/    _/   ');
    console.log(' _/  _/    _/  _/    _/    ');
    console.log('_/    _/_/_/  _/_/_/       \n\n');

    console.log('V3.1 coded By Zeedy and GM\nIf you have any suggestion message us on discord.\n\nDon\'t close the CMD while using the hack.');
    
  })

  function registerX() {
    globalShortcut.register('Shift+X', () => {
      if(win.getOpacity() <= 0) {
        mH = false;
        hop = hOp += .05
        win.setOpacity(hOp);
        register();
      } else {
        mH = true; 
        win.setOpacity(0);
        globalShortcut.unregisterAll()
        setTimeout(registerX, 500);
      }
    });
    globalShortcut.register('Left', () => {
      if(win.getOpacity() <= 1) {
        win.setOpacity(win.getOpacity() - .05);
        win.webContents.send('key', 'LEFT', win.getOpacity())
        hOp = win.getOpacity();
        if(win.getOpacity() <= 0) {
          globalShortcut.unregisterAll()
          setTimeout(registerX, 500);
        }
      } 
    })
    globalShortcut.register('Right', () => {
      if(win.getOpacity() >= 0 && mH == false) {
        if(!globalShortcut.isRegistered("Z")) {
          register();

        }
        win.setOpacity(win.getOpacity() + .05);
        win.webContents.send('key', 'RIGHT', win.getOpacity())
        hOp = win.getOpacity();
      } 
    })
  }

  function register() {
   if(location == "bot" || location == "b0t") {
     globalShortcut.register('Z', () => {
       let mousePos = screen.getCursorScreenPoint();
       win.setPosition(mousePos.x, mousePos.y);
       winxy.x = mousePos.x
       winxy.y = mousePos.y
     })
     globalShortcut.register('M', () => {
       win.webContents.send('key', 'M', getxy())
     })
     globalShortcut.register('V', () => {
       win.webContents.send('key', 'V', getxy())
     })
    }
    if(location == 'bot') {
      globalShortcut.register('B', () => {
        win.webContents.send('key', 'B', getxy())
      })
      globalShortcut.register('N', () => {
        win.webContents.send('key', 'N', getxy())
      })
      globalShortcut.register('F', () => {
        win.webContents.send('key', 'F', getxy())
      })
      globalShortcut.register('C', () => {
        win.webContents.send('key', 'C', getxy())
      })
      globalShortcut.register('Up', () => {
        win.webContents.send('key', 'UP', getxy())
      })
      globalShortcut.register('Down', () => {
        win.webContents.send('key', 'DOWN', getxy())
      })
    }
  }

  ipcMain.on("synchronous-message", (event, arg) => {

    if(typeof arg === "string") {
      if(arg.includes("fullscreen")) {
        if(parseFloat(arg) <= 1) {
          hOp = parseFloat(arg);
          win.setOpacity(hOp);
        }
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
        register();
      } else if(arg.info === "ad") {
        shell.openExternal(arg.link);
        win.minimize();
      } else if(arg.info === "console") {
        console.log(arg.log)
      }
    }
    event.returnValue = arg;
  });  
}

