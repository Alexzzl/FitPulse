const ROUTE_TO_SCREEN = new Map([
  ["/", "welcome"],
  ["/profile-ready", "profile-ready"],
  ["/home", "home"],
  ["/library", "library"],
  ["/classic", "classic"],
  ["/me", "profile"],
  ["/history", "history"],
  ["/plan/abs-of-steel", "plan-calendar"],
  ["/plan/abs-of-steel/day/5", "day-detail"],
  ["/workout/get-ready", "get-ready"],
  ["/workout/player", "workout-player"],
  ["/workout/rest", "rest"],
  ["/workout/complete", "workout-complete"],
]);

export function getScreenId(route) {
  return ROUTE_TO_SCREEN.get(route) ?? "welcome";
}

export function createRouter(initialRoute = "/") {
  let currentRoute = initialRoute;
  const history = [initialRoute];

  return {
    back(fallback = "/home") {
      if (history.length > 1) {
        history.pop();
        currentRoute = history.at(-1);
        return currentRoute;
      }

      currentRoute = fallback;
      history[0] = fallback;
      return currentRoute;
    },

    getCurrentRoute() {
      return currentRoute;
    },

    getHistory() {
      return [...history];
    },

    navigate(route, { replace = false } = {}) {
      if (replace) {
        history[history.length - 1] = route;
      } else if (currentRoute !== route) {
        history.push(route);
      }

      currentRoute = route;
      return currentRoute;
    },
  };
}
