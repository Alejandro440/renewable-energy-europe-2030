# Contexto del presentador — entender el proyecto antes de grabar

Este documento **no es el guion**. Es una referencia para que entiendas y defiendas el trabajo sin dudas. Léelo entero al menos una vez antes de grabar y antes de la defensa. El guion (`video/guion_video.md`) sirve para leer; este documento sirve para responder cualquier pregunta que se salga del guion.

---

## 1. De qué va el proyecto, en una frase

Una visualización web interactiva que responde, con datos de Eurostat, si los países europeos están avanzando lo suficientemente rápido para alcanzar el objetivo del 42,5 % de energía renovable en 2030.

La diferencia con visualizaciones similares es que **no se queda en la cuota actual**: deriva una métrica nueva, *required_pace*, que mide la velocidad anual que cada país necesitaría hasta 2030 y la compara con la velocidad observada los últimos años. Ese contraste es la respuesta a la pregunta.

---

## 2. La pregunta central y por qué importa

> ¿Está Europa avanzando lo suficientemente rápido para cumplir su objetivo de energía renovable en 2030?

Por qué la pregunta es buena:
- **Es específica**: hay un objetivo legal cuantificado (42,5 %, Directiva UE 2023/2413, RED III).
- **Es cuantificable**: la respuesta se traduce a puntos porcentuales al año.
- **Es prospectiva**: no describe el pasado, evalúa la trayectoria. Eso es lo que la mayoría de dashboards de Eurostat **no hacen**.
- **Tiene una respuesta binaria útil** ("sí / no") con matices interesantes (por país, por sector, por región).

Por qué importa: la transición energética europea es política, presupuestaria y geopolíticamente central, y la métrica "cuota renovable actual" se publica en todas partes; lo que falta es traducir esa cuota en distancia y velocidad respecto al compromiso.

---

## 3. Qué mide Eurostat NRG_IND_REN

- **Tabla:** NRG_IND_REN — *Share of Energy from Renewable Sources*.
- **Qué calcula:** el porcentaje de energía procedente de fuentes renovables sobre el **consumo final bruto de energía**. No es producción, no es capacidad instalada; es consumo final.
- **Metodología:** la fija la Directiva RED. El numerador es la energía renovable consumida en cada uno de los sectores (electricidad, calor, transporte) sumada; el denominador es el consumo final bruto del país, con ajustes específicos.
- **Sectores publicados:** Total (`REN`), Electricidad (`REN_ELC`), Calefacción y refrigeración (`REN_HEAT_CL`), Transporte (`REN_TRA`).
- **Periodicidad:** anual.
- **Cobertura:** 2004 hasta el último año disponible. En este proyecto, 2004–2024.
- **Entidades:** los 27 Estados miembros, el agregado oficial EU27_2020, Islandia, Noruega y otros candidatos. Aquí se conservan los 27 + el agregado + IS + NO.

Por qué puede superar el 100 % en electricidad: países como Noruega, Islandia, Suecia o Finlandia producen más electricidad renovable de la que consumen y exportan el excedente. En el indicador `REN_ELC`, el numerador puede superar al denominador local. **No es un error**, es metodología estándar.

---

## 4. Variables clave de la app

### `share_ren_pct`
Cuota de energía renovable en porcentaje sobre el consumo final bruto. Es el dato bruto, ya extraído y limpiado de banderas de calidad. Para Suecia en 2024, por ejemplo, es 62,8 %.

### `gap_to_target_pp`
Distancia al objetivo en puntos porcentuales: `42,5 − share_ren_pct` para 2024 y para el sector total. **Solo se calcula para el sector total**, porque el objetivo de la Directiva RED III se aplica al agregado, no a cada sector individual. Si el país ya supera el objetivo, el valor es negativo.

### `required_pace`
La métrica protagonista. Cuántos puntos porcentuales al año tiene que avanzar el país desde 2024 hasta 2030 para llegar al 42,5 %. Fórmula:

```
required_pace = max(0, 42,5 − share_2024) / (2030 − 2024)
```

Si el país ya superó el objetivo, el ritmo necesario es 0 por convención (no se pide retroceder). Solo se calcula para el sector total, por la misma razón que `gap_to_target_pp`.

