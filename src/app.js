import { appData } from "./data.js";
import { createFocusEngine } from "./focus-engine.js";
import {
  isContentFocusId,
  resolveScreenEntryFocus,
  resolveSidebarReentryFocus,
} from "./focus-rules.js";
import { getRemoteActionFromKey, registerTizenKeys } from "./remote.js";
import { getScreenId, createRouter } from "./router.js";
import { getSidebarIconSet } from "./sidebar-icons.js";

function createActionMap(entries) {
  return new Map(entries.filter(([, action]) => typeof action === "function"));
}

function createSidebarItems() {
  return [
    { id: "home", icon: "HOME", label: "Home", route: "/home" },
    { id: "library", icon: "LIBRARY", label: "Library", route: "/library" },
    { id: "classic", icon: "CLASSIC", label: "Classic", route: "/classic" },
    { id: "me", icon: "ME", label: "Me", route: "/me" },
  ];
}

function routeForSidebar(route) {
  if (route === "/history") {
    return "/me";
  }

  if (route === "/plan/abs-of-steel" || route === "/plan/abs-of-steel/day/5") {
    return "/classic";
  }

  return route;
}

function renderSidebar(screenId, activeRoute) {
  const items = createSidebarItems();
  const iconSet = getSidebarIconSet(activeRoute);

  const html = items
    .map((item) => {
      const focusId = `${screenId}-nav-${item.id}`;
      const isCurrent = item.route === activeRoute;

      return `
        <button type="button" class="sidebar-item ${isCurrent ? "is-current" : ""}" data-focus-id="${focusId}">
          <span class="sidebar-icon">
            <img src="${iconSet.items[item.id]}" alt="" />
          </span>
          <span class="sidebar-label">${item.label}</span>
        </button>
      `;
    })
    .join("");

  const nodes = items.map((item, index) => {
    const focusId = `${screenId}-nav-${item.id}`;
    const up = index > 0 ? `${screenId}-nav-${items[index - 1].id}` : null;
    const down = index < items.length - 1 ? `${screenId}-nav-${items[index + 1].id}` : null;

    return {
      id: focusId,
      isDefault: item.route === activeRoute,
      neighbors: { down, up },
      screenId,
    };
  });

  const actions = createActionMap(
    items.map((item) => [
      `${screenId}-nav-${item.id}`,
      item.route === activeRoute ? null : () => item.route,
    ]),
  );

  return {
    actions,
    html: `
      <aside class="sidebar">
        <div class="brand-mark">
          <img src="${iconSet.brand}" alt="FitPulse logo" />
        </div>
        <nav class="sidebar-nav">${html}</nav>
      </aside>
    `,
    nodes,
  };
}

function buildActivityBars(points) {
  const max = Math.max(...points);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return points
    .map(
      (point, index) => `
        <div class="activity-bar">
          <div class="activity-fill" style="height:${Math.round((point / max) * 100)}%"></div>
          <span>${labels[index]}</span>
        </div>
      `,
    )
    .join("");
}

function renderImageCard(card) {
  return `
    <article class="image-card image-card--recommended" style="background-image:url('${card.image}')">
      <div class="image-card__overlay"></div>
      <div class="image-card__copy">
        <span class="card-metric">${card.metric}</span>
        <h3>${card.title}</h3>
        ${card.subtitle ? `<p>${card.subtitle}</p>` : ""}
      </div>
    </article>
  `;
}

function renderWorkoutProgress(index, total) {
  return `
    <div class="progress-track">
      ${Array.from({ length: total }, (_, step) => `<span class="progress-segment ${step <= index ? "is-done" : ""}"></span>`).join("")}
    </div>
  `;
}

