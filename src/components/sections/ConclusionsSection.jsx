import { useMemo } from 'react'
import { useData } from '../../context/DataContext.jsx'
import SectionWrapper from '../ui/SectionWrapper.jsx'
import { EU27_CODES } from '../../utils/regions.js'

const LIMITATIONS = [
  'El objetivo del 42,5 % se aplica al total de energía renovable, no a cada sector individual. La comparación sectorial es ilustrativa de asimetrías, no de cumplimiento sectorial.',
  'El ritmo observado (recent_pace) se calcula como (cuota_2024 − cuota_2020) / 4. No incorpora el ritmo previo a 2020 ni la recuperación post-COVID de 2021-2022.',
  'Algunos valores de electricidad superan el 100 % (IS, NO, SE, FI) porque estos países exportan renovables. Esto es metodológicamente correcto pero requiere cautela interpretativa.',
  'No se incluyen objetivos nacionales específicos (algunos países tienen objetivos propios más ambiciosos) por la dificultad de documentar todas las fuentes con rigor.',
  'Los datos de 2024 pueden ser provisionales para algunos países (bandera "p" en Eurostat). Los datos finales pueden variar ligeramente.',
]

export default function ConclusionsSection() {
  const { latestTotalAll, rawData } = useData()

  const stats = useMemo(() => {
    const eu27 = latestTotalAll.filter(d => EU27_CODES.includes(d.geo_code) && d.share_ren_pct != null)

    const atTarget = [...eu27]
      .filter(d => d.pace_status === 'At or above target')
      .sort((a, b) => b.share_ren_pct - a.share_ren_pct)

    const onTrack = eu27.filter(d => d.pace_status === 'On track')

    const hardest = [...eu27]
      .filter(d => d.required_pace > 0)
      .sort((a, b) => b.required_pace - a.required_pace)
      .slice(0, 3)

    // EU-27 historical pace: (share_2024 − share_2004) / 20
    const eu27Series = rawData
      .filter(d => d.geo_code === 'EU27_2020' && d.nrg_bal === 'REN')
      .sort((a, b) => a.year - b.year)
    const eu27_2004 = eu27Series.find(d => d.year === 2004)?.share_ren_pct
    const eu27_2024 = eu27Series.find(d => d.year === 2024)?.share_ren_pct
    const historicalPace = (eu27_2004 != null && eu27_2024 != null)
      ? ((eu27_2024 - eu27_2004) / 20).toFixed(1)
      : '–'
    const requiredPaceEU = (eu27_2024 != null)
      ? ((42.5 - eu27_2024) / 6).toFixed(1)
      : '–'
    const historicalRatio = (parseFloat(requiredPaceEU) / parseFloat(historicalPace)).toFixed(0)

    return { atTarget, onTrack, hardest, historicalPace, requiredPaceEU, historicalRatio, eu27_2024 }
  }, [latestTotalAll, rawData])

  const fmt = (v) => v?.toFixed(1) ?? '–'
  const fmtPace = (v) => v?.toFixed(2) ?? '–'

  const FINDINGS = [
    {
      title: `La UE-27 necesita ~${stats.historicalRatio}× su ritmo histórico`,
      text: `Desde 2004 hasta 2024, la UE-27 ha avanzado a un ritmo medio de aproximadamente ${stats.historicalPace} pp/año. Para alcanzar el 42,5 % en 2030 desde el nivel actual (≈${fmt(stats.eu27_2024)} %), necesita mantener un ritmo de ≈${stats.requiredPaceEU} pp/año —aproximadamente ${stats.historicalRatio} veces superior al histórico. Este es el hallazgo central y el mayor reto de la transición.`,
      color: '#b71c1c',
    },
    {
      title: `Solo ${stats.atTarget.length} países han alcanzado el objetivo`,
      text: `${stats.atTarget.map(d => `${d.geo_name} (${fmt(d.share_ren_pct)} %)`).join(', ')} han superado ya el 42,5 %. ${stats.onTrack.length > 0 ? `${stats.onTrack.map(d => d.geo_name).join(' y ')} están en camino si mantienen su ritmo reciente.` : 'Ningún país adicional mantiene actualmente un ritmo reciente suficiente para llegar a tiempo.'} Los ${27 - stats.atTarget.length - stats.onTrack.length} países restantes necesitan acelerar significativamente.`,
      color: '#1b5e20',
    },
    {
      title: 'La electricidad avanza; el transporte, no',
      text: 'La asimetría sectorial es la principal revelación de esta visualización. La electricidad renovable supera el 42,5 % en varios países gracias a la eólica y solar. El transporte, en cambio, promedia apenas un 10–15 % en la mayoría de países. Esta brecha es estructural y requiere políticas específicas de movilidad sostenible.',
      color: '#1565c0',
    },
    {
      title: 'El patrón geográfico es real pero no simple',
      text: 'Los países nórdicos lideran gracias a recursos hidroeléctricos y eólicos abundantes. Sin embargo, Malta, Bélgica y Luxemburgo muestran las cuotas más bajas de la UE, y Austria supera a países nórdicos como Estonia. La geografía energética sigue más la dotación de recursos que el eje norte-sur esperado.',
      color: '#6a1b9a',
    },
    {
      title: 'El tiempo se acorta: 6 años para el objetivo',
      text: `Con solo 6 años hasta 2030 (desde 2024), el margen de aceleración se reduce. Los países más rezagados —${stats.hardest.map(d => `${d.geo_name} (${fmtPace(d.required_pace)} pp/año)`).join(', ')}— necesitarían tasas de crecimiento sin precedente histórico para cumplir el objetivo europeo común.`,
      color: '#e65100',
    },
  ]

  return (
    <SectionWrapper
      id="conclusiones"
      title="Conclusiones: ¿está Europa en camino?"
      subtitle="Hallazgos principales, limitaciones y reflexión final sobre lo que revelan los datos."
    >
      {/* Main answer */}
      <div className="bg-red-50 border-l-4 border-red-600 rounded-r-xl p-5 mb-8 max-w-3xl">
        <p className="font-bold text-red-900 text-lg mb-1">Respuesta: en general, no.</p>
        <p className="text-red-800 text-sm leading-relaxed">
          La gran mayoría de los países de la UE-27 no está avanzando al ritmo necesario para
          alcanzar el objetivo del 42,5 % en 2030. Solo {stats.atTarget.length} países han llegado
          ya al objetivo, y solo {stats.onTrack.length} mantienen un ritmo de avance reciente
          suficiente para llegar a tiempo si lo sostienen. Los {27 - stats.atTarget.length - stats.onTrack.length} restantes
          necesitarían una aceleración sustancial sin precedente histórico.
        </p>
      </div>

      {/* Findings */}
      <div className="space-y-4 mb-8">
        <h3 className="font-semibold text-gray-800 text-lg">Hallazgos principales</h3>
        {FINDINGS.map((f, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border-l-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            style={{ borderLeftColor: f.color }}
          >
            <h4 className="font-semibold mb-1" style={{ color: f.color }}>
              {i + 1}. {f.title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{f.text}</p>
          </div>
        ))}
      </div>

      {/* Limitations */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Limitaciones del análisis</h3>
        <ul className="space-y-2">
          {LIMITATIONS.map((l, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600">
              <span className="text-gray-400 flex-shrink-0">⚠</span>
              {l}
            </li>
          ))}
        </ul>
      </div>

      {/* Reflection */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-semibold text-blue-900 mb-2">Reflexión final</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          Esta visualización transforma los datos de Eurostat —que por sí solos responden
          "¿dónde está cada país?"— en una herramienta que responde "¿va suficientemente
          rápido?". La métrica <code className="bg-blue-100 px-1 rounded">required_pace</code> es
          el elemento diferenciador: no describe el presente, sino la distancia entre la
          velocidad actual y la velocidad necesaria. El resultado es claro: la transición
          energética europea necesita una aceleración significativa, especialmente en el
          sector del transporte, donde la brecha entre renovables disponibles y renovables
          utilizadas es estructuralmente enorme. El objetivo de 2030 es alcanzable para
          unos pocos; para la mayoría, requeriría cambios de política sin precedente.
        </p>
      </div>

      {/* Data credits */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
        Fuente principal: Eurostat, tabla NRG_IND_REN —{' '}
        <em>Share of Energy from Renewable Sources</em>.
        Datos 2004–2024. Descargados en mayo de 2026.
        Objetivo: Directiva (UE) 2023/2413 (RED III), artículo 3.
      </div>
    </SectionWrapper>
  )
}
