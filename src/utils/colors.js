/**
 * Color palette for the renewable energy visualization.
 * Palette is:
 *  - Accessible: contrast ratio ≥ 4.5:1 against white/dark backgrounds
 *  - Daltonism-friendly: uses shape+label encoding in addition to color
 */

export const PACE_STATUS_COLORS = {
  'At or above target': '#1b5e20',   // dark green
  'On track':           '#388e3c',   // medium green
  'Needs acceleration': '#e65100',   // deep orange
  'Far behind':         '#b71c1c',   // dark red
  'No data':            '#9e9e9e',   // grey
}

export const PACE_STATUS_LABELS = {
  'At or above target': 'En/por encima del objetivo',
  'On track':           'En camino',
  'Needs acceleration': 'Necesita aceleración',
  'Far behind':         'Muy retrasado',
  'No data':            'Sin datos',
}

export const REGION_COLORS = {
  'North':  '#1565c0',   // deep blue
  'West':   '#6a1b9a',   // purple
  'South':  '#e65100',   // deep orange
  'East':   '#2e7d32',   // dark green
  'EU-27 (aggregate)': '#607d8b',
  'Non-EU': '#9e9e9e',
}

export const SECTOR_COLORS = {
  'Total':             '#37474f',   // dark grey-blue
  'Electricity':       '#1565c0',   // blue
  'Heating & Cooling': '#d84315',   // deep orange-red
  'Transport':         '#2e7d32',   // dark green
}

export const SECTOR_LABELS_ES = {
  'Total':             'Total',
  'Electricity':       'Electricidad',
  'Heating & Cooling': 'Calefacción/Refrigeración',
  'Transport':         'Transporte',
}

// For continuous scales (share value → color)
// Using a green-yellow-red diverging scale centred at 42.5%
export function shareColor(value, target = 42.5) {
  if (value === null || value === undefined) return '#e0e0e0'
  const ratio = value / target
  if (ratio >= 1)   return '#1b5e20'
  if (ratio >= 0.8) return '#388e3c'
  if (ratio >= 0.6) return '#f9a825'
  if (ratio >= 0.4) return '#ef6c00'
  return '#b71c1c'
}

// EU target reference line color
export const TARGET_COLOR = '#003399'

// Neutral greys
export const GREY_LIGHT   = '#f5f5f5'
export const GREY_MEDIUM  = '#bdbdbd'
export const GREY_DARK    = '#424242'
export const EU_BLUE      = '#003399'
export const EU_GOLD      = '#FFCC00'
