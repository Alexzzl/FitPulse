const KEY_TO_ACTION = new Map([
  ["ArrowUp", "up"],
  ["ArrowDown", "down"],
  ["ArrowLeft", "left"],
  ["ArrowRight", "right"],
  ["Enter", "select"],
  ["NumpadEnter", "select"],
  ["Backspace", "back"],
  ["Escape", "back"],
  ["BrowserBack", "back"],
  ["XF86Back", "back"],
  ["MediaPlayPause", "playPause"],
  ["MediaPlay", "play"],
  ["MediaPause", "pause"],
  ["Space", "playPause"],
]);

const KEYCODE_TO_ACTION = new Map([
  [13, "select"],
  [37, "left"],
  [38, "up"],
  [39, "right"],
  [40, "down"],
  [10009, "back"],
  [27, "back"],
  [8, "back"],
  [19, "playPause"],   // Media Pause
  [415, "play"],       // Media Play
  [412, "pause"],      // Media Pause
  [659, "playPause"],  // Tizen Media PlayPause
]);

export function getRemoteActionFromKey(eventLike) {
  const key = eventLike?.key ?? null;
  const keyCode = eventLike?.keyCode ?? eventLike?.which ?? null;

  if (key && KEY_TO_ACTION.has(key)) {
    return KEY_TO_ACTION.get(key);
  }

  if (typeof keyCode === "number" && KEYCODE_TO_ACTION.has(keyCode)) {
    return KEYCODE_TO_ACTION.get(keyCode);
  }

  return null;
}

export function registerTizenKeys() {
  const inputDevice = globalThis.tizen?.tvinputdevice;
  if (!inputDevice?.registerKey) {
    return;
  }

  ["ColorF0Red", "ColorF1Green", "ColorF2Yellow", "ColorF3Blue", "MediaPlayPause"].forEach(
    (key) => {
      try {
        inputDevice.registerKey(key);
      } catch {
        // Ignore unsupported remote keys during local browser development.
      }
    },
  );
}
