/**
 * CurrentStatusSection – situación actual de cada país (sector Total).
 *
 * Siempre muestra la cuota total de energía renovable (sector REN).
 * Las métricas derivadas gap_to_target_pp, required_pace y pace_status
 * solo son significativas para el sector total y se calculan únicamente
 * para ese sector; por ello esta sección no varía con el filtro de sector.
 * El análisis sectorial desglosado se encuentra en la sección "Sectores".
 */
import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext.jsx'
import SectionWrapper from '../ui/SectionWrapper.jsx'
import CountryBarChart from '../charts/CountryBarChart.jsx'
import PaceStatusBadge from '../ui/PaceStatusBadge.jsx'
import { EU27_CODES } from '../../utils/regions.js'

const SORT_OPTIONS = [
  { value: 'share',    label: 'Cuota actual ↑' },
  { value: 'gap',      label: 'Brecha al objetivo ↓' },
  { value: 'required', label: 'Ritmo necesario ↓' },
]

export default function CurrentStatusSection() {
  const { latestTotalAll, selectedRegion, latestYear } = useData()
  const [sortBy, setSortBy] = useState('share')
  const [showNonEU, setShowNonEU] = useState(false)

  const chartData = useMemo(() => {
    return latestTotalAll.filter(d => {
      if (d.geo_code === 'EU27_2020') return false
      if (!showNonEU && !EU27_CODES.includes(d.geo_code)) return false
      if (selectedRegion && d.region !== selectedRegion) return false
      return d.share_ren_pct != null
    })
  }, [latestTotalAll, selectedRegion, showNonEU])

  return (
    <SectionWrapper
      id="estado-actual"
      title="Estado actual: ¿dónde está cada país?"
      subtitle={`Cuota total de energía renovable en ${latestYear}. Línea azul: objetivo europeo 42,5 % para 2030 (Directiva RED III). El análisis sectorial desglosado está en la sección Sectores.`}
    >
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Ordenar por:</span>
          <div className="flex gap-1">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-3 py-1 rounded text-sm border transition-colors ${
                  sortBy === opt.value
                    ? 'bg-blue-800 text-white border-blue-800'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                }`}
                aria-pressed={sortBy === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showNonEU}
            onChange={e => setShowNonEU(e.target.checked)}
            className="rounded"
          />
          Incluir Islandia y Noruega
        </label>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        {[
          'At or above target',
          'On track',
          'Needs acceleration',
          'Far behind',
        ].map(status => (
          <PaceStatusBadge key={status} status={status} small />
        ))}
        <span className="text-gray-400 self-center ml-2">
          · Colores por ritmo de avance necesario (cuota total)
        </span>
      </div>

      {/* Chart */}
      <div className="w-full overflow-x-auto">
        <CountryBarChart data={chartData} sortBy={sortBy} />
      </div>

      {/* Note */}
      <p className="text-xs text-gray-400 mt-4">
        Fuente: Eurostat NRG_IND_REN · Objetivo: 42,5 % (Directiva RED III, 2023) ·
        Cuota total sobre consumo final bruto de energía.
      </p>
    </SectionWrapper>
  )
}
