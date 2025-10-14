import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">PL Dashboard</Link>
      </div>
      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/analyze">Analyze</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  )
}
