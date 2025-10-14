import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import csv from 'csvtojson'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

// Look for CSV in current working dir first, then parent directory (handles repository layout)
let csvPath = path.resolve(process.cwd(), 'premier_league_matches.csv')
if (!fs.existsSync(csvPath)) {
  const parentPath = path.resolve(process.cwd(), '..', 'premier_league_matches.csv')
  if (fs.existsSync(parentPath)) csvPath = parentPath
}

app.get('/api/matches', async (req, res) => {
  try {
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'CSV not found' })
    const json = await csv().fromFile(csvPath)
    return res.json(json)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
})

// Serve static build if exists
const dist = path.resolve(process.cwd(), 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
