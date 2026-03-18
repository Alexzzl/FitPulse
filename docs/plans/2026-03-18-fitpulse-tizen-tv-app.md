# FitPulse Tizen TV App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Tizen TV-ready FitPulse web app from the provided Figma exports with remote focus navigation, screen-to-screen flow, and WGT packaging basics.

**Architecture:** Use a Vite + React + TypeScript single-page app with `react-router-dom` for page routes and a custom focus engine for TV remote behavior. Keep screens data-driven and use a centralized mock dataset so the UX flow is complete before any real API work.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, CSS variables, Tizen Web App `config.xml`

---

### Task 1: Project Bootstrap

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/AppShell.tsx`
- Create: `src/styles/global.css`
- Create: `src/styles/tokens.css`
- Create: `config.xml`

**Step 1: Create the generated scaffold and config files**

Use Vite React TypeScript as the base, then add Tizen metadata in `config.xml`.

**Step 2: Install app dependencies**

Run: `npm install`
Expected: dependencies installed without peer dependency errors

**Step 3: Run the dev server**

Run: `npm run build`
Expected: initial scaffold builds successfully

### Task 2: Remote Input Contract

**Files:**
- Create: `src/tv/remote.ts`
- Create: `src/tv/remote.test.ts`

**Step 1: Write the failing test**

Test arrow, enter, and back key normalization from browser keyboard events to TV input intents.

**Step 2: Run test to verify it fails**

Run: `npm run test -- src/tv/remote.test.ts`
Expected: FAIL because `remote.ts` does not exist yet

**Step 3: Write minimal implementation**

Add key normalization helpers for `up`, `down`, `left`, `right`, `select`, and `back`, including Tizen-friendly key names and key codes.

**Step 4: Run test to verify it passes**

Run: `npm run test -- src/tv/remote.test.ts`
Expected: PASS

### Task 3: Focus Engine

**Files:**
- Create: `src/focus/focus-engine.ts`
- Create: `src/focus/focus-engine.test.ts`
- Create: `src/focus/FocusProvider.tsx`
- Create: `src/focus/useFocusable.ts`

**Step 1: Write the failing test**

Test moving focus inside a directional graph, selecting defaults, and preserving focus when returning to a screen.

**Step 2: Run test to verify it fails**

Run: `npm run test -- src/focus/focus-engine.test.ts`
Expected: FAIL because focus engine does not exist yet

**Step 3: Write minimal implementation**

Implement a registry-driven focus engine with screen scopes, directional neighbors, and a current focus id.

**Step 4: Run test to verify it passes**

Run: `npm run test -- src/focus/focus-engine.test.ts`
Expected: PASS

### Task 4: App Data and Routing

**Files:**
- Create: `src/data/mock-data.ts`
- Create: `src/app/routes.tsx`
- Create: `src/app/app-state.ts`

**Step 1: Write the failing test**

Add a route flow test that verifies the onboarding to home transition and classic plan journey.

**Step 2: Run test to verify it fails**

Run: `npm run test -- src/app/routes.test.tsx`
Expected: FAIL because route config is missing

**Step 3: Write minimal implementation**

Add route definitions and app state needed for mock workout flow.

**Step 4: Run test to verify it passes**

Run: `npm run test -- src/app/routes.test.tsx`
Expected: PASS

### Task 5: Shared TV UI Components

**Files:**
- Create: `src/components/SidebarNav.tsx`
- Create: `src/components/FocusCard.tsx`
- Create: `src/components/PrimaryButton.tsx`
- Create: `src/components/StatCard.tsx`
- Create: `src/components/ProgressHeader.tsx`

**Step 1: Build shared presentational components**

Match the dark, high-contrast Figma look while exposing focus state styling.

**Step 2: Verify visual composition**

Run: `npm run build`
Expected: shared components compile cleanly

### Task 6: Main Screens

**Files:**
- Create: `src/screens/WelcomeScreen.tsx`
- Create: `src/screens/ProfileReadyScreen.tsx`
- Create: `src/screens/HomeScreen.tsx`
- Create: `src/screens/LibraryScreen.tsx`
- Create: `src/screens/ClassicScreen.tsx`
- Create: `src/screens/ProfileScreen.tsx`
- Create: `src/screens/HistoryScreen.tsx`

**Step 1: Write the failing screen flow test**

Verify that sidebar navigation and CTA buttons change routes as expected.

**Step 2: Run test to verify it fails**

Run: `npm run test -- src/screens/main-flow.test.tsx`
Expected: FAIL because screens are not implemented

**Step 3: Write minimal implementation**

Create the main screens using mock data and shared components.

**Step 4: Run test to verify it passes**

Run: `npm run test -- src/screens/main-flow.test.tsx`
Expected: PASS

### Task 7: Plan and Workout Screens

**Files:**
- Create: `src/screens/PlanCalendarScreen.tsx`
- Create: `src/screens/DayDetailScreen.tsx`
- Create: `src/screens/GetReadyScreen.tsx`
- Create: `src/screens/WorkoutPlayerScreen.tsx`
- Create: `src/screens/RestScreen.tsx`
- Create: `src/screens/WorkoutCompleteScreen.tsx`

**Step 1: Write the failing workout flow test**

Verify that a user can enter a classic day, start training, advance through workout phases, and finish.

**Step 2: Run test to verify it fails**

Run: `npm run test -- src/screens/workout-flow.test.tsx`
Expected: FAIL because workout screens are not implemented

**Step 3: Write minimal implementation**

Add the workout journey screens and transitions, including simple timer display states from mock data.

**Step 4: Run test to verify it passes**

Run: `npm run test -- src/screens/workout-flow.test.tsx`
Expected: PASS

### Task 8: Tizen Integration and Packaging Notes

**Files:**
- Modify: `config.xml`
- Create: `README.md`
- Create: `scripts/tizen-package.md`

**Step 1: Add Tizen notes and required metadata placeholders**

Set app id placeholder, TV profile metadata, and document how to package into a WGT.

**Step 2: Verify app build**

Run: `npm run build`
Expected: production bundle generated in `dist`

### Task 9: Full Verification

**Files:**
- Modify: any touched files as needed

**Step 1: Run tests**

Run: `npm run test -- --run`
Expected: all tests pass

**Step 2: Run build**

Run: `npm run build`
Expected: successful production build
