#!/usr/bin/env python3
"""
Prepare NRG_IND_REN dataset for visualization.

Steps:
  1. Read raw TSV (wide format)
  2. Parse & split index columns
  3. Filter to relevant sectors and geographies
  4. Pivot to long format (tidy)
  5. Clean Eurostat quality flags (b, p, e, u)
  6. Add region classification and country names
  7. Calculate derived variables (gap, required_pace, yoy_change, recent_pace, pace_status)
  8. Export to JSON (for the React app) and CSV (for reproducibility)

Output:
  data/processed/data.json   – main app data (long format, all sectors)
  data/processed/data.csv    – same, CSV for inspection

Target:  42.5 % renewable share (EU common target, 2030)
Latest:  2024 (last year in dataset)
"""
import os
import re
import json
import numpy as np
import pandas as pd

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_FILE  = os.path.join(BASE, 'data', 'raw',       'nrg_ind_ren.tsv.gz')
OUT_DIR   = os.path.join(BASE, 'data', 'processed')
OUT_JSON  = os.path.join(OUT_DIR, 'data.json')
OUT_CSV   = os.path.join(OUT_DIR, 'data.csv')

# ── Constants ──────────────────────────────────────────────────────────────────
TARGET_2030   = 42.5        # EU common target (%)
LATEST_YEAR   = 2024
YEARS_REMAIN  = 2030 - LATEST_YEAR   # = 6

# Sectors to keep (raw nrg_bal codes → readable labels)
SECTOR_MAP = {
    'REN':         'Total',
    'REN_ELC':     'Electricity',
    'REN_HEAT_CL': 'Heating & Cooling',
    'REN_TRA':     'Transport',
}

# EU-27 member states (ISO 2-letter)
EU27 = {
    'AT','BE','BG','CY','CZ','DE','DK','EE','EL','ES',
    'FI','FR','HR','HU','IE','IT','LT','LU','LV','MT',
    'NL','PL','PT','RO','SE','SI','SK',
}
# Additional entities to keep (for context/comparison)
EXTRA = {'EU27_2020', 'IS', 'NO'}
GEO_KEEP = EU27 | EXTRA

# Country names (ISO 2-letter → readable)
GEO_NAMES = {
    'AT': 'Austria',       'BE': 'Belgium',       'BG': 'Bulgaria',
    'CY': 'Cyprus',        'CZ': 'Czechia',       'DE': 'Germany',
    'DK': 'Denmark',       'EE': 'Estonia',        'EL': 'Greece',
    'ES': 'Spain',         'FI': 'Finland',        'FR': 'France',
    'HR': 'Croatia',       'HU': 'Hungary',        'IE': 'Ireland',
    'IT': 'Italy',         'LT': 'Lithuania',      'LU': 'Luxembourg',
    'LV': 'Latvia',        'MT': 'Malta',          'NL': 'Netherlands',
    'PL': 'Poland',        'PT': 'Portugal',       'RO': 'Romania',
    'SE': 'Sweden',        'SI': 'Slovenia',       'SK': 'Slovakia',
    'EU27_2020': 'EU-27',  'IS': 'Iceland',        'NO': 'Norway',
}

# Geographical region classification (EU-27 only)
REGION = {
    # North
    'DK':'North','EE':'North','FI':'North','LT':'North','LV':'North','SE':'North',
    # West
    'AT':'West','BE':'West','DE':'West','FR':'West','IE':'West','LU':'West','NL':'West',
    # South
    'CY':'South','EL':'South','ES':'South','HR':'South','IT':'South','MT':'South',
                  'PT':'South','SI':'South',
    # East
    'BG':'East','CZ':'East','HU':'East','PL':'East','RO':'East','SK':'East',
    # Non-EU
    'EU27_2020':'EU-27 (aggregate)','IS':'Non-EU','NO':'Non-EU',
}

# ── Step 1: Read raw file ──────────────────────────────────────────────────────
def read_raw():
    import gzip
    print("Reading raw file …")
    with gzip.open(RAW_FILE, 'rt', encoding='utf-8') as f:
        df = pd.read_csv(f, sep='\t')
    print(f"  Shape: {df.shape}")
    return df


# ── Step 2: Parse index column ─────────────────────────────────────────────────
def parse_index(df):
    """
    First column format: 'A,REN,PC,AT'  (freq,nrg_bal,unit,geo)
    """
    idx_col = df.columns[0]
    parts = df[idx_col].str.split(',', expand=True)
    parts.columns = ['freq', 'nrg_bal', 'unit', 'geo_code']
    df = pd.concat([parts, df.drop(columns=[idx_col])], axis=1)
    return df


# ── Step 3: Filter sectors and geographies ────────────────────────────────────
def filter_data(df):
    df = df[df['nrg_bal'].isin(SECTOR_MAP.keys())]
    df = df[df['geo_code'].isin(GEO_KEEP)]
    df = df[df['unit'] == 'PC']      # percentage
    df = df[df['freq'] == 'A']       # annual
    print(f"  After filter: {df.shape}")
    return df


# ── Step 4: Pivot to long format ───────────────────────────────────────────────
def pivot_long(df):
    year_cols = [c for c in df.columns if c.strip().isdigit()]
    id_vars = ['freq', 'nrg_bal', 'unit', 'geo_code']
    long = df.melt(id_vars=id_vars, value_vars=year_cols,
                   var_name='year', value_name='raw_value')
    long['year'] = long['year'].str.strip().astype(int)
    long = long[long['year'].between(2004, 2024)]
    print(f"  Long shape: {long.shape}")
    return long


