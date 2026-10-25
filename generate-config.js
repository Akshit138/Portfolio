const fs = require("fs");
const path = require("path");

function readApiKey(fileName) {
  const filePath = path.join(__dirname, fileName);
  const text = fs.readFileSync(filePath, "utf8");
  const values = {};

  text.split(/\r?\n/).forEach(function (line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const index = trimmed.indexOf("=");
    if (index === -1) {
      return;
    }

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  });

  return values.API_KEY || "";
}

const weatherKey = readApiKey("API.env");
const chatKey = readApiKey("API2.env");

const contents =
  "window.__WEATHER_API_KEY = " + JSON.stringify(weatherKey) + ";\n" +
  "window.__CHAT_API_KEY = " + JSON.stringify(chatKey) + ";\n";

fs.writeFileSync(path.join(__dirname, "config.keys.js"), contents);
console.log("Wrote config.keys.js from API.env and API2.env");
