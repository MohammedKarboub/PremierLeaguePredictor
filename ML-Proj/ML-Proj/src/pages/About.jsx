import React from 'react'
import { Link } from 'react-router-dom'

export default function About(){
  return (
    <div>
      <h2>About this dashboard</h2>

      <section className="card">
        <h3>What does this app show?</h3>
        <p>This dashboard displays a collection of Premier League matches loaded from a CSV file. The main pages and their purposes are:</p>
        <ul>
          <li><strong>Home</strong> — Overview with a couple of quick stats, the team-vs-team comparison (Matchup), and a preview of recent matches.</li>
          <li><strong>Teams</strong> — A list of teams with a simple filter; select a team to view its matches.</li>
          <li><strong>Analyze</strong> — Pick a team and inspect simple analyses: a rolling averages chart, a very basic rule-based model (Model results) and rolling-averages tables.</li>
          <li><strong>Match details</strong> — Click a row in any table to see all available columns for that specific match.</li>
        </ul>
      </section>

      <section className="card" style={{marginTop:12}}>
        <h3>What do the tools actually do?</h3>
        <p>All computations are client-side and intentionally simple. They are provided for exploration and illustration:</p>
        <ul>
          <li><strong>Rolling averages</strong> — Moving averages over the last N matches (default 3) for numeric columns such as goals, shots and shots on target. This highlights short-term trends only.</li>
          <li><strong>Model results</strong> — A very naive rule-based predictor that uses a few heuristics (for example simple home advantage or comparing goals for/against). It is NOT a trained statistical or ML model and is included for demonstration only.</li>
          <li><strong>Matchup</strong> — Compares two teams using head-to-head history when there is sufficient data, otherwise a simple recent-form fallback. The output is a rough estimate, not a reliable prediction.</li>
        </ul>
      </section>

      <section className="card" style={{marginTop:12}}>
        <h3>Important disclaimers</h3>
        <ul>
          <li>This dashboard is for informational and educational purposes only. The calculations make many simplifying assumptions.</li>
          <li>We do not support or endorse gambling or betting and we do not provide advice for placing wagers. Do not use the results here as the basis for financial decisions.</li>
          <li>The authors and maintainers of this project accept no liability for decisions you make based on the information in this dashboard. Use at your own risk.</li>
        </ul>
      </section>

      <p style={{marginTop:12}}><Link to="/">Back to Home</Link></p>
    </div>
  )
}
