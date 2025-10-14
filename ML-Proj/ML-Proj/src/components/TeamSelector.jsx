export default function TeamSelector({ teams, value, onChange }) {
  return (
    <div className="team-selector card">
      <label>Team
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">-- choose team --</option>
          {teams.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
    </div>
  )
}
