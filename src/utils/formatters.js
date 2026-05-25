/**
 * Number and text formatters for the visualization.
 */

/**
 * Format a percentage value with one decimal place.
 * @param {number|null} v
 * @returns {string}
 */
export function pct(v) {
  if (v === null || v === undefined || isNaN(v)) return '–'
  return `${v.toFixed(1)} %`
}

/**
 * Format a pace value (pp/year) with two decimal places.
 * @param {number|null} v
 * @returns {string}
 */
export function pace(v) {
  if (v === null || v === undefined || isNaN(v)) return '–'
  return `${v.toFixed(2)} pp/año`
}

/**
 * Format a pp change with sign.
 * @param {number|null} v
 * @returns {string}
 */
export function ppChange(v) {
  if (v === null || v === undefined || isNaN(v)) return '–'
  const sign = v >= 0 ? '+' : ''
  return `${sign}${v.toFixed(2)} pp`
}

/**
 * Format year as string.
 */
export function year(v) {
  if (v === null || v === undefined) return '–'
  return String(v)
}

/**
 * Clamp a value between min and max.
 */
export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

/**
 * Format required_pace for display.
 * 0 means already at/above target.
 */
export function requiredPaceLabel(v) {
  if (v === null || v === undefined || isNaN(v)) return '–'
  if (v === 0) return '0 pp/año (objetivo alcanzado)'
  return `${v.toFixed(2)} pp/año`
}
