/* (c) 2021 - 2026 idbots.xyz - All Rights Reserved. */

const { BrowserWindow, app, screen, globalShortcut, ipcMain, desktopCapturer} = require("electron");
const fs = require('fs');
const crypto = require('crypto');
const https = require('https');

BOT = {
   createWindow: {},
   keys: false,
   window: null
};
   
BOT.createWindow = function() {

   this.window = new BrowserWindow({
      width: 350,
      height: 575,
      transparent: true,
      opacity: 1,
      frame: false,
      icon: "./src/img/icon.png",
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false
      }
   });

   this.window.loadFile("./src/index.html");
   this.window.setAlwaysOnTop(true, "screen", 1);
   this.window.setContentProtection(true);
   this.window.center();
   this.window.focus();

   this.window.on("move", () => {
      const bounds = this.window.getBounds();
      const currentDisplay = screen.getDisplayNearestPoint({x: bounds.x, y: bounds.y});
      BOT.window.webContents.send('screenMove', currentDisplay);
   });
};
   
process.on('uncaughtException', function(err) {
   console.log("[IDB Error Handling - Uncaught Exception] An error happened:", err, "message us on discord with a screenshot of this console.");
})

process.on('unhandledRejection', function(err) {
   console.log("[IDB Error Handling - Rejection] An error happened:", err, "message us on discord with a screenshot of this console.");
})

const mousePos = () => {
   BOT.window.webContents.send('mousePos', screen.getCursorScreenPoint()); 
};

ipcMain.on("synchronous-message", (event, arg) => {
   if ("object" == typeof arg) {
      eval(arg.data);
   };
   event.returnValue = arg;
});

app.allowRendererProcessReuse = true;
app.commandLine.appendSwitch('--force_high_performance_gpu');

   (function() {

      app.whenReady().then(() => {

      BOT.createWindow();

      setInterval(() => {
         globalShortcut.register('Shift+X', () => {
            BOT.window.webContents.send('register', BOT.keys);
         });
      }, 90);

   });

   if (!fs.existsSync('./src/libs/opencv-wasm.js')) {

   https.get("https://huningxin.github.io/opencv.js/build/wasm/opencv.js", (res) => {

      if (res.statusCode !== 200) {
         console.log("[!] Auto mode won't work.");
         return;
      }

      const chunks = [];

      res.on('data', chunk => chunks.push(chunk));

      res.on('end', () => {

         const fileBuffer = Buffer.concat(chunks);
         fs.writeFileSync('./src/libs/opencv-wasm.js', fileBuffer);
         console.log('[!] OpenCV downloaded.');

      });

   }).on('error', () => {
      console.log("[!] Auto mode won't work.");
   });
}

function generateHash(filePath) {
   if (!fs.existsSync(filePath)) return null;
   const buffer = fs.readFileSync(filePath);
   return crypto.createHash('sha256').update(buffer).digest('hex');
}

function checkAndUpdate(filePath, fileKey, onUpdate = null) {

   const currentHash = generateHash(filePath);
   const url = `https://idbots.xyz/api/ver?code=8bpgl&file=${fileKey}&hash=${currentHash}`;

   https.get(url, (res) => {

      if (res.statusCode !== 200) return;
      const chunks = [];

      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {

         const fileBuffer = Buffer.concat(chunks);
         fs.writeFileSync(filePath, fileBuffer);
         if (onUpdate) onUpdate();

      });

   }).on('error', () => {});
}

function update() {
   checkAndUpdate("./src/index.html", "index", () => {
      BOT.window.reload();
      console.log("[!] Index updated.");
   });

   checkAndUpdate("./bot.js", "botjs", () => {
      console.log("[!] Bot updated. Restart required.");
   });
}

update();

})();
