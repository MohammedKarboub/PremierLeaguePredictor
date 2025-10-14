import { useMemo } from 'react'

function simpleModelPredict(rows){
  // Very naive rule-based 'model': if venue is Home or rolling gf > ga then predict win
  return rows.map(r=>{
    const venueHome = (r.venue === 'Home' || r.venue === 'home' || r.venue === 1)
    const gf = Number(r.gf) || 0
    const ga = Number(r.ga) || 0
    const predicted = venueHome || (gf > ga)
    return predicted?1:0
  })
}

export default function ModelResults({ rows }){
  const results = useMemo(()=>{
    if(!rows||rows.length===0) return null
    const preds = simpleModelPredict(rows)
    const actual = rows.map(r=> (r.result==='W' || r.result==='w' || r.result==='Win')?1:0)
    let tp=0,tn=0,fp=0,fn=0
    for(let i=0;i<preds.length;i++){
      if(preds[i]===1 && actual[i]===1) tp++
      if(preds[i]===0 && actual[i]===0) tn++
      if(preds[i]===1 && actual[i]===0) fp++
      if(preds[i]===0 && actual[i]===1) fn++
    }
    const accuracy = (tp+tn)/(tp+tn+fp+fn) || 0
    const precision = tp/(tp+fp) || 0
    return { preds, actual, tp,tn,fp,fn, accuracy, precision }
  },[rows])

  if(!results) return <div className="card">Choose a team to see model results.</div>

  return (
    <div className="card">
      <h3>Model results (simple rule-based)</h3>
      <div>Matches: {rows.length}</div>
      <div>Accuracy: {(results.accuracy*100).toFixed(1)}%</div>
      <div>Precision: {(results.precision*100).toFixed(1)}%</div>
      <h4>Confusion</h4>
      <table>
        <thead><tr><th></th><th>Pred=1</th><th>Pred=0</th></tr></thead>
        <tbody>
          <tr><th>Actual=1</th><td>{results.tp}</td><td>{results.fn}</td></tr>
          <tr><th>Actual=0</th><td>{results.fp}</td><td>{results.tn}</td></tr>
        </tbody>
      </table>

      <h4>Predictions sample</h4>
      <div style={{overflow:'auto'}}>
        <table>
          <thead>
            <tr><th>date</th><th>opponent</th><th>venue</th><th>pred</th><th>actual</th></tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}><td>{r.date}</td><td>{r.opponent}</td><td>{r.venue}</td><td>{results.preds[i]}</td><td>{results.actual[i]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