### `recent_pace`
Variación neta anual entre 2020 y 2024 para el sector total: `(share_2024 − share_2020) / 4`. Se eligió este intervalo —y no la media de variaciones interanuales— para evitar que el shock de demanda de 2020 (COVID) infle artificialmente la media de cambios anuales. Es un indicador robusto y honesto del ritmo reciente real.

### `pace_status`
Clasificación interpretativa del avance. Cuatro categorías:

| Estado                  | Condición                                                          | Color  |
|-------------------------|--------------------------------------------------------------------|--------|
| `At or above target`    | gap ≤ 0 (ya alcanzado el objetivo)                                  | verde oscuro |
| `On track`              | recent_pace ≥ required_pace y recent_pace > 0                      | verde medio |
| `Needs acceleration`    | recent_pace > 0 pero < required_pace y required_pace ≤ 3 pp/año    | naranja |
| `Far behind`            | recent_pace ≤ 0 (estancamiento/retroceso) o required_pace > 3 pp/año | rojo  |

Estos cortes se eligen para reflejar lo siguiente: avanzar más despacio que lo necesario es preocupante (naranja); estancarse, retroceder o tener una brecha estructuralmente enorme es muy preocupante (rojo).

### `yoy_change`
Variación interanual de la cuota. Calculada para todos los sectores y años. Solo se usa para validación e inspección; no se muestra en la visualización principal.

---

## 5. Cómo explicar cada sección de la app

### Hero (portada)
Sirve para fijar la pregunta, mencionar el objetivo legal (42,5 %, Directiva RED III) y mostrar cuatro KPIs:
- la cuota actual de la UE-27,
- el objetivo 2030,
- la brecha en puntos porcentuales,
- el ritmo necesario por año.

Si te preguntan por qué se muestra el ritmo necesario para la UE-27 en la portada: es la versión agregada y resumida de la métrica protagonista, una entrada al resto del recorrido.

### Estado actual
Ranking horizontal de los 27 Estados miembros por cuota total en 2024, con línea de referencia en 42,5 %. **No varía con el filtro de sector**, y eso está documentado en la propia sección y en la pantalla. La razón es metodológica: las métricas derivadas (brecha, ritmo necesario, estado de avance) solo tienen sentido para el agregado total, no por sector.

### Ritmo necesario (sección central, fondo oscuro)
La sección que marca la diferencia. Caja explicativa con la fórmula de `required_pace`, cuatro KPIs y un gráfico de mancuernas que enfrenta, país a país, el ritmo necesario (círculo) y el ritmo observado 2020–2024 (rombo). Cuando el rombo está a la derecha del círculo, el país avanza lo suficiente. Solo dos países cumplen esa condición en los datos actuales: Estonia y Lituania.

### Evolución temporal
Líneas desde 2004. La línea azul gruesa es la UE-27. El filtro superior de sector **sí afecta a esta sección**: si lo cambias, la línea cambia. La línea de referencia del 42,5 % aparece **solo si el sector es Total**, porque el objetivo de la Directiva solo aplica al agregado.

### Sectores
Small multiples con los cuatro sectores en paralelo. La línea de referencia del 42,5 % aparece solo en el panel total. La nota junto al gráfico lo explica explícitamente. El filtro de región se aplica aquí.

### Mapa geográfico
Mapa coroplético de Europa con dos métricas seleccionables: cuota renovable o estado de avance (`pace_status`). Las tarjetas de la parte superior muestran la **media no ponderada** de las cuotas dentro de cada región —es una media simple por país, no un agregado oficial.

### Conclusiones
Cinco hallazgos numerados, calculados dinámicamente desde los datos (no hardcodeados), seguidos por las limitaciones del análisis y una reflexión final sobre `required_pace` como innovación narrativa.

---

## 6. Cifras clave del último build (referencia rápida)

Estos números vienen de `data/processed/data.json` y son los que verás en pantalla.

