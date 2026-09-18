# Auditoría de accesibilidad, UX y diseño responsive

**Alcance:** revisión no destructiva de `index.html`, `styles.css` y `script.js`.

**Criterios:** WCAG 2.2 AA, estructura semántica, navegación por teclado, nombres accesibles, imágenes, contraste, objetivos táctiles, comportamiento responsive y errores JavaScript.

**Viewports probados:** 320 px, 390 px, 768 px y 1440 px de ancho.

## Resumen ejecutivo

La página tiene una base semántica y responsive sólida. La jerarquía de encabezados es coherente, la navegación móvil utiliza un botón real con `aria-expanded` y `aria-controls`, no se detectó overflow horizontal y no aparecieron errores JavaScript durante la ejecución.

Se identificaron dos incumplimientos verificables de contraste, una implementación de imágenes poco robusta para accesibilidad y producción, un formulario que simula el envío sin registrar una reserva real y varias mejoras de foco y objetivos táctiles. Los problemas de mayor impacto para usuarios finales son el contraste de botones/textos coral y la falsa confirmación del formulario.

## Hallazgos críticos

No se identificaron hallazgos críticos con la evidencia disponible.

## Hallazgos altos

### A-01: Contraste insuficiente en botones y textos coral

**Criterio relacionado:** WCAG 2.2, 1.4.3 Contraste mínimo.

**Evidencia concreta:**

- Archivo: [styles.css](styles.css).
- Variables afectadas: `--coral: #ed684d`, `--cream: #fbfaf7`.
- Contraste medido de coral sobre crema: **3.01:1**.
- Contraste medido de texto blanco sobre coral: **3.14:1**.
- Elementos afectados: `.button`, `.eyebrow`, `.brand em`, `h1 span`, `h2 em`, `.dish-info strong`.
- Los textos y botones afectados se presentan como texto normal o menor que texto grande, por lo que necesitan al menos 4.5:1.

**Recomendación:** oscurecer el coral para los usos textuales y de botón, o utilizar una variante de fondo más oscura con texto blanco. Volver a medir cada combinación con una herramienta de contraste.

### A-02: Confirmación de reserva no conectada a ningún canal real

**Criterio relacionado:** UX, honestidad del estado de operación y prevención de errores.

**Evidencia concreta:**

- Archivo: [script.js](script.js).
- Elemento: `#reservation-form`.
- El listener de `submit` ejecuta `event.preventDefault()`, muestra `Gracias. Te escribiremos por WhatsApp...` y luego ejecuta `reservationForm.reset()`.
- No se observa `fetch`, enlace a WhatsApp, envío de correo, almacenamiento ni respuesta de backend.
- En la prueba manual, el mensaje aparece correctamente, pero no se genera ninguna solicitud real.

**Recomendación:** conectar el formulario a un backend o generar un enlace de WhatsApp con los datos validados. Mostrar éxito únicamente después de confirmar que el canal recibió la solicitud y mostrar un mensaje de error si falla.

## Hallazgos medios

### M-01: Imágenes de productos sin alternativa accesible explícita

**Criterio relacionado:** WCAG 2.2, 1.1.1 Contenido no textual.

**Evidencia concreta:**

- Archivos: [index.html](index.html) y [styles.css](styles.css).
- Elementos afectados: `.dish-image.dish-one`, `.dish-image.dish-two` y `.dish-image.dish-three`.
- Son `div` con imágenes aplicadas mediante `background-image` y no tienen `alt`, `role="img"` ni nombre accesible propio.
- El nombre y la descripción del plato sí están disponibles como texto, pero la imagen no tiene una alternativa explícita.

**Recomendación:** reemplazar los `div` por `<img>` con `alt` descriptivo cuando la imagen aporte información, o marcarla como decorativa con `alt=""` si el texto del plato ya cubre completamente su función.

### M-02: Dependencia frágil de imágenes remotas como fondos CSS

**Criterio relacionado:** robustez, rendimiento y experiencia visual.

**Evidencia concreta:**

- Archivo: [styles.css](styles.css).
- Elementos afectados: `.hero-image`, `.dish-image`, `.story-image` y `.map-panel`.
- Las imágenes se cargan desde URLs externas de Unsplash.
- Durante la prueba del navegador, fallaron solicitudes para las imágenes asociadas a `.dish-two` y `.map-panel` con `net::ERR_BLOCKED_BY_ORB`.
- Al ser fondos CSS, no existe fallback `alt` ni una estrategia de imágenes responsive.

**Recomendación:** alojar las imágenes en el propio proyecto o en un CDN controlado, usar `<picture>`/`srcset` cuando sean contenido, y definir un fondo de respaldo visual para fallos de red.

### M-03: Foco visible no definido explícitamente

**Criterio relacionado:** WCAG 2.2, 2.4.7 Foco visible y 2.4.11 Apariencia del foco.

**Evidencia concreta:**

- Archivo: [styles.css](styles.css).
- No se encontró una regla `:focus-visible` para enlaces, botones, campos o el menú.
- En el navegador el foco fue visible mediante el indicador por defecto (`outline: auto`), por lo que la navegación no queda sin foco en el entorno probado.

**Recomendación:** definir `:focus-visible` con un contorno de al menos 2 px, contraste suficiente y separación visible respecto al componente. Repetir la prueba en fondo crema, coral y teal.

### M-04: Objetivos táctiles pequeños para enlaces secundarios

**Criterio relacionado:** WCAG 2.2, 2.5.8 Tamaño mínimo del objetivo.

