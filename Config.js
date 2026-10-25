// Public browser configuration.
// Only keys that are safe to expose in client-side code belong here.
// The Groq key lives on the server (Vercel environment variable: GROQ_API_KEY).
const CONFIG = {
  weatherApiKey: "",
  apiKey: "",
  baseUrl: "https://api.groq.com/openai/v1",
  model: "openai/gpt-oss-20b"
};

function parseEnv(text) {
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

  return values;
}

function loadScript(src) {
  return new Promise(function (resolve) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });
}

async function readEnvFile(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    return {};
  }
  return parseEnv(await response.text());
}

CONFIG.ready = (async function loadApiKeys() {
  await loadScript("config.keys.js");

  if (window.__WEATHER_API_KEY) {
    CONFIG.weatherApiKey = window.__WEATHER_API_KEY;
  }
  if (window.__CHAT_API_KEY) {
    CONFIG.apiKey = window.__CHAT_API_KEY;
  }

  if (!CONFIG.weatherApiKey) {
    try {
      const weatherEnv = await readEnvFile("API.env");
      CONFIG.weatherApiKey = weatherEnv.API_KEY || "";
    } catch (error) {
      CONFIG.weatherApiKey = "";
    }
  }

  if (!CONFIG.apiKey) {
    try {
      const chatEnv = await readEnvFile("API2.env");
      CONFIG.apiKey = chatEnv.API_KEY || "";
    } catch (error) {
      CONFIG.apiKey = "";
    }
  }
})();
=======
  weatherApiKey: "ec94c48f526a9bb4e3d8211ee9d9cf5d",
};
>>>>>>> 60b8458 (Updates Added)
