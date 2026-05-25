/**
 * SectoralSection – asimetría sectorial.
 * Muestra los cuatro sectores en paralelo para revelar las asimetrías.
 * Destaca especialmente la brecha electricidad vs transporte.
 */
import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext.jsx'
import SectionWrapper from '../ui/SectionWrapper.jsx'
import SectorSmallMultiples from '../charts/SectorSmallMultiples.jsx'
import { EU27_CODES, COUNTRY_META } from '../../utils/regions.js'

const LATEST_YEAR = 2024

export default function SectoralSection() {
  const { latestAllSectors, selectedRegion, rawData } = useData()
  const [selectedCountry, setSelectedCountry] = useState(null)

  // Countries to show
  const geoCodes = useMemo(() => {
    let codes = EU27_CODES
    if (selectedRegion) {
      codes = EU27_CODES.filter(c => COUNTRY_META[c]?.region === selectedRegion)
    }
    return codes
  }, [selectedRegion])

  // For the scatter comparison (electricidad vs transporte for selected country)
  const countryOptions = EU27_CODES.map(code => ({
    code,
    name: COUNTRY_META[code]?.name || code,
  })).sort((a, b) => a.name.localeCompare(b.name))

  // Aggregate stats for the insight box
  const elec = latestAllSectors.filter(d => d.nrg_bal === 'REN_ELC' && EU27_CODES.includes(d.geo_code))
  const tran = latestAllSectors.filter(d => d.nrg_bal === 'REN_TRA' && EU27_CODES.includes(d.geo_code))
  const avgElec = elec.length ? (elec.reduce((s,d) => s+(d.share_ren_pct||0),0)/elec.length).toFixed(1) : '–'
  const avgTran = tran.length ? (tran.reduce((s,d) => s+(d.share_ren_pct||0),0)/tran.length).toFixed(1) : '–'

  return (
    <SectionWrapper
      id="sectores"
      title="Asimetría sectorial: electricidad vs transporte"
      subtitle={`La brecha renovable no es uniforme. ¿En qué sector es mayor el rezago? (${LATEST_YEAR})`}
    >
      {/* Insight box */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 mb-8 max-w-3xl">
        <h3 className="font-semibold text-amber-900 mb-2">¿Por qué esta asimetría importa?</h3>
        <p className="text-amber-800 text-sm leading-relaxed mb-3">
          Un país puede tener una cuota total moderada mientras esconde diferencias sectoriales
          enormes. En 2024, la UE-27 promedia <strong>{avgElec}%</strong> de renovables en
          electricidad frente a solo <strong>{avgTran}%</strong> en transporte —una brecha
          de <strong>{(parseFloat(avgElec) - parseFloat(avgTran)).toFixed(1)} pp</strong>.
          Esta asimetría estructural sugiere que la transición energética en el transporte
          está muy por detrás de la del sistema eléctrico.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2 bg-blue-100 rounded-lg px-3 py-1.5">
            <span className="text-xl">⚡</span>
            <div>
              <span className="font-bold text-blue-900">{avgElec}%</span>
              <span className="text-blue-700 ml-1">electricidad (UE-27)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-100 rounded-lg px-3 py-1.5">
            <span className="text-xl">🚗</span>
            <div>
              <span className="font-bold text-green-900">{avgTran}%</span>
              <span className="text-green-700 ml-1">transporte (UE-27)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Small multiples */}
      <p className="text-sm text-gray-600 mb-4">
        Cada panel muestra los países ordenados por cuota en ese sector.
        La línea azul discontinua marca el objetivo 42,5 % (solo aplicable al total).
      </p>
      <SectorSmallMultiples
        allSectorsData={latestAllSectors}
        geoCodes={geoCodes}
      />

      {/* Country detail note */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
        <strong>Nota metodológica:</strong> El objetivo del 42,5 % es para la cuota total de
        energía renovable, no para cada sector individualmente. La Directiva RED III
        establece sub-objetivos sectoriales específicos (p.ej., 14 % mínimo en transporte),
        pero para mantener la comparabilidad, todos los paneles muestran la misma escala.
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Fuente: Eurostat NRG_IND_REN · Datos {LATEST_YEAR}.
      </p>
    </SectionWrapper>
  )
}
