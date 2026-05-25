#!/usr/bin/env python3
"""
Download NRG_IND_REN dataset from Eurostat.
Source: Eurostat – Share of Energy from Renewable Sources (NRG_IND_REN)
URL: https://ec.europa.eu/eurostat/databrowser/product/view/NRG_IND_REN
License: Eurostat – free reuse with attribution
"""
import os
import sys
import requests

RAW_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'raw')

# Eurostat SDMX-ML 2.1 REST API – TSV compressed
URL_TSV = (
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/"
    "NRG_IND_REN/?format=TSV&compressed=true"
)

OUT_FILE = os.path.join(RAW_DIR, 'nrg_ind_ren.tsv.gz')


def download():
    os.makedirs(RAW_DIR, exist_ok=True)
    print("Downloading NRG_IND_REN from Eurostat …")
    headers = {"User-Agent": "Mozilla/5.0 (academic research project)"}
    r = requests.get(URL_TSV, timeout=180, headers=headers)
    r.raise_for_status()
    with open(OUT_FILE, 'wb') as f:
        f.write(r.content)
    size_kb = os.path.getsize(OUT_FILE) / 1024
    print(f"✓ Saved: {OUT_FILE}  ({size_kb:.1f} KB)")
    return OUT_FILE


if __name__ == '__main__':
    download()
