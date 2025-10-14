import { useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MatchesContext } from '../App'

export default function MatchDetails() {
  const { id } = useParams()
  const { matches } = useContext(MatchesContext)
  const idx = parseInt(id, 10)
  const match = matches[idx]

  if (!match) return (
    <div>
      <p>Match not found.</p>
      <Link to="/">Back</Link>
    </div>
  )

  const labels = {
    index: 'Index',
    date: 'Date',
    team: 'Team',
    opponent: 'Opponent',
    venue: 'Venue',
    result: 'Result',
    gf: 'Goals For',
    ga: 'Goals Against',
    sh: 'Shots',
    sot: 'Shots on Target',
    dist: 'Distance',
    fk: 'Free Kicks',
    pk: 'Penalty Kicks',
    pkatt: 'Penalty Attempts',
    xg: 'Expected Goals (xG)',
    xga: 'Expected Goals Against (xGA)',
    poss: 'Possession',
    possession: 'Possession',
    xga_diff: 'xGA Difference',
    xg_diff: 'xG Difference',
  }

  const humanize = (s) => {
    if (!s) return ''
    // convert snake_case or short keys to Title Case e.g. 'team_name' -> 'Team Name'
    return s.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
  }

  return (
    <div className="match-details">
      <h2>Match details</h2>
      <table>
        <tbody>
          {Object.entries(match).map(([k, v]) => (
            <tr key={k}>
              <th>{labels[k] || humanize(k)}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/">Back</Link>
    </div>
  )
}
