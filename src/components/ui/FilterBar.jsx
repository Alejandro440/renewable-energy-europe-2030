import { useData } from '../../context/DataContext.jsx'
import { REGION_LIST } from '../../utils/regions.js'

/**
 * FilterBar – barra de filtros globales (sector + región).
 * Se muestra fijada debajo del NavBar.
 */
export default function FilterBar() {
  const {
    selectedSector, setSelectedSector,
    selectedRegion, setSelectedRegion,
  } = useData()

  const sectors = ['Total', 'Electricity', 'Heating & Cooling', 'Transport']
  const sectorLabels = {
    'Total': 'Total',
    'Electricity': 'Electricidad',
    'Heating & Cooling': 'Calefacción/Refrig.',
    'Transport': 'Transporte',
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-8 lg:px-16 py-2 flex flex-wrap gap-4 items-center text-sm">
      {/* Sector */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-600 whitespace-nowrap">Sector para evolución:</span>
        <div className="flex gap-1">
          {sectors.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSector(s)}
              className={`px-3 py-1 rounded-full border transition-colors ${
                selectedSector === s
                  ? 'bg-blue-800 text-white border-blue-800'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
              }`}
              aria-pressed={selectedSector === s}
            >
              {sectorLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Región */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-600 whitespace-nowrap">Región:</span>
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedRegion(null)}
            className={`px-3 py-1 rounded-full border transition-colors ${
              selectedRegion === null
                ? 'bg-blue-800 text-white border-blue-800'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
            }`}
            aria-pressed={selectedRegion === null}
          >
            Todas
          </button>
          {REGION_LIST.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r === selectedRegion ? null : r)}
              className={`px-3 py-1 rounded-full border transition-colors ${
                selectedRegion === r
                  ? 'bg-blue-800 text-white border-blue-800'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
              }`}
              aria-pressed={selectedRegion === r}
            >
              {r === 'North' ? 'Norte' : r === 'West' ? 'Oeste' : r === 'South' ? 'Sur' : 'Este'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
