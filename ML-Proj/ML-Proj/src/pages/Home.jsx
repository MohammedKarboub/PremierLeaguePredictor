import { useContext } from 'react'
import { MatchesContext } from '../App'
import MatchesTable from '../components/MatchesTable'
import Matchup from '../components/Matchup'

export default function Home() {
  const { matches } = useContext(MatchesContext)

  // quick stats
  const total = matches.length
  const teams = Array.from(new Set(matches.map((m) => m.team))).length

  const preview = matches.slice(0, 50)

  return (
    <div>
      <section className="hero">
        <h2>Overview</h2>
        <div className="cards">
          <div className="card">Matches: <strong>{total}</strong></div>
          <div className="card">Teams: <strong>{teams}</strong></div>
        </div>
      </section>

      <section style={{marginTop:12}}>
        <Matchup matches={matches} />
      </section>

      <section>
        <h3>Recent matches (preview)</h3>
        <MatchesTable rows={preview} />
      </section>
    </div>
  )
}
