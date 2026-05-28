/**
 * TimelineChart – línea temporal de cuota renovable.
 * Muestra EU-27 + países seleccionados. Línea de referencia en 42,5 %.
 */
import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Legend, ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import { pct } from '../../utils/formatters.js'

const TARGET = 42.5
const TARGET_YEAR = 2030

const COUNTRY_PALETTE = [
  '#1565c0','#b71c1c','#2e7d32','#6a1b9a',
  '#e65100','#00838f','#f57f17','#37474f',
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value != null ? pct(p.value) : '–'}</strong>
        </p>
      ))}
    </div>
  )
}

export default function TimelineChart({ eu27Series, countrySeries, countryNames, showTarget = true }) {
  // Build combined data keyed by year
  const allYears = Array.from(
    new Set([...eu27Series.map(d => d.year), ...countrySeries.flatMap(s => s.map(d => d.year))])
  ).sort((a, b) => a - b)

  const chartData = allYears.map(year => {
    const eu27 = eu27Series.find(d => d.year === year)
    const row = { year, 'EU-27': eu27?.share_ren_pct ?? null }
    countrySeries.forEach((series, i) => {
      const pt = series.find(d => d.year === year)
      row[countryNames[i]] = pt?.share_ren_pct ?? null
    })
    return row
  })

  const countryKeys = countryNames

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 16, right: 32, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, Math.max(70, TARGET + 10)]}
          tickFormatter={v => `${v}%`}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12 }}
        />
        {/* Target reference line — only for Total sector */}
        {showTarget && (
          <ReferenceLine
            y={TARGET}
            stroke="#003399"
            strokeWidth={2}
            strokeDasharray="6 3"
            label={{
              value: 'Objetivo 2030 (42,5 %)',
              position: 'insideTopRight',
              fontSize: 10,
              fill: '#003399',
              fontWeight: 600,
            }}
          />
        )}
        {/* EU-27 main line */}
        <Line
          type="monotone"
          dataKey="EU-27"
          stroke="#003399"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 5 }}
          connectNulls
        />
        {/* Country lines */}
        {countryKeys.map((name, i) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={COUNTRY_PALETTE[i % COUNTRY_PALETTE.length]}
            strokeWidth={1.5}
            strokeDasharray={i % 2 === 0 ? undefined : '4 2'}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
