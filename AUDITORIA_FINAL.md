# Auditoría final — *¿Está Europa en camino?*

**Proyecto:** Práctica final · Visualización de Datos · UOC 2026
**Autor:** Alejandro Alonso Anda
**Fecha de la auditoría:** 28 de mayo de 2026
**Objetivo:** verificar coherencia entre datos, aplicación, documentación, informe, guion y escaleta antes de publicar la visualización y grabar el vídeo.

---

## 1. Fortalezas del proyecto

- **Narrativa central clara y defendible.** Una sola pregunta (*¿está Europa avanzando lo suficientemente rápido?*) atraviesa toda la visualización y se responde con una métrica concreta y verificable.
- **Métrica protagonista bien posicionada.** `required_pace` aparece como sección central con caja explicativa, fórmula visible y gráfico de mancuernas comparándolo con el ritmo observado. No es un dato secundario.
- **Dataset y pipeline reproducibles.** El proyecto incluye descarga, limpieza, validación y export; el script de validación cubre coberturas, rangos, consistencia y categorías esperadas.
- **Separación correcta entre cuotas y métricas derivadas.** Las métricas (`gap_to_target_pp`, `required_pace`, `recent_pace`, `pace_status`) se calculan solo para el sector total, donde tienen sentido metodológico.
- **Accesibilidad básica seria.** Skip-link, `aria-pressed`, `aria-label`, mapa navegable por teclado en países con datos, codificación por color + etiqueta + icono.
- **Documentación rigurosa.** Diccionario de datos, fuentes, transformaciones, informe de decisiones de diseño y guion de vídeo, todos alineados.
- **Sin invenciones.** No hay objetivos nacionales hardcodeados sin fuente; el alcance del análisis se limita a lo que los datos permiten afirmar.

---

## 2. Problemas encontrados durante la auditoría

### 2.1. Inconsistencias entre app y datos
- **`RequiredPaceSection.jsx`** tenía un KPI hardcodeado: `value="≈ 0,9 pp/año"` con nota *“Media 2004–2023 (real)”*. El valor real calculado desde el dataset es **≈ 0,78 pp/año** (2004→2024). Cifra incorrecta y nota desalineada respecto al rango temporal usado en el resto de la app.

### 2.2. Inconsistencias entre app y narrativa por sector
- **`TimelineChart.jsx`** dibujaba siempre la línea de referencia 42,5 %, incluso cuando el usuario seleccionaba Electricidad o Transporte. El objetivo del 42,5 % de la Directiva RED III se aplica solo al total. La línea era engañosa al cambiar de sector.
- **`TimelineSection.jsx`** mostraba el subtítulo *“Cuota renovable total (%) desde 2004”* con independencia del sector seleccionado. Si el usuario cambiaba a Electricidad, el subtítulo seguía hablando del total.
- **`TimelineSection.jsx`** mostraba siempre el “Hallazgo clave” con la conclusión sobre el ritmo histórico vs. necesario al 42,5 %. Esa conclusión solo es válida para el sector total.

### 2.3. Cifras desactualizadas en el guion del vídeo
Los datos refrescados de Eurostat 2024 cambian respecto a versiones previas; el guion anterior contenía:
- *“La media de la UE-27 se sitúa en torno al 24 %”* → real **25,2 %**.
- *“El agregado EU27_2020 […] en torno al 46 % en electricidad y un 10 % en transporte: una brecha de más de 35 puntos”* → real **47,5 % / 11,2 % / 36,3 pp**.
- *“Solo tres países presentan esta situación: Estonia, Lituania y Portugal”* (referido a `On track`) → **incorrecto**. Portugal tiene `recent_pace` ≈ 0,58 y `required_pace` ≈ 1,03 → cae en `Needs acceleration`. Los únicos países `On track` son **Estonia y Lituania**.
- *“Estonia y Lituania son casos interesantes: llevan un ritmo reciente de casi 2 puntos por año”* → correcto para ambos. La cifra de Estonia (≈ 3,04) era subestimada.
- *“Slovakia”* aparecía sin traducir.
- Indicación sobre el alcance del filtro de sector demasiado vaga: *“en las vistas donde tiene sentido metodológico, especialmente en la evolución temporal”*. En realidad, **solo** afecta a Evolución temporal.

### 2.4. Coherencia entre escaleta y narración
- La escaleta anterior atribuía la *Presentación en vivo* a 01:10–02:10 y a 04:00–04:40, pero el guion repartía la *Presentación en vivo* en dos bloques distintos que no se reflejaban con limpieza en la tabla.

