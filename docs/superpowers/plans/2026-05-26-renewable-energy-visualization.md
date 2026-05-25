# Renewable Energy Europe 2030 – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a narrative interactive visualization answering "Is Europe on track for its 2030 renewable energy targets?" using Eurostat NRG_IND_REN data, centred on the `required_pace` metric.

**Architecture:** Python data pipeline → processed JSON → Vite + React app with Recharts + D3 choropleth map → GitHub Pages deployment. Narrative structure with 7 scrollable sections, global filter state via React Context.

**Tech Stack:** Python 3 (pandas, requests), Vite 5, React 18, Recharts 2, D3 v7, Tailwind CSS 3, gh-pages

---

## File Map

```
renewable-energy-europe-2030/
├── README.md
├── LICENSE
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .gitignore
├── data/
│   ├── raw/           nrg_ind_ren.tsv.gz (downloaded)
│   ├── processed/     data.json
│   └── manual/        (not used – no verified national targets)
├── scripts/
│   ├── download_data.py
│   ├── prepare_data.py
│   └── validate_data.py
├── metadata/
│   ├── data_dictionary.md
│   └── sources.md
├── video/
│   ├── guion_video.md
│   └── escaleta_video.md
├── informe_decisiones_diseno.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── DataContext.jsx
    ├── hooks/
    │   └── useScrollSpy.js
    ├── utils/
    │   ├── colors.js
    │   ├── formatters.js
    │   └── regions.js
    └── components/
        ├── layout/
        │   ├── Header.jsx
        │   ├── NavBar.jsx
        │   └── Footer.jsx
        ├── sections/
        │   ├── HeroSection.jsx
        │   ├── CurrentStatusSection.jsx
        │   ├── RequiredPaceSection.jsx
        │   ├── TimelineSection.jsx
        │   ├── SectoralSection.jsx
        │   ├── GeographicSection.jsx
        │   └── ConclusionsSection.jsx
        ├── charts/
        │   ├── CountryBarChart.jsx
        │   ├── PaceDumbbellChart.jsx
        │   ├── TimelineChart.jsx
        │   ├── SectorSmallMultiples.jsx
        │   └── EuropeMap.jsx
        └── ui/
            ├── SectionWrapper.jsx
            ├── StatCard.jsx
            ├── FilterBar.jsx
            ├── CountrySelector.jsx
            └── PaceStatusBadge.jsx
```

---

### Task 1: Python – Download Eurostat Data

**Files:**
- Create: `scripts/download_data.py`

- [ ] **Step 1: Write download_data.py**

```python
#!/usr/bin/env python3
"""
Download NRG_IND_REN dataset from Eurostat bulk download.
Source: https://ec.europa.eu/eurostat/databrowser/product/view/NRG_IND_REN
"""
import os
import sys
import requests

RAW_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'raw')
URL = (
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/"
    "NRG_IND_REN/?format=TSV&compressed=true"
)
OUT_FILE = os.path.join(RAW_DIR, 'nrg_ind_ren.tsv.gz')

def download():
    os.makedirs(RAW_DIR, exist_ok=True)
    print(f"Downloading NRG_IND_REN from Eurostat...")
    r = requests.get(URL, timeout=120)
    r.raise_for_status()
    with open(OUT_FILE, 'wb') as f:
        f.write(r.content)
    size_kb = os.path.getsize(OUT_FILE) / 1024
    print(f"Saved to {OUT_FILE} ({size_kb:.1f} KB)")

if __name__ == '__main__':
    download()
```

- [ ] **Step 2: Run download script**

```bash
cd /Users/alejandroalonsoanda/Desktop/1.\ MASTER\ OUC/2\ CUATRIMESTRE\ /VISUALIZACION/PRACTICA/renewable-energy-europe-2030
python3 scripts/download_data.py
```
Expected: File saved, size > 50 KB

---

### Task 2: Python – Prepare & Clean Data

**Files:**
- Create: `scripts/prepare_data.py`

- [ ] **Step 1: Write prepare_data.py**

Reads raw TSV, pivots to long, cleans flags, derives variables, exports JSON.

- [ ] **Step 2: Run and verify output**

```bash
python3 scripts/prepare_data.py
```
Expected: `data/processed/data.json` created, ~4000-5000 records

---

### Task 3: Python – Validate Data

**Files:**
- Create: `scripts/validate_data.py`

