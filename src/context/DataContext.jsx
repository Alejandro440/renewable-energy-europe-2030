/**
 * DataContext – global state for filters and loaded data.
 *
 * Provides:
 *   rawData      – full records array (all sectors, all years)
 *   loading      – boolean
 *   error        – string|null
 *   selectedSector  – 'Total'|'Electricity'|'Heating & Cooling'|'Transport'
 *   setSelectedSector
 *   selectedRegion  – null | 'North'|'West'|'South'|'East'
 *   setSelectedRegion
 *   selectedCountries – string[]  (geo_codes)
 *   setSelectedCountries
 *   latestYear   – number
 *   BASE_URL     – string (Vite import.meta.env.BASE_URL)
 *
 * Helper selectors:
 *   getLatestTotal(geo_code) → record for sector=REN, year=latestYear
 *   getTimeSeries(geo_code, sector) → [{year, share_ren_pct}] sorted by year
 */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

const DataContext = createContext(null)

const LATEST_YEAR = 2024

export function DataProvider({ children }) {
  const [rawData, setRawData]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const [selectedSector,    setSelectedSector]    = useState('Total')
  const [selectedRegion,    setSelectedRegion]    = useState(null)
  const [selectedCountries, setSelectedCountries] = useState([])

  useEffect(() => {
    const base = import.meta.env.BASE_URL || '/'
    const url  = `${base}data.json`
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`)
        return r.json()
      })
      .then(data => {
        setRawData(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  const getLatestTotal = useCallback((geoCode) => {
    return rawData.find(
      d => d.geo_code === geoCode && d.nrg_bal === 'REN' && d.year === LATEST_YEAR
    ) || null
  }, [rawData])

  const getTimeSeries = useCallback((geoCode, sector) => {
    const nrgBal = {
      'Total': 'REN', 'Electricity': 'REN_ELC',
      'Heating & Cooling': 'REN_HEAT_CL', 'Transport': 'REN_TRA',
    }[sector] || 'REN'
    return rawData
      .filter(d => d.geo_code === geoCode && d.nrg_bal === nrgBal)
      .sort((a, b) => a.year - b.year)
  }, [rawData])

  // EU-27 time series for Total (used in hero / timeline)
  const eu27TimeSeries = useMemo(() => {
    return rawData
      .filter(d => d.geo_code === 'EU27_2020' && d.nrg_bal === 'REN')
      .sort((a, b) => a.year - b.year)
  }, [rawData])

  // Latest year data for all EU-27 countries, Total sector
  const latestTotalAll = useMemo(() => {
    return rawData.filter(d => d.nrg_bal === 'REN' && d.year === LATEST_YEAR)
  }, [rawData])

  // Latest year data for all sectors (for sectoral comparison)
  const latestAllSectors = useMemo(() => {
    return rawData.filter(d => d.year === LATEST_YEAR)
  }, [rawData])

  const value = {
    rawData, loading, error,
    selectedSector, setSelectedSector,
    selectedRegion, setSelectedRegion,
    selectedCountries, setSelectedCountries,
    latestYear: LATEST_YEAR,
    getLatestTotal,
    getTimeSeries,
    eu27TimeSeries,
    latestTotalAll,
    latestAllSectors,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
