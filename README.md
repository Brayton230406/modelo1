# Mar de Fondo

Landing page responsive para una cevichería ecuatoriana. La implementación es HTML, CSS y JavaScript nativo, por lo que puede abrirse sin instalar dependencias.

## Buenas prácticas aplicadas

- **HTML semántico:** `header`, `nav`, `main`, `section`, `article` y `footer` describen la estructura real del contenido.
- **Accesibilidad:** idioma del documento, enlace para saltar al contenido, etiquetas de formulario y mensajes con `role="status"`.
- **Responsive design:** viewport correcto, layout con Grid/Flexbox, unidades relativas y breakpoint para navegación móvil.
- **CSS mantenible:** variables en `:root`, nombres de clases orientados a componentes, estados de interacción y `prefers-reduced-motion`.
- **Rendimiento:** JavaScript con `defer`, fuentes con `preconnect`, imágenes comprimidas y sin librerías innecesarias.
- **SEO básico:** `title`, `description`, jerarquía de encabezados y textos alternativos descriptivos.
- **Formularios claros:** campos obligatorios, tipos de entrada apropiados, autocompletado y confirmación visible.
- **Conversión:** botones de carta, reserva, ubicación y contacto ubicados según la intención del visitante.

## Estructura

```text
index.html   Estructura y contenido de la página
styles.css   Diseño visual, responsive y accesibilidad
script.js    Menú móvil y confirmación de reserva
```

## Uso local

Abre `index.html` directamente o ejecuta:

```bash
python -m http.server 8000
```

Después visita `http://localhost:8000`.

## Próximos pasos de producción

- Reemplazar textos, precios, teléfonos y direcciones por datos reales.
- Servir imágenes optimizadas desde el propio proyecto o un CDN controlado.
- Conectar el formulario a WhatsApp, correo o un backend real.
- Añadir política de privacidad, términos y analítica antes de publicar.