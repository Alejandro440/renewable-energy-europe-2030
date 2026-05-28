# Guion del vídeo — Práctica Final de Visualización de Datos

**Título:** ¿Está Europa en camino? La carrera de los países europeos hacia los objetivos de energía renovable 2030
**Duración prevista:** ~5 minutos (margen entre 4:45 y 5:30)
**Autor:** Alejandro Alonso Anda
**Asignatura:** Visualización de Datos — Máster Universitario en Ciencia de Datos, UOC, 2026

---

## Cómo usar este guion

Este guion está redactado para grabarse de un tirón leyendo a un ritmo natural (≈140 palabras por minuto). Las indicaciones entre corchetes son acciones en pantalla, no se leen en voz alta. Los números entre comillas corresponden exactamente a los valores que la aplicación muestra en tiempo de ejecución; si los datos se actualizan, las tarjetas KPI y el agregado EU27 cambiarán y conviene reajustar el guion en consecuencia.

---

### [00:00 – 00:25]  Presentación del proyecto y pregunta central

*[Pantalla: portada / sección Hero, con el título grande y las cuatro tarjetas KPI visibles]*

"Hola. Soy Alejandro Alonso Anda y esta es la práctica final de Visualización de Datos del Máster en Ciencia de Datos de la UOC.

La pregunta que estructura todo el trabajo es la que aparece en pantalla: ¿está Europa avanzando lo suficientemente rápido para cumplir su objetivo de energía renovable en 2030?

La Unión Europea, a través de la Directiva RED III, se comprometió a alcanzar al menos un 42,5 % de energía renovable sobre el consumo final bruto en 2030. Quedan seis años. Y como veremos, el ritmo actual no es suficiente para la mayoría de los países."

---

### [00:25 – 01:10]  Proceso de creación, dataset y métricas derivadas

*[Pantalla: seguir en Hero; señalar las KPI inferiores; opcional, breve cambio al panel de Eurostat o a `scripts/prepare_data.py`]*

"Los datos vienen de Eurostat, de la tabla NRG_IND_REN —Share of Energy from Renewable Sources—, que para cada país europeo y cada año desde 2004 registra el porcentaje de energía renovable desglosado por cuatro sectores: total, electricidad, calefacción y refrigeración, y transporte.

Tras descargar el archivo, un script en Python lo pasa de formato ancho a formato largo, limpia las banderas de calidad de Eurostat —«b» para ruptura de serie, «p» para provisional— y filtra las entidades. El resultado son 2.520 filas: 21 años por cuatro sectores por treinta entidades, que son los veintisiete Estados miembros más el agregado EU-27 e Islandia y Noruega como referencia externa.

A partir de ese dataset se calculan tres variables derivadas que son el corazón del proyecto. La primera es la brecha al objetivo, en puntos porcentuales. La segunda es el ritmo necesario, *required pace*: cuántos puntos porcentuales al año tiene que avanzar cada país desde 2024 hasta 2030 para llegar al 42,5 %. Y la tercera es el ritmo reciente: la variación neta observada entre 2020 y 2024.

`required_pace` es la métrica que diferencia este proyecto. No describe dónde está un país, sino si está yendo lo bastante rápido."

---

### [01:10 – 02:00]  Presentación en vivo: estado actual

*[Pantalla: bajar a la sección «Estado actual». Gráfico de barras horizontales]*

"Esta primera sección muestra el estado actual: la cuota total de energía renovable de cada Estado miembro en 2024, ordenada por defecto de menor a mayor. La línea azul discontinua marca el objetivo del 42,5 %.

Solo cinco países han cruzado esa línea: Suecia, con un 62,8 %; Finlandia, con un 52,1 %; Dinamarca, con un 46,5 %; Letonia, con un 45,5 %; y Austria, que apenas supera el objetivo con un 43 %.

En el extremo opuesto están Bélgica, con un 14,3 %, Luxemburgo, con un 14,7 %, Irlanda, con un 16,1 %, y Malta, con un 17,2 %, todos muy por debajo. La cuota agregada de la UE-27 está en torno al 25 %.

*[Acción: cambiar la ordenación a «Ritmo necesario ↓»]*

Si reordeno por ritmo necesario, las posiciones cambian completamente. Bélgica encabeza ahora la lista con un ritmo requerido de casi cinco puntos porcentuales al año hasta 2030. Luxemburgo, Irlanda, Malta y Polonia están todos por encima de cuatro puntos por año. El ritmo histórico medio de la UE-27 ha sido de menos de un punto por año. La magnitud del reto se percibe de inmediato."

---

### [02:00 – 02:50]  Preguntas clave: required pace como núcleo narrativo

*[Pantalla: sección «Ritmo necesario». Gráfico de mancuernas, fondo oscuro]*

"Esta es la sección central. El gráfico de mancuernas pone dos puntos para cada país: el círculo de color es el ritmo necesario hasta 2030; el rombo es el ritmo observado entre 2020 y 2024. La interpretación es directa: cuando el rombo está a la derecha del círculo, el país avanza lo suficiente.

Solo dos países cumplen esa condición: Estonia y Lituania. Ambos llevan un ritmo reciente de unos dos puntos por año, suficiente porque ya están muy cerca del objetivo. El resto de países o necesitan acelerar o están claramente retrasados.

En el otro extremo, Croacia muestra incluso un retroceso reciente, y países como Polonia o Eslovaquia llevan un ritmo de medio punto por año o menos cuando necesitarían cuatro veces más.

