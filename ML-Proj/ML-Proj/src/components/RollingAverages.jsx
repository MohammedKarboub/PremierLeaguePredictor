import { useMemo } from 'react'

export default function RollingAverages({ rows }) {
  const numericCols = ['gf','ga','sh','sot','dist','fk','pk','pkatt']
  const colLabels = {
    gf: 'Goals For',
    ga: 'Goals Against',
    sh: 'Shots',
    sot: 'Shots on Target',
    dist: 'Distance',
    fk: 'Free Kicks',
    pk: 'Penalty Kicks',
    pkatt: 'Penalty Attempts',
  }

  const rolling = useMemo(() => {
    if (!rows || rows.length === 0) return []
    // ensure rows are sorted by date if date exists
    const sorted = [...rows].sort((a,b)=> (a.date||'') > (b.date||'') ? 1 : -1)
    const out = []
    for (let i=0;i<sorted.length;i++){
      const prev = sorted.slice(Math.max(0,i-3), i)
      const avg = {}
      numericCols.forEach(c => {
        const vals = prev.map(r=>Number(r[c])||0)
        avg[c+'_rolling'] = vals.length? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2):null
      })
      out.push({ ...sorted[i], ...avg })
    }
    return out
  }, [rows])

  if (!rows || rows.length===0) return <div className="card">Choose a team to see rolling averages.</div>

  return (
    <div className="rolling card">
      <h3>Rolling averages (3 matches)</h3>
      <div style={{overflow:'auto'}}>
        <table>
          <thead>
            <tr>
              <th>date</th>
              {numericCols.map(c=> <th key={c}>{colLabels[c] ? `${colLabels[c]} (3-match avg)` : c+'_rolling'}</th>)}
            </tr>
          </thead>
          <tbody>
            {rolling.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                {numericCols.map(c=> <td key={c+i}>{r[c+'_rolling'] ?? ''}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
