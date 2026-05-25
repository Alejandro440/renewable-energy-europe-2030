# ¿Está Europa en camino?
## La carrera de los países europeos hacia los objetivos de energía renovable 2030

[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-blue)](https://alejandro440.github.io/renewable-energy-europe-2030/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Data: Eurostat](https://img.shields.io/badge/Data-Eurostat-003399)](https://ec.europa.eu/eurostat/databrowser/product/view/NRG_IND_REN)

Visualización interactiva del progreso de los países europeos hacia el objetivo de energía renovable del **42,5 % para 2030** (Directiva RED III). Práctica final de la asignatura *Visualización de Datos* del Máster Universitario en Ciencia de Datos de la UOC.

**Autor:** Alejandro Alonso Anda  
**Año:** 2026

---

## Visualización online

🌐 **[alejandro440.github.io/renewable-energy-europe-2030](https://alejandro440.github.io/renewable-energy-europe-2030/)**

Accesible sin registro. Compatible con navegadores modernos (Chrome, Firefox, Edge, Safari).

---

## Pregunta central

> ¿Está Europa avanzando lo suficientemente rápido para cumplir sus objetivos de energía renovable en 2030?

La visualización responde a cinco preguntas de investigación:

1. **Situación actual:** ¿Cuál es la cuota renovable de cada país en 2024 y a qué distancia está del objetivo?
2. **Evolución temporal:** ¿Cómo ha evolucionado la UE-27 desde 2004? ¿Se observa aceleración?
3. **Patrones geográficos:** ¿Existe un patrón regional claro (Norte vs. Sur vs. Este)?
4. **Asimetría sectorial:** ¿En qué sector —electricidad, calefacción o transporte— es mayor la brecha?
5. **Ritmo necesario:** ¿Qué países necesitan acelerar más y cuánto?

---

## Estructura del repositorio

```
renewable-energy-europe-2030/
├── README.md
├── LICENSE
├── package.json                 ← Dependencias del proyecto web
├── vite.config.js               ← Configuración Vite + GitHub Pages
├── index.html                   ← Punto de entrada HTML
│
├── data/
│   ├── raw/                     ← Datos descargados de Eurostat (sin modificar)
│   │   └── nrg_ind_ren.tsv.gz
│   ├── processed/               ← Dataset final procesado
│   │   ├── data.json            ← Formato JSON (consumido por la app)
│   │   └── data.csv             ← Formato CSV (para inspección)
│   └── manual/                  ← (vacío; no se usan objetivos nacionales)
│
├── scripts/                     ← Pipeline de preparación de datos (Python)
│   ├── download_data.py         ← Descarga NRG_IND_REN de Eurostat
│   ├── prepare_data.py          ← Limpia, transforma y calcula variables derivadas
│   └── validate_data.py         ← Valida integridad del dataset procesado
│
├── metadata/
│   ├── data_dictionary.md       ← Diccionario de variables
│   └── sources.md               ← Fuentes, metadatos y transformaciones
│
├── video/
│   ├── guion_video.md           ← Guion del vídeo (listo para grabar)
│   └── escaleta_video.md        ← Escaleta temporal y verificaciones
│
├── informe_decisiones_diseno.md ← Informe académico de decisiones de diseño
│
├── public/                      ← Assets estáticos (copiados en build)
│   ├── data.json                ← Copia del dataset para la app
│   ├── countries-110m.json      ← TopoJSON para el mapa
│   └── favicon.svg
│
└── src/                         ← Código fuente React
    ├── main.jsx
    ├── App.jsx
    ├── context/DataContext.jsx
    ├── utils/
    ├── components/
    │   ├── layout/
    │   ├── sections/            ← 7 secciones narrativas
    │   ├── charts/              ← 5 componentes de gráficos
    │   └── ui/                  ← Componentes de interfaz
    └── index.css
```

---

## Ejecución local

### Requisitos previos

- **Python ≥ 3.10** con `pandas` y `requests`
- **Node.js ≥ 18** y **npm ≥ 9**

### 1. Preparar datos (opcional — datos ya incluidos en `data/processed/`)

```bash
# Instalar dependencias Python si no están disponibles
pip install pandas requests numpy

# Descargar datos frescos de Eurostat
python scripts/download_data.py

# Procesar y limpiar
python scripts/prepare_data.py

# Validar
python scripts/validate_data.py

# Copiar datos procesados a public/
cp data/processed/data.json public/data.json
```

### 2. Instalar dependencias web y ejecutar en local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/renewable-energy-europe-2030/`.

### 3. Compilar para producción

```bash
npm run build
```

Los archivos compilados quedan en `dist/`. Pueden servirse con cualquier servidor HTTP estático.

---

## Despliegue en GitHub Pages

```bash
npm run deploy
```

Este comando compila el proyecto y publica el contenido de `dist/` en la rama `gh-pages` del repositorio.

**Prerrequisito:** configurar GitHub Pages en el repositorio para servir desde la rama `gh-pages`.

---

## Stack tecnológico

| Componente            | Tecnología                        |
|-----------------------|-----------------------------------|
| Pipeline de datos     | Python + pandas + requests        |
| Framework web         | React 18 + Vite 5                 |
| Gráficos principales  | Recharts 2                        |
| Mapa coroplético      | D3 v7 + TopoJSON                  |
| Estilos               | Tailwind CSS 3                    |
| Despliegue            | GitHub Pages (gh-pages)           |

---

## Datos

**Fuente:** Eurostat — *Share of Energy from Renewable Sources* (NRG_IND_REN)  
**Período:** 2004–2024  
**Sectores:** Total, Electricidad, Calefacción/Refrigeración, Transporte  
**Objetivo:** 42,5 % (Directiva RED III / Reglamento UE 2023/2413)  
**Licencia:** Reutilización libre con atribución (política estándar Eurostat)

Ver `metadata/sources.md` para información detallada sobre fuentes y transformaciones.  
Ver `metadata/data_dictionary.md` para el diccionario completo de variables.

---

## Licencia

Código fuente: [MIT License](LICENSE)  
Datos Eurostat: reutilización libre con atribución  
Mapa TopoJSON: dominio público (Natural Earth / World Atlas)
