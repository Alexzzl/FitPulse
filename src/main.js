import { createApp } from "./app.js";

const root = document.querySelector("#root");
const app = createApp(root);

globalThis.__FITPULSE_APP__ = app;

app.start();
globalThis.__FITPULSE_READY__ = true;
