import fs from "node:fs/promises";
import path from "node:path";

import {
  HOST,
  captureCurrentView,
  closeBrowserResources,
  connectToBrowser,
  createStaticServer,
  ensureCleanDirectory,
  launchBrowser,
  navigateApp,
  openApp,
} from "./capture-common.mjs";

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, "store-screenshots");
const SERVER_PORT = 4183;
const DEBUG_PORT = 9232;

const shots = [
  {
    name: "01-home-dashboard.jpg",
    route: "/home",
    state: {
      audioOn: true,
      selectedBodyPart: "Fullbody",
      selectedDay: 5,
      workoutIndex: 0,
    },
  },
  {
    name: "02-library-explore.jpg",
    route: "/library",
    state: {
      selectedBodyPart: "Fullbody",
    },
  },
  {
    name: "03-classic-programs.jpg",
    route: "/classic",
    state: {},
  },
  {
    name: "04-workout-player.jpg",
    route: "/workout/player",
    state: {
      selectedDay: 5,
      workoutIndex: 0,
    },
  },
];

async function main() {
  await ensureCleanDirectory(OUTPUT_DIR);

  const server = createStaticServer(ROOT_DIR, SERVER_PORT);
  await new Promise((resolve) => server.listen(SERVER_PORT, HOST, resolve));

  let cdp = null;
  let browser = null;
  let userDataDir = null;

  try {
    const launched = await launchBrowser(DEBUG_PORT);
    browser = launched.browser;
    userDataDir = launched.userDataDir;

    cdp = await connectToBrowser(DEBUG_PORT);
    await openApp(cdp, SERVER_PORT);

    for (const shot of shots) {
      await navigateApp(cdp, shot.route, shot.state);
      const filePath = path.join(OUTPUT_DIR, shot.name);
      const fileSize = await captureCurrentView(cdp, filePath);
      const kb = (fileSize / 1024).toFixed(1);
      console.log(`${shot.name} ${kb}KB`);
    }

    const files = await fs.readdir(OUTPUT_DIR);
    console.log(`saved=${OUTPUT_DIR}`);
    console.log(`count=${files.filter((name) => name.endsWith(".jpg")).length}`);
  } finally {
    await closeBrowserResources(server, cdp, browser, userDataDir);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
