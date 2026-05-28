/**
 * SectoralSection – asimetría sectorial.
 * Muestra los cuatro sectores en paralelo para revelar las asimetrías.
 * Destaca especialmente la brecha electricidad vs transporte.
 */
import { useMemo } from 'react'
import { useData } from '../../context/DataContext.jsx'
import SectionWrapper from '../ui/SectionWrapper.jsx'
import SectorSmallMultiples from '../charts/SectorSmallMultiples.jsx'
import { EU27_CODES, COUNTRY_META } from '../../utils/regions.js'

const LATEST_YEAR = 2024

export default function SectoralSection() {
  const { latestAllSectors, selectedRegion } = useData()

  // Countries to show (respects region filter)
  const geoCodes = useMemo(() => {
    if (!selectedRegion) return EU27_CODES
    return EU27_CODES.filter(c => COUNTRY_META[c]?.region === selectedRegion)
  }, [selectedRegion])

  // Aggregate stats for the insight box — use the EU27_2020 aggregate row from Eurostat,
  // not a simple mean of country values (which would be unweighted).
  const eu27Elec = latestAllSectors.find(d => d.geo_code === 'EU27_2020' && d.nrg_bal === 'REN_ELC')
  const eu27Tran = latestAllSectors.find(d => d.geo_code === 'EU27_2020' && d.nrg_bal === 'REN_TRA')
  const avgElecNum = eu27Elec?.share_ren_pct ?? null
  const avgTranNum = eu27Tran?.share_ren_pct ?? null
  const avgElec = avgElecNum != null ? avgElecNum.toFixed(1) : '–'
  const avgTran = avgTranNum != null ? avgTranNum.toFixed(1) : '–'
  const gapElecTran = (avgElecNum != null && avgTranNum != null)
    ? (avgElecNum - avgTranNum).toFixed(1)
    : '–'

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
          enormes. En 2024, el agregado EU27_2020 de Eurostat registra <strong>{avgElec}%</strong> de
          renovables en electricidad frente a solo <strong>{avgTran}%</strong> en transporte
          —una brecha de <strong>{gapElecTran} pp</strong>.
          Esta asimetría estructural sugiere que la transición energética en el transporte
          está muy por detrás de la del sistema eléctrico.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="bg-blue-100 rounded-lg px-3 py-1.5">
            <span className="font-bold text-blue-900">{avgElec}%</span>
            <span className="text-blue-700 ml-1">electricidad (UE-27)</span>
          </div>
          <div className="bg-green-100 rounded-lg px-3 py-1.5">
            <span className="font-bold text-green-900">{avgTran}%</span>
            <span className="text-green-700 ml-1">transporte (UE-27)</span>
          </div>
        </div>
      </div>

      {/* Small multiples */}
      <p className="text-sm text-gray-600 mb-4">
        Cada panel muestra los países ordenados por cuota en ese sector.
        La línea azul discontinua del panel Total marca el objetivo 42,5 % de la Directiva RED III.
        No se traza en los paneles sectoriales porque ese objetivo aplica al total, no a cada sector.
      </p>
      <SectorSmallMultiples
        allSectorsData={latestAllSectors}
        geoCodes={geoCodes}
      />

      {/* Country detail note */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
        <strong>Nota metodológica:</strong> El objetivo del 42,5 % (línea azul discontinua)
        se aplica a la <em>cuota total</em> de energía renovable, no a cada sector individualmente.
        Por ello la línea de referencia solo aparece en el panel Total.
        La Directiva RED III establece sub-objetivos sectoriales específicos
        (p.ej., mínimo del 14,5 % en transporte para 2030), pero a efectos comparativos
        todos los paneles comparten la misma escala en el eje X.
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Fuente: Eurostat NRG_IND_REN · Datos {LATEST_YEAR}.
      </p>
    </SectionWrapper>
  )
}
