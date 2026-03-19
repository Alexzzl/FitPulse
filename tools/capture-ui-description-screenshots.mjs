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
const OUTPUT_DIR = path.join(ROOT_DIR, "ui-description-screenshots");
const SERVER_PORT = 4184;
const DEBUG_PORT = 9233;

const shots = [
  {
    name: "05-welcome-setup.jpg",
    route: "/",
    state: {},
  },
  {
    name: "06-history-screen.jpg",
    route: "/history",
    state: {
      selectedDay: 5,
    },
  },
  {
    name: "07-plan-calendar.jpg",
    route: "/plan/abs-of-steel",
    state: {
      selectedDay: 5,
    },
  },
  {
    name: "08-day-detail.jpg",
    route: "/plan/abs-of-steel/day/5",
    state: {
      selectedDay: 5,
    },
  },
  {
    name: "09-workout-complete.jpg",
    route: "/workout/complete",
    state: {
      selectedDay: 5,
      currentWorkoutCalories: 178,
      currentWorkoutDuration: 15,
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
