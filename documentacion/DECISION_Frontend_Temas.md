# JARVIS — Decisión de interfaz: temas del frontend

> ## Addendum del 29 de octubre de 2026 — las maquetas definitivas
>
> **El lienzo vuelve a ser 1024 × 600**, con panel táctil de 7" sobre Raspberry Pi 3. La alternativa de usar un teléfono como dispositivo quedó descartada: el equipo disponible no tiene reparación.
>
> **La dirección visual no cambia**: Lavanda Suave por defecto, Menta Clínica opcional. Lo que cambia es que ahora hay **cinco pantallas maquetadas**, no una:
>
> | Archivo | Qué es |
> |---|---|
> | `mockups/project/Principal.dc.html` | Pantalla principal, tema Lavanda. **La de referencia.** |
> | `mockups/project/Escucha.dc.html` | El momento en que hablás: transcripción, acción verificada y de dónde se resolvió. |
> | `mockups/project/Emergencia.dc.html` | Alerta activa con el estado real de cada aviso. |
> | `mockups/project/Musica.dc.html` | Reproducción, con origen explícito y cola. |
> | `mockups/project/Menta.dc.html` | Pantalla principal en el tema alternativo. |
>
> **Elementos nuevos incorporados al diseño**, todos presentes en las maquetas: el chip **«Casa activa»** del modo acompañamiento, la tarjeta **«Casa»** con el estado real de luces y aspiradora, la **barra compacta de música**, y en la pantalla de escucha el distintivo **«Resuelto en casa · sin enviar a la nube»**.
>
> **Modo nocturno:** sigue pendiente como variante atenuada para una habitación a oscuras (Fase 10). Con un panel LCD no es obligatorio como lo habría sido con AMOLED, pero mejora el uso de noche.

**Estado:** DECIDIDO Y CERRADO
**Fecha de la decisión:** 28 de octubre de 2026
**Decidido por:** el usuario (propietario del proyecto)
**Alcance:** pantalla principal del dispositivo (Raspberry Pi) y, por extensión, la PWA móvil
**Reemplaza:** nada. Complementa la sección 5.5 «Dashboard visual» y la sección 17.1 del documento `JARVIS_Proyecto_Integral.md`.

---

## 1. La decisión

El frontend de JARVIS tendrá **dos temas visuales seleccionables por el usuario desde la configuración**. No son dos aplicaciones ni dos maquetados: es **una sola interfaz** cuyo aspecto cambia al intercambiar un conjunto de tokens de diseño.

| | Tema | Archivo del mockup | Rol |
|---|---|---|---|
| **1** | **Lavanda Suave** | `mockups/project/Lavanda.dc.html` | **Por defecto.** Es el que se muestra en la primera instalación y si el usuario nunca toca la configuración. |
| **2** | **Menta Clínica** | `mockups/project/Menta.dc.html` | **Opcional.** Disponible en configuración; el usuario puede cambiar a este en cualquier momento. |

Los mockups están publicados en el canvas de diseño: <https://claude.ai/artifact/3dozfkTjcVtj7wCBAwrSEQ>

Los demás mockups de esa carpeta (`Main`, `Claro`, `Focus`, `Calido`) quedan como **material descartado**. Se conservan solo como registro de la exploración; no se implementan.

### Consecuencia para la arquitectura

La elección de tema es **una preferencia por usuario y por hogar**, no una constante del código. Debe guardarse en la tabla de preferencias del modelo de datos (sección 10.1 del documento principal) junto al volumen, la velocidad del habla y el tamaño de texto. Dos hogares pueden tener temas distintos, y eso es lo esperable: el hogar principal puede usar Lavanda mientras el hogar de la madre usa Menta con los tamaños de texto aumentados.

**Esto obliga a que todo color, radio, sombra y tipografía se declare como token y nunca se escriba a mano dentro de un componente.** Un color literal incrustado en un componente rompe el cambio de tema.

---

## 2. Estructura compartida por ambos temas

Ambos temas resuelven la misma pantalla de **1024 × 600** con el mismo contenido. Lo que cambia es el color y la disposición, no la información.

Elementos obligatorios en ambos, por decisión del documento principal (secciones 5.5 y 14.4):

- hora y fecha;
- clima actual, con condición, máxima, mínima y pronóstico por hora;
- agenda del día;
- lista de compras con cantidad de pendientes;
- próximo recordatorio;
- estado de conexión con el servidor;
- estado del micrófono y de la escucha;
- acceso a emergencia **siempre visible, sin navegar**;
- tiempo de viaje (añadido a pedido del usuario; no estaba en el documento original).

### Lavanda Suave — disposición

