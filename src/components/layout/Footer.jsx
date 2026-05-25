export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-8 mt-0">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-2">Fuente de datos</h3>
          <p>
            Eurostat – <em>Share of Energy from Renewable Sources</em> (NRG_IND_REN).
            Datos anuales 2004–2024.{' '}
            <a
              href="https://ec.europa.eu/eurostat/databrowser/product/view/NRG_IND_REN"
              target="_blank" rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              ec.europa.eu/eurostat
            </a>
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Objetivo europeo</h3>
          <p>
            42,5 % de energía renovable sobre consumo final bruto en 2030 (Directiva
            RED III, Reglamento UE 2023/2413).
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Autoría</h3>
          <p>
            Alejandro Alonso Anda<br />
            Máster Universitario en Ciencia de Datos – UOC<br />
            Visualización de Datos, 2026
          </p>
          <p className="mt-2">
            <a
              href="https://github.com/Alejandro440/renewable-energy-europe-2030"
              target="_blank" rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Código fuente en GitHub
            </a>
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-gray-800 text-xs text-gray-500">
        Licencia MIT · Datos Eurostat de reutilización libre con atribución ·
        Los valores <span className="font-mono">&gt;100 %</span> en electricidad corresponden a países exportadores netos de renovables.
      </div>
    </footer>
  )
}
