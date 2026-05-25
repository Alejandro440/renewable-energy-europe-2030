/**
 * StatCard – tarjeta para mostrar un KPI destacado.
 */
export default function StatCard({ label, value, unit, note, color = '#003399', dark = false }) {
  return (
    <div
      className={`rounded-xl p-5 flex flex-col gap-1 border ${
        dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      <span className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </span>
      <span className="text-3xl font-bold" style={{ color }}>
        {value}
        {unit && <span className="text-lg font-medium ml-1 opacity-70">{unit}</span>}
      </span>
      {note && (
        <span className={`text-xs mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{note}</span>
      )}
    </div>
  )
}
