const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const initStore = require("./store");
const initConfig = require("./config/config.json");

contextBridge.exposeInMainWorld("electronAPI", {
  store: initStore({ configName: "config", defaults: initConfig ?? {} }),
  loadConfig: (callback) => {
    fs.readFile(
      path.join(__dirname, "config/config.json"),
      "utf8",
      (err, data) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, JSON.parse(data));
      }
    );
  },
  onConfigChanged: (callback) => ipcRenderer.on("config-changed", callback),
  removeConfigListener: (callback) =>
    ipcRenderer.removeListener("config-changed", callback),
});
