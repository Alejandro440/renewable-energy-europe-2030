# Informe de decisiones de diseño

**Proyecto:** ¿Está Europa en camino? La carrera de los países europeos hacia los objetivos de energía renovable 2030  
**Autor:** Alejandro Alonso Anda  
**Asignatura:** Visualización de Datos — Máster en Ciencia de Datos, UOC, 2026

---

## 1. Objetivo comunicativo

El objetivo principal de la visualización es responder, de forma clara y verificable, si los países europeos avanzan al ritmo necesario para alcanzar el objetivo del 42,5 % de energía renovable en 2030. No se trata de una presentación descriptiva de datos históricos, sino de una evaluación del progreso prospectivo: la distancia entre lo que ocurre y lo que debería ocurrir.

La pregunta central —"¿está Europa en camino?"— tiene una respuesta que los datos pueden responder si se formulan las métricas correctas. La métrica `required_pace` es la que hace posible esta respuesta: transforma un dato de posición (cuota actual) en un dato de velocidad (ritmo necesario).

---

## 2. Público objetivo

La visualización está diseñada para dos audiencias simultáneas:

- **Público general informado:** personas interesadas en la transición energética y la acción climática, sin necesidad de formación técnica. Para ellos se priorizan los textos contextuales, los hallazgos en lenguaje natural y los tooltips explicativos.
- **Público académico/técnico:** personas que pueden verificar metodologías, formulas y fuentes. Para ellos se incluyen definiciones exactas de las métricas, la fórmula visible de `required_pace`, y las notas metodológicas en las secciones de datos.

---

## 3. Dataset usado

Fuente principal: Eurostat, tabla NRG_IND_REN (Share of Energy from Renewable Sources). Datos anuales 2004–2024. Descargados el 26 de mayo de 2026 mediante la API REST de Eurostat. Formato original: TSV comprimido en formato ancho (años como columnas).

Se incluyeron 27 Estados miembros de la UE, el agregado EU27_2020, Islandia y Noruega (como referencias externas). Se excluyeron candidatos y micro-estados con series muy incompletas.

---

## 4. Transformaciones realizadas

Las transformaciones principales, en orden:

1. Lectura del TSV con pandas; separación del índice compuesto en cuatro columnas (freq, nrg_bal, unit, geo_code).
2. Filtrado a los cuatro sectores principales (REN, REN_ELC, REN_HEAT_CL, REN_TRA) y al conjunto de entidades definido.
3. Pivoteo de formato ancho a largo (melt): una fila por observación (país × sector × año).
4. Limpieza de banderas de calidad con expresiones regulares: extracción del valor numérico y conservación de la bandera en columna separada.
5. Cálculo de variables derivadas:
   - `yoy_change`: diferencia entre valor del año y del año anterior (por país y sector).
   - `gap_to_target_pp`: 42,5 − cuota_2024 (para sector REN).
   - `required_pace`: max(0, gap) / 6.
   - `recent_pace`: ritmo neto anual (sector REN) = `(share_2024 − share_2020) / 4`. Evita incluir la variación 2019→2020 (COVID) que sesgaría la media de diferencias anuales.
   - `pace_status`: clasificación basada en comparación required_pace vs recent_pace.
6. Exportación a JSON (consumido por la app) y CSV (para reproducibilidad e inspección).

---

## 5. Elección de gráficos

**Barras horizontales (Estado actual):** el ranking de países por cuota es el gráfico más intuitivo para comparar muchos valores discretos entre categorías nominales. La orientación horizontal permite leer los nombres de país sin rotación. La línea de referencia en 42,5 % añade el contexto evaluativo.

**Gráfico de mancuernas (Required Pace):** la comparación de dos valores por país (ritmo necesario vs ritmo observado) requiere mostrar la diferencia de forma directa. Las mancuernas permiten percibir visualmente qué países superan su objetivo (rombo más a la derecha que el círculo) y cuáles no. Esta forma de visualización es menos habitual que un gráfico de barras, lo que la hace más llamativa y refuerza el carácter diferenciador de la métrica.

**Small multiples (Sectores):** cuatro paneles paralelos, uno por sector, permiten comparar la distribución de valores sectoriales al mismo tiempo. Es más efectivo que filtrar un único gráfico porque permite la comparación directa entre sectores sin necesidad de memorizar posiciones.

**Línea temporal (Evolución):** el gráfico de líneas es el estándar para series temporales. La elección de múltiples países + EU-27 en el mismo gráfico permite ver trayectorias convergentes o divergentes. La línea de referencia del objetivo ancla la narrativa prospectiva.

**Mapa coroplético (Geográfico):** el mapa permite percibir patrones espaciales que un ranking no revela. La proyección Mercator es estándar para Europa y suficientemente precisa para esta escala.

---

## 6. Por qué required_pace es central

