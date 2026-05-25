import { useData } from './context/DataContext.jsx'
import NavBar             from './components/layout/NavBar.jsx'
import Footer             from './components/layout/Footer.jsx'
import FilterBar          from './components/ui/FilterBar.jsx'
import HeroSection        from './components/sections/HeroSection.jsx'
import CurrentStatusSection   from './components/sections/CurrentStatusSection.jsx'
import RequiredPaceSection    from './components/sections/RequiredPaceSection.jsx'
import TimelineSection        from './components/sections/TimelineSection.jsx'
import SectoralSection        from './components/sections/SectoralSection.jsx'
import GeographicSection      from './components/sections/GeographicSection.jsx'
import ConclusionsSection     from './components/sections/ConclusionsSection.jsx'

export default function App() {
  const { loading, error } = useData()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-700 mb-2">Error al cargar los datos</h1>
          <p className="text-red-600 font-mono text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans antialiased">
      <a
        href="#estado-actual"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow-400 focus:text-black focus:rounded"
      >
        Saltar al contenido principal
      </a>

      <HeroSection />

      <NavBar />
      <FilterBar />

      <main id="main-content">
        <CurrentStatusSection />
        <RequiredPaceSection />
        <TimelineSection />
        <SectoralSection />
        <GeographicSection />
        <ConclusionsSection />
      </main>

      <Footer />
    </div>
  )
}
