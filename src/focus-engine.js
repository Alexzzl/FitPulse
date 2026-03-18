export function createFocusEngine() {
  const screens = new Map();
  const lastFocused = new Map();
  let activeScreenId = null;
  let currentFocusId = null;

  function ensureScreen(screenId) {
    if (!screens.has(screenId)) {
      screens.set(screenId, new Map());
    }

    return screens.get(screenId);
  }

  function registerNode(node) {
    ensureScreen(node.screenId).set(node.id, {
      neighbors: {},
      isDefault: false,
      ...node,
    });
  }

  function clearScreen(screenId) {
    ensureScreen(screenId).clear();
    if (activeScreenId === screenId) {
      currentFocusId = null;
    }
  }

  function activate(focusId) {
    if (!activeScreenId) {
      return null;
    }

    const screen = ensureScreen(activeScreenId);
    if (!screen.has(focusId)) {
      return currentFocusId;
    }

    currentFocusId = focusId;
    lastFocused.set(activeScreenId, focusId);
    return currentFocusId;
  }

  function setActiveScreen(screenId) {
    activeScreenId = screenId;

    const screen = ensureScreen(screenId);
    const remembered = lastFocused.get(screenId);
    const defaultNode = [...screen.values()].find((node) => node.isDefault);
    const firstNode = screen.values().next().value ?? null;
    const targetId =
      (remembered && screen.has(remembered) && remembered) ||
      defaultNode?.id ||
      firstNode?.id ||
      null;

    if (targetId) {
      activate(targetId);
    } else {
      currentFocusId = null;
    }

    return currentFocusId;
  }

  function move(direction) {
    if (!activeScreenId || !currentFocusId) {
      return currentFocusId;
    }

    const screen = ensureScreen(activeScreenId);
    const currentNode = screen.get(currentFocusId);
    const nextId = currentNode?.neighbors?.[direction];

    if (nextId && screen.has(nextId)) {
      return activate(nextId);
    }

    return currentFocusId;
  }

  return {
    activate,
    clearScreen,
    getActiveScreenId: () => activeScreenId,
    getCurrentFocusId: () => currentFocusId,
    move,
    registerNode,
    setActiveScreen,
  };
}