Mosaico de tres columnas y dos filas, más una barra inferior:

- **Panel oscuro** (columnas 1–2, fila 1, alto 190 px): la hora en grande, la fecha, y dentro del mismo panel la cápsula de estado del micrófono. Dos auroras desenfocadas respiran detrás. Es el único elemento oscuro de la pantalla y es deliberado: da contraste y jerarquía sin volver oscura toda la interfaz.
- **Clima** (columna 3, filas 1–2, alto completo 400 px): bloque de cielo con degradado, ícono compuesto, temperatura actual, condición, máxima/mínima y cuatro chips por hora.
- **Agenda** (columna 1, fila 2) y **Compras** (columna 2, fila 2), alto 196 px cada una.
- **Barra inferior** (alto 96 px): sugerencia de voz con medidor de nivel a la izquierda, botón **«Necesito ayuda»** de 252 px a la derecha.

### Menta Clínica — disposición

Riel lateral flotante más contenido, en dos columnas:

- **Riel izquierdo** (ancho 72 px, separado del borde, en vidrio): marca, cuatro accesos de navegación y el botón **SOS** anclado abajo.
- **Encabezado** (alto 30 px): saludo, chip del hogar, pastilla de viaje y pastilla de estado de conexión.
- **Columna izquierda**: tarjeta de hora y clima combinados (alto 232 px) sobre la lista de compras en tres columnas.
- **Columna derecha** (ancho 342 px): agenda del día sobre recordatorios.
- **Barra de voz inferior** (alto 68 px) a todo el ancho del contenido.

---

## 3. Tokens de diseño

Estos valores son el contrato. Se implementan como variables CSS (o el equivalente del framework elegido) y se intercambian en bloque al cambiar de tema.

### 3.1 Compartido por ambos temas

| Token | Valor |
|---|---|
| Tipografía | **Plus Jakarta Sans**, pesos 400, 500, 600, 700, 800 |
| Reserva de tipografía | `system-ui, sans-serif` |
| Números | `font-variant-numeric: tabular-nums` en toda hora, temperatura y contador |
| Curva de animación | `cubic-bezier(.2, .8, .2, 1)` |
| Duración de transición | 300 ms en botones, 450 ms en tarjetas |
| Elevación al pasar por encima | `translateY(-2px)` en botones, `translateY(-3px)` en tarjetas |
| Radio de tarjeta grande | 26–28 px |
| Radio de tarjeta chica | 24 px |
| Radio de bloque interior | 20 px |
| Radio de chip | 14 px |
| Radio de pastilla | 999 px |
| Área táctil mínima | 44 px |

**Animaciones ambientales** (deben respetar `prefers-reduced-motion` y poder desactivarse si la Pi 3 no rinde):

| Nombre | Elemento | Duración |
|---|---|---|
| `giro` | rayos del sol en el ícono del clima | 46 s lineal, infinita |
| `flotar` | nube del ícono del clima | 8 s suave, infinita |
| `aura` | auroras del panel oscuro | 7 s suave, infinita |
| `escuchar` | halo del micrófono | 3 s, infinita |

### 3.2 Lavanda Suave (por defecto)

| Token | Valor |
|---|---|
| Fondo base | `#F3F1FA` |
| Fondo, aurora superior izquierda | `radial-gradient(680px 420px at 0% -10%, rgba(123,116,224,.24), transparent 60%)` |
| Fondo, aurora inferior derecha | `radial-gradient(620px 420px at 100% 108%, rgba(230,150,180,.22), transparent 58%)` |
| Texto principal | `#1B1930` |
| Texto secundario | `#5A5676` |
| Texto terciario / tachado | `#83809B` |
| Acento | `#4B47B8` |
| Acento, degradado | `linear-gradient(140deg, #4B47B8, #7B74E0)` |
| Verde de confirmación (compras) | `#2A6B52` |
| Ámbar de recordatorio | `#C9803A` |
| Emergencia | `linear-gradient(140deg, #E05A5A, #B82D2D)` |
| Vidrio claro | `rgba(255,255,255,.70)` |
| Borde del vidrio | `rgba(255,255,255,.92)` |
| Desenfoque del vidrio | `blur(22px) saturate(140%)` |
| Sombra de tarjeta | `0 14px 32px rgba(32,26,70,.10)` |
| Sombra al pasar por encima | `0 24px 48px rgba(32,26,70,.16)` |
| **Panel oscuro** | `linear-gradient(142deg, #272250 0%, #1B1933 58%, #2C2142 100%)` |
| Texto sobre panel oscuro | `#F2F0FF` |
| Texto secundario sobre panel oscuro | `#BDB8E0` |
| Vidrio sobre panel oscuro | `rgba(255,255,255,.10)`, borde `rgba(255,255,255,.17)` |
| Cielo del clima | `linear-gradient(170deg, #8D9BE0 0%, #B6A4DC 52%, #F0B59A 100%)` |

