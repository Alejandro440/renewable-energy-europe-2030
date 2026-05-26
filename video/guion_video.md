# Guion del vídeo — Práctica Final de Visualización de Datos

**Título:** ¿Está Europa en camino? La carrera de los países europeos hacia los objetivos de energía renovable 2030  
**Duración prevista:** 5 minutos  
**Autor:** Alejandro Alonso Anda  
**Asignatura:** Visualización de Datos — Máster en Ciencia de Datos, UOC, 2026  

---

## Estructura del guion

### [00:00 – 00:25] Presentación del proyecto y pregunta central

*[Pantalla: portada de la visualización, sección Hero]*

"Hola. Me llamo Alejandro Alonso Anda y esta es la práctica final de Visualización de Datos del Máster en Ciencia de Datos de la UOC.

La pregunta que guía todo el trabajo es simple pero urgente: ¿está Europa avanzando lo suficientemente rápido para cumplir sus objetivos de energía renovable en 2030?

La Unión Europea se ha comprometido a alcanzar un 42,5 % de energía renovable sobre el consumo final bruto en 2030, según la Directiva RED III. Quedan seis años. Y como vamos a ver, para la gran mayoría de los países, el ritmo actual no es suficiente."

---

### [00:25 – 01:10] Dataset, preparación y métricas derivadas

*[Pantalla: sección Hero con las tarjetas de KPI; posteriormente moverse al navegador de Eurostat]*

"Los datos provienen de Eurostat, concretamente de la tabla NRG_IND_REN —Share of Energy from Renewable Sources—, que registra, para cada país europeo y cada año desde 2004, el porcentaje de energía renovable desglosado por cuatro sectores: total, electricidad, calefacción/refrigeración y transporte.

El dataset tiene aproximadamente 2.500 registros tras el pivoteo a formato largo —21 años por cuatro sectores y treinta entidades—. La preparación incluyó: separar el índice compuesto de Eurostat, pivotar de formato ancho a largo, limpiar las banderas de calidad (b para ruptura de serie, p para provisional), y filtrar entidades con series incompletas.

Las variables derivadas más importantes son tres. La primera es `gap_to_target_pp`: cuántos puntos porcentuales le faltan a cada país para llegar al 42,5 %. La segunda es `required_pace`: el ritmo anual en puntos porcentuales que cada país necesita mantener desde 2024 hasta 2030 para llegar a tiempo. Su fórmula es: el máximo entre cero y la brecha restante dividida entre seis. Y la tercera es `recent_pace`: la variación media anual observada entre 2020 y 2024.

`required_pace` es la métrica central de toda la visualización: no describe dónde está un país, sino si avanza lo suficientemente rápido."

---

### [01:10 – 02:10] Vista general y situación actual

*[Pantalla: sección Estado actual — gráfico de barras horizontales]*

"Esta primera sección muestra el estado actual: la cuota renovable de cada uno de los 27 Estados miembros en 2024, ordenada de menor a mayor. La línea azul discontinua marca el objetivo del 42,5 %.

*[Scrollear por el gráfico]*

A primera vista, el resultado es llamativo. Solo cinco países han cruzado esa línea: Suecia con un 62,8 %, Finlandia con un 52 %, Dinamarca con un 46 %, Letonia con un 45 %, y Austria, que apenas supera el objetivo con un 43 %.

En el extremo opuesto están Bélgica, Luxemburgo, Irlanda y Malta, todos por debajo del 18 %. La media de la UE-27 se sitúa en torno al 24 %.

*[Cambiar ordenación a 'ritmo necesario']*

Si reordenamos por ritmo necesario, vemos que Bélgica necesita casi 5 puntos porcentuales al año. Luxemburgo y Malta, más de 4. Recordemos que el ritmo histórico medio de la UE ha sido de menos de un punto por año. La magnitud del reto es evidente."

---

### [02:10 – 03:10] Required pace como núcleo narrativo

*[Pantalla: sección Ritmo necesario — gráfico de mancuernas]*

"Esta es la sección central de la visualización. El gráfico de mancuernas compara, para cada país, dos ritmos: el círculo de color muestra el ritmo necesario para llegar al 42,5 % en 2030. El rombo muestra el ritmo observado entre 2020 y 2024.

*[Señalar países concretos]*

La interpretación es directa: cuando el rombo supera al círculo, el país está en camino. Solo tres países presentan esta situación: Estonia, Lituania y Portugal. El resto —veinticuatro países— necesita acelerar.

Estonia y Lituania son casos interesantes: llevan un ritmo reciente de casi 2 puntos por año, lo que es suficiente porque ya están cerca del objetivo. Portugal, con un ritmo de 1,1 punto por año, también supera sus 1,0 punto necesario.

