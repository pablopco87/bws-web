# # Plantilla Página Producto BWS

Perfecto, entiendo el contexto. Antes de proponer la estructura, necesito cer

_Started 2026-08-24 13:03 UTC_

---

## User

Continuing from "# Brutal Work Studio Homepage".

## Assistant

Estamos en la iteración final de la Home de BWS en dark mode, con light mode como alternativa.

**Lo que se trabajó:**
Construimos la página de Inicio completa con 7 secciones en orden cerrado: hero con gráfico 3D animado de tus piezas STL encajando (FC1α + FC1Ω), módulo de refuerzo con acordeones para montaje/durabilidad/transporte, prueba social, teaser de 5 packs (Tournament y Battle Ready destacados), transparencia de proceso, origen de marca y blog oculto. Añadimos: módulo flotante de slots en esquina inferior derecha (minimizable), dark/light mode con switch en header, y sistema de botones/enlaces unificado.

**Decisiones principales:**
- Hero: gráfico 3D con wireframe verde de tus STL reales, reactivo al cursor, encaje vertical tipo Slider System
- Refuerzo: video 1:1 a la izquierda, tres conceptos apilados a la derecha (etiqueta + titular + descripción), logo SSS grande anclado arriba sin desplazarse
- Light mode: fondos intercalados blanco/#F3F1ED en módulos, wireframe 3D en gris oscuro/verde tenue, sin perder contraste
- CTA unificados: borde verde + hover relleno en la mayoría; solo reservar slot mantiene relleno sólido

**Estado actual:**
v4 cerrada con ambos modos funcionando. Hero 3D y logo header en light requieren revisión en publicación. Logo del pie reemplazado por versión completa (BRUTAL WORK STUDIO_light.svg con transparencia controlada).

**Archivos:**
- Inicio BWS v4.dc.html (principal, desktop)
- piezas-wireframe.json (datos wireframe de STL)
- BWS_light.svg, bws-dark.svg, BRUTAL WORK STUDIO_light.svg (logos)

**Próximos pasos:**
Debuggear publicación del gráfico 3D y logo en light mode. Después: página Producto, Slider System, detalle de packs.

## User

Quiero diseñar la plantilla de página de Producto de Brutal Work Studio (BWS), usando el pack Tournament como caso real. Esta plantilla se reutilizará después para los otros cuatro packs (Battle Ready, Ruined Buildings, Blockers & Barricadas, Rubble Walls) solo cambiando contenido — ten eso en cuenta: resuelve zonas de contenido claras y reutilizables, no algo tan a medida de Tournament que no generalice.

Antes de proponer nada, pregúntame lo que necesites sobre cómo presentar las especificaciones técnicas, el patrón de interacción de la galería, y cómo debería verse el módulo de cross-selling — no dov por cerrado nada de eso todavía.

CONTINUIDAD DE ESTILO
Ya cerramos la dirección visual y el sistema de marca en la página de Inicio de este mismo proyecto — reutiliza esos tokens (color, tipografía, espaciado, tono de interfaz) tal cual, no propongas una dirección nueva desde cero. Esta página hereda ese sistema; las preguntas que me hagas deben ser sobre las decisiones específicas de ESTA página, no sobre la dirección de marca general.

CONTEXTO DE PRODUCTO — TOURNAMENT
Pack Tournament: mesa completa de torneo, consume 1 slot de fabricación completo (equivalente a una semana). Es el pack ancla del catálogo. [Listado exacto de piezas incluidas — pendiente de confirmar, usa un placeholder editable]. Material: PLA Bambu Lab, impreso en Bambu Lab A1, color gris. Plazo de fabricación: 6-7 días. Precio: [PRECIO — aún sin cerrar, no lo inventes].

ESTRUCTURA DE LA PÁGINA (cerrada en el Brief, sección 4, no cambies el orden)
1. Hero de producto — nombre del pack, mensaje corto, CTA de compra/reserva según estado de slot.
2. Qué incluye — desglose de piezas del pack.
3. Especificaciones técnicas — con renders acotados en cm. [Medidas exactas pendientes — usa placeholders del tipo [XX cm], no inventes cifras].
4. Galería de detalle.
5. Slider System aplicado — un resumen/preview del mecanismo aplicado a este producto, con enlace a la página dedicada de Slider System (que se diseñará después, aún no existe) — no repliques aquí la explicación técnica completa.
6. Proceso de fabricación — versión resumida (la versión larga vive en Inicio/Transparencia).
7. Cross-selling — enlaces a los otros packs físicos (nunca al STL — son embudos de compra distintos).

Además, el módulo flotante de estado de slots (ya diseñado en Inicio) aparece igual aquí, en la misma posición — no lo rediseñes, solo asegúrate de que el CTA de esta página se coordina con su estado.

