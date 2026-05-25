# Escaleta temporal del vídeo

**Duración objetivo:** 5 minutos (300 segundos)  
**Evaluación UOC:** 6 bloques con pesos distintos

---

## Mapa de bloques evaluativos

| Bloque                   | Peso | Duración en 5 min | Tiempo en escaleta |
|--------------------------|------|--------------------|---------------------|
| Proceso de creación      | 20 % | ~60 s              | 00:25 – 01:10        |
| Presentación en vivo     | 20 % | ~60 s              | 01:10 – 02:10 + 04:00–04:40 |
| Conjunto de datos        | 15 % | ~45 s              | 00:25 – 01:10        |
| Preguntas clave          | 20 % | ~60 s              | 02:10 – 03:10        |
| Interactividad           | 15 % | ~45 s              | 03:10 – 04:00        |
| Reflexión final          | 10 % | ~30 s              | 04:40 – 05:20        |

---

## Escaleta por segmento

| Tiempo       | Bloque evaluativo        | Pantalla / Acción                               | Narración clave                                         |
|--------------|--------------------------|--------------------------------------------------|----------------------------------------------------------|
| 00:00–00:25  | Presentación             | Hero section con título y KPIs                  | Presentación personal, pregunta central, objetivo 42,5 % |
| 00:25–01:10  | Dataset + Proceso        | Hero (tarjetas) → mencionar Eurostat            | Dataset NRG_IND_REN, pivoteo, limpieza de banderas, variables derivadas (`gap`, `required_pace`, `recent_pace`) |
| 01:10–02:10  | Presentación en vivo     | Estado actual (barras horizontales)             | 5 países sobre objetivo, media EU 24 %, ordenar por ritmo necesario |
| 02:10–03:10  | Preguntas clave          | Required Pace (mancuernas)                      | Explicar `required_pace`, mostrar quién está en camino vs. rezagado |
| 03:10–04:00  | Interactividad           | Sectores (small multiples) + FilterBar          | Brecha electricidad vs. transporte; usar filtro de región; cambiar sector |
| 04:00–04:40  | Presentación en vivo     | Mapa + Timeline                                 | Patrón geográfico, cambiar métrica mapa, seleccionar países en línea temporal |
| 04:40–05:20  | Reflexión final          | Conclusiones                                    | 5 hallazgos, limitaciones, reflexión sobre `required_pace` como innovación narrativa |

---

## Interacciones a demostrar durante el vídeo

1. **FilterBar – Sector:** cambiar de "Total" a "Electricidad" (y ver efecto en Estado actual)
2. **FilterBar – Región:** filtrar a "Norte" (y ver efecto en Sectores)
3. **Estado actual – Ordenación:** cambiar de "Cuota actual" a "Ritmo necesario"
4. **Estado actual – Toggle no-EU:** activar Islandia y Noruega
5. **Mapa – Métrica:** cambiar de "Cuota renovable" a "Estado de avance"
6. **Timeline – País selector:** añadir/quitar países para comparar con EU-27
7. **Tooltip:** hover sobre un país en el gráfico de barras o en el mapa

---

## Verificaciones antes de grabar

- [ ] La visualización está desplegada online y abre sin errores
- [ ] El mapa ha cargado correctamente (países coloreados, no grises)
- [ ] Los tooltips funcionan al hacer hover
- [ ] Los filtros de sector y región actualizan las secciones en tiempo real
- [ ] La resolución de pantalla es ≥ 1280px (para que todos los gráficos sean legibles)
- [ ] El audio funciona correctamente (micro probado)
- [ ] La grabación de pantalla captura el área completa del navegador
