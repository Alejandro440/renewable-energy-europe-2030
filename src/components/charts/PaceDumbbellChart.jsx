/**
 * PaceDumbbellChart – compara ritmo reciente observado vs ritmo requerido.
 * Gráfico de mancuernas (dumbbell chart): cada país tiene dos puntos
 * conectados por una línea.
 *
 * Eje X: pp/año
 * Dot izquierdo (azul): recent_pace (ritmo observado 2020–2024)
 * Dot derecho (rojo): required_pace (ritmo necesario hasta 2030)
 * Si recent_pace >= required_pace: el país está en camino (verde/azul).
 */
import React from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer, Cell,
} from 'recharts'
import { PACE_STATUS_COLORS } from '../../utils/colors.js'
import PaceStatusBadge from '../ui/PaceStatusBadge.jsx'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
      <p className="font-bold mb-1">{d.geo_name}</p>
      <p className="text-blue-700">Ritmo observado: <strong>{d.recent_pace != null ? `${d.recent_pace.toFixed(2)} pp/año` : '–'}</strong></p>
      <p className="text-red-700">Ritmo necesario: <strong>{d.required_pace === 0 ? 'Objetivo alcanzado ✓' : `${d.required_pace.toFixed(2)} pp/año`}</strong></p>
      <p className="text-gray-600 mt-1">Cuota {d.year}: <strong>{d.share_ren_pct?.toFixed(1)}%</strong></p>
      <div className="mt-2"><PaceStatusBadge status={d.pace_status} small /></div>
    </div>
  )
}

// Custom dot renderer for the dumbbell
function DumbbellRow({ x, y, data, xScale, height = 18 }) { return null }

// We render a custom SVG-based dumbbell via a pure Recharts approach
// using two overlapping bar charts + custom lines
export default function PaceDumbbellChart({ data }) {
  // Sort: countries far behind first (highest required_pace)
  const sorted = [...data]
    .filter(d => d.recent_pace != null)
    .sort((a, b) => b.required_pace - a.required_pace)

  const maxVal = Math.max(
    ...sorted.map(d => Math.max(d.required_pace || 0, d.recent_pace || 0)),
    1
  )

  // We use a custom SVG layout
  const rowHeight = 26
  const marginLeft = 110
  const marginRight = 20
  const marginTop = 30
  const marginBottom = 20
  const chartWidth = 600
  const availableWidth = chartWidth - marginLeft - marginRight
  const totalHeight = marginTop + sorted.length * rowHeight + marginBottom

  const xScale = (val) => (val / (maxVal * 1.1)) * availableWidth

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width="100%"
        viewBox={`0 0 ${chartWidth} ${totalHeight}`}
        role="img"
        aria-label="Gráfico de mancuernas: ritmo observado vs ritmo necesario por país"
        style={{ maxWidth: 700, minWidth: 320 }}
      >
        {/* Axis label */}
        <text x={marginLeft + availableWidth / 2} y={15} textAnchor="middle" fontSize={10} fill="#6b7280">
          pp/año (puntos porcentuales por año)
        </text>

        {/* Reference line at 0 */}
        <line
          x1={marginLeft + xScale(0)} y1={marginTop - 5}
          x2={marginLeft + xScale(0)} y2={totalHeight - marginBottom}
          stroke="#d1d5db" strokeWidth={1}
        />

        {/* X-axis ticks */}
        {[0, 1, 2, 3, 4, 5].filter(v => v <= maxVal * 1.1).map(tick => (
          <g key={tick}>
            <line
              x1={marginLeft + xScale(tick)} y1={marginTop - 5}
              x2={marginLeft + xScale(tick)} y2={totalHeight - marginBottom}
              stroke="#f3f4f6" strokeWidth={1}
            />
            <text
              x={marginLeft + xScale(tick)} y={marginTop - 8}
              textAnchor="middle" fontSize={9} fill="#9ca3af"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Rows */}
        {sorted.map((d, i) => {
          const cy = marginTop + i * rowHeight + rowHeight / 2
          const xRecent   = marginLeft + xScale(Math.max(0, d.recent_pace))
          const xRequired = marginLeft + xScale(d.required_pace)
          const isOnTrack = d.recent_pace >= d.required_pace && d.recent_pace > 0
          const color = PACE_STATUS_COLORS[d.pace_status] || '#9e9e9e'

          return (
            <g key={d.geo_code} aria-label={`${d.geo_name}: observado ${d.recent_pace?.toFixed(2)}, necesario ${d.required_pace.toFixed(2)}`}>
              {/* Country label */}
              <text x={marginLeft - 6} y={cy + 4} textAnchor="end" fontSize={10} fill="#374151">
                {d.geo_name}
              </text>

              {/* Connector line */}
              <line
                x1={Math.min(xRecent, xRequired)} y1={cy}
                x2={Math.max(xRecent, xRequired)} y2={cy}
                stroke={color} strokeWidth={2} opacity={0.5}
              />

              {/* Dot: required_pace (circle) */}
              <circle cx={xRequired} cy={cy} r={5} fill={color} stroke="white" strokeWidth={1.5} />

              {/* Dot: recent_pace (diamond shape via rect rotated) */}
              <rect
                x={xRecent - 4.5} y={cy - 4.5}
                width={9} height={9}
                transform={`rotate(45, ${xRecent}, ${cy})`}
                fill={isOnTrack ? '#1b5e20' : '#6b7280'}
                stroke="white" strokeWidth={1.5}
              />
            </g>
          )
        })}

        {/* Legend */}
        <g transform={`translate(${marginLeft}, ${totalHeight - marginBottom + 5})`}>
          <circle cx={0} cy={4} r={5} fill="#b71c1c" />
          <text x={10} y={8} fontSize={9} fill="#374151">Ritmo necesario (relleno = estado)</text>
          <rect x={120} y={0} width={9} height={9} transform="rotate(45, 124, 4)" fill="#6b7280" />
          <text x={134} y={8} fontSize={9} fill="#374151">Ritmo observado 2020–2024</text>
          <rect x={254} y={0} width={9} height={9} transform="rotate(45, 258, 4)" fill="#1b5e20" />
          <text x={268} y={8} fontSize={9} fill="#374151">Observado ≥ necesario (en camino)</text>
        </g>
      </svg>
    </div>
  )
}
