import { useContext, useState, useMemo } from 'react'
import { MatchesContext } from '../App'
import MatchesTable from '../components/MatchesTable'

export default function Teams() {
  const { matches } = useContext(MatchesContext)
  const [filter, setFilter] = useState('')

  const teams = useMemo(() => {
    const map = {}
    matches.forEach((m) => {
      const t = m.team || 'Unknown'
      if (!map[t]) map[t] = 0
      map[t] += 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [matches])

  const filtered = teams.filter(([name]) => name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="teams-page">
      <h2>Teams</h2>
      <div className="teams-panel">
        <div className="teams-list">
          <input placeholder="Filter teams" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <ul>
            {filtered.map(([name, count]) => (
              <li key={name}>
                <strong>{name}</strong> <span className="muted">({count})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="teams-matches">
          <h3>All matches for filtered teams</h3>
          <MatchesTable rows={matches.filter((m) => (m.team || '').toLowerCase().includes(filter.toLowerCase()))} />
        </div>
      </div>
    </div>
  )
}
