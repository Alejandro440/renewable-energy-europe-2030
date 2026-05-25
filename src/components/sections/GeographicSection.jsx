import { useMemo } from 'react'
import { useData } from '../../context/DataContext.jsx'
import SectionWrapper from '../ui/SectionWrapper.jsx'
import EuropeMap from '../charts/EuropeMap.jsx'
import StatCard from '../ui/StatCard.jsx'
import { EU27_CODES, REGION_LIST, COUNTRY_META } from '../../utils/regions.js'

const LATEST_YEAR = 2024

export default function GeographicSection() {
  const { latestTotalAll } = useData()

  const eu27Data = useMemo(() =>
    latestTotalAll.filter(d => EU27_CODES.includes(d.geo_code)),
    [latestTotalAll]
  )

  // Regional averages
  const regionStats = useMemo(() => {
    return REGION_LIST.map(region => {
      const codes = EU27_CODES.filter(c => COUNTRY_META[c]?.region === region)
      const rows  = eu27Data.filter(d => codes.includes(d.geo_code) && d.share_ren_pct != null)
      const avg   = rows.length
        ? rows.reduce((s, d) => s + d.share_ren_pct, 0) / rows.length
        : null
      return { region, avg, n: rows.length }
    })
  }, [eu27Data])

  const regionLabel = { North:'Norte', West:'Oeste', South:'Sur', East:'Este' }
  const regionColor = { North:'#1565c0', West:'#6a1b9a', South:'#e65100', East:'#2e7d32' }

  return (
    <SectionWrapper
      id="mapa"
      title="Patrón geográfico: ¿lideran los países nórdicos?"
      subtitle={`Distribución espacial de la cuota renovable y el estado de avance en ${LATEST_YEAR}.`}
    >
      {/* Regional summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {regionStats.map(({ region, avg }) => (
          <StatCard
            key={region}
            label={`Región ${regionLabel[region]}`}
            value={avg != null ? `${avg.toFixed(1)}%` : '–'}
            note="Cuota media UE (total)"
            color={regionColor[region]}
          />
        ))}
      </div>

      {/* Map */}
      <EuropeMap countryData={latestTotalAll} />

      {/* Geographic insight */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-5 max-w-3xl">
        <h3 className="font-semibold text-indigo-900 mb-2">¿Se confirma el patrón Norte-Sur?</h3>
        <p className="text-indigo-800 text-sm leading-relaxed">
          Los países nórdicos (Suecia 62,8 %, Finlandia 52,1 %, Dinamarca 46,5 %, Letonia 45,5 %)
          encabezan el ranking gracias a su abundante hidroeléctrica, eólica y biomasa. Sin embargo,
          el patrón no es simple: Austria (42,9 %) y Estonia (42,2 %) superan a muchos países del
          sur, mientras que Malta (17,2 %), Bélgica (14,3 %) y Luxemburgo (14,7 %) muestran las
          cuotas más bajas de la UE. La geografía energética sigue más la abundancia de recursos
          naturales que el eje norte-sur clásico.
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Fuente: Eurostat NRG_IND_REN · Mapa: Natural Earth / World Atlas TopoJSON ·
        Hover sobre un país para ver sus valores. El mapa puede estar ligeramente distorsionado
        por la proyección Mercator.
      </p>
    </SectionWrapper>
  )
}
