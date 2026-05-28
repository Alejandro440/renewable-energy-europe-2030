# Escaleta temporal del vídeo

**Duración objetivo:** ~5 minutos (300 s) con margen entre 4:45 y 5:30
**Evaluación UOC:** 6 bloques con pesos distintos

---

## Mapa de bloques evaluativos

| Bloque                   | Peso | Duración aprox. | Tramo en escaleta            |
|--------------------------|------|------------------|------------------------------|
| Proceso de creación      | 20 % | ~45 s            | 00:25 – 01:10                |
| Conjunto de datos        | 15 % | ~45 s            | 00:25 – 01:10                |
| Preguntas clave          | 20 % | ~50 s            | 02:00 – 02:50                |
| Presentación en vivo     | 20 % | ~95 s            | 01:10 – 02:00 + 03:40 – 04:25 |
| Interactividad           | 15 % | ~50 s            | 02:50 – 03:40                |
| Reflexión final          | 10 % | ~45 s            | 04:25 – 05:10                |

Los pesos de cada bloque se cubren tanto en la narración como en lo que se muestra en pantalla; algunos bloques se solapan (por ejemplo, la presentación en vivo aparece dos veces: primero al mostrar el estado actual y el ritmo necesario, y de nuevo al recorrer el mapa y la evolución temporal).

---

## Escaleta por segmento

| Tiempo        | Bloque evaluativo            | Pantalla / Acción                                                              | Narración clave                                                                                          |
|---------------|------------------------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| 00:00 – 00:25 | Presentación                 | Hero con título grande y 4 KPIs visibles                                       | Presentación personal y pregunta central; objetivo 42,5 % de la Directiva RED III                         |
| 00:25 – 01:10 | Proceso + Dataset            | Hero (señalando KPIs); breve mención al pipeline o a `scripts/prepare_data.py` | NRG_IND_REN, pivoteo a long, banderas de calidad, 2.520 filas; `gap`, `required_pace`, `recent_pace`     |
| 01:10 – 02:00 | Presentación en vivo (1)     | Sección Estado actual; cambiar ordenación a «Ritmo necesario ↓»                | 5 países por encima del 42,5 %; cuotas más bajas (BE, LU, IE, MT); UE-27 ≈ 25 %; BE necesita ~5 pp/año    |
| 02:00 – 02:50 | Preguntas clave              | Sección Ritmo necesario (mancuernas)                                            | Solo EE y LT están en camino; HR retrocede; PL y SK lejos del ritmo necesario; mostrar fórmula visible    |
| 02:50 – 03:40 | Interactividad               | Sección Sectores; activar filtro región «Norte»; cambiar sector vía FilterBar  | UE-27: 47 % electricidad vs 11 % transporte (~36 pp); 14 países pasan 42,5 % en electricidad; alcance real de los filtros |
| 03:40 – 04:25 | Presentación en vivo (2)     | Sección Evolución temporal (volver al sector Total); luego Mapa; cambiar métrica del mapa a «Ritmo necesario» | Trayectorias DE/SE/PL/ES desde 2004; patrón no estrictamente norte-sur; mapa rojo cuando se mira el ritmo |
| 04:25 – 05:10 | Reflexión final              | Sección Conclusiones                                                            | Necesidad de cuadruplicar el ritmo histórico; accesibilidad; limitaciones; reflexión sobre `required_pace` |

---

## Interacciones a demostrar durante el vídeo

1. **Estado actual – Ordenación:** cambiar de «Cuota actual ↑» a «Ritmo necesario ↓»
2. **FilterBar – Región:** activar «Norte» en la sección Sectores
3. **FilterBar – Sector:** cambiar a «Electricidad» y mostrar el efecto **solo** en la sección Evolución temporal (resto se mantiene en Total — el texto en pantalla lo confirma)
4. **Mapa – Métrica:** alternar entre «Cuota renovable» y «Ritmo necesario»
5. **Timeline – Selección de países:** mostrar los cuatro países por defecto (DE, SE, PL, ES); opcional añadir o quitar uno
6. **Tooltip:** hover sobre un país en el gráfico de barras o en el mapa para mostrar el detalle

---

## Verificaciones antes de grabar

- [ ] La visualización está desplegada online y abre sin errores
- [ ] El TopoJSON del mapa ha cargado (países coloreados, ninguno gris por error de carga)
- [ ] Los tooltips funcionan al hacer hover (en el gráfico de barras, en el mapa y en el line chart)
- [ ] El filtro de sector actualiza únicamente la sección de Evolución temporal y la nota correspondiente; las secciones de Estado actual, Ritmo necesario, Mapa y Conclusiones se mantienen en sector Total
- [ ] El filtro de región actualiza las secciones Estado actual, Ritmo necesario y Sectores; el resto permanece global
- [ ] La línea de referencia del 42,5 % aparece solo cuando el sector es Total (en Estado actual, en Evolución temporal–Total y en el panel Total de Sectores)
- [ ] La resolución de pantalla es ≥ 1280 px (para que todos los gráficos sean legibles)
- [ ] El audio funciona correctamente (micro probado, sin clipping)
- [ ] La grabación captura el área completa del navegador
- [ ] Antes de cambiar de sección, dejar los filtros en su estado por defecto si la sección siguiente lo requiere (especialmente: volver al sector Total antes de pasar de «Sectores» a «Evolución temporal»)
