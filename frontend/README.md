# Frontend — Sovereign On-Premise Agentic AI Workbench

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
  listing endpoint when it exists.