### 2.5. No se detectaron, después de revisión cruzada
- Países mencionados en el guion que no estuvieran en el dataset.
- Aplicación del 42,5 % a sectores distintos del total en las secciones donde la línea o el texto se muestran.
- Discrepancias entre `data/processed/data.json` y `public/data.json` (revisión confirmó *FILES MATCH*).
- Inconsistencias entre el diccionario de datos y el comportamiento real del pipeline.

---

## 3. Cambios aplicados

### 3.1. Código de la aplicación
- **`src/components/sections/RequiredPaceSection.jsx`** —
  KPI *Ritmo histórico UE* ahora se calcula dinámicamente desde el dataset (`(share_2024 − share_2004) / 20`) con dos decimales y nota *“Media 2004–2024 (real)”*. Se elimina el valor hardcodeado.
- **`src/components/charts/TimelineChart.jsx`** —
  Se añade la prop `showTarget` (por defecto `true`) que controla si se dibuja la línea de referencia del 42,5 %.
- **`src/components/sections/TimelineSection.jsx`** —
  - Subtítulo dinámico, dependiente del sector seleccionado.
  - `showTarget` se pasa al gráfico solo cuando el sector es Total.
  - El recuadro *Hallazgo clave* solo se muestra para el sector Total; para los demás sectores aparece una nota metodológica que recuerda que el objetivo del 42,5 % no aplica al sector seleccionado y que el agregado oficial es la única referencia válida para la comparación con el objetivo.

### 3.2. Documentación de vídeo
- **`video/guion_video.md`** — reescrito completo: cifras actualizadas, narración más natural, eliminada la mención incorrecta a Portugal como país `On track`, aclarado el alcance real del filtro de sector, distribución temporal levemente reajustada (4:25 en lugar de 4:40 para empezar la reflexión final), traducciones uniformes al español (Eslovaquia).
- **`video/escaleta_video.md`** — tabla reorganizada para reflejar que la *Presentación en vivo* se reparte en dos tramos; añadidas comprobaciones de filtro y de aparición de la línea de referencia.

### 3.3. Documentación nueva
- **`video/contexto_presentador.md`** — documento de referencia para entender el proyecto sin depender solo del guion: alcance del dataset, definición de cada variable, contenido de cada sección, errores de interpretación a evitar, cifras clave del último build y banco de posibles preguntas del profesor con respuestas cortas.

### 3.4. Auditoría
- **`AUDITORIA_FINAL.md`** — este documento.

### 3.5. Sin cambios deliberados
- No se modifican `prepare_data.py`, `validate_data.py`, `README.md`, `metadata/data_dictionary.md`, `metadata/sources.md`, `informe_decisiones_diseno.md` ni los gráficos de las demás secciones, porque ya son coherentes con los datos y con la narrativa. Aplicar cambios cosméticos extra introduciría riesgo sin beneficio en la entrega.

---

## 4. Riesgos restantes y mitigaciones

| Riesgo                                                                                              | Severidad | Mitigación recomendada                                                                                       |
|-----------------------------------------------------------------------------------------------------|-----------|---------------------------------------------------------------------------------------------------------------|
| Datos 2024 provisionales (bandera `p`) que pueden actualizarse                                      | Media     | Mencionar en el guion (ya incluido) y en las limitaciones. La app recalcula automáticamente si los datos cambian. |
| `recent_pace` calculado con sólo 4 años puede ser volátil para países pequeños                       | Baja      | Se acepta en la documentación como limitación. La métrica usa el intervalo 2020–2024 para evitar el ruido de COVID.   |
| Bundle JS > 600 kB (warning de Vite)                                                                | Baja      | Aceptable para una práctica académica; no afecta a la entrega. Mejorable con code-splitting en una futura iteración. |
| La media regional en GeographicSection es no ponderada                                              | Baja      | Etiquetada como “Cuota media UE (total)”; idealmente “Media no ponderada por país” pero el alcance es claro. |
| Filtro de región no se aplica a Evolución temporal ni al Mapa                                       | Baja      | Decisión consciente: ambas secciones tienen su propio selector (países en la línea, métrica en el mapa). Documentado en la escaleta y en el contexto del presentador. |
| Mapa con proyección Mercator distorsiona el norte                                                   | Baja      | Documentado en el footer y en la nota del propio mapa. Aceptable para el alcance europeo.                     |
| Si en una actualización futura un país se queda sin dato 2024, los KPIs muestran “–”                 | Media     | El pipeline ya devuelve `null` controlado; los componentes muestran “–” o se omiten sin romper.               |

---

## 5. Validaciones ejecutadas

