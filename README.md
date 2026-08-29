# The Index — A Startup pitch registration page

A responsive, static webpage for browsing early-stage startups, styled as a
library card catalog. Built with plain HTML, CSS, and JavaScript — no
build step, no dependencies, no framework.

## Features

- **Startup cards** — name, logo (initials on a colored badge), a short
  description, and a link out to the startup's website.
- **Live search** — the input box filters cards by name, description, or
  category as you type, with a short debounce so it doesn't refilter on
  every keystroke.
- **Animated filtering** — non-matching cards fade and scale out (and back
  in) instead of snapping away, and cards lift with a shadow on hover.
- **Responsive layout** — a single stacked column on mobile, 2 columns on
  tablet-width screens, and a 3-column grid on desktop.
- **"Add a card" form** — a submission form for someone to add their own
  startup. New entries render into the grid immediately (see the
  Firebase/Sheets section below for wiring it to a real backend).

## Project structure

```
startup-showcase/
├── index.html        # page structure and content
├── css/
│   └── style.css      # design tokens, layout, animations
├── js/
│   └── script.js       # startup data, rendering, search, form handling
└── README.md
```

## How to run

No installation or build tools needed.

1. Download or clone this folder.
2. Open `index.html` directly in any browser (double-click it, or
   right-click → Open With → your browser).

If you'd rather serve it locally (some browsers restrict certain features
when a page is opened via `file://`), run one of these from inside the
folder and visit `http://localhost:8000`:

```bash
# Python 3
python3 -m http.server 8000

# Node (if you have npx available)
npx serve .
```

## Editing the startup list

Startups live in a plain array at the top of `js/script.js`:

```js
const STARTUPS = [
  {
    name: "Loopwell",
    category: "Climate",
    description: "Sensors that tell commercial HVAC systems when they're wasting energy, in real time.",
    url: "https://example.com/loopwell",
    initials: "LW",
    color: "#2F6F62"
  },
  // ...
];
```

Add, remove, or edit entries here and the grid re-renders automatically.
`color` accepts any CSS color and is used for the badge background.

## Optional: connecting the submission form to a real backend

Right now, submitting the form just adds a card to the in-memory list —
nothing is saved, and a page refresh clears it. To persist submissions,
wire the `submit` handler in `js/script.js` to one of the following.

### Option A — Firebase (Firestore)

1. Create a Firebase project and enable Firestore.
2. Add the Firebase SDK to `index.html`:
   ```html
   <script type="module">
     import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
     import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

     const app = initializeApp({ /* your config */ });
     const db = getFirestore(app);
     window.saveStartup = (data) => addDoc(collection(db, "startups"), data);
   </script>
   ```
3. In the form's `submit` handler, call `window.saveStartup({ name, url, description })`
   instead of (or in addition to) pushing straight into `STARTUPS`.
4. On page load, fetch existing documents from the `startups` collection
   and merge them into `STARTUPS` before the first `renderCards()` call.

### Option B — Google Sheets (via Apps Script)

1. Create a Google Sheet with columns `name | url | description | category`.
2. In the Sheet, go to **Extensions → Apps Script** and add a `doPost`
   function that appends incoming form data as a new row, then deploy it
   as a Web App (execute as you, accessible to anyone).
3. In `js/script.js`, `fetch()` that Web App URL with a `POST` request and
   a JSON body inside the `submit` handler:
   ```js
   fetch("YOUR_APPS_SCRIPT_URL", {
     method: "POST",
     body: JSON.stringify({ name, url, description })
   });
   ```
4. To display submitted startups on load, add a `doGet` function to the
   same script that returns the sheet's rows as JSON, and `fetch()` it
   before the first `renderCards()` call.

Either approach keeps the rest of the site — layout, search, animations —
completely unchanged; only the data source moves from a hardcoded array
to a live source.

## Browser support

Uses only standard, widely supported CSS and JavaScript (CSS Grid, CSS
custom properties, `requestAnimationFrame`, template literals). Works in
all current versions of Chrome, Firefox, Safari, and Edge.

