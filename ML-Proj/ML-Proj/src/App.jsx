import { useEffect, useState, createContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Analyze from './pages/Analyze'
import Home from './pages/Home'
import Teams from './pages/Teams'
import MatchDetails from './pages/MatchDetails'
import About from './pages/About'
import './App.css'

export const MatchesContext = createContext({ matches: [], setMatches: () => {} })

function App() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const apiBase = import.meta.env.DEV ? 'http://localhost:3000' : ''
        const res = await fetch(`${apiBase}/api/matches`)
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data = await res.json()
        setMatches(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <MatchesContext.Provider value={{ matches, setMatches }}>
      <div className="app">
        <Navbar />

        <div className="page">
          {loading && <p>Loading matches…</p>}
          {error && <p className="error">Error: {error}</p>}

          {!loading && !error && (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/match/:id" element={<MatchDetails />} />
              <Route path="/analyze" element={<Analyze />} />
            </Routes>
          )}
        </div>
      </div>
    </MatchesContext.Provider>
  )
}

export default App