En el otro extremo, Croacia ha experimentado incluso un retroceso en los últimos años, y países como Slovakia o Polonia tienen un ritmo reciente inferior a medio punto por año cuando necesitarían más de cuatro.

La caja explicativa debajo del gráfico desglosa la fórmula para que cualquier usuario pueda verificar el cálculo por sí mismo."

---

### [03:10 – 04:00] Asimetría sectorial e interacción

*[Pantalla: sección Sectores — small multiples]*

"La tercera dimensión analítica es la sectorial. Esta sección muestra los cuatro sectores en paralelo: total, electricidad, calefacción/refrigeración y transporte.

*[Señalar diferencias entre paneles]*

La diferencia es estructural. En electricidad, Islandia y Noruega pueden superar el 100 % por su condición de exportadores netos de electricidad renovable —producen más de lo que consumen y exportan el excedente. En el panel de transporte, en cambio, la mayoría de países está por debajo del 15 %.

El agregado EU27_2020 de Eurostat sitúa la cuota en electricidad en torno al 46 % y la de transporte en torno al 10 %: una brecha de más de 35 puntos porcentuales entre el sector más avanzado y el más rezagado.

*[Usar el filtro de región: clic en 'Norte']*

Con el filtro de región activo —aquí selecciono los países del Norte— vemos cómo incluso en esta región líder, el transporte sigue siendo el talón de Aquiles. Los países nórdicos tienen electricidades casi completamente renovables, pero sus cuotas de transporte son similares a las del resto de Europa.

*[Mostrar FilterBar: cambiar a sector Electricidad y navegar a la sección Evolución temporal]*

El selector superior permite cambiar el sector analizado en las vistas donde tiene sentido metodológico, especialmente en la evolución temporal. La sección Estado actual se mantiene fija en la cuota total porque las métricas de brecha, ritmo necesario y estado de avance solo se calculan para el total."

---

### [04:00 – 04:40] Patrones geográficos / evolución temporal

*[Pantalla: sección Mapa; luego sección Evolución temporal]*

"El mapa coroplético confirma visualmente lo que ya sugerían los datos: los países nórdicos y bálticos lideran en verde oscuro. Sin embargo, el patrón no es simplemente norte-sur. Austria, en Europa occidental, supera a muchos países del norte de Europa central. Y Malta y Bélgica, ambos en el oeste y el sur respectivamente, están entre los más rezagados.

*[Cambiar métrica del mapa a 'estado de avance']*

Cambiando a la vista de estado de avance, el mapa se vuelve mayoritariamente rojo. Solo cinco países en verde —los que ya alcanzaron el objetivo— y prácticamente toda Europa central y oriental en rojo intenso.

*[Pasar a sección Evolución temporal; seleccionar DE, PL, SE, ES]*

La sección temporal muestra la trayectoria desde 2004. La línea azul gruesa es la UE-27. Selecciono Suecia, Polonia, Alemania y España para comparar. Suecia partía ya del 40 % en 2004 y ha seguido creciendo. Polonia apenas ha avanzado. La aceleración más reciente se nota en Alemania, que ha acelerado visiblemente desde 2020 gracias a la expansión solar."

---

### [04:40 – 05:20] Reflexión final, limitaciones y cierre

*[Pantalla: sección Conclusiones]*

"Las conclusiones resumen cinco hallazgos: la UE-27 necesita triplicar su ritmo histórico; solo cinco países han alcanzado el objetivo; la brecha entre electricidad y transporte es estructural; el patrón geográfico existe pero no es simple; y el tiempo se acorta con cada año que pasa.

En cuanto a las limitaciones: el objetivo del 42,5 % es para el total, no para cada sector, así que la comparación sectorial es ilustrativa de asimetrías, no de cumplimiento. Los datos de 2024 pueden ser provisionales. Y no se han incluido objetivos nacionales específicos por la dificultad de documentarlos con rigor suficiente.

La reflexión más importante del proceso es esta: el mayor reto al diseñar esta visualización no fue técnico, sino narrativo. Transformar una tabla de porcentajes en una historia sobre velocidad, urgencia y disparidad requirió pensar antes en qué pregunta responder y luego en qué gráfico usar. La métrica `required_pace` no estaba en los datos de Eurostat: hubo que derivarla con sentido conceptual claro para que la visualización dijera algo que los datos solos no decían.

Gracias."

---

## Notas para la grabación

- Duración total: ~5 minutos (ajustable si se habla más lento)
- Usar zoom/spotlight en las zonas relevantes del gráfico al narrar
- Para la demostración del mapa: asegurarse de que el TopoJSON ha cargado antes de iniciar la grabación
- Mostrar el filtro de región activo al menos en una sección para evidenciar la interactividad
- Pronunciar correctamente: "required pace" (en inglés) o "ritmo necesario" (preferir español en la narración)
