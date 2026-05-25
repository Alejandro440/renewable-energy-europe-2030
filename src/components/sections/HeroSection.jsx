import { useData } from '../../context/DataContext.jsx'
import { pct } from '../../utils/formatters.js'
import StatCard from '../ui/StatCard.jsx'

const TARGET = 42.5
const LATEST_YEAR = 2024

export default function HeroSection() {
  const { eu27TimeSeries, latestTotalAll, loading } = useData()

  const eu27Latest = eu27TimeSeries.find(d => d.year === LATEST_YEAR)
  const eu27Share  = eu27Latest?.share_ren_pct ?? null

  // Count pace statuses in EU-27
  const eu27Countries = latestTotalAll.filter(d =>
    ['AT','BE','BG','CY','CZ','DE','DK','EE','EL','ES',
     'FI','FR','HR','HU','IE','IT','LT','LU','LV','MT',
     'NL','PL','PT','RO','SE','SI','SK'].includes(d.geo_code)
  )
  const atTarget   = eu27Countries.filter(d => d.pace_status === 'At or above target').length
  const onTrack    = eu27Countries.filter(d => d.pace_status === 'On track').length
  const needsAccel = eu27Countries.filter(d => d.pace_status === 'Needs acceleration').length
  const farBehind  = eu27Countries.filter(d => d.pace_status === 'Far behind').length

  const gapEU = eu27Share !== null ? (TARGET - eu27Share).toFixed(1) : '–'

  if (loading) return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center text-white text-xl">
      Cargando datos…
    </div>
  )

  return (
    <section
      id="hero"
      className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20 px-4 sm:px-8 lg:px-16 min-h-screen flex items-center"
      aria-labelledby="hero-title"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Badge */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">☀️</span>
          <span className="text-yellow-300 text-sm font-semibold uppercase tracking-widest">
            Visualización de Datos · UOC 2026
          </span>
        </div>

        {/* Title */}
        <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          ¿Está Europa{' '}
          <span className="text-yellow-300">en camino?</span>
        </h1>
        <p className="text-xl sm:text-2xl text-blue-200 mb-4 max-w-3xl">
          La carrera de los países europeos hacia los objetivos de energía renovable 2030
        </p>
        <p className="text-blue-300 max-w-2xl mb-10 leading-relaxed">
          La Unión Europea se ha comprometido a alcanzar una cuota mínima de{' '}
          <strong className="text-white">42,5 %</strong> de energía renovable sobre el
          consumo final bruto en 2030 (Directiva RED III). Esta visualización analiza qué
          países están avanzando suficientemente rápido y dónde se concentra la brecha más
          grande.
        </p>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="UE-27 en 2024"
            value={eu27Share !== null ? pct(eu27Share) : '…'}
            note="Cuota renovable total"
            color="#facc15"
            dark
          />
          <StatCard
            label="Objetivo 2030"
            value="42,5 %"
            note="Directiva RED III (UE)"
            color="#86efac"
            dark
          />
          <StatCard
            label="Brecha actual UE-27"
            value={`${gapEU} pp`}
            note="Puntos porcentuales restantes"
            color="#fca5a5"
            dark
          />
          <StatCard
            label="Ritmo necesario UE"
            value={eu27Share !== null ? `${((TARGET - eu27Share) / (2030 - LATEST_YEAR)).toFixed(2)} pp/año` : '…'}
            note="Para alcanzar 42,5 % desde 2024"
            color="#93c5fd"
            dark
          />
        </div>

        {/* Countries summary */}
        <div className="flex flex-wrap gap-4 text-sm mb-10">
          {[
            { count: atTarget,   label: 'ya en/sobre objetivo', color: '#16a34a' },
            { count: onTrack,    label: 'en camino',            color: '#22c55e' },
            { count: needsAccel, label: 'necesitan acelerar',   color: '#f97316' },
            { count: farBehind,  label: 'muy rezagados',        color: '#ef4444' },
          ].map(({ count, label, color }) => (
            <div key={label} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <span className="text-2xl font-bold" style={{ color }}>{count}</span>
              <span className="text-blue-200">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 text-blue-400 text-xs self-end ml-2">
            de 27 estados miembros
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex items-center gap-3 text-blue-300 animate-bounce mt-4">
          <span className="text-sm">Explorar la visualización</span>
          <span className="text-xl">↓</span>
        </div>
      </div>
    </section>
  )
}
