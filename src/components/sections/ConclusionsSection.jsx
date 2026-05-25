import SectionWrapper from '../ui/SectionWrapper.jsx'

const FINDINGS = [
  {
    icon: '🎯',
    title: 'La UE-27 necesita triplicar su ritmo histórico',
    text: 'Desde 2004 hasta 2024, la UE-27 ha avanzado a un ritmo medio de aproximadamente 0,9 pp/año. Para alcanzar el 42,5 % en 2030 desde el nivel actual (≈24 %), necesita mantener un ritmo de ≈3 pp/año —tres veces superior al histórico. Este es el hallazgo central y el mayor reto de la transición.',
    color: '#b71c1c',
  },
  {
    icon: '🏆',
    title: 'Solo 5 países han alcanzado el objetivo',
    text: 'Suecia (62,8 %), Finlandia (52,1 %), Dinamarca (46,5 %), Letonia (45,5 %) y Austria (43,0 %) han superado ya el 42,5 %. Estonia (42,2 %), Lituania (35,4 %) y Portugal (36,3 %) están en camino si mantienen su ritmo reciente. Los 19 países restantes necesitan acelerar significativamente.',
    color: '#1b5e20',
  },
  {
    icon: '⚡',
    title: 'La electricidad avanza; el transporte, no',
    text: 'La asimetría sectorial es la principal revelación de esta visualización. La electricidad renovable supera el 42,5 % en varios países gracias a la eólica y solar. El transporte, en cambio, promedia apenas un 10-15 % en la mayoría de países. Esta brecha es estructural y requiere políticas específicas de movilidad sostenible.',
    color: '#1565c0',
  },
  {
    icon: '🗺️',
    title: 'El patrón geográfico es real pero no simple',
    text: 'Los países nórdicos lideran gracias a recursos hidroeléctricos y eólicos abundantes. Sin embargo, Malta, Bélgica y Luxemburgo muestran las cuotas más bajas de la UE, y Austria (Europa occidental) supera a países nórdicos como Estonia. La geografía energética sigue más la dotación de recursos que el eje norte-sur esperado.',
    color: '#6a1b9a',
  },
  {
    icon: '⏱️',
    title: 'El tiempo se acorta: 6 años para el objetivo',
    text: 'Con solo 6 años hasta 2030 (desde 2024), el margen de aceleración se reduce. Los países más rezagados —Bélgica (requiere 4,7 pp/año), Luxemburgo (4,6 pp/año), Malta (4,2 pp/año)— necesitarían tasas de crecimiento sin precedente histórico para cumplir el objetivo europeo común.',
    color: '#e65100',
  },
]

const LIMITATIONS = [
  'El objetivo del 42,5 % se aplica al total de energía renovable, no a cada sector individual. La comparación sectorial es ilustrativa de asimetrías, no de cumplimiento sectorial.',
  'El ritmo observado (2020–2024) incluye el período post-COVID, que puede distorsionar las tendencias de largo plazo.',
  'Algunos valores de electricidad superan el 100 % (IS, NO, SE, FI) porque estos países exportan renovables. Esto es metodológicamente correcto pero requiere cautela interpretativa.',
  'No se incluyen objetivos nacionales específicos (algunos países tienen objetivos propios más ambiciosos) por la dificultad de documentar todas las fuentes con rigor.',
  'Los datos de 2024 pueden ser provisionales para algunos países (bandera "p" en Eurostat). Los datos finales pueden variar ligeramente.',
]

export default function ConclusionsSection() {
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
          alcanzar el objetivo del 42,5 % en 2030. Solo 5 países han llegado ya al objetivo, y
          solo 3 mantienen un ritmo de avance reciente suficiente para llegar a tiempo si
          mantienen ese ritmo. Los 19 restantes necesitarían una aceleración sustancial sin
          precedente histórico.
        </p>
      </div>

      {/* Findings */}
      <div className="space-y-4 mb-8">
        <h3 className="font-semibold text-gray-800 text-lg">Hallazgos principales</h3>
        {FINDINGS.map((f, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="text-3xl flex-shrink-0 mt-0.5" aria-hidden="true">{f.icon}</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1" style={{ color: f.color }}>
                {i + 1}. {f.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{f.text}</p>
            </div>
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