- **UE-27 (agregado) en 2024:** 25,2 % (Total).
- **UE-27 en 2004:** 9,6 %.
- **UE-27 Electricidad 2024:** 47,5 %.
- **UE-27 Calefacción/Refrigeración 2024:** 26,7 %.
- **UE-27 Transporte 2024:** 11,2 %.
- **Ritmo histórico UE-27 (2004→2024):** ≈ 0,78 pp/año.
- **Ritmo necesario UE-27 (2024→2030):** ≈ 2,88 pp/año.
- **Ratio:** el ritmo necesario es aproximadamente cuatro veces el histórico.
- **Países por encima del objetivo (5):** Suecia 62,8 %, Finlandia 52,1 %, Dinamarca 46,5 %, Letonia 45,5 %, Austria 43,0 %.
- **Países `On track` (2):** Estonia y Lituania.
- **Países con cuota más baja:** Bélgica 14,3 %, Luxemburgo 14,7 %, Irlanda 16,1 %, Malta 17,2 %.
- **Países con ritmo necesario más alto:** Bélgica ≈ 4,7 pp/año, Luxemburgo ≈ 4,6, Malta ≈ 4,2, Polonia ≈ 4,1.
- **Países con retroceso (recent_pace < 0):** Croacia (−1,1 pp/año), Italia (−0,24), Bulgaria (−0,03), Irlanda (−0,02).
- **Países en transporte por encima del 15 %:** Suecia (26,4 %), Finlandia (20,3 %), Países Bajos (19,7 %). Solo esos tres.
- **Países en electricidad por encima del 42,5 %:** 14 de la UE-27.

Si los datos se actualizan, todas estas cifras pueden cambiar; la app las recalcula sola y los textos del guion se han redactado para tolerar pequeñas variaciones.

---

## 7. Errores de interpretación a evitar

1. **No digas que el objetivo del 42,5 % se aplica por sector.** Se aplica al agregado (sector total). RED III tiene sub-objetivos sectoriales —14,5 % renovable en transporte en 2030, entre otros— pero no son el 42,5 %.
2. **No llames "media UE-27" a una media no ponderada de los 27 países.** El agregado oficial EU27_2020 está ponderado por el consumo final bruto. La media simple de los 27 países en 2024 es 28,0 %; el agregado oficial es 25,2 %. La app usa el agregado para los KPI y solo usa la media no ponderada en los recuadros del mapa, donde lo etiqueta como "Cuota media UE (total)".
3. **No prometas que el filtro de sector afecta a todo.** Solo afecta a la sección de Evolución temporal. La barra superior dice "Sector para evolución" y la app lo deja claro en pantalla.
4. **No digas que Portugal está "en camino".** Su ritmo reciente (≈ 0,58 pp/año) es inferior al necesario (≈ 1,03 pp/año), así que está en *Needs acceleration*. Los únicos países "en camino" según la métrica son Estonia y Lituania.
5. **No interpretes los valores >100 % en electricidad como un error.** Son países exportadores netos (NO, IS, AT, SE…). Está documentado en la app.
6. **No digas que `required_pace` es el ritmo necesario "para alcanzar" cuando el país ya supera el objetivo.** Para esos países el valor es 0 por convención (no se pide retroceder); está explicado en la caja de la sección.
7. **No confundas `recent_pace` con la variación interanual del último año.** Es la media neta entre 2020 y 2024 sobre 4 años.
8. **No vendas como conclusión definitiva** una afirmación tipo "X país nunca lo va a cumplir". Lo correcto: "necesitaría un ritmo sin precedente histórico" o "necesitaría acelerar X veces respecto al ritmo reciente".
9. **No omitas que los datos de 2024 son provisionales** para algunos países (bandera `p` de Eurostat).

---

## 8. Posibles preguntas del profesor y respuestas cortas

### Sobre la elección de datos

- *¿Por qué Eurostat y no IEA o IRENA?*
  Eurostat publica los datos oficialmente reconocidos para la Directiva RED III. Es la fuente que define el cumplimiento del objetivo; cualquier otra sería secundaria.

- *¿Por qué desde 2004?*
  Es el primer año con cobertura armonizada en la serie de Eurostat para todos los Estados miembros (la Directiva renovable original es de 2009, pero Eurostat retropola hasta 2004).

- *¿Por qué incluir IS y NO si no son UE?*
  Como referencia externa: Islandia y Noruega son países europeos con cuotas extremadamente altas (geotermia, hidroeléctrica) y permiten contextualizar el rango total de variación.

### Sobre la métrica `required_pace`

- *¿Por qué la fórmula es lineal? Las curvas reales no lo son.*
  Es una aproximación deliberada y comunicativa. La curva real depende de inversión, política e infraestructura, todas no observables. Un ritmo lineal medio anual es el indicador más simple, verificable y comparable entre países. La app comunica que es un ritmo medio necesario, no una predicción.

