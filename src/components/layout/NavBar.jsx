/**
 * NavBar – barra de navegación con scroll suave a cada sección.
 */
const NAV_ITEMS = [
  { id: 'estado-actual',    label: 'Estado actual'      },
  { id: 'ritmo-necesario',  label: 'Ritmo necesario'    },
  { id: 'evolucion',        label: 'Evolución temporal' },
  { id: 'sectores',         label: 'Sectores'           },
  { id: 'mapa',             label: 'Mapa geográfico'    },
  { id: 'conclusiones',     label: 'Conclusiones'       },
]

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function NavBar() {
  return (
    <nav
      className="sticky top-0 z-40 bg-blue-900 text-white shadow-lg"
      aria-label="Navegación principal"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex overflow-x-auto gap-0 no-scrollbar">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="px-4 py-3 text-sm font-medium whitespace-nowrap hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-inset"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
