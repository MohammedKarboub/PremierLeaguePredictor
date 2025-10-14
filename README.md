
# Premier League Dashboard

A compact interactive dashboard that visualizes Premier League match data, provides simple analytics, and includes a lightweight rule-based matchup and prediction tool.  
Built for exploratory analysis and technical demonstration — useful to showcase front-end, data-processing, and simple modeling skills to recruiters and hiring managers.



## Highlights

- **Home:** Overview stats, recent matches preview, quick team-vs-team matchup tool  
- **Teams:** Searchable team list and match table  
- **Analyze:** Per-team rolling averages chart, rule-based model results, rolling averages table  
- **Match Details:** Full row-level view of any match  
- **Stack:** React + Vite frontend, Express API serving CSV as JSON, Chart.js visualizations

---

## Tech Stack

**Frontend:** React (v19), Vite, react-router-dom  
**Charts:** Chart.js, react-chartjs-2  
**Backend:** Node.js, Express, csvtojson  
**Styling:** Plain CSS (dark-friendly)  
**Data:** CSV (`premier_league_matches.csv`) parsed to JSON by the server

---

## Quick Run

1. Open the project folder containing `package.json`

2. Install dependencies:
   bash
   npm install
`

3. Start both servers (in two terminals):

   **Frontend (Vite):**

   bash
   npm run dev
   

   **API server (Express):**

   bash
   node server.js
   

4. Open the app:

   * Frontend: `http://localhost:5173` (or port shown in terminal)
   * API: `http://localhost:3000/api/matches`

5. Production build:

   bash
   npm run build
   npm run preview
   

---

## Data

The server looks for `premier_league_matches.csv` in the project folder or its parent.
To update data, replace that CSV and restart the server.

**Expected columns:**


date, team, opponent, venue, result, gf, ga, sh, sot, xg, xga, poss, ...


Missing columns display as blank. Match IDs are array indices (used in `/match/:id`).

---

## Features

* **Rolling averages:** Moving averages (default 3 matches) for numeric metrics such as goals and shots
* **Matchup:** Head-to-head summary or recent-form heuristic for win probability
* **Model results:** Simple rule-based predictor showing accuracy, precision, and confusion matrix
* **Rolling chart:** Line chart of goals for/against and shots on target over time




### Focus Points

* Component and routing structure
* Data fetching and context handling
* Extensibility (e.g., real ML model integration)
* Chart integration and separation of UI and logic

### Possible Extensions

* Replace rule-based model with a Python or Node ML model exposed via `/api/predict`
* Add server-side pagination for large CSVs
* Extend chart controls or add detailed per-team pages

---



