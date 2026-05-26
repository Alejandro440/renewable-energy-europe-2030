# Diccionario de datos — ¿Está Europa en camino?

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Dataset principal:** Eurostat NRG_IND_REN  
**Archivo procesado:** `data/processed/data.json` / `data/processed/data.csv`

---

## Variables del dataset procesado

| Variable           | Tipo        | Rol        | Descripción                                                                                  |
|--------------------|-------------|------------|----------------------------------------------------------------------------------------------|
| `geo_code`         | Cadena      | Dimensión  | Código ISO 2 letras del país (p.ej. `DE`, `ES`). `EU27_2020` = agregado UE-27.              |
| `geo_name`         | Cadena      | Dimensión  | Nombre corto del país en inglés (p.ej. `Germany`, `EU-27`).                                 |
| `year`             | Entero      | Dimensión  | Año de referencia. Rango: 2004–2024.                                                         |
| `nrg_bal`          | Cadena      | Dimensión  | Código Eurostat del indicador sectorial (ver tabla inferior).                                |
| `sector`           | Cadena      | Dimensión  | Etiqueta legible del sector: `Total`, `Electricity`, `Heating & Cooling`, `Transport`.       |
| `share_ren_pct`    | Numérico    | Medida     | Cuota de energía renovable (% del consumo final bruto). Puede superar 100% en electricidad. |
| `unit`             | —           | —          | Eliminado en procesado; siempre `PC` (porcentaje).                                           |
| `data_flag`        | Cadena      | Metadato   | Bandera de calidad Eurostat: `b` (ruptura), `p` (provisional), `e` (estimado), `u` (baja fiabilidad), `''` (definitivo). |
| `region`           | Cadena      | Dimensión  | Clasificación regional manual: `North`, `West`, `South`, `East`, `EU-27 (aggregate)`, `Non-EU`. |
| `is_eu27_member`   | Booleano    | Metadato   | `true` si es Estado miembro de la UE-27; `false` para IS, NO, EU27_2020.                    |
| `gap_to_target_pp` | Numérico    | Medida     | Distancia al objetivo del 42,5 % en puntos porcentuales. Negativo = objetivo superado. Solo calculado para sector `REN`, año 2024, pero disponible en todas las filas del mismo país. |
| `required_pace`    | Numérico    | Medida     | Ritmo anual necesario (pp/año) para alcanzar 42,5 % en 2030 desde el dato de 2024. `0` si ya superado el objetivo. Solo calculado para sector `REN`. Fórmula: `max(0, 42.5 − share_2024) / (2030 − 2024)`. |
| `recent_pace`      | Numérico    | Medida     | Ritmo anual neto observado entre 2020 y 2024 para el sector `REN` (pp/año). Fórmula: `(share_2024 − share_2020) / (2024 − 2020)`. |
| `pace_status`      | Cadena      | Medida     | Clasificación interpretativa del avance (ver tabla inferior).                                |
| `yoy_change`       | Numérico    | Medida     | Variación interanual de `share_ren_pct` en puntos porcentuales. Calculada para todos los sectores y años. |

---

## Códigos de indicador sectorial (nrg_bal)

| Código          | Sector                  | Notas                                              |
|-----------------|-------------------------|----------------------------------------------------|
| `REN`           | Total                   | Cuota renovable global sobre consumo final bruto   |
| `REN_ELC`       | Electricity             | Cuota renovable en electricidad                    |
| `REN_HEAT_CL`   | Heating & Cooling       | Cuota renovable en calefacción y refrigeración     |
| `REN_TRA`       | Transport               | Cuota renovable en transporte                      |

Los códigos `REN_HEAT_CL_WHC` y `REN_WHC_DHEAT_DCL` (sub-indicadores de calor) fueron excluidos del análisis por ser subconjuntos del indicador `REN_HEAT_CL`.

---

## Clasificación pace_status

| Valor                  | Condición                                                           |
|------------------------|---------------------------------------------------------------------|
| `At or above target`   | `gap_to_target_pp ≤ 0` (ya en/sobre el 42,5 %)                     |
| `On track`             | `recent_pace ≥ required_pace` y `recent_pace > 0`                  |
| `Needs acceleration`   | `recent_pace > 0` pero `recent_pace < required_pace`               |
| `Far behind`           | `recent_pace ≤ 0` (estancamiento o retroceso) o `required_pace > 3 pp/año` |
| `No data`              | `share_ren_pct` no disponible                                       |

---

## Clasificación regional

| Región | Países                                           |
|--------|--------------------------------------------------|
| North  | DK, EE, FI, LT, LV, SE                          |
| West   | AT, BE, DE, FR, IE, LU, NL                       |
| South  | CY, EL, ES, HR, IT, MT, PT, SI                  |
| East   | BG, CZ, HU, PL, RO, SK                          |

---

## Coberturas del dataset

- **Período:** 2004–2024 (21 años)
- **Entidades incluidas:** 27 Estados miembros UE + EU27_2020 (agregado) + IS (Islandia) + NO (Noruega) = 30 entidades
- **Sectores:** 4 (Total, Electricity, Heating & Cooling, Transport)
- **Total de filas:** 2.520 (30 × 4 × 21)

---

## Notas sobre calidad de datos

- Valores `>100 %` en el sector electricidad son metodológicamente correctos para países con exportación neta de renovables (IS, NO, SE, FI).
- Las banderas `p` (provisional) son frecuentes para 2023–2024 y pueden variar en actualizaciones posteriores.
- La bandera `b` indica ruptura de serie (cambio metodológico). Se conserva el valor numérico.
- Se excluyeron entidades con series muy incompletas (Kosovo, Albania, Georgia, etc.) para mantener el foco en la UE.
