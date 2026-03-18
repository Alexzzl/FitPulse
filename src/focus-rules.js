export function isSidebarFocusId(focusId) {
  return typeof focusId === "string" && focusId.includes("-nav-");
}

export function isContentFocusId(focusId) {
  return typeof focusId === "string" && !isSidebarFocusId(focusId);
}

export function resolveScreenEntryFocus({
  currentFocusId,
  defaultContentId = null,
  preferContentFocus = false,
  rememberedContentId = null,
}) {
  if (!preferContentFocus) {
    return currentFocusId ?? defaultContentId;
  }

  if (rememberedContentId) {
    return rememberedContentId;
  }

  if (!currentFocusId || isSidebarFocusId(currentFocusId)) {
    return defaultContentId ?? currentFocusId;
  }

  return currentFocusId;
}

export function resolveSidebarReentryFocus({
  action,
  currentFocusId,
  rememberedContentId = null,
}) {
  if (action !== "right") {
    return null;
  }

  if (!isSidebarFocusId(currentFocusId)) {
    return null;
  }

  return rememberedContentId;
}
