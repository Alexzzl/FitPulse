import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [, , inputDir = ".", inputPort = "4173", mode] = process.argv;
const rootDir = path.resolve(process.cwd(), inputDir);
const port = Number(inputPort);
const host = "127.0.0.1";

const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"],
]);

function getContentType(filePath) {
  return MIME_TYPES.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

async function resolvePath(urlPathname) {
  const decodedPath = decodeURIComponent(urlPathname.split("?")[0]);
  const safeRelative = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
  const candidate = path.resolve(rootDir, safeRelative);

  if (!candidate.startsWith(rootDir)) {
    return null;
  }

  try {
    const fileStat = await stat(candidate);
    if (fileStat.isDirectory()) {
      return path.join(candidate, "index.html");
    }

    return candidate;
  } catch {
    return path.join(rootDir, "index.html");
  }
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host}`);
  const filePath = await resolvePath(requestUrl.pathname);

  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  try {
    await access(filePath);
    response.writeHead(200, { "Content-Type": getContentType(filePath) });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
  }
});

server.listen(port, host, async () => {
  const url = `http://${host}:${port}`;
  console.log(`Serving ${rootDir} at ${url}`);

  if (mode === "--smoke") {
    try {
      const response = await fetch(url);
      console.log(`Smoke check: ${response.status} ${response.headers.get("content-type")}`);
    } finally {
      server.close();
    }
  }
});

server.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});
