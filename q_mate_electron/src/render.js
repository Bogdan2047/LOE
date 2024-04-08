const fs = require("fs");
const path = require("path");
const { ipcRenderer } = require("electron");

const configPath = path.join(__dirname, "resources/config.json");

const readAndSendConfig = () => {
  fs.readFile(configPath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading config file:", err);
      return;
    }
    const newConfig = JSON.parse(data);
    ipcRenderer.send("config-changed", newConfig);
  });
};

fs.watch(configPath, (event, filename) => {
  if (event === "change") {
    console.log("config.json changed, reloading...");
    readAndSendConfig();
  }
});

readAndSendConfig();
