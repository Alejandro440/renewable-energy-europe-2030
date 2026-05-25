import { PACE_STATUS_COLORS, PACE_STATUS_LABELS } from '../../utils/colors.js'

export default function PaceStatusBadge({ status, small = false }) {
  const color = PACE_STATUS_COLORS[status] || '#9e9e9e'
  const label = PACE_STATUS_LABELS[status] || status
  const sizeClass = small ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'
  return (
    <span
      className={`inline-flex items-center rounded font-medium ${sizeClass}`}
      style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }}
      aria-label={`Estado: ${label}`}
    >
      <span
        className="inline-block w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}