- *¿Y los países con recent_pace > required_pace por casualidad? ¿No sería ruido?*
  Es una observación válida. Por eso se compara con el ritmo medio reciente (2020–2024), no con la variación de un año. Y la categoría `On track` no garantiza el cumplimiento futuro: solo dice que, si el ritmo reciente se sostiene, el país llegará. Es una proyección lineal explícita.

- *¿Por qué `max(0, ...)`?*
  Para evitar que los países que ya superaron el objetivo aparezcan con un "ritmo negativo necesario" que no tendría interpretación operativa. Si Suecia ya está al 62 %, no se le pide que retroceda al 42,5 %; se le pide que sostenga.

### Sobre las decisiones de diseño

- *¿Por qué mancuernas y no barras?*
  Las mancuernas hacen visible la **diferencia** entre dos valores por país. Con barras paralelas habría que comparar mentalmente alturas; con mancuernas, la diferencia es una línea horizontal cuya longitud y dirección se leen de un vistazo.

- *¿Por qué no integraste el PIB per cápita?*
  Lo contempló la Parte I, pero el feedback fue priorizar `required_pace`, la distancia al objetivo y la asimetría sectorial. Añadir PIB habría dispersado la narrativa sin aportar más a la pregunta central.

- *¿Por qué no objetivos nacionales?*
  La Parte I lo dejó claro: solo si se documentan las fuentes oficiales con rigor para los 27 países. No se pudo garantizar esa documentación para todos los Estados miembros, así que se usa solo el objetivo común (42,5 %) y se documenta la limitación.

- *¿Por qué Recharts y D3? ¿No es redundante?*
  Recharts cubre los gráficos cartesianos con poco código y buena accesibilidad por defecto. D3 se usa solo para el mapa coroplético, porque Recharts no soporta proyecciones geográficas. Es la combinación que minimiza el código sin perder control.

### Sobre los límites del análisis

- *¿Qué fiabilidad tienen los datos de 2024?*
  Algunos países llevan bandera `p` (provisional) y pueden ajustarse en revisiones posteriores. Está documentado en el diccionario de datos y en la sección Conclusiones.

- *¿La cuota >100 % en electricidad no es un error?*
  No. Es metodología estándar de Eurostat para países exportadores netos. Está documentado en el footer y en las limitaciones.

- *¿Qué pasaría si en 2025 hay un salto en la cuota?*
  La app recalcula `required_pace` y `recent_pace` automáticamente cuando se actualiza `data/processed/data.json`. No hay cifras hardcodeadas críticas; los KPI principales y la sección de conclusiones se derivan en tiempo de ejecución.

### Sobre el proceso

- *¿Cuánto tiempo te ha llevado?*
  La Parte I, dedicada al diseño conceptual del dataset y las preguntas, marcó el grueso del trabajo intelectual. La Parte II ha consistido en implementar la visualización con React + Recharts + D3 y en asegurar coherencia entre datos, app, documentación y vídeo.

- *¿Qué fue lo más difícil?*
  Decidir qué dejar fuera. El dataset permite docenas de visualizaciones; reducirlo a seis secciones conectadas por la métrica central exigió descartar varias ideas (pirámides energéticas, comparaciones de PIB, regresiones).

- *¿Qué habrías hecho con más tiempo?*
  Documentar los objetivos nacionales y permitir el toggle entre objetivo común y objetivo nacional. Añadir una capa de exportación de gráficos en PNG para reproducir en el informe. Hacer una auditoría WCAG con herramienta automatizada.

---

## 9. Cómo ensayar antes de grabar

1. Lee el guion completo una vez.
2. Lee este documento de contexto una vez (no lo lleves a memoria, basta con familiaridad).
3. Abre la app y haz una pasada navegando por todas las secciones sin grabar, en silencio, para fijar el orden.
4. Haz una segunda pasada hablando en voz alta sobre cada sección, sin leer aún el guion; comprueba que entiendes lo que se ve.
5. Lee el guion en voz alta una vez cronometrándolo.
6. Graba.

Si te trabas con un dato, recuerda que las cifras del guion están redondeadas para que coincidan con lo que la app muestra; si hay un desfase, lee el valor de la pantalla, no el del guion.
