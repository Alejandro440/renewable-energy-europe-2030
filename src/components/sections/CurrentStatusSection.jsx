/**
 * CurrentStatusSection – situación actual de cada país.
 *
 * Responde al filtro global de sector:
 *   - Sector Total: ranking de cuota total + línea de referencia 42,5 % +
 *     coloreado por pace_status + tooltip con brecha y ritmos.
 *   - Resto de sectores: ranking de cuota del sector seleccionado, sin línea
 *     de objetivo (el 42,5 % aplica al agregado), color sectorial uniforme,
 *     tooltip sólo con la cuota. Las ordenaciones por brecha y ritmo necesario
 *     se ocultan porque sólo están definidas para el sector total.
 */
import { useState, useMemo, useEffect } from 'react'
import { useData } from '../../context/DataContext.jsx'
import SectionWrapper from '../ui/SectionWrapper.jsx'
import CountryBarChart from '../charts/CountryBarChart.jsx'
import PaceStatusBadge from '../ui/PaceStatusBadge.jsx'
import { EU27_CODES } from '../../utils/regions.js'
import { SECTOR_COLORS, SECTOR_LABELS_ES } from '../../utils/colors.js'

const SECTOR_TO_NRGBAL = {
  'Total':             'REN',
  'Electricity':       'REN_ELC',
  'Heating & Cooling': 'REN_HEAT_CL',
  'Transport':         'REN_TRA',
}

const SORT_OPTIONS_TOTAL = [
  { value: 'share',    label: 'Cuota actual ↓' },
  { value: 'gap',      label: 'Brecha al objetivo ↓' },
  { value: 'required', label: 'Ritmo necesario ↓' },
]

const SORT_OPTIONS_SECTOR = [
  { value: 'share', label: 'Cuota actual ↓' },
]

export default function CurrentStatusSection() {
  const { latestAllSectors, selectedSector, selectedRegion, latestYear } = useData()
  const [sortBy, setSortBy] = useState('share')
  const [showNonEU, setShowNonEU] = useState(false)

  const isTotal = selectedSector === 'Total'
  const currentNrgBal = SECTOR_TO_NRGBAL[selectedSector] || 'REN'
  const sectorLabelEs = SECTOR_LABELS_ES[selectedSector] || 'Total'

  // Si se cambia a un sector ≠ Total, las ordenaciones por brecha/ritmo no aplican.
  // Forzamos sortBy = 'share' para evitar quedar en un estado sin efecto visual.
  useEffect(() => {
    if (!isTotal && sortBy !== 'share') setSortBy('share')
  }, [isTotal, sortBy])

  const chartData = useMemo(() => {
    return latestAllSectors.filter(d => {
      if (d.nrg_bal !== currentNrgBal) return false
      if (d.geo_code === 'EU27_2020') return false
      if (!showNonEU && !EU27_CODES.includes(d.geo_code)) return false
      if (selectedRegion && d.region !== selectedRegion) return false
      return d.share_ren_pct != null
    })
  }, [latestAllSectors, currentNrgBal, selectedRegion, showNonEU])

  const sortOptions = isTotal ? SORT_OPTIONS_TOTAL : SORT_OPTIONS_SECTOR

  const subtitle = isTotal
    ? `Cuota total de energía renovable en ${latestYear}. Línea azul: objetivo europeo 42,5 % para 2030 (Directiva RED III). Cambia el sector con el filtro superior para ver el ranking de cada sector individual.`
    : `Cuota de renovables en ${sectorLabelEs.toLowerCase()} en ${latestYear}. El objetivo del 42,5 % aplica a la cuota total, no a cada sector individual, por eso aquí no se muestra la línea de referencia. Vuelve al sector Total para ver brechas y ritmos comparados con el objetivo.`

  return (
    <SectionWrapper
      id="estado-actual"
      title={isTotal
        ? 'Estado actual: ¿dónde está cada país?'
        : `Estado actual (${sectorLabelEs.toLowerCase()}): ¿dónde está cada país?`}
      subtitle={subtitle}
    >
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Ordenar por:</span>
          <div className="flex gap-1">
            {sortOptions.map(opt => (
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

      {/* Legend (sólo en sector Total: las categorías pace_status sólo existen ahí) */}
      {isTotal && (
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
      )}

      {/* Chart */}
      <div className="w-full overflow-x-auto">
        <CountryBarChart
          data={chartData}
          sortBy={sortBy}
          sectorLabel={sectorLabelEs}
          showTarget={isTotal}
          colorByPaceStatus={isTotal}
          barColor={SECTOR_COLORS[selectedSector] || '#1565c0'}
          showPaceMetricsInTooltip={isTotal}
        />
      </div>

      {/* Note */}
      <p className="text-xs text-gray-400 mt-4">
        Fuente: Eurostat NRG_IND_REN · {isTotal
          ? 'Objetivo: 42,5 % (Directiva RED III, 2023) · Cuota total sobre consumo final bruto de energía.'
          : `Cuota de renovables en ${sectorLabelEs.toLowerCase()} sobre el consumo final bruto del sector.`}
      </p>
    </SectionWrapper>
  )
}
