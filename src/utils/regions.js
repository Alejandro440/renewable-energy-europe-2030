/**
 * Geographic metadata for countries in the dataset.
 * Maps ISO 2-letter codes to regions, names, and TopoJSON numeric IDs.
 */

export const REGION_LIST = ['North', 'West', 'South', 'East']

export const COUNTRY_META = {
  AT: { name:'Austria',      region:'West',  iso3n: 40  },
  BE: { name:'Belgium',      region:'West',  iso3n: 56  },
  BG: { name:'Bulgaria',     region:'East',  iso3n: 100 },
  CY: { name:'Cyprus',       region:'South', iso3n: 196 },
  CZ: { name:'Czechia',      region:'East',  iso3n: 203 },
  DE: { name:'Germany',      region:'West',  iso3n: 276 },
  DK: { name:'Denmark',      region:'North', iso3n: 208 },
  EE: { name:'Estonia',      region:'North', iso3n: 233 },
  EL: { name:'Greece',       region:'South', iso3n: 300 },
  ES: { name:'Spain',        region:'South', iso3n: 724 },
  FI: { name:'Finland',      region:'North', iso3n: 246 },
  FR: { name:'France',       region:'West',  iso3n: 250 },
  HR: { name:'Croatia',      region:'South', iso3n: 191 },
  HU: { name:'Hungary',      region:'East',  iso3n: 348 },
  IE: { name:'Ireland',      region:'West',  iso3n: 372 },
  IT: { name:'Italy',        region:'South', iso3n: 380 },
  LT: { name:'Lithuania',    region:'North', iso3n: 440 },
  LU: { name:'Luxembourg',   region:'West',  iso3n: 442 },
  LV: { name:'Latvia',       region:'North', iso3n: 428 },
  MT: { name:'Malta',        region:'South', iso3n: 470 },
  NL: { name:'Netherlands',  region:'West',  iso3n: 528 },
  PL: { name:'Poland',       region:'East',  iso3n: 616 },
  PT: { name:'Portugal',     region:'South', iso3n: 620 },
  RO: { name:'Romania',      region:'East',  iso3n: 642 },
  SE: { name:'Sweden',       region:'North', iso3n: 752 },
  SI: { name:'Slovenia',     region:'South', iso3n: 705 },
  SK: { name:'Slovakia',     region:'East',  iso3n: 703 },
  IS: { name:'Iceland',      region:'North', iso3n: 352 },
  NO: { name:'Norway',       region:'North', iso3n: 578 },
  EU27_2020: { name:'EU-27', region:'EU-27 (aggregate)', iso3n: null },
}

export const EU27_CODES = [
  'AT','BE','BG','CY','CZ','DE','DK','EE','EL','ES',
  'FI','FR','HR','HU','IE','IT','LT','LU','LV','MT',
  'NL','PL','PT','RO','SE','SI','SK',
]

// iso3n → iso2 lookup (for D3 map matching)
export const ISO3N_TO_CODE = Object.fromEntries(
  Object.entries(COUNTRY_META)
    .filter(([, m]) => m.iso3n !== null)
    .map(([code, m]) => [m.iso3n, code])
)
