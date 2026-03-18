import { copyFile, cp, lstat, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const entries = ["assets", "config.xml", "icon.png", "index.html", "src"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const entry of entries) {
  const source = path.join(root, entry);
  const target = path.join(dist, entry);
  const stat = await lstat(source);

  if (stat.isDirectory()) {
    await cp(source, target, { recursive: true });
  } else {
    await copyFile(source, target);
  }
}

console.log("Static Tizen bundle ready in dist/");
