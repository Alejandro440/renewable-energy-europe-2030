# Fuentes y metadatos

## Dataset principal

| Campo           | Valor                                                                                                          |
|-----------------|----------------------------------------------------------------------------------------------------------------|
| **Nombre**      | Share of Energy from Renewable Sources                                                                         |
| **Código**      | NRG_IND_REN                                                                                                    |
| **Organismo**   | Eurostat – Oficina Estadística de la Unión Europea                                                             |
| **URL**         | https://ec.europa.eu/eurostat/databrowser/product/view/NRG_IND_REN                                            |
| **API REST**    | https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/NRG_IND_REN/?format=TSV&compressed=true         |
| **Licencia**    | Reutilización libre con atribución (política estándar Eurostat)                                                |
| **Formato**     | TSV comprimido (gzip), formato wide (años como columnas)                                                       |
| **Cobertura temporal** | 2004–2024                                                                                             |
| **Cobertura geográfica** | 27 Estados miembros UE, más IS, NO, AL, BA, GE, ME, MK, RS, XK y agregados EA20, EU27_2020        |
| **Fecha de descarga** | 26 de mayo de 2026                                                                                      |
| **Unidad**      | PC — porcentaje del consumo final bruto de energía                                                             |

## Marco regulatorio

| Instrumento                          | Objetivo                      | Referencia                                                   |
|--------------------------------------|-------------------------------|--------------------------------------------------------------|
| Directiva RED III (UE 2023/2413)     | ≥ 42,5 % renovables en 2030  | https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32023L2413 |
| Pacto Verde Europeo                  | Neutralidad climática 2050    | European Commission, 2019                                    |
| Fit for 55 (paquete legislativo)     | –55 % emisiones en 2030       | European Commission, 2021                                    |
| REPowerEU                            | Aceleración renovables        | European Commission, 2022                                    |

## Mapa geográfico

| Campo       | Valor                                                                                                  |
|-------------|--------------------------------------------------------------------------------------------------------|
| **Fuente**  | Natural Earth / World Atlas TopoJSON                                                                   |
| **Archivo** | `countries-110m.json`                                                                                  |
| **URL**     | https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json                                         |
| **Licencia**| Dominio público                                                                                         |
| **Nota**    | Proyección Mercator. Los identificadores numéricos (ISO 3166-1 numérico) se mapean a códigos ISO alpha-2 mediante tabla manual. |

## Transformaciones aplicadas

1. **Lectura de raw:** TSV comprimido con `pandas.read_csv` y `gzip.open`.
2. **Separación del índice:** La columna `freq,nrg_bal,unit,geo\TIME_PERIOD` se divide por comas en cuatro columnas.
3. **Filtrado sectorial:** Se retienen `nrg_bal ∈ {REN, REN_ELC, REN_HEAT_CL, REN_TRA}`.
4. **Filtrado geográfico:** Se retienen 27 Estados miembros UE + EU27_2020 + IS + NO.
5. **Pivoteo a long:** `pandas.melt` sobre las columnas de años (2004–2024).
6. **Limpieza de banderas:** Las banderas (`b`, `p`, `e`, `u`) se extraen con regex y se guardan en `data_flag`. El valor numérico se convierte a `float`.
7. **Tratamiento de ausentes:** `:` → `NaN`. No se interpola; se documentan los ausentes.
8. **Variables derivadas:** Ver sección de métricas derivadas en `data_dictionary.md`.
9. **Exportación:** JSON (`data/processed/data.json`) y CSV (`data/processed/data.csv`).

## Objetivos nacionales

No se incluyen objetivos nacionales específicos por país. Todos los cálculos de `required_pace` y `gap_to_target_pp` utilizan el objetivo europeo común del 42,5 % (Directiva RED III).

La tabla manual de objetivos nacionales prevista en la Parte I se descarta por la dificultad de documentar con rigor suficiente la fuente oficial de cada objetivo en todos los 27 Estados miembros. Si se requiere este análisis en futuras versiones, debe consultarse el Plan Nacional de Energía y Clima (PNEC) de cada Estado miembro.