RESTRICCIONES DE CONTENIDO
No hay fotografía ni renders reales todavía — usa placeholders marcados, no fotos de stock. No inventes precio, medidas exactas ni listado de piezas — dónde falte un dato real, dejalo como placeholder visible. Copy en español, tono técnico y directo, sin relleno.

Soy diseñador de producto UX/UI senior, trátame como un igual técnico.

## Assistant



## Assistant

_[tool: grep]_

_[tool: list_files]_

Tengo el sistema (Archivo + IBM Plex Mono, #0A0A0B/#4ADE80, canvas wireframe, dark/light). Antes de construir, las decisiones de ESTA página:

_[tool: ask_user]_

Espero tus respuestas: patrón de especificaciones, galería, cross-selling, estados de CTA y marcado de placeholders. Con eso construyo la plantilla directamente sobre los tokens de Inicio v4.

## User

Answered — specs_pattern: Selector de pieza: lista de piezas a la izquierda, render acotado grande a la derecha que cambia al seleccionar; specs_scope: 3-4 cotas clave por pieza; gallery: Grid + lightbox: click abre visor a pantalla completa con navegación por teclado; gallery_slots: 8-9; cross: Cuatro tarjetas iguales en fila (mismo componente que el teaser de packs de Inicio, reutilizado); cta_states: Slot libre → Reservar slot, Slot ocupado → Entrar en lista de espera, Sin slots este mes → Avisarme cuando abra; hero_visual: Placeholder marcado grande para render/foto; placeholders: Ambos:…

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

Plantilla lista en `Producto BWS · Tournament.dc.html`, con los tokens de Inicio v4 intactos.

Zonas reutilizables (solo cambia contenido entre packs):
- **Hero**: título + claim + rejilla 2×2 de metadatos (consumo/plazo/material/precio) + CTA por estado de slot. El conmutador `LIBRE / OCUPADO / SIN SLOTS` sobre el marco es de demo: cambia el CTA del hero, la nota bajo él y el botón del módulo flotante a la vez. También está como prop `estadoSlot`.
- **Qué incluye**: 6 fichas de pieza (`[XX] ud` + nombre + función) + fila de totales. Añadir o quitar filas no rompe la retícula.
- **Especificaciones**: selector de pieza a la izquierda (con bloque «común a todo el pack» al pie) y render acotado grande a la derecha, 4 cotas clave debajo. Las cotas están dibujadas como líneas de acotación reales con etiquetas `[XX cm]` para que solo haya que sustituir cifra y render.
- **Galería**: bento de 9 huecos + lightbox con ←/→ y ESC, contador 01/09.
- **Slider System**: 3 puntos y diagrama de encaje, sin repetir la explicación técnica; enlace a la página dedicada.
- **Proceso**: 4 pasos Día 0 → Día 7, con enlace a la versión larga.
- **Cross-selling**: 4 tarjetas iguales al componente de packs de Inicio, solo packs físicos.

Pendientes marcados: precio, listado de piezas, todas las cotas, altura de capa y tolerancia, y los 10 huecos de imagen (1 hero + 9 galería). Cuando me pases el listado real te digo si 6 fichas siguen siendo el número correcto.

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

## User

Revisa pormenorizadamente la versión light, hay elementos y módulos que siguen dark. Además suavizaría varios de los strokes de módulos y elementos para que se vean en el gris claro utilizado en la versión light de la página de inicio.

Al módulo "qué incluye" le daría una vuelta porque deberia ser algo más visual, probablemente añadiendo una imagen por tipo de pieza. pregúntame lo que necesites para la iteracion

## Assistant



## Assistant

_[tool: dc_html_str_replace]_

_[tool: show_html]_

_[tool: ask_user]_

Modo claro repasado: superficies (#0a0a0b, #22222a), filetes, tramas, textos, tarjetas, módulo flotante y lightbox ya tienen equivalente claro, con strokes SVG más suaves (#B7B8AF) y acento #17A354. El pie sigue en oscuro a propósito — es una de las preguntas.

Espero tus respuestas sobre «Qué incluye» (formato, tipo de imagen, datos por pieza y nº de tipos) para rehacerlo.

## User

Answered — layout: Tira horizontal con arrastre: una tarjeta con imagen por tipo de pieza, se desplaza lateralmente; img_type: Render 3⁄4 de la pieza; datos: Cantidad (XX ud), Cota principal (alto o ancho), Referencia interna (BWS-XX); n_tipos: 7 o más; footer_claro: También en claro

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: grep]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

## User

1. El hover de las cards del "Qué incluye", al efectuarse la interacción el stroke superior de la card se queda oculto. Corregirlo.
2. En el grid de galería de Detalle, el espacio entre imágenes no está correcto, el espacio entre la imagen principal y las que se muestran debajo no es igual al resto.

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

## User

Found issues — fixing…

## User

Found issues — fixing…

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

