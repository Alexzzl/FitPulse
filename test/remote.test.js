import assert from "node:assert/strict";
import test from "node:test";

import { getRemoteActionFromKey } from "../src/remote.js";

test("normalizes arrow keys", () => {
  assert.equal(getRemoteActionFromKey({ key: "ArrowUp" }), "up");
  assert.equal(getRemoteActionFromKey({ key: "ArrowDown" }), "down");
  assert.equal(getRemoteActionFromKey({ key: "ArrowLeft" }), "left");
  assert.equal(getRemoteActionFromKey({ key: "ArrowRight" }), "right");
});

test("normalizes select and back keys", () => {
  assert.equal(getRemoteActionFromKey({ key: "Enter" }), "select");
  assert.equal(getRemoteActionFromKey({ keyCode: 10009 }), "back");
  assert.equal(getRemoteActionFromKey({ key: "Escape" }), "back");
});

test("returns null for unsupported keys", () => {
  assert.equal(getRemoteActionFromKey({ key: "a" }), null);
});
