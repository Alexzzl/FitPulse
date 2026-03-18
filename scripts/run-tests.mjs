import assert from "node:assert/strict";

import { createFocusEngine } from "../src/focus-engine.js";
import { resolveScreenEntryFocus, resolveSidebarReentryFocus } from "../src/focus-rules.js";
import { getRemoteActionFromKey } from "../src/remote.js";
import { createRouter, getScreenId } from "../src/router.js";
import { getSidebarIconSet } from "../src/sidebar-icons.js";

const results = [];

function run(name, fn) {
  try {
    fn();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ error, name, ok: false });
  }
}

run("remote keys normalize correctly", () => {
  assert.equal(getRemoteActionFromKey({ key: "ArrowUp" }), "up");
  assert.equal(getRemoteActionFromKey({ key: "ArrowDown" }), "down");
  assert.equal(getRemoteActionFromKey({ key: "Enter" }), "select");
  assert.equal(getRemoteActionFromKey({ keyCode: 10009 }), "back");
  assert.equal(getRemoteActionFromKey({ key: "a" }), null);
});

run("focus engine keeps last focused item per screen", () => {
  const engine = createFocusEngine();

  engine.registerNode({
    id: "home-nav",
    screenId: "home",
    neighbors: { right: "home-card" },
    isDefault: true,
  });
  engine.registerNode({
    id: "home-card",
    screenId: "home",
    neighbors: { left: "home-nav" },
  });
  engine.registerNode({
    id: "library-nav",
    screenId: "library",
    neighbors: {},
    isDefault: true,
  });

  engine.setActiveScreen("home");
  assert.equal(engine.getCurrentFocusId(), "home-nav");
  engine.move("right");
  assert.equal(engine.getCurrentFocusId(), "home-card");
  engine.setActiveScreen("library");
  assert.equal(engine.getCurrentFocusId(), "library-nav");
  engine.setActiveScreen("home");
  assert.equal(engine.getCurrentFocusId(), "home-card");
});

run("router maps screen ids and tracks history", () => {
  const router = createRouter("/");

  assert.equal(getScreenId("/classic"), "classic");
  assert.equal(getScreenId("/workout/rest"), "rest");

  router.navigate("/home");
  router.navigate("/library");
  assert.deepEqual(router.getHistory(), ["/", "/home", "/library"]);
  assert.equal(router.back("/home"), "/home");
});

run("sidebar icon sets exist for all main route groups", () => {
  const routes = ["/home", "/library", "/classic", "/me"];

  for (const route of routes) {
    const iconSet = getSidebarIconSet(route);
    assert.ok(iconSet.brand);
    assert.ok(iconSet.items.home);
    assert.ok(iconSet.items.library);
    assert.ok(iconSet.items.classic);
    assert.ok(iconSet.items.me);
  }
});

run("screen entry prefers remembered content focus over sidebar focus", () => {
  const target = resolveScreenEntryFocus({
    currentFocusId: "home-nav-home",
    defaultContentId: "home-resume",
    preferContentFocus: true,
    rememberedContentId: "home-rec-2",
  });

  assert.equal(target, "home-rec-2");
});

run("screen entry falls back to default content when only sidebar focus exists", () => {
  const target = resolveScreenEntryFocus({
    currentFocusId: "library-nav-library",
    defaultContentId: "library-body-4",
    preferContentFocus: true,
    rememberedContentId: null,
  });

  assert.equal(target, "library-body-4");
});

run("sidebar right movement re-enters remembered content focus", () => {
  const target = resolveSidebarReentryFocus({
    action: "right",
    currentFocusId: "classic-nav-classic",
    rememberedContentId: "classic-plan-2",
  });

  assert.equal(target, "classic-plan-2");
});

const failed = results.filter((result) => !result.ok);

results.forEach((result) => {
  if (result.ok) {
    console.log(`PASS ${result.name}`);
    return;
  }

  console.error(`FAIL ${result.name}`);
  console.error(result.error);
});

if (failed.length > 0) {
  process.exitCode = 1;
} else {
  console.log(`All ${results.length} checks passed.`);
}
