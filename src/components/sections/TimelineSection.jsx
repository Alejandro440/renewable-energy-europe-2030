import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext.jsx'
import SectionWrapper from '../ui/SectionWrapper.jsx'
import TimelineChart from '../charts/TimelineChart.jsx'
import { EU27_CODES, COUNTRY_META } from '../../utils/regions.js'

// Pre-selected country examples for interest
const DEFAULT_COUNTRIES = ['DE', 'SE', 'PL', 'ES']

const SECTOR_TO_NRGBAL = {
  'Total':             'REN',
  'Electricity':       'REN_ELC',
  'Heating & Cooling': 'REN_HEAT_CL',
  'Transport':         'REN_TRA',
}

export default function TimelineSection() {
  const { rawData, selectedSector } = useData()
  const [selected, setSelected] = useState(DEFAULT_COUNTRIES)

  const currentNrgBal = SECTOR_TO_NRGBAL[selectedSector] || 'REN'

  // Available EU-27 countries
  const available = EU27_CODES.map(code => ({
    code,
    name: COUNTRY_META[code]?.name || code,
  })).sort((a, b) => a.name.localeCompare(b.name))

  const toggleCountry = (code) => {
    setSelected(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code].slice(0, 8)  // max 8 countries
    )
  }

  // EU-27 time series for selected sector
  const eu27TimeSeries = useMemo(() => {
    return rawData
      .filter(d => d.geo_code === 'EU27_2020' && d.nrg_bal === currentNrgBal)
      .sort((a, b) => a.year - b.year)
  }, [rawData, currentNrgBal])

  const countrySeries = useMemo(() => {
    return selected.map(code =>
      rawData
        .filter(d => d.geo_code === code && d.nrg_bal === currentNrgBal)
        .sort((a, b) => a.year - b.year)
    )
  }, [rawData, selected, currentNrgBal])

  const countryNames = selected.map(code => COUNTRY_META[code]?.name || code)

  return (
    <SectionWrapper
      id="evolucion"
      title="Evolución temporal: ¿se acelera la transición?"
      subtitle="Cuota renovable total (%) desde 2004. EU-27 en azul oscuro. Selecciona países para comparar."
    >
      {/* Country selector */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">
          Selecciona hasta 8 países (máx.) para comparar con la media EU-27:
        </p>
        <div className="flex flex-wrap gap-2">
          {available.map(({ code, name }) => (
            <button
              key={code}
              onClick={() => toggleCountry(code)}
              className={`px-2.5 py-1 rounded text-xs border transition-colors ${
                selected.includes(code)
                  ? 'bg-blue-800 text-white border-blue-800'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
              }`}
              aria-pressed={selected.includes(code)}
              disabled={!selected.includes(code) && selected.length >= 8}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <TimelineChart
        eu27Series={eu27TimeSeries}
        countrySeries={countrySeries}
        countryNames={countryNames}
      />

      {/* Interpretation note */}
      {(() => {
        const share2004 = eu27TimeSeries.find(d => d.year === 2004)?.share_ren_pct
        const share2024 = eu27TimeSeries.find(d => d.year === 2024)?.share_ren_pct
        const histPace  = (share2004 != null && share2024 != null)
          ? ((share2024 - share2004) / 20).toFixed(2)
          : '–'
        const reqPace   = share2024 != null
          ? ((42.5 - share2024) / 6).toFixed(2)
          : '–'
        return (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <strong>Hallazgo clave:</strong> La UE-27 avanza desde ≈{share2004?.toFixed(1) ?? '–'} % en 2004
            hasta ≈{share2024?.toFixed(1) ?? '–'} % en 2024,
            pero el ritmo medio histórico (≈{histPace} pp/año)
            es claramente inferior al ritmo necesario de ≈{reqPace} pp/año
            para alcanzar el 42,5 % en 2030.
          </div>
        )
      })()}

      <p className="text-xs text-gray-400 mt-3">
        Fuente: Eurostat NRG_IND_REN · Cuota total sobre consumo final bruto · Datos 2004–2024.
      </p>
    </SectionWrapper>
  )
}
