import fs from "fs";
import path from "path";

const writeLog = (e) => {
  if (!e) return;
  const configFilesFolderPath = "q_mate_electron/logs.json";
  const normolizePath = path.normalize(process.env.APPDATA);
  const pathConfig = path.join(normolizePath, configFilesFolderPath);

  const pathStr = path.join(pathConfig);

  const logs = parseDataFile(pathStr, []);
  const data = JSON.stringify(e, null, 2);
  const date = new Date()
  const err = { time: date.toString(), data };
  fs.writeFileSync(pathStr, JSON.stringify([...logs, err], null, 2));
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return [ ...defaults ];
  }
}
