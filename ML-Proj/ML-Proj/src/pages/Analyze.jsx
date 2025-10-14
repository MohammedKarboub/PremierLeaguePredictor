import { useContext, useState, useMemo } from 'react'
import { MatchesContext } from '../App'
// upload UI removed
import TeamSelector from '../components/TeamSelector'
import ModelResults from '../components/ModelResults'
import RollingAverages from '../components/RollingAverages'
import RollingChart from '../components/RollingChart'

export default function Analyze() {
  const { matches } = useContext(MatchesContext)
  const [team, setTeam] = useState('')

  const teams = useMemo(() => Array.from(new Set(matches.map((m) => m.team))).filter(Boolean).sort(), [matches])

  const teamMatches = useMemo(() => matches.filter((m) => m.team === team), [matches, team])

  return (
    <div>
      <h2>Analyze</h2>
      <div className="analyze-grid">
        <div className="left">
          <TeamSelector teams={teams} value={team} onChange={setTeam} />
        </div>
        <div className="right">
          <RollingChart rows={teamMatches} windowSize={3} />
          <ModelResults rows={teamMatches} />
          <RollingAverages rows={teamMatches} />
        </div>
      </div>
    </div>
  )
}