La caja explicativa de arriba muestra la fórmula. Es deliberadamente simple: la brecha al objetivo dividida entre los años que quedan. Cualquier persona puede verificar el cálculo con los datos que se muestran en los tooltips."

---

### [02:50 – 03:40]  Asimetría sectorial e interactividad

*[Pantalla: bajar a la sección «Sectores». Cuatro paneles en small multiples]*

"La tercera dimensión analítica es la sectorial. Aquí veo en paralelo los cuatro sectores: total, electricidad, calefacción, transporte. La línea de referencia del 42,5 % aparece solo en el panel total, porque el objetivo de la Directiva RED III se aplica al total, no a cada sector individual.

La asimetría salta a la vista. El agregado de la UE-27 está en torno al 47 % de renovables en electricidad y solo un 11 % en transporte: una brecha estructural de unos 36 puntos porcentuales entre el sector más avanzado y el más rezagado. Catorce países de la UE ya superan el 42,5 % en electricidad; en transporte, solo tres países pasan del 15 %.

*[Acción: activar el filtro de región «Norte» en la barra superior]*

Si filtro por la región Norte, los paneles muestran solo Suecia, Finlandia, Dinamarca, Estonia, Letonia y Lituania. Incluso en esta región líder, el transporte sigue siendo el talón de Aquiles.

*[Acción: subir a la barra de filtros y cambiar el sector a «Electricidad»; bajar a la sección Evolución temporal]*

El filtro de sector solo afecta a la sección de evolución temporal, donde tiene sentido metodológico cambiar de indicador. Las secciones de estado actual y ritmo necesario se mantienen siempre en el total, porque las métricas de brecha y ritmo solo se calculan para el agregado."

---

### [03:40 – 04:25]  Patrón geográfico y evolución temporal

*[Pantalla: sección Evolución temporal. Subo el filtro al sector «Total» antes de continuar]*

"En la sección temporal veo la trayectoria desde 2004. La línea azul gruesa es la UE-27. Por defecto se comparan Alemania, Suecia, Polonia y España. Suecia partía del 38 % en 2004 y ha seguido subiendo. Polonia ha avanzado mucho más despacio. Alemania ha acelerado visiblemente desde 2020 gracias a la expansión solar y eólica. España se mantiene cerca de la media europea.

*[Pantalla: bajar a la sección «Mapa geográfico»]*

El mapa coroplético confirma el patrón visual. Los países nórdicos y bálticos están en verde oscuro; gran parte del centro y el oeste, en rojo. Pero el patrón no es estrictamente norte-sur: Austria, en pleno centro de Europa, supera a Estonia; y Malta, en el sur, está entre los más retrasados.

*[Acción: cambiar la métrica del mapa a «Ritmo necesario»]*

Si cambio la métrica del mapa al ritmo necesario, el resultado es elocuente: solo cinco países en verde oscuro —los que ya alcanzaron el objetivo— y prácticamente toda Europa occidental, central y oriental, en naranja o rojo."

---

### [04:25 – 05:10]  Reflexión final, accesibilidad y cierre

*[Pantalla: sección «Conclusiones»]*

"Las conclusiones reúnen los cinco hallazgos. El primero, y el más contundente: para alcanzar el 42,5 % en 2030, la UE-27 necesita un ritmo unas cuatro veces superior al histórico —el cálculo aparece en pantalla, hecho con los datos cargados, no con cifras hardcodeadas. El segundo: solo cinco países han alcanzado ya el objetivo y solo dos más mantienen un ritmo reciente suficiente para llegar a tiempo. El tercero: la electricidad avanza; el transporte, no. El cuarto: el patrón geográfico existe pero no es simple. Y el quinto: el tiempo se acorta cada año.

En cuanto a accesibilidad, los estados de avance se codifican con color y etiqueta textual, los controles tienen estado `aria-pressed`, el mapa permite navegación por teclado en los países con datos, y hay un *skip link* al contenido principal.

Y como limitaciones: el objetivo del 42,5 % solo se aplica al total, así que la comparación sectorial es ilustrativa de asimetrías, no de cumplimiento; los datos de 2024 son provisionales para algunos países; y no se incluyen objetivos nacionales específicos por la dificultad de documentar todas las fuentes con rigor.

La reflexión final: el mayor reto al diseñar esta visualización no fue técnico, sino narrativo. La métrica `required_pace` no estaba en los datos de Eurostat; hubo que derivarla con sentido conceptual claro. Sin ella, este proyecto sería un mapa más de cuotas renovables; con ella, responde a una pregunta concreta —¿va Europa lo bastante rápido?— y la respuesta, con los datos en la mano, es que, en general, no.

Gracias."

---

## Notas para la grabación

- Duración total objetivo: 5 minutos, ritmo natural (140 wpm aproximado).
- Pronunciación: «*required pace*» en inglés solo en la introducción; en el resto, «ritmo necesario».
- Antes de empezar, asegurarse de que el mapa ha cargado (países coloreados, no grises) y de que el navegador está a una resolución ≥ 1280 px.
- Volver siempre el sector al «Total» antes de pasar de la sección «Sectores» a la de «Evolución temporal», y dejar el mapa en «Cuota renovable» al cierre.
- No leer las acciones entre corchetes; son indicaciones para el operador o para uno mismo si se graba en solitario.
- Si la grabación pasa de 5:30, recortar primero las cifras detalladas de la sección «Estado actual» y las descripciones del mapa: ambos bloques son los más fácilmente abreviables sin perder narrativa.
