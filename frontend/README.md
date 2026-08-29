<!-- # Frontend — Sovereign On-Premise Agentic AI Workbench

Person 1's module. React + Vite + Tailwind. No backend required to run —
it ships with a mock API layer so you can demo the UI standalone, then
flip one flag to point at the real FastAPI backend.

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`.

## What's here

```
src/
├── App.jsx                 # shell: top status bar, sidebar, chat, right panel
├── index.css                # tailwind + a few global tweaks (scrollbars, focus rings)
├── api/
│   └── client.js            # the ONLY file that talks to the network — see below
└── components/
    ├── Sidebar.jsx           # session list + local knowledge base listing
    ├── Chat.jsx              # message thread + composer
    ├── FileUploader.jsx      # drag-and-drop / attach control
    ├── AgentPlan.jsx         # plan → act → observe step visualization
    ├── ModelRouter.jsx       # shows task classification + which model was picked
    ├── Deliverables.jsx      # generated .docx/.xlsx/.pptx/code, with download affordance
    └── NetworkMonitor.jsx    # the "proof of sovereignty" readout in the top bar
```

## Design direction

The UI is built around the actual claim of the project — an on-prem,
air-gapped workbench for confidential industrial work — rather than
looking like a generic chat app. That's why it reads like a control-room
instrument panel: `JetBrains Mono` for anything that's a label, status,
or readout; `Inter` for prose; a near-black slate background; amber for
active/selected states; and a persistent green "AIR-GAPPED / EXT CALLS
000000" readout in the header, which doubles as the literal proof the
judges are told to look for.

Colors, type, and layout tokens live in `tailwind.config.js` under
`theme.extend` if you want to adjust them.

## Connecting to the real backend (Person 2)

Everything the UI needs from the network goes through `src/api/client.js`.
It currently runs in mock mode (`USE_MOCK = true`) and fabricates
classifier output, agent steps, and deliverables locally so the UI is
fully clickable before any backend exists.

To go live:

1. Set `USE_MOCK = false` in `client.js`.
2. Implement the endpoints documented at the top of that file
   (`POST /api/chat`, `POST /api/upload`, `GET /api/kb/documents`,
   `GET /api/network/stats`, …). Vite's dev server already proxies
   `/api/*` to `http://localhost:8000` (see `vite.config.js`), so no
   CORS setup is needed locally.
3. Match the response shapes documented above each function in
   `client.js`, or update the function bodies — components never call
   `fetch` directly, so this is the only file that needs to change.

## Notes for the rest of the team

- **Person 4 (agent):** `AgentPlan.jsx` currently ticks through a
  hard-coded step list on a timer. If the planner can stream real step
  events (SSE or a websocket), swap the `setInterval` in that component
  for events from the stream — the `steps` / `activeIndex` contract can
  stay as-is.
- **Person 6 (network monitor):** `NetworkMonitor.jsx` polls
  `getNetworkStats()` every 8s. Point that at whatever
  `scripts/network_monitor.sh` exposes and the header counter goes live.
- **Person 5 (RAG):** `Sidebar.jsx` lists knowledge-base documents via
  `getKnowledgeBase()` — point that at the real vector store's document
  listing endpoint when it exists. -->


# Frontend — Sovereign On-Premise Agentic AI Workbench

Person 1's module. React + Vite + Tailwind. No backend required to run —
ships with a mock API layer so the UI is fully demoable standalone, then
one flag flips it to the real FastAPI backend.

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`.

## Structure

```
src/
├── App.jsx                  # shell: header, sidebar, chat, right panel
├── index.css                 # tailwind + scrollbars/focus-ring tweaks
├── api/
│   ├── client.js              # the ONLY file that talks to the network
│   └── mockData.js            # all demo data, isolated from client.js and components
└── components/
    ├── Header.jsx              # top bar wordmark + sidebar toggle
    ├── NetworkMonitor.jsx       # header status cluster — the "proof of sovereignty" readout
    ├── Sidebar.jsx              # session list
    ├── KnowledgeBase.jsx        # local KB document list (used inside Sidebar)
    ├── Chat.jsx                 # message list + hero empty state + composer wiring
    ├── HeroEmptyState.jsx       # first-load hero with 4 functional suggested-task cards
    ├── ChatMessage.jsx          # message bubble: code blocks w/ copy, error+retry, timestamps
    ├── Composer.jsx             # bottom input: autosize, Enter/Shift+Enter, send states
    ├── FileUploader.jsx         # drag-and-drop attach, type/size validation, processing states
    ├── AgentStatus.jsx          # execution timeline: pending/running/completed/failed + durations
    ├── ModelRouter.jsx          # task classification + which local model is active/standby
    ├── SystemStatus.jsx         # GPU/VRAM/resident-model telemetry
    ├── Deliverables.jsx         # generated files: generating/ready/failed states
    ├── SystemLog.jsx            # live INFO/SUCCESS/WARNING/ERROR activity feed
    └── PanelLabel.jsx           # shared panel-header typography (keeps every card consistent)
```

## Design system

Tokens live in `tailwind.config.js` under `theme.extend`:

- **Color** — `base.bg/panel/panel2/panel3` for surface depth, `text.primary/secondary/tertiary/disabled`
  for a consistent text hierarchy, and five semantic accents: `amber` (active/selected), `secure`
  (air-gapped/success), `alert` (errors), `warn` (warnings), `wire` (links/data flow).
- **Type** — `JetBrains Mono` for anything that's a system label, status, or log line;
  `Inter` for everything the user reads and writes. `text-2xs`/`text-3xs` are the two
  small sizes used for panel labels and metadata so they don't drift across components.
- **Shape/depth** — `rounded-xl` for cards, `rounded-lg` for inputs/buttons, `rounded-md`
  for small chips. `shadow-panel` (resting) and `shadow-elevated` (hover) instead of ad-hoc
  shadows.
- **Motion** — `duration-150`–`duration-250` for hover/focus/state transitions; `fade-up`/`fade-in`
  for new content appearing; `prefers-reduced-motion` is respected globally in `index.css`.

## Connecting to the real backend (Person 2)

Everything the UI needs from the network goes through `src/api/client.js`, currently in
mock mode (`USE_MOCK = true`). To go live:

1. Set `USE_MOCK = false` in `client.js`.
2. Implement the endpoints documented at the top of that file.
   Vite's dev server proxies `/api/*` to `http://localhost:8000` (see `vite.config.js`),
   so no CORS setup is needed locally.
3. Match the response shapes documented above each function, or update the function
   bodies — components never call `fetch` directly, so this is the only file that needs
   to change.

## Notes for the rest of the team

- **Person 4 (agent):** `AgentStatus.jsx` currently drives its pending → running →
  completed sequence off a client-side timer keyed to each step's mock `seconds`. Once
  the planner can stream real step events (SSE or a websocket), feed it
  `{ label, status, elapsedMs }` per step — the rendering logic doesn't need to change.
  The `failed` + `Retry` visual state is fully built but never triggered by mock data on
  purpose, so a demo can't self-sabotage; wire it once real failures can happen.
- **Person 6 (system telemetry):** `SystemStatus.jsx` and `NetworkMonitor.jsx` poll
  `getSystemStatus()` / `getNetworkStats()`. Point those at whatever
  `scripts/network_monitor.sh` and GPU monitoring expose and both go live with no UI changes.
- **Person 5 (RAG):** `KnowledgeBase.jsx` lists documents via `getKnowledgeBase()` — point
  that at the real vector store's document listing endpoint when it exists.
- **Person 2 (backend):** `Deliverables.jsx` expects real download URLs per item
  (`GET /api/files/{id}`) to replace the currently-disabled download buttons.

## Intentionally still mocked

Everything under `src/api/mockData.js` is frontend-only placeholder data: session list,
knowledge-base documents, GPU/VRAM numbers, external-call counter, and system log lines.
None of it is a real measurement — it exists so every UI state (loading, standby, active,
error) is visible and demoable before any backend module is wired up.
