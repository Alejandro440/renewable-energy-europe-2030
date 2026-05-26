/**
 * SectorSmallMultiples – 4 paneles, uno por sector.
 * Muestra la cuota renovable de un país en cada sector (último año).
 * Destaca la asimetría electricidad vs transporte.
 */
import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, ReferenceLine,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { SECTOR_COLORS, SECTOR_LABELS_ES } from '../../utils/colors.js'
import { pct } from '../../utils/formatters.js'

const TARGET = 42.5
const SECTORS = ['Total', 'Electricity', 'Heating & Cooling', 'Transport']
const NRG_MAP = {
  'Total': 'REN',
  'Electricity': 'REN_ELC',
  'Heating & Cooling': 'REN_HEAT_CL',
  'Transport': 'REN_TRA',
}

function SectorPanel({ sector, data, maxVal }) {
  const color = SECTOR_COLORS[sector]
  const label = SECTOR_LABELS_ES[sector]

  // Sort countries descending by share
  const sorted = [...data].sort((a, b) => (b.share_ren_pct ?? -1) - (a.share_ren_pct ?? -1))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
        <h4 className="font-semibold text-gray-800 text-sm">{label}</h4>
        {sector === 'Electricity' && (
          <span className="ml-auto text-xs bg-blue-100 text-blue-800 rounded px-1.5 py-0.5">
            Mayor avance
          </span>
        )}
        {sector === 'Transport' && (
          <span className="ml-auto text-xs bg-red-100 text-red-700 rounded px-1.5 py-0.5">
            Mayor brecha
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 40, left: 72, bottom: 0 }}
        >
          <XAxis
            type="number"
            domain={[0, Math.ceil(maxVal / 10) * 10]}
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="geo_name"
            width={70}
            tick={{ fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v, name) => [pct(v), name]}
            labelStyle={{ fontWeight: 600 }}
            contentStyle={{ fontSize: 11 }}
          />
          {sector === 'Total' && (
            <ReferenceLine
              x={TARGET}
              stroke="#003399"
              strokeDasharray="4 2"
              strokeWidth={1.5}
            />
          )}
          <Bar dataKey="share_ren_pct" radius={[0, 2, 2, 0]} maxBarSize={14}>
            {sorted.map(entry => (
              <Cell key={entry.geo_code} fill={color} opacity={entry.share_ren_pct != null ? 0.85 : 0.2} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 mt-1 text-right">
        Media UE-27: <strong>
          {(sorted.filter(d => d.share_ren_pct != null).reduce((s, d) => s + (d.share_ren_pct||0), 0) /
           Math.max(1, sorted.filter(d => d.share_ren_pct != null).length)).toFixed(1)}%
        </strong>
        {sector === 'Total' && <span className="ml-1 text-blue-500">· ─ obj. 42,5%</span>}
      </p>
    </div>
  )
}

export default function SectorSmallMultiples({ allSectorsData, geoCodes }) {
  // For each sector, build array of {geo_code, geo_name, share_ren_pct}
  const byNrg = {}
  SECTORS.forEach(sector => {
    const nrg = NRG_MAP[sector]
    byNrg[sector] = geoCodes
      .map(code => {
        const row = allSectorsData.find(d => d.geo_code === code && d.nrg_bal === nrg)
        return {
          geo_code: code,
          geo_name: row?.geo_name || code,
          share_ren_pct: row?.share_ren_pct ?? null,
        }
      })
      .filter(d => d.share_ren_pct != null)
  })

  // Max value across all sectors for consistent x-axis
  const allVals = Object.values(byNrg).flat().map(d => d.share_ren_pct || 0)
  const maxVal  = Math.max(...allVals, TARGET + 5)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {SECTORS.map(sector => (
        <SectorPanel
          key={sector}
          sector={sector}
          data={byNrg[sector]}
          maxVal={maxVal}
        />
      ))}
    </div>
  )
}
