import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function RollingChart({ rows = [], windowSize = 3 }) {
  const numericCols = ['gf', 'ga', 'sot']
  const colLabels = { gf: 'Goals For', ga: 'Goals Against', sot: 'Shots on Target' }

  const labels = useMemo(() => rows.map(r => r.date || ''), [rows])

  const datasets = useMemo(() => {
    return numericCols.map((col, i) => {
      const data = rows.map((_, idx) => {
        const start = Math.max(0, idx - windowSize)
        const slice = rows.slice(start, idx)
        const vals = slice.map(r => Number(r[col]) || 0)
        if (!vals.length) return null
        return vals.reduce((a, b) => a + b, 0) / vals.length
      })
      const colors = ['#4f46e5', '#ef4444', '#06b6d4']
      return {
        label: colLabels[col] || col,
        data,
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length],
        tension: 0.25,
        spanGaps: true,
      }
    })
  }, [rows, windowSize])

  const data = { labels, datasets }
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Rolling ${windowSize}-match averages` },
    },
    scales: { y: { beginAtZero: true } },
  }

  return (
    <div className="card" style={{ padding: 12, marginBottom: 12 }}>
      <Line data={data} options={options} />
    </div>
  )
}
