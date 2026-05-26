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

  // Dynamic values for insight text
  const byCode = useMemo(() => Object.fromEntries(eu27Data.map(d => [d.geo_code, d])), [eu27Data])
  const shareOf = (code) => byCode[code]?.share_ren_pct?.toFixed(1) ?? '–'
  const top4 = useMemo(() =>
    [...eu27Data].sort((a, b) => b.share_ren_pct - a.share_ren_pct).slice(0, 4),
    [eu27Data]
  )
  const bottom3 = useMemo(() =>
    [...eu27Data].filter(d => d.share_ren_pct != null).sort((a, b) => a.share_ren_pct - b.share_ren_pct).slice(0, 3),
    [eu27Data]
  )

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
          {top4.length >= 4 && (
            <>
              Los primeros cuatro países son {top4.map(d => `${d.geo_name} (${d.share_ren_pct?.toFixed(1)} %)`).join(', ')},
              que encabezan el ranking gracias a su abundante hidroeléctrica, eólica y biomasa. Sin embargo,
              el patrón no es simple: Austria ({shareOf('AT')} %) y Estonia ({shareOf('EE')} %) superan a muchos países del
              sur, mientras que {bottom3.map(d => `${d.geo_name} (${d.share_ren_pct?.toFixed(1)} %)`).join(', ')} muestran las
              cuotas más bajas de la UE-27. La geografía energética sigue más la abundancia de recursos
              naturales que el eje norte-sur clásico.
            </>
          )}
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
