


# Premier League Dashboard

An interactive dashboard that visualizes Premier League match data, provides simple analytics, and includes a lightweight rule-based prediction tool.  
Built for exploratory analysis and technical demonstration — useful to showcase front-end, data-processing, and simple modeling skills to recruiters and hiring managers.



## Overview

This project combines data scraping, data visualization, and basic analytics in a single environment:

- Selenium (Python) web scraper for automated match data collection  
- React + Vite frontend with interactive charts  
- Express (Node.js) backend serving processed CSV data as JSON  
- Lightweight ML / rule-based predictions in Python (`ML.py`)

---

## Tech Stack

**Frontend:** React (v19), Vite, react-router-dom  
**Charts:** Chart.js, react-chartjs-2  
**Backend:** Node.js, Express, csvtojson  
**Styling:** Plain CSS (dark-friendly)  
**Data Source:** Web scraping via Selenium (Python)  
**Modeling:** Simple rule-based predictor (`ML.py`)

---

## Quick Start

1. Navigate to the main project folder:
   ```bash
   cd ML-Proj


2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend (Vite):

   ```bash
   npm run dev
   ```

4. Start the API server (Express):

   ```bash
   node server.js
   ```

5. Open the app:

   * Frontend: [http://localhost:5173](http://localhost:5173)
   * API: [http://localhost:3000/api/matches](http://localhost:3000/api/matches)

6. Production build:

   ```bash
   npm run build
   npm run preview
   ```

---

## Data

The backend reads `premier_league_matches.csv` from the project directory or its parent folder.

### Data Source

Match data was collected via Selenium (Python).
The scraper (`data.py`) automatically navigates to public Premier League statistics pages, extracts match details, cleans them, and exports them as a CSV file.

**Expected columns:**

```
date, team, opponent, venue, result, gf, ga, sh, sot, xg, xga, poss, ...
```

Missing columns are left blank.
Match IDs are array indices used in the route `/match/:id`.

---

## Features

* Rolling averages: Moving averages (default: 3 matches) for metrics like goals and shots
* Matchup tool: Head-to-head summary and recent form heuristic for win probability
* Model results: Simple rule-based predictor with accuracy, precision, and confusion matrix
* Rolling charts: Time-series visualization of goals, shots, and xG metrics
* Full match view: Row-level data exploration per match

---

## Focus Points

* Component and routing structure (React + Express integration)
* Data fetching and context handling
* Separation of logic and UI
* Extensibility for ML model integration
* Visualization using Chart.js

---

## Possible Extensions

* Replace rule-based predictor with a trained ML model served via `/api/predict`
* Add server-side pagination for large datasets
* Enhance chart controls and filters
* Include player-level stats and advanced analytics

---

## Selenium Scraper Example

`data.py` uses Selenium with a headless browser to fetch match data:

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
import pandas as pd

driver = webdriver.Chrome()
driver.get("https://www.premierleague.com/results")

matches = driver.find_elements(By.CLASS_NAME, "matchFixtureContainer")
data = []
for m in matches:
    data.append(m.text)

df = pd.DataFrame(data, columns=["match_info"])
df.to_csv("premier_league_matches.csv", index=False)
driver.quit()
```

---

## Dependencies

**Node.js Packages**

```
react, vite, express, chart.js, react-chartjs-2, csvtojson
```

**Python Packages**

```
selenium, pandas
```

```




