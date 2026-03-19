import http from "node:http";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

export const HOST = "127.0.0.1";
export const VIEWPORT = { width: 1920, height: 1080 };
export const MAX_BYTES = 500 * 1024;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

export function resolveBrowserPath() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);

  return candidates.find((candidate) => fsSync.existsSync(candidate)) ?? null;
}

export function createStaticServer(rootDir, port) {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${HOST}:${port}`);
      const requestPath = decodeURIComponent(url.pathname);
      const relativePath = requestPath === "/" ? "index.html" : requestPath.slice(1);
      const normalizedPath = path.normalize(relativePath);
      const fullPath = path.resolve(rootDir, normalizedPath);

      if (!fullPath.startsWith(rootDir)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      const stat = await fs.stat(fullPath);
      const filePath = stat.isDirectory() ? path.join(fullPath, "index.html") : fullPath;
      const extension = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[extension] || "application/octet-stream";
      const data = await fs.readFile(filePath);

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
    }
  });
}

export async function waitForJson(url, timeoutMs = 10000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch {
      // Browser not ready yet.
    }

    await delay(200);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

export function createCdpClient(wsUrl) {
  const socket = new WebSocket(wsUrl);
  const pending = new Map();
  let nextId = 1;

  const openPromise = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    if (!payload.id || !pending.has(payload.id)) {
      return;
    }

    const { resolve, reject } = pending.get(payload.id);
    pending.delete(payload.id);

    if (payload.error) {
      reject(new Error(payload.error.message));
    } else {
      resolve(payload.result);
    }
  });

  const send = async (method, params = {}) => {
    await openPromise;
    const id = nextId++;

    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  };

  return {
    send,
    async close() {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    },
  };
}

export async function evaluate(cdp, expression, awaitPromise = true) {
  return cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise,
    returnByValue: true,
  });
}

export async function waitForCondition(cdp, conditionJs, timeoutMs = 10000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const result = await evaluate(cdp, `Boolean(${conditionJs})`);
    if (result?.result?.value === true) {
      return;
    }

    await delay(150);
  }

  throw new Error(`Timed out waiting for condition: ${conditionJs}`);
}

export async function waitForAppReady(cdp) {
  await evaluate(
    cdp,
    `
      new Promise(resolve => {
        const done = () => {
          const root = document.getElementById("root");
          const ready = Boolean(
            globalThis.__FITPULSE_READY__
            && globalThis.__FITPULSE_APP__
            && root
            && root.dataset
            && root.dataset.screen
          );

          if (ready) {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve(true)));
            return;
          }

          setTimeout(done, 100);
        };

        done();
      })
    `,
  );
}

export async function ensureCleanDirectory(outputDir) {
  await fs.mkdir(outputDir, { recursive: true });
  const existingFiles = await fs.readdir(outputDir);

  await Promise.all(
    existingFiles
      .filter((name) => name.toLowerCase().endsWith(".jpg"))
      .map((name) => fs.unlink(path.join(outputDir, name))),
  );
}

export async function launchBrowser(debugPort) {
  const browserPath = resolveBrowserPath();
  if (!browserPath) {
    throw new Error("Chrome or Edge executable not found. Set CHROME_PATH and retry.");
  }

  const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), "fitpulse-capture-"));
  const browser = spawn(
    browserPath,
    [
      "--headless=new",
      "--disable-gpu",
      "--autoplay-policy=no-user-gesture-required",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--remote-allow-origins=*",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${userDataDir}`,
      `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  return {
    browser,
    userDataDir,
  };
}

export async function connectToBrowser(debugPort) {
  const targets = await waitForJson(`http://${HOST}:${debugPort}/json/list`);
  const pageTarget = targets.find((target) => target.type === "page");
  if (!pageTarget?.webSocketDebuggerUrl) {
    throw new Error("Could not find a debuggable page target.");
  }

  const cdp = createCdpClient(pageTarget.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: VIEWPORT.width,
    height: VIEWPORT.height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      Math.random = () => 0;
      Date.now = () => 1773878400000;
      window.__FITPULSE_CAPTURE__ = true;
    `,
  });

  return cdp;
}

export async function openApp(cdp, port) {
  await cdp.send("Page.navigate", { url: `http://${HOST}:${port}/index.html` });
  await waitForAppReady(cdp);
}

export async function navigateApp(cdp, route, partialState = {}, extraJs = "") {
  const routeJson = JSON.stringify(route);
  const stateJson = JSON.stringify(partialState);

  await evaluate(
    cdp,
    `
      (() => {
        const app = globalThis.__FITPULSE_APP__;
        if (!app || typeof app.navigateTo !== "function") {
          throw new Error("FitPulse app debug API is not available.");
        }

        app.navigateTo(${routeJson}, { replace: true }, ${stateJson});

        ${extraJs}

        return true;
      })()
    `,
  );

  await waitForCondition(
    cdp,
    `document.getElementById("root")?.dataset?.route === ${routeJson}`,
  );
  await delay(250);
}

export async function captureCurrentView(cdp, outputPath) {
  const qualityLevels = [85, 78, 72, 66, 60, 54];

  for (const quality of qualityLevels) {
    const { data } = await cdp.send("Page.captureScreenshot", {
      format: "jpeg",
      quality,
      captureBeyondViewport: false,
      clip: {
        x: 0,
        y: 0,
        width: VIEWPORT.width,
        height: VIEWPORT.height,
        scale: 1,
      },
    });

    const buffer = Buffer.from(data, "base64");
    await fs.writeFile(outputPath, buffer);

    if (buffer.byteLength <= MAX_BYTES) {
      return buffer.byteLength;
    }
  }

  const stat = await fs.stat(outputPath);
  return stat.size;
}

export async function closeBrowserResources(server, cdp, browser, userDataDir) {
  if (cdp) {
    await cdp.close();
  }

  if (server) {
    server.close();
  }

  if (browser && !browser.killed) {
    await new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };

      browser.once("close", finish);
      browser.kill();
      setTimeout(finish, 1000);
    });
  }

  if (userDataDir) {
    try {
      await fs.rm(userDataDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    } catch {
      // Windows can keep the browser lockfile for a short time; ignore cleanup failures.
    }
  }
}
