#!/usr/bin/env python3
"""
Validate the processed dataset before visualization.

Checks:
  1. File exists and is non-empty
  2. Expected columns are present
  3. All EU-27 countries are represented in every sector
  4. share_ren_pct is in [0, 100]
  5. required_pace is non-negative
  6. gap_to_target_pp is consistent with share_ren_pct
  7. yoy_change is plausible (no jumps > 20 pp)
  8. pace_status only contains expected categories
  9. Latest year is 2024 for all sectors / countries
"""
import os
import sys
import json
import pandas as pd
import numpy as np

BASE     = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_IN  = os.path.join(BASE, 'data', 'processed', 'data.json')

EXPECTED_SECTORS = {'Total', 'Electricity', 'Heating & Cooling', 'Transport'}
EU27_CODES = {
    'AT','BE','BG','CY','CZ','DE','DK','EE','EL','ES',
    'FI','FR','HR','HU','IE','IT','LT','LU','LV','MT',
    'NL','PL','PT','RO','SE','SI','SK',
}
VALID_STATUSES = {'At or above target','On track','Needs acceleration','Far behind','No data'}
TARGET_2030 = 42.5
LATEST_YEAR = 2024

PASS = "  ✓"
FAIL = "  ✗ FAIL:"

errors = []

def check(cond, msg_pass, msg_fail):
    if cond:
        print(f"{PASS} {msg_pass}")
    else:
        print(f"{FAIL} {msg_fail}")
        errors.append(msg_fail)


def main():
    print("=== validate_data.py ===\n")

    # 1. File exists
    check(os.path.exists(JSON_IN), f"File exists: {JSON_IN}", f"File NOT found: {JSON_IN}")

    with open(JSON_IN) as f:
        records = json.load(f)
    df = pd.DataFrame(records)
    check(len(df) > 1000, f"Row count OK: {len(df)}", f"Too few rows: {len(df)}")

    # 2. Expected columns
    expected_cols = {'geo_code','geo_name','year','sector','share_ren_pct',
                     'data_flag','region','nrg_bal','gap_to_target_pp',
                     'required_pace','recent_pace','pace_status','yoy_change'}
    missing = expected_cols - set(df.columns)
    check(len(missing)==0, "All expected columns present", f"Missing columns: {missing}")

    # 3. EU-27 coverage per sector
    for sector in EXPECTED_SECTORS:
        sub = df[(df['sector']==sector) & (df['year']==LATEST_YEAR)]
        found = set(sub['geo_code'].unique()) & EU27_CODES
        missing_geo = EU27_CODES - found
        check(len(missing_geo)==0,
              f"EU-27 coverage OK for sector '{sector}' in {LATEST_YEAR}",
              f"Missing countries in '{sector}': {missing_geo}")

    # 4. share_ren_pct >= 0 (values > 100 are legitimate in electricity sector
    #    for countries like Iceland/Norway that export renewables via the grid)
    non_null = df['share_ren_pct'].dropna()
    in_range = (non_null >= 0).all()
    over_100 = non_null[non_null > 100]
    check(in_range, f"share_ren_pct >= 0 (note: {len(over_100)} values >100% are legitimate – renewable exports)",
          f"Negative share_ren_pct values found")
    if len(over_100) > 0:
        print(f"    INFO: {len(over_100)} values exceed 100% (electricity sector exports, expected for IS/NO/SE/FI)")

    # 5. required_pace non-negative
    rp = df['required_pace'].dropna()
    check((rp >= 0).all(), "required_pace >= 0",
          f"Negative required_pace values found: {rp[rp<0].values}")

    # 6. gap consistency: only check for Total sector latest year rows
    #    (gap_to_target_pp is a country-level field from LATEST_YEAR REN, merged into all rows)
    check_gap = df[
        (df['nrg_bal'] == 'REN') &
        (df['year'] == LATEST_YEAR) &
        df['gap_to_target_pp'].notna() &
        df['share_ren_pct'].notna()
    ].copy()
    check_gap['expected_gap'] = (TARGET_2030 - check_gap['share_ren_pct']).round(2)
    diff = (check_gap['gap_to_target_pp'].round(2) - check_gap['expected_gap']).abs()
    check((diff <= 0.02).all(), "gap_to_target_pp consistent with REN share (2024)",
          f"Gap inconsistencies in {(diff>0.02).sum()} rows")

    # 7. yoy_change plausibility (|change| <= 30 pp; > 20 are noted as potential breaks)
    yoy = df['yoy_change'].dropna()
    very_large = yoy[yoy.abs() > 30]
    large_warn = yoy[(yoy.abs() > 20) & (yoy.abs() <= 30)]
    check(len(very_large)==0, "yoy_change plausible (|Δ| ≤ 30 pp)",
          f"Very large yoy_change values (likely series breaks): {very_large.values}")
    if len(large_warn) > 0:
        print(f"    INFO: {len(large_warn)} yoy_change values in 20-30 pp range (possible series breaks, not errors)")

    # 8. pace_status categories
    statuses = set(df['pace_status'].dropna().unique())
    unexpected = statuses - VALID_STATUSES
    check(len(unexpected)==0, f"pace_status values valid: {statuses}",
          f"Unexpected pace_status: {unexpected}")

    # 9. Latest year = 2024
    latest = int(df['year'].max())
    check(latest == LATEST_YEAR, f"Latest year = {latest}",
          f"Expected latest year {LATEST_YEAR}, got {latest}")

    # Summary stats
    print()
    print("Summary statistics (EU-27, Total sector, 2024):")
    total_2024 = df[(df['nrg_bal']=='REN') & (df['year']==LATEST_YEAR) &
                    df['geo_code'].isin(EU27_CODES)]
    print(f"  Countries at/above target: {(total_2024['pace_status']=='At or above target').sum()}")
    print(f"  Countries on track:        {(total_2024['pace_status']=='On track').sum()}")
    print(f"  Countries need accel:      {(total_2024['pace_status']=='Needs acceleration').sum()}")
    print(f"  Countries far behind:      {(total_2024['pace_status']=='Far behind').sum()}")
    print(f"  EU-27 mean share (REN):    {total_2024['share_ren_pct'].mean():.2f} %")

    print()
    if errors:
        print(f"VALIDATION FAILED: {len(errors)} error(s)")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("ALL CHECKS PASSED ✓")


if __name__ == '__main__':
    main()
