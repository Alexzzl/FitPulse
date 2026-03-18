import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const entries = ["assets", "config.xml", "icon.png", "index.html", "src"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const entry of entries) {
  await cp(path.join(root, entry), path.join(dist, entry), { recursive: true });
}

console.log("Static Tizen bundle ready in dist/");
