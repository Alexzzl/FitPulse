import assert from "node:assert/strict";
import test from "node:test";

import { createFocusEngine } from "../src/focus-engine.js";

test("focuses default nodes and moves between neighbors", () => {
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

  engine.setActiveScreen("home");
  assert.equal(engine.getCurrentFocusId(), "home-nav");

  engine.move("right");
  assert.equal(engine.getCurrentFocusId(), "home-card");
});

test("preserves last focus when returning to a screen", () => {
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
  engine.move("right");
  engine.setActiveScreen("library");
  engine.setActiveScreen("home");

  assert.equal(engine.getCurrentFocusId(), "home-card");
});
