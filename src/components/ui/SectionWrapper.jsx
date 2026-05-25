/**
 * SectionWrapper – contenedor para cada sección narrativa.
 * Aplica padding, id de ancla y divisor sutil.
 */
export default function SectionWrapper({ id, title, subtitle, children, dark = false }) {
  return (
    <section
      id={id}
      className={`py-16 px-4 sm:px-8 lg:px-16 ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <div className="max-w-6xl mx-auto">
        {title && (
          <div className="mb-8">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`text-base sm:text-lg ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                {subtitle}
              </p>
            )}
            <div className={`mt-4 h-1 w-16 rounded ${dark ? 'bg-yellow-400' : 'bg-blue-700'}`} />
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