| Comando                                | Resultado                                                                 |
|----------------------------------------|---------------------------------------------------------------------------|
| `python3 scripts/prepare_data.py`      | ✅ Ejecuta sin error · 2.520 filas en `data.json` (705,7 KB) y `data.csv`. |
| `python3 scripts/validate_data.py`     | ✅ `ALL CHECKS PASSED`. 21 valores >100 % en electricidad documentados; 2 `yoy_change` entre 20–30 pp informados como rupturas de serie, no errores. |
| `diff data/processed/data.json public/data.json` | ✅ *FILES MATCH*. `public/data.json` resincronizado tras la pipeline. |
| `npm install`                          | (Ya ejecutado en sesiones previas; `node_modules` presente y `package-lock.json` intacto.) |
| `npm run build`                        | ✅ 1.218 módulos, 1,6 s. Salida en `dist/`. Warning de tamaño de bundle (esperable, no bloqueante). |

Resumen estadístico (UE-27, sector Total, 2024):
- Países en/sobre objetivo: **5** (SE, FI, DK, LV, AT).
- Países `On track`: **2** (EE, LT).
- Países `Needs acceleration`: **4** (PT, EL, ES, RO).
- Países `Far behind`: **16**.
- Cuota agregada UE-27: **25,2 %** · Ritmo necesario: **2,88 pp/año** · Ritmo histórico medio: **0,78 pp/año**.

---

## 6. Checklist final antes de entregar

### 6.1. Datos y código
- [x] `data/processed/data.json` regenerado y validado.
- [x] `public/data.json` sincronizado con `data/processed/data.json`.
- [x] `npm run build` finaliza sin errores.
- [x] La aplicación carga `data.json` correctamente vía `import.meta.env.BASE_URL`.
- [x] Las métricas derivadas (`required_pace`, `recent_pace`, `gap_to_target_pp`, `pace_status`) están presentes para los 27 Estados miembros en 2024.

### 6.2. Coherencia narrativa y visual
- [x] La línea de referencia del 42,5 % aparece **solo** en las vistas referidas al sector Total (Estado actual, Evolución temporal cuando sector = Total, panel Total de Sectores).
- [x] El filtro de sector solo afecta a la sección Evolución temporal, y eso queda explícito en la app.
- [x] El filtro de región afecta a Estado actual, Ritmo necesario y Sectores, no al resto.
- [x] No se mencionan países que no estén en el dataset.
- [x] No se atribuye el objetivo del 42,5 % a sectores individuales.
- [x] No se usan cifras hardcodeadas críticas; los KPI y conclusiones se calculan desde los datos.
- [x] Los textos no exageran lo que los datos permiten afirmar (límites bien identificados en Conclusiones).

### 6.3. Documentación
- [x] `README.md` describe estructura, dependencias, ejecución local y despliegue.
- [x] `metadata/data_dictionary.md` cubre todas las variables del dataset procesado.
- [x] `metadata/sources.md` documenta fuente, licencia, transformaciones y decisión sobre objetivos nacionales.
- [x] `informe_decisiones_diseno.md` explica objetivo comunicativo, público, dataset, transformaciones, elección de gráficos, interacciones, accesibilidad, limitaciones y aprendizaje.

### 6.4. Vídeo
- [x] `video/guion_video.md` actualizado a las cifras del dataset 2024 y sin afirmaciones incorrectas.
- [x] `video/escaleta_video.md` consistente con el guion y con la app.
- [x] `video/contexto_presentador.md` listo como referencia previa a la grabación y a la defensa oral.
- [ ] Vídeo grabado entre 4:45 y 5:30 minutos. (Pendiente del usuario)
- [ ] Vídeo publicado o subido al espacio de entrega. (Pendiente del usuario)

### 6.5. Publicación
- [ ] `npm run deploy` ejecutado al menos una vez para publicar `gh-pages`. (Pendiente: revisar fecha y URL operativa antes de grabar.)
- [ ] URL pública accesible sin registro y desde un dispositivo distinto al de desarrollo.

### 6.6. Entrega académica
- [ ] PDF / paquete de entrega final con README + informe + enlace público + vídeo.
- [ ] Captura del estado de la aplicación con sus filtros por defecto, por si la grabación falla.

---

## 7. Qué falta antes de entregar o grabar

1. **Grabar el vídeo** siguiendo `video/guion_video.md`, con `video/contexto_presentador.md` como soporte mental.
2. **Confirmar el despliegue público.** El enlace de GitHub Pages declarado en `README.md` debe responder sin redirecciones rotas.
3. **Una pasada en navegador real** (no solo `npm run build`): cargar la URL pública, hacer la pasada completa por las seis secciones y comprobar:
   - Los KPI muestran números, no “…”.
   - El mapa carga (no se ve en gris).
   - Los tooltips funcionan en barras, mancuernas y mapa.
   - Los filtros se comportan como documenta la escaleta.
4. **Empaquetar para entrega** (PDF del informe + URL pública + vídeo + repositorio o ZIP del código).

Hecho lo anterior, el proyecto está en condiciones de defensa académica con argumentos sólidos.
