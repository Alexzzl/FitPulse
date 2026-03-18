import assert from "node:assert/strict";
import test from "node:test";

import { createRouter, getScreenId } from "../src/router.js";

test("maps routes to screen ids", () => {
  assert.equal(getScreenId("/classic"), "classic");
  assert.equal(getScreenId("/workout/rest"), "rest");
});

test("router navigates and goes back", () => {
  const router = createRouter("/");

  router.navigate("/home");
  router.navigate("/library");

  assert.deepEqual(router.getHistory(), ["/", "/home", "/library"]);
  assert.equal(router.back("/home"), "/home");
});
