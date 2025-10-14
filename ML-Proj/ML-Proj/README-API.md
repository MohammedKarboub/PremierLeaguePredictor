# Premier League Dashboard

This repository contains a small React + Vite dashboard (in `src/`) and a tiny Node server (`server.js`) that serves the `premier_league_matches.csv` as JSON.

Quick start (development):

- Install deps (make sure you're in the `ML-Proj` folder where `package.json` is located):

```bash
cd ML-Proj
npm install
```

- Run the Vite dev server (frontend)

```bash
npm run dev
```

The React app will run on the Vite dev server (default port 5173) and requests to `/api/matches` will fail unless you run the Node server. In development you can run both:

```bash
# Terminal 1
npm run dev

# Terminal 2 (API)
npm start
```

Production build & serve:

```bash
npm run build
npm start
```

Open http://localhost:3000 to see the built dashboard.

API endpoints:

- GET /api/matches — returns the CSV parsed as JSON.

Notes
- The server expects `premier_league_matches.csv` to be in the project root (`ML-Proj/`).
- The React app expects basic columns such as `date`, `team`, `opponent`, `venue`, `result`, `gf`, `ga` — it will render empty cells if missing.

Pages added in the dashboard:

- `/` — Home: overview stats and a preview of recent matches.
- `/teams` — Teams: searchable list of teams and their matches.
- `/match/:id` — Match details: view full data for a single match (click any cell in the table to open details).

Analyze features:

- Upload CSV: upload your own CSV (header row required) and it will replace the dataset in the client.
- Team selector: choose a team to analyze.
- Model results: simple rule-based predictions per match, accuracy, precision and confusion table.
- Rolling averages: per-match rolling averages (3-match window) for numeric columns like gf/ga/sh/sot.
- Visualizations: placeholders for charts (Chart.js added) to plot rolling averages and predicted vs actual.
- Help: short explanations are included on the Analyze page.

The UI is client-side routed using `react-router-dom`.
