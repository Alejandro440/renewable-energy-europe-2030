/**
 * CountryBarChart – ranking horizontal de países por cuota renovable.
 *
 * Props:
 *   data                     – array de filas {geo_code, geo_name, share_ren_pct, ...}
 *   sortBy                   – 'share' | 'gap' | 'required'
 *   sectorLabel              – etiqueta del sector mostrado (para el tooltip)
 *   showTarget   = true      – pinta la línea de referencia 42,5 % (sólo para sector Total)
 *   colorByPaceStatus = true – si false, usa un color uniforme `barColor`
 *   barColor     = undefined – color uniforme cuando no se colorea por pace_status
 *   showPaceMetricsInTooltip = true – muestra brecha / ritmo necesario / reciente (sólo Total)
 */
import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ReferenceLine, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { PACE_STATUS_COLORS } from '../../utils/colors.js'
import { pct } from '../../utils/formatters.js'
import PaceStatusBadge from '../ui/PaceStatusBadge.jsx'

const TARGET = 42.5

function makeTooltip({ sectorLabel, showPaceMetricsInTooltip }) {
  return function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
        <p className="font-bold text-gray-900 mb-1">{d.geo_name}</p>
        <p className="text-gray-700">
          {sectorLabel ? `Cuota (${sectorLabel})` : 'Cuota renovable'}: <strong>{pct(d.share_ren_pct)}</strong>
        </p>
        {showPaceMetricsInTooltip && d.gap_to_target_pp != null && (
          <p className="text-gray-700">Brecha al objetivo: <strong>{d.gap_to_target_pp > 0 ? `–${d.gap_to_target_pp.toFixed(1)} pp` : '✓ Superado'}</strong></p>
        )}
        {showPaceMetricsInTooltip && d.required_pace != null && d.required_pace > 0 && (
          <p className="text-gray-700">Ritmo necesario: <strong>{d.required_pace.toFixed(2)} pp/año</strong></p>
        )}
        {showPaceMetricsInTooltip && d.recent_pace != null && (
          <p className="text-gray-700">Ritmo reciente: <strong>{d.recent_pace.toFixed(2)} pp/año</strong></p>
        )}
        {showPaceMetricsInTooltip && d.pace_status && (
          <div className="mt-2">
            <PaceStatusBadge status={d.pace_status} small />
          </div>
        )}
      </div>
    )
  }
}

export default function CountryBarChart({
  data,
  sortBy = 'share',
  sectorLabel,
  showTarget = true,
  colorByPaceStatus = true,
  barColor = '#1565c0',
  showPaceMetricsInTooltip = true,
}) {
  const sorted = [...data].sort((a, b) => {
    // Todas las ordenaciones son descendentes (mayor → menor) para que produzcan
    // órdenes visualmente distintos. share-DESC y gap-DESC son recíprocos
    // (gap = 42,5 − share), y required-DESC mete a los países ya en objetivo
    // al final con required_pace = 0.
    if (sortBy === 'share')    return (b.share_ren_pct    ?? -Infinity) - (a.share_ren_pct    ?? -Infinity)
    if (sortBy === 'gap')      return (b.gap_to_target_pp ?? -Infinity) - (a.gap_to_target_pp ?? -Infinity)
    if (sortBy === 'required') return (b.required_pace    ?? -Infinity) - (a.required_pace    ?? -Infinity)
    return (b.share_ren_pct ?? -Infinity) - (a.share_ren_pct ?? -Infinity)
  })

  const maxVal = Math.max(
    ...sorted.map(d => d.share_ren_pct || 0),
    showTarget ? TARGET + 5 : 0,
    50,
  )

  const Tip = makeTooltip({ sectorLabel, showPaceMetricsInTooltip })

  return (
    <ResponsiveContainer width="100%" height={Math.max(500, sorted.length * 28)}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 8, right: 80, left: 100, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
        <XAxis
          type="number"
          domain={[0, Math.ceil(maxVal / 10) * 10]}
          tickFormatter={v => `${v}%`}
          tick={{ fontSize: 11 }}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="geo_name"
          width={95}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<Tip />} />
        {showTarget && (
          <ReferenceLine
            x={TARGET}
            stroke="#003399"
            strokeWidth={2}
            strokeDasharray="6 3"
            label={{
              value: `Objetivo 42,5 %`,
              position: 'insideTopRight',
              fontSize: 10,
              fill: '#003399',
              fontWeight: 600,
            }}
          />
        )}
        <Bar dataKey="share_ren_pct" radius={[0, 3, 3, 0]} maxBarSize={22}>
          {sorted.map(entry => (
            <Cell
              key={entry.geo_code}
              fill={colorByPaceStatus
                ? (PACE_STATUS_COLORS[entry.pace_status] || '#9e9e9e')
                : barColor}
            />
          ))}
          <LabelList
            dataKey="share_ren_pct"
            position="right"
            formatter={v => `${v?.toFixed(1)}%`}
            style={{ fontSize: 10, fill: '#374151' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