- [ ] **Step 1: Write validate_data.py with assertions**
- [ ] **Step 2: Run and confirm all checks pass**

---

### Task 4: Project Scaffold – Vite + React

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

- [ ] **Step 1: Init Vite project manually (no npm create)**
- [ ] **Step 2: Install dependencies**
- [ ] **Step 3: Configure Tailwind**
- [ ] **Step 4: Configure gh-pages**
- [ ] **Step 5: Verify dev server starts**

---

### Task 5: Data Context

**Files:**
- Create: `src/context/DataContext.jsx`

- [ ] **Step 1: Write DataContext with global filter state**
- [ ] **Step 2: Wrap App with provider**

---

### Task 6: Utilities

**Files:**
- Create: `src/utils/colors.js`, `src/utils/formatters.js`, `src/utils/regions.js`

- [ ] **Step 1: Write color scales and pace_status colors**
- [ ] **Step 2: Write number/percentage formatters**
- [ ] **Step 3: Write region mapping and country metadata**

---

### Task 7: Layout Components

**Files:**
- Create: `src/components/layout/Header.jsx`, `NavBar.jsx`, `Footer.jsx`
- Create: `src/components/ui/SectionWrapper.jsx`

- [ ] **Step 1: Write Header with title and subtitle**
- [ ] **Step 2: Write NavBar with smooth-scroll links**
- [ ] **Step 3: Write Footer with sources**
- [ ] **Step 4: Write SectionWrapper**

---

### Task 8: Hero Section

**Files:**
- Create: `src/components/sections/HeroSection.jsx`

- [ ] **Step 1: Write HeroSection with EU-27 aggregate stats and target**

---

### Task 9: Current Status Chart

**Files:**
- Create: `src/components/charts/CountryBarChart.jsx`
- Create: `src/components/sections/CurrentStatusSection.jsx`

- [ ] **Step 1: Write CountryBarChart (horizontal bar, sorted, target line)**
- [ ] **Step 2: Write CurrentStatusSection with sort/filter controls**

---

### Task 10: Required Pace Section (Central)

**Files:**
- Create: `src/components/charts/PaceDumbbellChart.jsx`
- Create: `src/components/sections/RequiredPaceSection.jsx`

- [ ] **Step 1: Write PaceDumbbellChart comparing observed vs required pace**
- [ ] **Step 2: Write RequiredPaceSection with explanation**

---

### Task 11: Timeline Section

**Files:**
- Create: `src/components/charts/TimelineChart.jsx`
- Create: `src/components/sections/TimelineSection.jsx`

- [ ] **Step 1: Write TimelineChart with EU-27 + country selection**
- [ ] **Step 2: Write TimelineSection with country picker**

---

### Task 12: Sectoral Section

**Files:**
- Create: `src/components/charts/SectorSmallMultiples.jsx`
- Create: `src/components/sections/SectoralSection.jsx`

- [ ] **Step 1: Write SectorSmallMultiples (4 panels)**
- [ ] **Step 2: Write SectoralSection highlighting electricity vs transport**

---

### Task 13: Geographic Map

**Files:**
- Create: `src/components/charts/EuropeMap.jsx`
- Create: `src/components/sections/GeographicSection.jsx`

- [ ] **Step 1: Write EuropeMap SVG choropleth using D3 + TopoJSON**
- [ ] **Step 2: Write GeographicSection**

---

### Task 14: Conclusions Section

**Files:**
- Create: `src/components/sections/ConclusionsSection.jsx`

- [ ] **Step 1: Write ConclusionsSection with key findings**

---

### Task 15: UI Components & FilterBar

**Files:**
- Create: `src/components/ui/StatCard.jsx`, `FilterBar.jsx`, `CountrySelector.jsx`, `PaceStatusBadge.jsx`

- [ ] **Step 1: Write all UI utility components**
- [ ] **Step 2: Connect global filters across sections**

---

### Task 16: Documentation

**Files:**
- Create: `README.md`, `LICENSE`, `metadata/data_dictionary.md`, `metadata/sources.md`
- Create: `video/guion_video.md`, `video/escaleta_video.md`
- Create: `informe_decisiones_diseno.md`

- [ ] **Step 1: Write all documentation files**

---

### Task 17: GitHub Repo & Deploy

- [ ] **Step 1: Create GitHub repo via API**
- [ ] **Step 2: Push code**
- [ ] **Step 3: Deploy to GitHub Pages**
- [ ] **Step 4: Verify public URL**