La métrica `required_pace` es la que transforma esta visualización de descriptiva a evaluativa. Sin ella, el proyecto sería un mapa de cuotas renovables —que ya existe en docenas de sitios. Con ella, cada país tiene una "velocidad pendiente": la velocidad a la que debe avanzar para llegar a tiempo a 2030.

Esta métrica fue valorada específicamente en el feedback de la Parte I como la más original e interesante del proyecto. Su definición es simple (max(0, brecha) / años restantes), verificable por cualquier usuario, y su interpretación es intuitiva (puntos por año). Por ello ocupa la sección central de la visualización, con una caja de explicación metodológica visible.

---

## 7. Interacciones incorporadas y su propósito

| Interacción                     | Propósito                                                                 |
|----------------------------------|---------------------------------------------------------------------------|
| Selector de sector (FilterBar)  | Permite responder P4 (asimetría sectorial) filtrando todo el dashboard    |
| Filtro de región (FilterBar)    | Permite explorar si el patrón geográfico varía por región                 |
| Ordenación del ranking          | Permite ver quién necesita más esfuerzo (por `required_pace`) o quién está más atrás (por cuota) |
| Toggle países no-EU             | Permite contextualizar con Noruega e Islandia como referencias            |
| Selector de países (Timeline)   | Permite comparar trayectorias individuales con EU-27                      |
| Cambio de métrica en mapa       | Permite ver el mismo mapa desde dos perspectivas: cuota actual y estado de avance |
| Tooltips en todos los gráficos  | Permiten obtener valores exactos sin saturar el gráfico principal         |

Todas las interacciones tienen un propósito narrativo: responder una de las cinco preguntas de investigación o explorar una dimensión adicional de los datos.

---

## 8. Consideraciones de accesibilidad

- **Contraste:** los colores de texto principal sobre fondo claro u oscuro se han diseñado para aproximarse al contraste WCAG AA (≥ 4,5:1), aunque no se ha realizado una auditoría exhaustiva con herramienta automatizada.
- **No depender solo del color:** los estados de avance se codifican con color + icono circular + etiqueta de texto (PaceStatusBadge).
- **Navegación por teclado (controles):** todos los botones, checkboxes y controles de filtro son focusables y tienen estado `focus-visible` definido.
- **Navegación por teclado (mapa):** los paths de países con datos tienen `tabindex="0"`, `role="button"` y `aria-label` descriptivos, lo que permite recorrer los países con Tab y activar el tooltip de información con foco. La interacción completa del mapa sigue siendo principalmente de ratón.
- **ARIA:** los gráficos SVG tienen `aria-label` descriptivos. Los botones de filtro tienen `aria-pressed`.
- **Skip link:** botón "Saltar al contenido principal" para usuarios de lector de pantalla.
- **Tipografía:** Inter (sans-serif), tamaños mínimos de 10px en etiquetas de gráficos, 12px en UI.
- **Responsive:** el layout es adaptable a anchos desde 320px, con ajustes para tabletas y pantallas de portátil.

---

## 9. Limitaciones de los datos

1. El objetivo del 42,5 % se aplica al total de energía renovable, no a cada sector. La comparación sectorial revela asimetrías estructurales, pero no debe interpretarse como "el sector electricidad necesita alcanzar el 42,5 % por sí solo".
2. Los valores >100 % en electricidad son metodológicamente correctos (exportadores netos de renovables), pero pueden sorprender al usuario no especializado. Se documenta en el footer y en la sección de notas metodológicas.
3. El ritmo observado (2020–2024) incluye el período de recuperación post-COVID. La aceleración reciente podría estar parcialmente inflada por el rebote de la demanda energética.
4. No se incluyen objetivos nacionales específicos por la dificultad de documentar con rigor las fuentes oficiales de todos los Estados miembros.
5. Los datos de 2024 pueden ser provisionales para algunos países.

---

## 10. Qué se aprendió durante el proceso

El principal aprendizaje es que la claridad narrativa debe preceder a la elección técnica. La decisión más importante del proyecto no fue qué librería usar (React o D3), sino qué pregunta responder y con qué métrica.

El proceso de definir `required_pace` —una operación aritmética simple— requirió más reflexión conceptual que toda la implementación técnica posterior: ¿desde qué año? ¿con qué objetivo? ¿cómo tratar los países que ya superaron el objetivo? ¿cómo comunicar que el resultado es una velocidad, no un porcentaje?

La implementación técnica también reveló una tensión habitual en visualización de datos: la riqueza de los datos (cuatro sectores × treinta países × veintiún años) tiende a generar dashboards sobrecargados. La solución fue estructurar la visualización como una historia, donde cada sección responde a una pregunta específica antes de mostrar los datos, y donde los filtros globales conectan las secciones en lugar de multiplicarlas.
