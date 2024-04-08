const electron = require("electron");
const path = require("path");
const fs = require("fs");
let instanceStore = null;

class Store {
  constructor(opts) {
    // TODO: write proper name of application
    const configFilesFolderPath = "q_mate_electron/config.json";
    const normolizePath = path.normalize(process.env.APPDATA);
    const pathConfig = path.join(normolizePath, configFilesFolderPath);
    console.log("pathConfig => ", pathConfig);

    // const userDataPath = (electron.app || electron.remote.app).getPath('userData');

    this.path = path.join(pathConfig);

    this.data = parseDataFile(this.path, opts.defaults);
    if (!this.data.foundFile) {
      this.set("foundFile", true);
    }
    console.log("this.data", this.data);
    instanceStore = this;
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    console.log(this.path);
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return { ...defaults, foundFile: false };
  }
}

function initStore(opts) {
  if (instanceStore) {
    return instanceStore;
  } else {
    return new Store(opts);
  }
}

module.exports = initStore;