**Evidencia concreta:**

- Archivos: [index.html](index.html) y [styles.css](styles.css).
- En la prueba de navegador, los enlaces telefónicos midieron aproximadamente `104 × 18 px` y los enlaces del pie aproximadamente `31 × 19 px`.
- El botón del menú móvil midió aproximadamente `67 × 42 px`.
- El requisito WCAG permite excepciones para ciertos enlaces de texto inline, pero estas dimensiones son menos cómodas para uso táctil.

**Recomendación:** añadir `padding` y una altura mínima de 44 px para controles y enlaces interactivos importantes. Mantener separación suficiente entre objetivos vecinos.

### M-05: Fecha de reserva permite fechas pasadas

**Criterio relacionado:** prevención de errores y calidad de datos.

**Evidencia concreta:**

- Archivo: [index.html](index.html).
- Elemento: `input[name="fecha"]`.
- El campo es `type="date"` y `required`, pero no tiene atributo `min` ni validación equivalente en [script.js](script.js).

**Recomendación:** establecer como mínimo la fecha actual y validar también en el servidor cuando exista backend.

## Hallazgos bajos

### B-01: Gestión de foco incompleta en el menú móvil

**Criterio relacionado:** UX de teclado y navegación móvil.

**Evidencia concreta:**

- Archivos: [index.html](index.html) y [script.js](script.js).
- El botón alterna correctamente `aria-expanded` y la clase `.is-open`.
- No se implementa cierre con `Escape`, cierre al pulsar fuera ni restauración explícita del foco después de cerrar.
- La navegación por Tab funciona en el estado probado y los enlaces ocultos no reciben foco cuando `display: none`.

**Recomendación:** añadir cierre con `Escape`, devolver el foco al botón y considerar cierre al hacer clic fuera del panel.

### B-02: Iconos decorativos potencialmente anunciables

**Criterio relacionado:** WCAG 2.2, 1.1.1 Contenido no textual.

**Evidencia concreta:**

- Archivo: [index.html](index.html).
- Caracteres como `✦` y `✳` se usan como decoración en el mapa, marca y ticker.
- Algunos tienen `aria-hidden="true"`, pero no todos los elementos decorativos lo especifican.

**Recomendación:** añadir `aria-hidden="true"` a los iconos puramente decorativos o reemplazarlos por iconos con una semántica consistente.

### B-03: Enlace de Instagram genérico

**Criterio relacionado:** claridad de navegación y contenido real.

**Evidencia concreta:**

- Archivo: [index.html](index.html).
- El enlace del pie apunta a `https://instagram.com`, no a un perfil concreto.

**Recomendación:** sustituirlo por la cuenta oficial antes de publicar.

## Criterios que cumplen

- `<!doctype html>`, `<html lang="es">`, `charset` y `viewport` están presentes.
- Existe un único `h1` y la secuencia `h1 > h2 > h3` es coherente.
- Se utilizan elementos semánticos `header`, `nav`, `main`, `section`, `article` y `footer`.
- El enlace “Saltar al contenido” apunta a `#contenido`.
- La navegación principal tiene `aria-label="Navegación principal"`.
- El control del menú es un `<button type="button">` y expone `aria-expanded` y `aria-controls`.
- Los enlaces se usan para navegación y el envío del formulario utiliza un `<button type="submit">`.
- Los campos del formulario tienen etiquetas visibles y `required` donde corresponde.
- El título y la meta descripción están presentes.
- No hubo overflow horizontal en 320, 390, 768 ni 1440 px.
- No se detectaron errores JavaScript durante la carga y navegación probadas.
- La navegación por teclado alcanzó el enlace de salto, marca, menú, enlaces de contenido, teléfonos y controles del formulario.
- Los estilos incluyen `prefers-reduced-motion`.

## Pruebas que deberían repetirse después de corregir

1. Volver a medir todas las combinaciones de color con una herramienta WCAG 2.2 AA.
2. Probar `Tab`, `Shift + Tab` y `Escape` en escritorio y móvil.
3. Confirmar que el foco permanece visible sobre fondos crema, coral y teal.
4. Probar el menú con lector de pantalla y verificar `aria-expanded`, nombre y foco.
5. Validar el envío real del formulario con datos válidos, campos vacíos, teléfono inválido, fecha pasada y fallo del backend.
6. Verificar que una reserva confirmada llegue al canal operativo real.
7. Ejecutar pruebas de imágenes con red lenta, imágenes bloqueadas y ausencia de CDN.
8. Repetir overflow y tamaños de objetivos en 320, 390, 768 y 1440 px.
9. Probar zoom del navegador al 200% y reflow equivalente a 320 px.
10. Ejecutar una auditoría automatizada con axe, Lighthouse o Accessibility Insights y complementar con lector de pantalla.

## Verificación final

- Archivos revisados existentes: `index.html`, `styles.css`, `script.js`.
- Archivo generado: `AUDITORIA.md`.
- `node --check script.js` no pudo ejecutarse porque Node.js no está instalado en el entorno.
- El contenido de `script.js` sí fue compilado con `new Function(...)` en el motor JavaScript del navegador y la página se cargó sin errores de ejecución.
- Diagnóstico del editor: sin errores reportados en los tres archivos fuente.
- Pruebas de navegador realizadas en 320, 390, 768 y 1440 px.
- Resultado responsive: sin overflow horizontal.
- Resultado de consola: sin errores JavaScript durante la prueba.
- Repositorio sin cambios en los archivos fuente; esta auditoría solo añade este informe.