# ── Step 5: Clean quality flags ────────────────────────────────────────────────
FLAG_PATTERN = re.compile(r'([0-9.]+)\s*([bepud]*)')

def clean_value(raw):
    if pd.isna(raw):
        return np.nan, ''
    s = str(raw).strip()
    if s in (':', '', 'nan'):
        return np.nan, ''
    m = FLAG_PATTERN.match(s)
    if m:
        return float(m.group(1)), m.group(2).strip()
    try:
        return float(s), ''
    except ValueError:
        return np.nan, ''


def clean_flags(df):
    df = df.copy()
    cleaned = df['raw_value'].apply(clean_value)
    df['share_ren_pct'] = [v[0] for v in cleaned]
    df['data_flag']     = [v[1] for v in cleaned]
    df = df.drop(columns=['raw_value'])
    return df


# ── Step 6: Add metadata ───────────────────────────────────────────────────────
def add_metadata(df):
    df = df.copy()
    df['sector']   = df['nrg_bal'].map(SECTOR_MAP)
    df['geo_name'] = df['geo_code'].map(GEO_NAMES)
    df['region']   = df['geo_code'].map(REGION)
    df['is_eu27_member'] = df['geo_code'].isin(EU27)
    return df


# ── Step 7: Derived variables ──────────────────────────────────────────────────
def add_derived(df):
    df = df.copy()

    # Year-over-year change (all sectors, all years)
    df = df.sort_values(['geo_code', 'nrg_bal', 'year'])
    df['yoy_change'] = (
        df.groupby(['geo_code', 'nrg_bal'])['share_ren_pct']
          .diff()
          .round(3)
    )

    # ── Variables calculated only for TOTAL sector + latest year ──────────────
    # Subset for derivation
    total = df[(df['nrg_bal'] == 'REN') & (df['year'] == LATEST_YEAR)].copy()

    # gap_to_target_pp: positive means below target, negative means above target
    total['gap_to_target_pp'] = (TARGET_2030 - total['share_ren_pct']).round(3)

    # required_pace (pp/year): pace needed from LATEST_YEAR to 2030
    # = max(0, gap) / years_remaining
    total['required_pace'] = (
        total['gap_to_target_pp'].clip(lower=0) / YEARS_REMAIN
    ).round(3)

    # recent_pace: average annual change 2019–2024 (5-year window)
    recent = df[
        (df['nrg_bal'] == 'REN') & (df['year'].between(2020, 2024))
    ].groupby('geo_code')['yoy_change'].mean().round(3).rename('recent_pace')
    total = total.merge(recent, on='geo_code', how='left')

    # pace_status classification
    # Logic: compare required_pace against recent_pace observed (2020–2024)
    # - "At or above target"  : country has already reached 42.5 %
    # - "On track"            : recent_pace >= required_pace  (current momentum is enough)
    # - "Needs acceleration"  : recent_pace > 0 but < required_pace
    # - "Far behind"          : recent_pace <= 0  OR  required_pace > 3 pp/year (structural gap)
    def classify(row):
        if pd.isna(row['share_ren_pct']):
            return 'No data'
        if row['gap_to_target_pp'] <= 0:
            return 'At or above target'
        rp  = row.get('recent_pace',  np.nan)
        req = row['required_pace']
        if pd.isna(rp):
            return 'Needs acceleration'
        if rp >= req and rp > 0:
            return 'On track'
        if rp <= 0 or req > 3.0:
            return 'Far behind'
        return 'Needs acceleration'

    total['pace_status'] = total.apply(classify, axis=1)

    # Merge derived columns back into main df
    derived_cols = ['geo_code', 'gap_to_target_pp', 'required_pace',
                    'recent_pace', 'pace_status']
    df = df.merge(total[derived_cols], on='geo_code', how='left')

    return df


# ── Step 8: Final cleanup & export ────────────────────────────────────────────
def export(df):
    os.makedirs(OUT_DIR, exist_ok=True)

    # Drop redundant columns
    df = df.drop(columns=['freq', 'unit'])

    # Round
    df['share_ren_pct'] = df['share_ren_pct'].round(3)

    # Sort
    df = df.sort_values(['nrg_bal', 'geo_code', 'year'])

    # CSV
    df.to_csv(OUT_CSV, index=False)
    print(f"✓ CSV: {OUT_CSV}  ({len(df)} rows)")

    # JSON (records orientation, NaN → null)
    records = json.loads(df.to_json(orient='records', double_precision=3))
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, separators=(',', ':'))
    size_kb = os.path.getsize(OUT_JSON) / 1024
    print(f"✓ JSON: {OUT_JSON}  ({size_kb:.1f} KB)")


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    print("=== prepare_data.py ===")
    df = read_raw()
    df = parse_index(df)
    df = filter_data(df)
    df = pivot_long(df)
    df = clean_flags(df)
    df = add_metadata(df)
    df = add_derived(df)

    print("\nSample (EU-27, REN, 2024):")
    sample = df[(df['nrg_bal']=='REN') & (df['year']==2024) & df['is_eu27_member']]
    print(sample[['geo_code','geo_name','share_ren_pct','gap_to_target_pp',
                  'required_pace','recent_pace','pace_status']].to_string(index=False))

    export(df)
    print("\nDone.")


if __name__ == '__main__':
    main()