export function createApp(root) {
  const router = createRouter("/");
  const focusEngine = createFocusEngine();

  const state = {
    audioOn: true,
    selectedBodyPart: "Fullbody",
    selectedDay: 5,
    workoutIndex: 0,
  };

  let currentActions = new Map();
  const lastContentFocusByScreen = new Map();
  let isBound = false;

  function navigate(route, options) {
    router.navigate(route, options);
    render();
  }

  function goBack() {
    const currentRoute = router.getCurrentRoute();

    if (currentRoute === "/") {
      return;
    }

    if (
      currentRoute === "/workout/get-ready" ||
      currentRoute === "/workout/player" ||
      currentRoute === "/workout/rest"
    ) {
      navigate("/plan/abs-of-steel/day/5", { replace: true });
      return;
    }

    router.back(currentRoute === "/profile-ready" ? "/" : "/home");
    render();
  }

  function executeAction(focusId) {
    const action = currentActions.get(focusId);
    if (!action) {
      return;
    }

    const nextRoute = action();
    if (typeof nextRoute === "string") {
      navigate(nextRoute);
    }
  }

  function bindEvents() {
    if (isBound) {
      return;
    }

    window.addEventListener("keydown", (event) => {
      const action = getRemoteActionFromKey(event);
      if (!action) {
        return;
      }

      event.preventDefault();

      if (action === "back") {
        goBack();
        return;
      }

      if (action === "select") {
        executeAction(focusEngine.getCurrentFocusId());
        return;
      }

      const currentFocusId = focusEngine.getCurrentFocusId();
      const currentScreenId = focusEngine.getActiveScreenId();
      const reentryTarget = resolveSidebarReentryFocus({
        action,
        currentFocusId,
        rememberedContentId: lastContentFocusByScreen.get(currentScreenId) ?? null,
      });

      if (reentryTarget) {
        focusEngine.activate(reentryTarget);
        syncFocus();
        return;
      }

      focusEngine.move(action);
      syncFocus();
    });

    root.addEventListener("click", (event) => {
      const target = event.target.closest("[data-focus-id]");
      if (!target) {
        return;
      }

      const { focusId } = target.dataset;
      focusEngine.activate(focusId);
      syncFocus();
      executeAction(focusId);
    });

    isBound = true;
  }

  function syncFocus() {
    const activeId = focusEngine.getCurrentFocusId();
    const activeScreenId = focusEngine.getActiveScreenId();

    if (activeScreenId && isContentFocusId(activeId)) {
      lastContentFocusByScreen.set(activeScreenId, activeId);
    }

    root.querySelectorAll("[data-focus-id]").forEach((element) => {
      const isActive = element.dataset.focusId === activeId;
      element.classList.toggle("is-focused", isActive);
      if (isActive && typeof element.focus === "function") {
        element.focus({ preventScroll: true });
      }
    });
  }

  function registerScreen(screen) {
    currentActions = screen.actions;
    focusEngine.clearScreen(screen.screenId);
    screen.nodes.forEach((node) => focusEngine.registerNode(node));
    focusEngine.setActiveScreen(screen.screenId);

    const targetFocusId = resolveScreenEntryFocus({
      currentFocusId: focusEngine.getCurrentFocusId(),
      defaultContentId: screen.defaultContentId ?? null,
      preferContentFocus: Boolean(screen.preferContentFocus),
      rememberedContentId: lastContentFocusByScreen.get(screen.screenId) ?? null,
    });

    if (targetFocusId && targetFocusId !== focusEngine.getCurrentFocusId()) {
      focusEngine.activate(targetFocusId);
    }

    syncFocus();
  }

  function withSidebar(
    screenId,
    content,
    nodes,
    actions,
    defaultContentId = null,
    preferContentFocus = false,
  ) {
    const sidebar = renderSidebar(screenId, routeForSidebar(router.getCurrentRoute()));
    const sidebarNodes = sidebar.nodes.map((node) => ({
      ...node,
      isDefault: preferContentFocus ? false : node.isDefault,
      neighbors: {
        ...node.neighbors,
        right: defaultContentId ?? node.neighbors.right ?? null,
      },
    }));

    return {
      actions: createActionMap([...sidebar.actions.entries(), ...actions.entries()]),
      defaultContentId,
      html: `
        <div class="screen screen--with-sidebar">
          ${sidebar.html}
          <main class="screen-main">${content}</main>
        </div>
      `,
      nodes: [...sidebarNodes, ...nodes],
      preferContentFocus,
      screenId,
    };
  }

  function buildWelcomeScreen() {
    const screenId = "welcome";
    const focusId = "welcome-continue";

    return {
      actions: createActionMap([[focusId, () => "/profile-ready"]]),
      html: `
        <section class="screen screen--welcome">
          <div class="hero-copy">
            <p class="eyebrow">WELCOME</p>
            <h1>Welcome to <span>FitPulse</span></h1>
            <p class="subtle">Let's personalize your home workout experience.</p>
            <div class="setup-grid">
              <div class="panel setup-card">
                <span class="meta-label">NAME</span>
                <strong>${appData.user.name}</strong>
              </div>
              <div class="panel setup-card">
                <span class="meta-label">GENDER</span>
                <strong>Male</strong>
                <div class="pill-row">
                  <span class="pill pill--active">Male</span>
                  <span class="pill">Female</span>
                </div>
              </div>
              <div class="panel setup-card setup-card--wide">
                <span class="meta-label">GOAL</span>
                <div class="pill-row">
                  <span class="pill pill--active">${appData.user.goal}</span>
                  <span class="pill">Muscle Building</span>
                  <span class="pill">Keep Healthy</span>
                </div>
              </div>
            </div>
            <button type="button" class="primary-button" data-focus-id="${focusId}">Continue Setup</button>
          </div>
          <aside class="welcome-aside">
            <span class="meta-label">RECOMMENDED FOR YOU</span>
            ${renderImageCard({
              image: appData.onboarding.heroImage,
              metric: "15 MIN",
              title: "Morning HIIT",
            })}
          </aside>
        </section>
      `,
      nodes: [{ id: focusId, isDefault: true, neighbors: {}, screenId }],
      screenId,
    };
  }

  function buildProfileReadyScreen() {
    const screenId = "profile-ready";
    const focusId = "profile-ready-home";

    return {
      actions: createActionMap([[focusId, () => "/home"]]),
      html: `
        <section class="screen screen--centered">
          <div class="modal-card">
            <div class="modal-badge">&#10003;</div>
            <h1>Profile Ready</h1>
            <p>We've customized a plan for <span>weight</span>.</p>
            <button type="button" class="primary-button" data-focus-id="${focusId}">Go to Home</button>
          </div>
        </section>
      `,
      nodes: [{ id: focusId, isDefault: true, neighbors: {}, screenId }],
      screenId,
    };
  }

  function buildHomeScreen() {
    const screenId = "home";
    const focusIds = {
      resume: "home-resume",
      rec0: "home-rec-0",
      rec1: "home-rec-1",
      rec2: "home-rec-2",
    };

    const content = `
      <div class="page-header">
        <div>
          <h1>Hello, ${appData.user.name}</h1>
          <p>Ready to crush your goals today?</p>
        </div>
        <div class="kcal-pill">&#128293; ${appData.user.calories}<span>KCAL BURNED</span></div>
      </div>
      <section class="home-hero">
        <div class="panel activity-panel">
          <div class="section-title">Weekly Activity</div>
          <div class="activity-chart">${buildActivityBars(appData.home.weeklyActivity)}</div>
        </div>
        <button type="button" class="resume-card" data-focus-id="${focusIds.resume}" style="background-image:url('${appData.home.resume.image}')">
          <span class="resume-tag">${appData.home.resume.label}</span>
          <h2>${appData.home.resume.title}</h2>
          <div class="resume-footer">
            <span>${appData.home.resume.timeLeft}</span>
            <span class="play-chip">&#9654;</span>
          </div>
        </button>
      </section>
      <section class="section-block">
        <div class="section-title section-title--large">Recommended for You</div>
        <div class="card-row">
          ${appData.home.recommended
            .map(
              (card, index) => `
                <button type="button" class="image-card button-reset" data-focus-id="home-rec-${index}" style="background-image:url('${card.image}')">
                  <div class="image-card__overlay"></div>
                  <div class="image-card__copy">
                    <span class="card-metric">${card.metric}</span>
                    <h3>${card.title}</h3>
                    <p>${card.subtitle}</p>
                  </div>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
    `;

    const nodes = [
      {
        id: focusIds.resume,
        isDefault: false,
        neighbors: {
          down: focusIds.rec0,
          left: "home-nav-home",
          right: focusIds.rec0,
        },
        screenId,
      },
      {
        id: focusIds.rec0,
        isDefault: false,
        neighbors: {
          left: "home-nav-home",
          right: focusIds.rec1,
          up: focusIds.resume,
        },
        screenId,
      },
      {
        id: focusIds.rec1,
        isDefault: false,
        neighbors: {
          left: focusIds.rec0,
          right: focusIds.rec2,
          up: focusIds.resume,
        },
        screenId,
      },
      {
        id: focusIds.rec2,
        isDefault: false,
        neighbors: {
          left: focusIds.rec1,
          up: focusIds.resume,
        },
        screenId,
      },
    ];

    const actions = createActionMap([
      [focusIds.resume, () => "/workout/get-ready"],
      [focusIds.rec0, () => "/workout/get-ready"],
      [focusIds.rec1, () => "/workout/get-ready"],
      [focusIds.rec2, () => "/workout/get-ready"],
    ]);

    return withSidebar(screenId, content, nodes, actions, focusIds.resume, true);
  }

  function buildLibraryScreen() {
    const screenId = "library";
    const searchId = "library-search";
    const bodyIds = appData.library.bodyParts.map((_, index) => `library-body-${index}`);
    const pickIds = appData.library.picks.map((_, index) => `library-pick-${index}`);

    const content = `
      <div class="page-header">
        <div>
          <h1>Library</h1>
          <p>Body-part based picks for fast TV browsing.</p>
        </div>
        <button type="button" class="search-pill" data-focus-id="${searchId}">Search workouts...</button>
      </div>
      <section class="section-block">
        <div class="section-title">Body Parts</div>
        <div class="filter-row">
          ${appData.library.bodyParts
            .map(
              (bodyPart, index) => `
                <button type="button" class="filter-chip ${state.selectedBodyPart === bodyPart ? "filter-chip--active" : ""}" data-focus-id="${bodyIds[index]}">
                  ${bodyPart}
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="section-block">
        <div class="section-title">Picks for You</div>
        <div class="card-row card-row--wide">
          ${appData.library.picks
            .map(
              (card, index) => `
                <button type="button" class="image-card button-reset" data-focus-id="${pickIds[index]}" style="background-image:url('${card.image}')">
                  <div class="image-card__overlay"></div>
                  <div class="image-card__copy">
                    <span class="card-metric">${card.metric}</span>
                    <h3>${card.title}</h3>
                  </div>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
    `;

    const nodes = [
      {
        id: searchId,
        isDefault: false,
        neighbors: {
          down: bodyIds[0],
          left: "library-nav-library",
        },
        screenId,
      },
      ...bodyIds.map((id, index) => ({
        id,
        isDefault: false,
        neighbors: {
          down: pickIds[Math.min(index, pickIds.length - 1)],
          left: index > 0 ? bodyIds[index - 1] : "library-nav-library",
          right: index < bodyIds.length - 1 ? bodyIds[index + 1] : null,
          up: searchId,
        },
        screenId,
      })),
      ...pickIds.map((id, index) => ({
        id,
        isDefault: false,
        neighbors: {
          left: index > 0 ? pickIds[index - 1] : "library-nav-library",
          right: index < pickIds.length - 1 ? pickIds[index + 1] : null,
          up: bodyIds[Math.min(index, bodyIds.length - 1)],
        },
        screenId,
      })),
    ];

    const actions = createActionMap([
      [searchId, null],
      ...bodyIds.map((id, index) => [
        id,
        () => {
          state.selectedBodyPart = appData.library.bodyParts[index];
          render();
        },
      ]),
      ...pickIds.map((id) => [id, () => "/workout/get-ready"]),
    ]);

    return withSidebar(
      screenId,
      content,
      nodes,
      actions,
      bodyIds[appData.library.bodyParts.indexOf(state.selectedBodyPart)],
      true,
    );
  }

  function buildClassicScreen() {
    const screenId = "classic";
    const planIds = appData.plans.classic.map((_, index) => `classic-plan-${index}`);
    const filterIds = ["classic-filter-arm", "classic-filter-leg", "classic-filter-back"];

    const content = `
      <div class="page-header">
        <div>
          <h1>Home Workout <span class="accent-word">Classic</span></h1>
          <p>Structured programs designed for remote-first browsing.</p>
        </div>
      </div>
      <section class="card-row card-row--featured">
        ${appData.plans.classic
          .map(
            (plan, index) => `
              <button type="button" class="plan-card button-reset" data-focus-id="${planIds[index]}" style="background-image:url('${plan.image}')">
                <div class="image-card__overlay"></div>
                <div class="image-card__copy">
                  <span class="pill pill--active">${plan.tag}</span>
                  <h2>${plan.title}</h2>
                  <p>${plan.subtitle}</p>
                </div>
              </button>
            `,
          )
          .join("")}
      </section>
      <div class="filter-row filter-row--compact">
        ${["Arm", "Leg", "Back"]
          .map(
            (label, index) => `
              <button type="button" class="filter-chip" data-focus-id="${filterIds[index]}">${label}</button>
            `,
          )
          .join("")}
      </div>
    `;

    const nodes = [
      ...planIds.map((id, index) => ({
        id,
        isDefault: index === 0,
        neighbors: {
          down: filterIds[Math.min(index, filterIds.length - 1)],
          left: index > 0 ? planIds[index - 1] : "classic-nav-classic",
          right: index < planIds.length - 1 ? planIds[index + 1] : null,
        },
        screenId,
      })),
      ...filterIds.map((id, index) => ({
        id,
        isDefault: false,
        neighbors: {
          left: index > 0 ? filterIds[index - 1] : "classic-nav-classic",
          right: index < filterIds.length - 1 ? filterIds[index + 1] : null,
          up: planIds[Math.min(index, planIds.length - 1)],
        },
        screenId,
      })),
    ];

    const actions = createActionMap([
      ...planIds.map((id) => [id, () => "/plan/abs-of-steel"]),
      ...filterIds.map((id) => [id, null]),
    ]);

    return withSidebar(screenId, content, nodes, actions, planIds[0], true);
  }

  function buildProfileScreen() {
    const screenId = "profile";
    const historyId = "profile-history";
    const settingsId = "profile-settings";
    const soundId = "profile-sound";

    const content = `
      <div class="profile-grid">
        <section class="panel profile-card">
          <img class="avatar" src="${appData.plans.classic[1].image}" alt="${appData.user.name}" />
          <h1>${appData.user.name}</h1>
          <p>${appData.user.goal.toLowerCase()}</p>
          <div class="profile-metrics">
            <div class="metric-row"><span>Height</span><strong>${appData.user.height}</strong></div>
            <div class="metric-row"><span>Weight</span><strong>${appData.user.weight}</strong></div>
            <div class="metric-row metric-row--accent"><span>BMI</span><strong>${appData.user.bmi}</strong></div>
          </div>
        </section>
        <div class="profile-side">
          <div class="stats-row">
            <article class="panel stat-box">
              <span class="mini-icon">&#128293;</span>
              <strong>${appData.user.totalCalories}</strong>
              <p>Total Calories</p>
            </article>
            <article class="panel stat-box">
              <span class="mini-icon">~</span>
              <strong>${appData.user.workoutDays}</strong>
              <p>Workout Days</p>
            </article>
          </div>
          <div class="stats-row">
            <button type="button" class="panel action-box" data-focus-id="${historyId}">History</button>
            <button type="button" class="panel action-box" data-focus-id="${settingsId}">Settings</button>
            <button type="button" class="panel action-box" data-focus-id="${soundId}">${state.audioOn ? "Sound On" : "Sound Off"}</button>
          </div>
        </div>
      </div>
    `;

    const nodes = [
      {
        id: historyId,
        isDefault: false,
        neighbors: {
          left: "profile-nav-me",
          right: settingsId,
        },
        screenId,
      },
      {
        id: settingsId,
        isDefault: false,
        neighbors: {
          left: historyId,
          right: soundId,
        },
        screenId,
      },
      {
        id: soundId,
        isDefault: false,
        neighbors: {
          left: settingsId,
        },
        screenId,
      },
    ];

    const actions = createActionMap([
      [historyId, () => "/history"],
      [settingsId, null],
      [
        soundId,
        () => {
          state.audioOn = !state.audioOn;
          render();
        },
      ],
    ]);

    return withSidebar(screenId, content, nodes, actions, historyId, true);
  }

  function buildHistoryScreen() {
    const screenId = "history";
    const itemIds = appData.history.map((_, index) => `history-item-${index}`);

    const content = `
      <div class="page-header">
        <div>
          <h1>Workout History</h1>
          <p>Recent sessions completed on FitPulse TV.</p>
        </div>
      </div>
      <section class="history-list">
        ${appData.history
          .map(
            (entry, index) => `
              <button type="button" class="panel history-item" data-focus-id="${itemIds[index]}">
                <div>
                  <strong>${entry.title}</strong>
                  <p>${entry.day}</p>
                </div>
                <span>${entry.calories}</span>
              </button>
            `,
          )
          .join("")}
      </section>
    `;

    const nodes = itemIds.map((id, index) => ({
      id,
      isDefault: index === 0,
      neighbors: {
        down: index < itemIds.length - 1 ? itemIds[index + 1] : null,
        left: "history-nav-me",
        up: index > 0 ? itemIds[index - 1] : null,
      },
      screenId,
    }));

    return withSidebar(
      screenId,
      content,
      nodes,
      createActionMap(itemIds.map((id) => [id, null])),
      itemIds[0],
      true,
    );
  }

  function buildPlanCalendarScreen() {
    const screenId = "plan-calendar";
    const dayIds = Array.from({ length: 28 }, (_, index) => `plan-day-${index + 1}`);

    const content = `
      <div class="page-header page-header--compact">
        <div class="back-row">
          <button type="button" class="back-chip" data-focus-id="plan-back">&#8592;</button>
          <h1>ABS OF STEEL</h1>
        </div>
      </div>
      <section class="day-grid">
        ${dayIds
          .map((id, index) => {
            const day = index + 1;
            const available = day <= 5;

            return `
              <button type="button" class="day-card ${day === state.selectedDay ? "day-card--active" : ""} ${available ? "" : "day-card--locked"}" data-focus-id="${id}">
                <span>DAY</span>
                <strong>${day}</strong>
              </button>
            `;
          })
          .join("")}
      </section>
    `;

    const nodes = [
      {
        id: "plan-back",
        isDefault: false,
        neighbors: {
          down: dayIds[0],
          right: dayIds[0],
        },
        screenId,
      },
      ...dayIds.map((id, index) => {
        const row = Math.floor(index / 7);
        const col = index % 7;
        return {
          id,
          isDefault: index + 1 === state.selectedDay,
          neighbors: {
            down: row < 3 ? dayIds[index + 7] : null,
            left: col > 0 ? dayIds[index - 1] : "plan-back",
            right: col < 6 ? dayIds[index + 1] : null,
            up: row > 0 ? dayIds[index - 7] : "plan-back",
          },
          screenId,
        };
      }),
    ];

    const actions = createActionMap([
      ["plan-back", () => "/classic"],
      ...dayIds.map((id, index) => [
        id,
        () => {
          state.selectedDay = index + 1;
          if (index + 1 <= 5) {
            return "/plan/abs-of-steel/day/5";
          }
          render();
          return null;
        },
      ]),
    ]);

    return withSidebar(screenId, content, nodes, actions, dayIds[state.selectedDay - 1], true);
  }

  function buildDayDetailScreen() {
    const screenId = "day-detail";
    const backId = "day-back";
    const startId = "day-start";

    const content = `
      <div class="detail-grid">
        <section class="detail-copy">
          <div class="page-header page-header--compact">
            <button type="button" class="back-chip" data-focus-id="${backId}">&#8592;</button>
            <div>
              <p class="eyebrow">DAY ${state.selectedDay}</p>
              <h1>${appData.plans.dayDetail.title}</h1>
            </div>
          </div>
          <p class="detail-description">${appData.plans.dayDetail.description}</p>
          <button type="button" class="primary-button primary-button--wide" data-focus-id="${startId}">Start Day ${state.selectedDay}</button>
        </section>
        <section class="panel detail-panel">
          <img src="${appData.plans.dayDetail.image}" alt="${appData.plans.dayDetail.title}" />
          <div class="metric-row"><span>Estimated Time</span><strong>${appData.plans.dayDetail.time}</strong></div>
          <div class="metric-row"><span>Exercises</span><strong>${appData.plans.dayDetail.exercises}</strong></div>
        </section>
      </div>
    `;

    const nodes = [
      {
        id: backId,
        isDefault: false,
        neighbors: {
          down: startId,
          right: startId,
        },
        screenId,
      },
      {
        id: startId,
        isDefault: true,
        neighbors: { up: backId },
        screenId,
      },
    ];

    const actions = createActionMap([
      [backId, () => "/plan/abs-of-steel"],
      [
        startId,
        () => {
          state.workoutIndex = 0;
          return "/workout/get-ready";
        },
      ],
    ]);

    return withSidebar(screenId, content, nodes, actions, startId, true);
  }

  function buildGetReadyScreen() {
    const screenId = "get-ready";
    const focusId = "get-ready-skip";

    return {
      actions: createActionMap([[focusId, () => "/workout/player"]]),
      html: `
        <section class="screen screen--workout-intro">
          <div class="workout-intro-card">
            <span class="eyebrow">Get Ready</span>
            <h1>${appData.workout.exercises[state.workoutIndex].name}</h1>
            <p>Remote-first workout mode is active. Press select when you're ready.</p>
            <button type="button" class="primary-button" data-focus-id="${focusId}">Skip</button>
          </div>
        </section>
      `,
      nodes: [{ id: focusId, isDefault: true, neighbors: {}, screenId }],
      screenId,
    };
  }

  function buildWorkoutPlayerScreen() {
    const screenId = "workout-player";
    const focusId = "workout-next";
    const exercise = appData.workout.exercises[state.workoutIndex];
    const isLast = state.workoutIndex === appData.workout.exercises.length - 1;

    return {
      actions: createActionMap([
        [
          focusId,
          () => {
            if (isLast) {
              return "/workout/complete";
            }

            return "/workout/rest";
          },
        ],
      ]),
      html: `
        <section class="screen screen--player" style="background-image:url('${exercise.image}')">
          <div class="player-overlay"></div>
          <div class="player-copy">
            ${renderWorkoutProgress(state.workoutIndex, appData.workout.exercises.length)}
            <div class="player-body">
              <div>
                <h1>${exercise.name}</h1>
                <p>Next: ${exercise.next}</p>
              </div>
              <div class="player-metric">${exercise.metric}</div>
            </div>
            <button type="button" class="ghost-button" data-focus-id="${focusId}">${isLast ? "Finish Workout" : "Next Exercise"}</button>
          </div>
        </section>
      `,
      nodes: [{ id: focusId, isDefault: true, neighbors: {}, screenId }],
      screenId,
    };
  }

  function buildRestScreen() {
    const screenId = "rest";
    const addId = "rest-add";
    const skipId = "rest-skip";
    const nextExercise = appData.workout.exercises[state.workoutIndex + 1];

    return {
      actions: createActionMap([
        [addId, null],
        [
          skipId,
          () => {
            state.workoutIndex = Math.min(state.workoutIndex + 1, appData.workout.exercises.length - 1);
            return "/workout/player";
          },
        ],
      ]),
      html: `
        <section class="screen screen--centered">
          <div class="modal-card modal-card--rest">
            <span class="eyebrow">Rest</span>
            <h1>00:15</h1>
            <p>Coming up next: <span>${nextExercise?.name ?? "Finish"}</span></p>
            <div class="action-row">
              <button type="button" class="ghost-button" data-focus-id="${addId}">+20s</button>
              <button type="button" class="primary-button" data-focus-id="${skipId}">Skip Rest</button>
            </div>
          </div>
        </section>
      `,
      nodes: [
        {
          id: addId,
          isDefault: false,
          neighbors: { right: skipId },
          screenId,
        },
        {
          id: skipId,
          isDefault: true,
          neighbors: { left: addId },
          screenId,
        },
      ],
      screenId,
    };
  }

  function buildWorkoutCompleteScreen() {
    const screenId = "workout-complete";
    const finishId = "workout-finish";
    const shareId = "workout-share";

    return {
      actions: createActionMap([
        [
          finishId,
          () => {
            state.workoutIndex = 0;
            return "/home";
          },
        ],
        [shareId, null],
      ]),
      html: `
        <section class="screen screen--centered">
          <div class="modal-card modal-card--complete">
            <div class="trophy">&#127942;</div>
            <h1>Workout Complete!</h1>
            <p>Great job, ${appData.user.name}. You crushed it.</p>
            <div class="summary-grid">
              <article class="panel summary-card"><span>CALORIES</span><strong>159</strong></article>
              <article class="panel summary-card"><span>DURATION</span><strong>20:00</strong></article>
              <article class="panel summary-card"><span>EXERCISES</span><strong>12</strong></article>
            </div>
            <div class="action-row">
              <button type="button" class="primary-button" data-focus-id="${finishId}">Finish</button>
              <button type="button" class="ghost-button" data-focus-id="${shareId}">Share</button>
            </div>
          </div>
        </section>
      `,
      nodes: [
        {
          id: finishId,
          isDefault: true,
          neighbors: { right: shareId },
          screenId,
        },
        {
          id: shareId,
          isDefault: false,
          neighbors: { left: finishId },
          screenId,
        },
      ],
      screenId,
    };
  }

  function buildScreen(route) {
    switch (route) {
      case "/":
        return buildWelcomeScreen();
      case "/profile-ready":
        return buildProfileReadyScreen();
      case "/home":
        return buildHomeScreen();
      case "/library":
        return buildLibraryScreen();
      case "/classic":
        return buildClassicScreen();
      case "/me":
        return buildProfileScreen();
      case "/history":
        return buildHistoryScreen();
      case "/plan/abs-of-steel":
        return buildPlanCalendarScreen();
      case "/plan/abs-of-steel/day/5":
        return buildDayDetailScreen();
      case "/workout/get-ready":
        return buildGetReadyScreen();
      case "/workout/player":
        return buildWorkoutPlayerScreen();
      case "/workout/rest":
        return buildRestScreen();
      case "/workout/complete":
        return buildWorkoutCompleteScreen();
      default:
        return buildWelcomeScreen();
    }
  }

  function render() {
    const route = router.getCurrentRoute();
    const screen = buildScreen(route);
    root.innerHTML = screen.html;
    root.dataset.route = route;
    root.dataset.screen = getScreenId(route);
    registerScreen(screen);
  }

  return {
    getState() {
      return {
        focusId: focusEngine.getCurrentFocusId(),
        route: router.getCurrentRoute(),
        screenId: getScreenId(router.getCurrentRoute()),
        ...state,
      };
    },

    start() {
      registerTizenKeys();
      bindEvents();
      render();
    },
  };
}
