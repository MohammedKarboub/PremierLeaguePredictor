import { useMemo, useState } from 'react'

function safeDate(d){ return d ? String(d) : '' }

function computeHeadToHead(matches, a, b){
  const rows = matches.filter(m => (m.team===a && m.opponent===b) || (m.team===b && m.opponent===a))
  let a_wins=0, b_wins=0, draws=0
  rows.forEach(r => {
    if (r.team===a && r.opponent===b){
      if (r.result==='W') a_wins++
      else if (r.result==='L') b_wins++
      else draws++
    } else if (r.team===b && r.opponent===a){
      if (r.result==='W') b_wins++
      else if (r.result==='L') a_wins++
      else draws++
    }
  })
  return { rows, a_wins, b_wins, draws }
}

function recentWinRate(matches, team, venueFilter=null, window=10){
  // matches where team appears as 'team'
  const rows = matches.filter(m => m.team===team).sort((x,y)=> (x.date||'') > (y.date||'') ? 1:-1)
  const recent = rows.slice(Math.max(0, rows.length - window))
  if (venueFilter) {
    // venueFilter: 'home' | 'away' | 'neutral' or null
    const filtered = recent.filter(r => {
      const v = String(r.venue||'').toLowerCase()
      if (venueFilter==='home') return v==='home'
      if (venueFilter==='away') return v==='away'
      if (venueFilter==='neutral') return v==='neutral'
      return true
    })
    if (filtered.length===0) return null
    const wins = filtered.filter(r => r.result==='W').length
    return wins/filtered.length
  }
  const wins = recent.filter(r => r.result==='W').length
  return recent.length? wins/recent.length : null
}

export default function Matchup({ matches }){
  const teams = useMemo(()=> Array.from(new Set(matches.map(m => m.team))).filter(Boolean).sort(), [matches])
  const [teamA, setTeamA] = useState(teams[0]||'')
  const [teamB, setTeamB] = useState(teams[1]||'')
  const [venue, setVenue] = useState('homeA') // 'homeA' or 'homeB'

  const result = useMemo(()=>{
    if (!teamA || !teamB || teamA===teamB) return null
    // head-to-head
    const hh = computeHeadToHead(matches, teamA, teamB)
    if (hh.rows.length >= 5){
      const total = hh.a_wins + hh.b_wins + hh.draws
      const pa = (hh.a_wins + 0.5*hh.draws)/total
      const pb = (hh.b_wins + 0.5*hh.draws)/total
      return { method: 'head-to-head', pa, pb, hh }
    }

    // fallback: recent win rates (window 10)
    // if venue is homeA then consider A home win rate and B away win rate
    let aRate = null, bRate = null
    if (venue==='homeA'){
      aRate = recentWinRate(matches, teamA, 'home')
      bRate = recentWinRate(matches, teamB, 'away')
    } else { // homeB
      aRate = recentWinRate(matches, teamA, 'away')
      bRate = recentWinRate(matches, teamB, 'home')
    }

    // combine: pa = 0.5*(aRate + (1 - bRate)) if both available
    if (aRate==null && bRate==null) return { method:'insufficient', pa:null, pb:null }
    if (aRate==null) aRate = 0.5
    if (bRate==null) bRate = 0.5
    const pa = 0.5*(aRate + (1 - bRate))
    const pb = 1 - pa
    return { method: 'recent', pa, pb, aRate, bRate }
  }, [matches, teamA, teamB, venue])

  return (
    <div className="card">
      <h3>Team matchup</h3>
      <div className="matchup-controls">
        <select value={teamA} onChange={e=>setTeamA(e.target.value)}>
          <option value="">-- team A --</option>
          {teams.map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={teamB} onChange={e=>setTeamB(e.target.value)}>
          <option value="">-- team B --</option>
          {teams.map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={venue} onChange={e=>setVenue(e.target.value)}>
          <option value="neutral">Neutral</option>
          <option value="homeA">Team A home</option>
          <option value="homeB">Team B home</option>
        </select>
      </div>

      {!result && <p className="muted">Choose two different teams to compare.</p>}

      {result && result.method==='head-to-head' && (
        <div style={{marginTop:8}}>
          <div>Based on head-to-head ({result.hh.rows.length} matches):</div>
          <div style={{fontWeight:700, marginTop:6}}>{teamA}: {(result.pa*100).toFixed(1)}% — {teamB}: {(result.pb*100).toFixed(1)}%</div>
          <div className="muted" style={{marginTop:6}}>Head-to-head wins: {result.hh.a_wins} - {result.hh.b_wins} (draws: {result.hh.draws})</div>
        </div>
      )}

      {result && result.method==='recent' && (
        <div style={{marginTop:8}}>
          <div>Estimated from recent form (10 matches):</div>
          <div style={{fontWeight:700, marginTop:6}}>{teamA}: {(result.pa*100).toFixed(1)}% — {teamB}: {(result.pb*100).toFixed(1)}%</div>
          <div className="muted" style={{marginTop:6}}>Recent win rates — {teamA}: {result.aRate==null? 'n/a': (result.aRate*100).toFixed(1)+'%'}; {teamB}: {result.bRate==null? 'n/a': (result.bRate*100).toFixed(1)+'%'}</div>
        </div>
      )}

      {result && result.method==='insufficient' && (
        <div style={{marginTop:8}} className="muted">Not enough data to estimate probabilities for these teams.</div>
      )}
    </div>
  )
}
