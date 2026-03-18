# FitPulse TV

FitPulse TV is a Samsung Tizen TV-oriented fitness web app built from the provided Figma exports. It is implemented as a static modular web application so the source can be packaged directly into a `.wgt` without relying on a bundler at runtime.

## Included flows

- Welcome setup
- Profile ready
- Home
- Library
- Classic programs
- 30-day calendar
- Day detail
- Get ready
- Workout player
- Rest
- Workout complete
- Me
- History

## Remote keys

- `ArrowUp` / `ArrowDown` / `ArrowLeft` / `ArrowRight`: move focus
- `Enter`: select
- `Backspace` / `Escape` / Tizen key code `10009`: back

## Project commands

- `npm run dev`
  Serves the project root at `http://127.0.0.1:5173` for local design review.
- `npm test`
  Runs a single-process verification script for remote mapping, focus behavior, and route history.
- `npm run build`
  Copies the Tizen-ready app files into `dist/`.
- `npm run preview`
  Serves the built `dist/` output at `http://127.0.0.1:4173`.

## Local preview note

Do not double-click `index.html` from `dist/`. The app uses browser ES modules, and most browsers block module loading from `file://` for security reasons. Always preview through `npm run dev` or `npm run preview`.

## Important config placeholders

Before signing and uploading, replace these values in `config.xml`:

- Widget ID: `http://yourdomain.com/fitpulse-tv`
- Package ID: `RANDOMAPPID`
- Application ID: `RANDOMAPPID.FitPulseTV`

The app currently targets `1920x1080` landscape TV layout.

## Packaging and publishing

See `scripts/tizen-package.md` for packaging, testing on a TV, and Samsung TV Seller Office submission notes.