### 3.3 Menta Clínica (opcional)

| Token | Valor |
|---|---|
| Fondo base | `#EEF4F4` |
| Fondo, halo menta | `radial-gradient(720px 420px at 2% -8%, rgba(14,140,119,.17), transparent 60%)` |
| Fondo, halo azul | `radial-gradient(640px 440px at 100% 104%, rgba(94,140,200,.16), transparent 58%)` |
| Texto principal | `#13241F` |
| Texto secundario | `#51635D` |
| Texto terciario / tachado | `#7A8A85` |
| Acento | `#0E8C77` |
| Acento oscuro (enlaces visitados, texto sobre fondo claro de acento) | `#0A6A5B` |
| Azul de viaje | `#3A6FA8` |
| Emergencia | `#E0533D` |
| Vidrio claro | `rgba(255,255,255,.72)` |
| Borde del vidrio | `rgba(255,255,255,.92)` |
| Desenfoque del vidrio | `blur(22px) saturate(140%)` |
| Sombra de tarjeta | `0 14px 32px rgba(16,46,40,.09)` |
| Sombra al pasar por encima | `0 22px 44px rgba(16,46,40,.14)` |
| Realce de fila | `rgba(14,140,119,.07)` con desplazamiento de 12 px a la derecha |
| Bloque del clima | `linear-gradient(165deg, rgba(126,178,224,.30), rgba(14,140,119,.16))` |

### 3.4 Ícono del clima (compartido)

Es un SVG compuesto, no un ícono plano de biblioteca. Tres piezas:

1. **Rayos**: ocho trazos de 3,2–3,4 px alrededor del sol, redondeados, girando con la animación `giro`.
2. **Sol**: círculo con `radialGradient` de `#FFF8E2` → `#FFDE8A` (55 %) → `#F3AE52`.
3. **Nube**: trazado con `linearGradient` de `#FFFFFF` → `#DAD6F0` (Lavanda) o `#CFE0EC` (Menta), con la animación `flotar`.

Debe llevar `role="img"` y un `aria-label` con la condición real del clima, no decorativo.

---

## 4. Reglas de accesibilidad que no se negocian

Vienen de la sección 14.4 del documento principal y de que el sistema lo va a usar una persona mayor viviendo sola.

- Todo texto cumple **4,5:1** de contraste; las etiquetas chicas en gris también.
- Los botones críticos —emergencia y micrófono— tienen al menos **44 px** de área táctil; el de emergencia, mucho más.
- El acceso a emergencia está **siempre en pantalla**, nunca detrás de un menú.
- Los colores que deben distinguirse entre sí difieren además en luminosidad, no solo en tono. Por eso el acento de Menta es verde-teal y la emergencia es coral: no se confunden ni con daltonismo.
- Todo control es un `<button>`, `<a href>` o `<input>` real con su etiqueta. Nunca un `div` con manejador de clic.
- Los íconos sin texto llevan `aria-label`; los decorativos, `aria-hidden="true"`.
- **Para la instalación del hogar B** (la madre): mismo tema, con la escala tipográfica y los tamaños de los botones aumentados mediante un ajuste de densidad. Es un parámetro, no un rediseño.

---

## 5. Qué queda pendiente de esta decisión

1. **Escala de densidad.** Definir los dos o tres niveles de tamaño (normal / grande / muy grande) y a qué tokens afectan.
2. **Rendimiento en la Pi 3.** `backdrop-filter` con desenfoque es costoso en GPU. Hay que medirlo en el hardware real y tener preparada una degradación: sustituir el vidrio por un color sólido semitransparente y apagar las animaciones ambientales si el cuadro por segundo cae. **Esto se prueba en la Fase 1, antes de construir sobre la base.**
3. **Modo nocturno.** Ninguno de los dos temas está pensado todavía para una habitación a oscuras. Probablemente haga falta una variante atenuada del panel oscuro de Lavanda, o un modo reposo con la pantalla casi apagada.
4. **Comportamiento táctil.** Los mockups asumen que hay interacción táctil disponible. Si la pantalla que se compre no es táctil, los estados de «pasar por encima» pierden sentido y hay que revisar las afordancias.

---

## 6. Qué significa «cerrado»

La dirección visual no se vuelve a discutir salvo que el usuario lo pida explícitamente. Ajustes de detalle sobre estos dos temas, sí. Explorar una tercera estética desde cero, no: esta decisión es el punto de partida del desarrollo.
