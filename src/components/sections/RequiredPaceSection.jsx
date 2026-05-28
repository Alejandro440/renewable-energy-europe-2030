/**
 * RequiredPaceSection – sección central de la visualización.
 * Muestra qué países necesitan acelerar más para alcanzar el 42,5 % en 2030.
 */
import { useMemo } from 'react'
import { useData } from '../../context/DataContext.jsx'
import SectionWrapper from '../ui/SectionWrapper.jsx'
import PaceDumbbellChart from '../charts/PaceDumbbellChart.jsx'
import PaceStatusBadge from '../ui/PaceStatusBadge.jsx'
import StatCard from '../ui/StatCard.jsx'
import { EU27_CODES } from '../../utils/regions.js'
import { PACE_STATUS_COLORS } from '../../utils/colors.js'

const LATEST_YEAR = 2024
const TARGET = 42.5

export default function RequiredPaceSection() {
  const { latestTotalAll, selectedRegion, rawData } = useData()

  const eu27Data = useMemo(() => {
    return latestTotalAll.filter(d => {
      if (!EU27_CODES.includes(d.geo_code)) return false
      if (selectedRegion && d.region !== selectedRegion) return false
      return true
    })
  }, [latestTotalAll, selectedRegion])

  const maxRequired = eu27Data.reduce((m, d) => Math.max(m, d.required_pace ?? 0), 0)
  const hardestCountry = eu27Data.find(d => d.required_pace === maxRequired)
  const eu27Row = latestTotalAll.find(d => d.geo_code === 'EU27_2020')
  const eu27Req = eu27Row ? ((TARGET - eu27Row.share_ren_pct) / (2030 - LATEST_YEAR)).toFixed(2) : '–'

  // Historical EU-27 pace 2004→latest (computed from data, not hardcoded)
  const eu27Hist = useMemo(() => {
    const series = rawData
      .filter(d => d.geo_code === 'EU27_2020' && d.nrg_bal === 'REN')
      .sort((a, b) => a.year - b.year)
    const s2004 = series.find(d => d.year === 2004)?.share_ren_pct
    const sLast = series.find(d => d.year === LATEST_YEAR)?.share_ren_pct
    if (s2004 == null || sLast == null) return null
    return ((sLast - s2004) / (LATEST_YEAR - 2004))
  }, [rawData])

  return (
    <SectionWrapper
      id="ritmo-necesario"
      title="Ritmo necesario: ¿quién necesita acelerar más?"
      subtitle={`¿A qué velocidad (pp/año) debe avanzar cada país para alcanzar el 42,5 % en 2030 desde su cuota de ${LATEST_YEAR}?`}
      dark
    >
      {/* Explanation box */}
      <div className="bg-white/10 rounded-xl p-5 mb-8 border border-white/20 max-w-3xl">
        <h3 className="text-yellow-300 font-semibold mb-2">¿Qué es el <em>ritmo necesario</em>?</h3>
        <p className="text-blue-100 text-sm leading-relaxed mb-2">
          El <strong className="text-white">ritmo necesario</strong> (<code>required_pace</code>) es la
          velocidad anual en puntos porcentuales (pp/año) que cada país necesita mantener
          desde {LATEST_YEAR} hasta 2030 para alcanzar el objetivo del 42,5 %. Se calcula como:
        </p>
        <code className="block bg-black/30 text-green-300 text-sm px-4 py-2 rounded font-mono mb-2">
          required_pace = max(0, 42,5 − cuota_{LATEST_YEAR}) / (2030 − {LATEST_YEAR})
        </code>
        <p className="text-blue-200 text-xs">
          Un valor de 0 significa que el país ya ha superado el objetivo.
          El <strong className="text-white">ritmo observado</strong> es la variación media anual entre 2020 y {LATEST_YEAR}.
          Si el ritmo observado supera al necesario, el país está en camino.
        </p>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard dark label="Ritmo necesario UE-27" value={`${eu27Req} pp/año`} note="Desde 2024 hasta 2030" color="#facc15" />
        <StatCard dark label="Más rezagado (UE-27)" value={hardestCountry?.geo_name || '–'}
          note={hardestCountry ? `${hardestCountry.required_pace.toFixed(2)} pp/año` : ''} color="#fca5a5" />
        <StatCard dark label="Países en camino" value={eu27Data.filter(d => ['At or above target','On track'].includes(d.pace_status)).length}
          note="Ritmo observado suficiente" color="#86efac" />
        <StatCard
          dark
          label="Ritmo histórico UE-27"
          value={eu27Hist != null ? `≈ ${eu27Hist.toFixed(2)} pp/año` : '–'}
          note={`Media 2004–${LATEST_YEAR} (real)`}
          color="#93c5fd"
        />
      </div>

      {/* Dumbbell chart */}
      <div className="mb-6">
        <p className="text-blue-200 text-sm mb-4">
          Cada país muestra su <span className="text-red-300 font-medium">ritmo necesario ●</span> y
          su <span className="text-gray-400 font-medium">ritmo observado ◆</span>.
          Cuando el rombo supera al círculo, el país avanza lo suficientemente rápido.
        </p>
        <PaceDumbbellChart data={eu27Data} />
      </div>

      {/* Status distribution */}
      <div className="mt-6">
        <h3 className="text-white font-semibold mb-3">Distribución por estado de avance</h3>
        <div className="flex flex-wrap gap-3">
          {[
            'At or above target','On track','Needs acceleration','Far behind'
          ].map(status => {
            const count = eu27Data.filter(d => d.pace_status === status).length
            const countries = eu27Data.filter(d => d.pace_status === status).map(d => d.geo_name)
            return (
              <div key={status}
                className="rounded-xl p-4 flex-1 min-w-36 border border-white/20"
                style={{ backgroundColor: (PACE_STATUS_COLORS[status] || '#9e9e9e') + '22' }}
              >
                <div className="text-3xl font-bold mb-1" style={{ color: PACE_STATUS_COLORS[status] }}>
                  {count}
                </div>
                <PaceStatusBadge status={status} small />
                <p className="text-xs text-blue-200 mt-2">{countries.slice(0,4).join(', ')}{count > 4 ? '…' : ''}</p>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-blue-400 mt-6">
        Fuente: Eurostat NRG_IND_REN · Objetivo: 42,5 % (Directiva RED III) ·
        Ritmo observado calculado como variación media anual 2020–{LATEST_YEAR}.
      </p>
    </SectionWrapper>
  )
}
