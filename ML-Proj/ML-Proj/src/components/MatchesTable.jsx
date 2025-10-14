import React from 'react'
import { Link } from 'react-router-dom'

export default function MatchesTable({ rows }) {
  if (!rows || rows.length === 0) return <div>No matches to show</div>

  const columns = ['date', 'team', 'opponent', 'venue', 'result', 'gf', 'ga']
  const colLabels = {
    date: 'Date',
    team: 'Team',
    opponent: 'Opponent',
    venue: 'Venue',
    result: 'Result',
    gf: 'Goals For',
    ga: 'Goals Against',
  }

  const fmt = (v) => (v === undefined || v === null ? '' : String(v))

  return (
    <div className="table-wrap">
      <table className="matches">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{colLabels[c] || c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx} className="clickable-row">
              {columns.map((c) => (
                <td key={c + idx}>
                  <Link to={`/match/${idx}`}>{fmt(r[c])}</Link>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
