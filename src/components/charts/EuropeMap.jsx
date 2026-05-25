/**
 * EuropeMap – mapa coroplético SVG de Europa.
 * Coloreado por cuota renovable o required_pace del último año.
 * Usa D3 + TopoJSON + world-atlas countries-110m.json.
 */
import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { ISO3N_TO_CODE } from '../../utils/regions.js'
import { shareColor, PACE_STATUS_COLORS } from '../../utils/colors.js'
import { pct } from '../../utils/formatters.js'

const BASE_URL = import.meta.env.BASE_URL || '/'

// Map metric choices
const METRICS = [
  { value: 'share',    label: 'Cuota renovable (%)' },
  { value: 'required', label: 'Ritmo necesario (pp/año)' },
]

function getColor(d, metric) {
  if (!d) return '#e5e7eb'
  if (metric === 'share') return shareColor(d.share_ren_pct)
  if (metric === 'required') return PACE_STATUS_COLORS[d.pace_status] || '#e5e7eb'
  return '#e5e7eb'
}

export default function EuropeMap({ countryData }) {
  const svgRef = useRef(null)
  const [world, setWorld] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: null })
  const [metric, setMetric] = useState('share')

  // Load TopoJSON
  useEffect(() => {
    fetch(`${BASE_URL}countries-110m.json`)
      .then(r => r.json())
      .then(setWorld)
      .catch(e => console.error('Map load error:', e))
  }, [])

  // Draw map
  useEffect(() => {
    if (!world || !svgRef.current) return

    const el   = svgRef.current
    const W    = el.clientWidth || 700
    const H    = Math.round(W * 0.55)

    const svg = d3.select(el)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`)

    const projection = d3.geoMercator()
      .center([15, 54])
      .scale(W * 1.05)
      .translate([W / 2, H / 2])

    const path = d3.geoPath().projection(projection)

    const countries = topojson.feature(world, world.objects.countries)

    // Map iso3n → data
    const dataByCode = {}
    countryData.forEach(d => { dataByCode[d.geo_code] = d })

    svg.append('rect')
      .attr('width', W).attr('height', H)
      .attr('fill', '#dbeafe')

    svg.selectAll('path.country')
      .data(countries.features)
      .join('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', feature => {
        const iso3n  = parseInt(feature.id)
        const code   = ISO3N_TO_CODE[iso3n]
        const d      = code ? dataByCode[code] : null
        return getColor(d, metric)
      })
      .attr('stroke', 'white')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event, feature) => {
        const iso3n = parseInt(feature.id)
        const code  = ISO3N_TO_CODE[iso3n]
        const d     = code ? dataByCode[code] : null
        if (d) {
          d3.select(event.currentTarget).attr('stroke-width', 2).attr('stroke', '#1e40af')
          setTooltip({
            visible: true,
            x: event.offsetX,
            y: event.offsetY,
            content: d,
          })
        }
      })
      .on('mousemove', event => {
        setTooltip(prev => ({ ...prev, x: event.offsetX, y: event.offsetY }))
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).attr('stroke-width', 0.5).attr('stroke', 'white')
        setTooltip(prev => ({ ...prev, visible: false }))
      })

    // Country labels for larger countries
    const largeCountries = ['DE','FR','ES','IT','PL','SE','FI','NO','RO']
    svg.selectAll('text.label')
      .data(countries.features.filter(f => {
        const iso3n = parseInt(f.id)
        const code  = ISO3N_TO_CODE[iso3n]
        return largeCountries.includes(code)
      }))
      .join('text')
      .attr('class', 'label')
      .attr('transform', f => `translate(${path.centroid(f)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', '8')
      .attr('fill', 'white')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .text(f => {
        const iso3n = parseInt(f.id)
        return ISO3N_TO_CODE[iso3n] || ''
      })
  }, [world, countryData, metric])

  return (
    <div className="relative">
      {/* Metric selector */}
      <div className="flex gap-2 mb-3">
        {METRICS.map(m => (
          <button
            key={m.value}
            onClick={() => setMetric(m.value)}
            className={`px-3 py-1 rounded text-sm border transition-colors ${
              metric === m.value
                ? 'bg-blue-800 text-white border-blue-800'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* SVG map */}
      <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-blue-50">
        <svg ref={svgRef} style={{ width: '100%', height: 'auto', display: 'block' }} />

        {/* Tooltip */}
        {tooltip.visible && tooltip.content && (
          <div
            className="absolute pointer-events-none bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm z-10"
            style={{ left: tooltip.x + 12, top: tooltip.y - 10, maxWidth: 200 }}
          >
            <p className="font-bold mb-1">{tooltip.content.geo_name}</p>
            <p>Cuota total: <strong>{pct(tooltip.content.share_ren_pct)}</strong></p>
            <p>Brecha: <strong>{tooltip.content.gap_to_target_pp > 0
              ? `–${tooltip.content.gap_to_target_pp.toFixed(1)} pp`
              : '✓ Objetivo alcanzado'}</strong>
            </p>
            <p>Ritmo nec.: <strong>{tooltip.content.required_pace === 0
              ? '0 (objetivo alcanzado)'
              : `${tooltip.content.required_pace?.toFixed(2)} pp/año`}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Color legend */}
      {metric === 'share' && (
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-600 flex-wrap">
          <span>Cuota renovable:</span>
          {[
            ['< 17%',  '#b71c1c'],
            ['17–25%', '#ef6c00'],
            ['25–34%', '#f9a825'],
            ['34–42%', '#388e3c'],
            ['≥ 42,5%','#1b5e20'],
          ].map(([lbl, col]) => (
            <div key={lbl} className="flex items-center gap-1">
              <div className="w-4 h-3 rounded" style={{ backgroundColor: col }} />
              <span>{lbl}</span>
            </div>
          ))}
          <span className="text-gray-400">· Gris = sin datos / no EU</span>
        </div>
      )}
      {metric === 'required' && (
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-600 flex-wrap">
          <span>Estado:</span>
          {[
            ['At or above target','En/sobre objetivo'],
            ['On track','En camino'],
            ['Needs acceleration','Necesita acelerar'],
            ['Far behind','Muy retrasado'],
          ].map(([s, lbl]) => (
            <div key={s} className="flex items-center gap-1">
              <div className="w-4 h-3 rounded" style={{ backgroundColor: PACE_STATUS_COLORS[s] }} />
              <span>{lbl}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
