/**
 * Network Monitor for Tizen TV
 * Monitors network connection status and shows error popup when disconnected
 */

let isNetworkOnline = true;
let popupElement = null;
let hideTimeout = null;
const POPUP_AUTO_HIDE_DELAY = 8000; // 8 seconds auto-hide

/**
 * Check if network is currently online
 * Uses Tizen API if available, falls back to navigator.onLine
 */
function checkNetworkStatus() {
  // Tizen API - more reliable for TV
  if (globalThis.tizen && globalThis.tizen.systeminfo) {
    try {
      const value = tizen.systeminfo.get("NETWORK");
      return value && (value.networkType !== "NONE" || value.status === "CONNECTED");
    } catch (e) {
      console.warn("Tizen systeminfo check failed:", e);
    }
  }

  // Fallback to standard API
  return navigator.onLine;
}

/**
 * Create and show the network error popup
 */
function showNetworkErrorPopup() {
  // Prevent duplicate popups
  if (popupElement) {
    resetAutoHide();
    return;
  }

  // Create popup element
  popupElement = document.createElement("div");
  popupElement.id = "network-error-popup";
  popupElement.className = "network-popup";
  popupElement.innerHTML = `
    <div class="network-popup__content">
      <div class="network-popup__icon">&#9888;</div>
      <h2 class="network-popup__title">Network Disconnected</h2>
      <p class="network-popup__message">Please check your network connection and try again.</p>
      <button type="button" class="network-popup__button" id="network-popup-ok">OK</button>
    </div>
  `;

  document.body.appendChild(popupElement);

  // Add OK button handler
  const okButton = popupElement.querySelector("#network-popup-ok");
  okButton.addEventListener("click", hideNetworkErrorPopup);
  okButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      hideNetworkErrorPopup();
    }
  });

  // Focus the OK button for remote control
  setTimeout(() => {
    okButton.focus();
  }, 100);

  // Auto-hide after delay
  resetAutoHide();

  // Trigger animation
  requestAnimationFrame(() => {
    popupElement.classList.add("is-visible");
  });
}

/**
 * Hide the network error popup
 */
function hideNetworkErrorPopup() {
  if (!popupElement) return;

  clearTimeout(hideTimeout);
  hideTimeout = null;

  popupElement.classList.remove("is-visible");

  // Remove after animation completes
  setTimeout(() => {
    if (popupElement && popupElement.parentNode) {
      popupElement.parentNode.removeChild(popupElement);
    }
    popupElement = null;
  }, 300);
}

/**
 * Reset the auto-hide timer
 */
function resetAutoHide() {
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    hideNetworkErrorPopup();
  }, POPUP_AUTO_HIDE_DELAY);
}

/**
 * Handle network status change
 */
function handleNetworkChange() {
  const wasOnline = isNetworkOnline;
  isNetworkOnline = checkNetworkStatus();

  console.log(`[NetworkMonitor] Status changed: ${wasOnline ? "ONLINE" : "OFFLINE"} -> ${isNetworkOnline ? "ONLINE" : "OFFLINE"}`);

  // Show popup only when transitioning from ONLINE to OFFLINE
  if (wasOnline && !isNetworkOnline) {
    showNetworkErrorPopup();
  }

  // Dispatch custom event for app to react
  window.dispatchEvent(new CustomEvent("networkstatuschange", {
    detail: { isOnline: isNetworkOnline }
  }));
}

/**
 * Initialize network monitoring
 * Sets up event listeners for online/offline events
 * Also sets up Tizen-specific network listeners if available
 */
export function initNetworkMonitor() {
  // Initial status check
  isNetworkOnline = checkNetworkStatus();
  console.log(`[NetworkMonitor] Initial status: ${isNetworkOnline ? "ONLINE" : "OFFLINE"}`);

  // Standard web API event listeners
  window.addEventListener("online", handleNetworkChange);
  window.addEventListener("offline", handleNetworkChange);

  // Tizon-specific network listener (more reliable)
  if (globalThis.tizen && globalThis.tizen.systeminfo) {
    try {
      tizen.systeminfo.addPropertyValueChangeListener(
        "NETWORK",
        function (propertyValue) {
          handleNetworkChange();
        },
        { highThreshold: 0, lowThreshold: 0 },
        function (error) {
          console.warn("[NetworkMonitor] Tizen listener error:", error);
        }
      );
      console.log("[NetworkMonitor] Tizen systeminfo listener added");
    } catch (e) {
      console.warn("[NetworkMonitor] Failed to add Tizen listener:", e);
    }
  }

  // Periodic polling as fallback (every 5 seconds)
  setInterval(() => {
    const currentStatus = checkNetworkStatus();
    if (currentStatus !== isNetworkOnline) {
      handleNetworkChange();
    }
  }, 5000);

  console.log("[NetworkMonitor] Initialized successfully");
}

/**
 * Get current network status
 */
export function getNetworkStatus() {
  return isNetworkOnline;
}

/**
 * Manually trigger a network status check (useful after operations that might affect network)
 */
export function checkNetwork() {
  handleNetworkChange();
}
