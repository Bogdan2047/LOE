const { app, BrowserWindow, ipcMain, Menu, session } = require("electron");
const fs = require("fs");
const path = require("path");

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["Origin"] = null;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    fullscreen: true,
    webPreferences: {
      sandbox: false,
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // mainWindow.webContents.openDevTools();

  // Menu.setApplicationMenu(null);

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.key === "Escape" && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    }
  });

  if (mainWindow) {
    watchConfigChanges();
  }

  ipcMain.on("config-changed", (event, newConfig) => {
    updateAppParameters(newConfig);
  });
};

function updateAppParameters(newConfig) {
  yourAppParameters = newConfig;

  restartApp();
}

function restartApp() {
  app.relaunch();
  app.exit(0);
}

function watchConfigChanges() {
  const configPath = path.join(
    app.getPath("userData"),
    "src/config/config.json"
  );
  console.log(configPath, "configPath ====>>> ");
  if (fs.existsSync(configPath)) {
    fs.watch(configPath, (eventType, filename) => {
      if (eventType === "change") {
        fs.readFile(configPath, "utf8", (err, data) => {
          if (err) {
            console.error("Error reading config file:", err);
            return;
          }
          const config = JSON.parse(data);
          mainWindow.webContents.send("config-changed", config);
        });
      }
    });
  } else {
    console.error(`Config file not found at path: ${configPath}`);
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
