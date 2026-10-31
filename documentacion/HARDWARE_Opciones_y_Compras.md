# JARVIS — Hardware: opciones reales de compra

**Versión:** 1.0
**Fecha:** 28 de octubre de 2026
**Mercado:** Argentina (Mercado Libre, tiendas locales) y compra internacional (AliExpress)

> **Dónde comprar cada cosa es una decisión aparte, y está en [HARDWARE_AliExpress_vs_MercadoLibre.md](HARDWARE_AliExpress_vs_MercadoLibre.md)** (31/10/2026). Ese documento concluye que **la pantalla conviene importarla** —sale menos de la mitad y no hace falta hasta la Fase 6— y que existe una opción que acá no estaba contemplada: **monitores de 7" 1024×600 con parlantes incorporados y soporte para montar la Pi atrás**, que reemplazan de una vez al panel, la carcasa, la barra de sonido y el adaptador de audio. Antes de comprar lo de las secciones 4 y 5, leelo.

> **Advertencia sobre los precios.** Todos los valores son de **octubre de 2026** y salen de publicaciones consultadas ese día. En Argentina los precios y el stock cambian semana a semana. Úsalos para comparar entre opciones, no como presupuesto cerrado. Antes de comprar, verificá el precio en la publicación.

---

## 1. El criterio: que no parezca una computadora desarmada

Tu objetivo explícito es que esto **no** sea una plaqueta por un lado, un micrófono tirado por otro y unos parlantes colgando. Eso define las decisiones más que el precio.

Los tres criterios, en orden:

1. **Que se integre físicamente.** Un solo objeto sobre la mesa, no cuatro.
2. **Que funcione sin pelear con controladores.** Un dispositivo que anda enchufándolo vale más que uno teóricamente mejor que requiere compilar drivers cada vez que se actualiza el sistema.
3. **Que se consiga acá.** Un componente perfecto que tarda 45 días y paga impuestos frena el proyecto.

---

## 2. Hallazgo importante: por qué NO recomiendo el ReSpeaker 2-Mic HAT

Este es el componente que cualquiera recomendaría para este proyecto, así que explico por qué lo descarto.

El **ReSpeaker 2-Mics Pi HAT** es una placa que se enchufa encima de la Raspberry y trae dos micrófonos, salida para parlante, un pulsador y LEDs. Sobre el papel es exactamente lo que necesitás: resuelve micrófono, parlante y botón en una sola placa que queda **dentro** de la carcasa.

**El problema es el controlador.** El driver `seeed-voicecard` usaba interfaces internas del kernel que cambiaron a partir de la versión 5.10. Con Raspberry Pi OS Bookworm y kernel 6.x, la instalación falla: hay reportes abiertos de octubre de 2025 con errores de compilación en Raspberry Pi 3B+, y el propio soporte de Seeed indicó que el HAT v1 es compatible con kernels cercanos al 5.10 y Bullseye, no con los actuales. Hay salidas —el fork de HinTak con ramas por versión de kernel, o configurar el overlay a mano usando los drivers mainline— pero todas significan que **cada actualización del sistema puede romperte el audio**.

En un proyecto donde el audio es el canal principal de entrada y donde hay un módulo de emergencias encima, eso es un riesgo que no vale la pena. **Regla para este proyecto: audio por USB, que usa drivers estándar del kernel y no se rompe nunca.**

**Disponibilidad en Argentina, además:** solo encontré una tienda local (InnoMakeBright) listándolo a $47.040, **sin stock**. Afuera cuesta unos 12 a 14 dólares más envío e impuestos.

Si algún día querés revisarlo: la variante **V2.0 (chip WM8960)** sí tiene soporte en el kernel mainline y hay reportes de que funciona en Bookworm solo con un overlay, sin compilar nada. Pero sigue sin conseguirse acá.

---

## 3. Micrófono

### Lo que hay que entender antes de elegir

El micrófono es el componente que más define si JARVIS se siente bien o mal. Tiene que captar **desde tres metros, con ruido de fondo**, no pegado a la boca. Dos cosas importan:

- **Omnidireccional** (capta en 360°), no direccional. No vas a hablarle de frente siempre.
- **Cancelación de eco**, para que no se escuche a sí mismo cuando responde. Si el micrófono no la trae por hardware, hay que silenciarlo mientras habla, lo que impide interrumpirlo.

### Las tres opciones

| | Opción | Precio aprox. | Dónde |
|---|---|---|---|
| **Económico** | Mini micrófono USB tipo pendrive | **$3.000 – $9.000** | [Mercado Libre](https://listado.mercadolibre.com.ar/microfono-usb-mini) |
| **Intermedio** ⭐ | Micrófono de conferencia USB omnidireccional de mesa ([Genius MIC-100U](https://www.shiftdigital.com.ar/productos/14712/genius+microfono+conferencias+usb+mic100u+omnidireccional) o genérico 360°) | **$18.000 – $25.000** | [Mercado Libre](https://listado.mercadolibre.com.ar/microfono-omnidireccional-conferencia) · [Shift Digital](https://www.shiftdigital.com.ar/productos/14712/genius+microfono+conferencias+usb+mic100u+omnidireccional) · [PC Tintas](https://tienda.pctintas.com/producto/microfono-conferencia-usb-mic-100u/) |
| **Alto** | Maono AU-BM10 u omnidireccional de marca | **$100.000 – $120.000** | [Mercado Libre](https://listado.mercadolibre.com.ar/microfono-omnidireccional-de-mesa-para-conferencias) |
| **El ideal técnico** | [ReSpeaker USB Mic Array v2.0](https://www.seeedstudio.com/ReSpeaker-Mic-Array-v2-0.html) — 4 micrófonos, cancelación de eco y formación de haz **por hardware** | **~US$70–80 + envío** | [Seeed Studio](https://www.seeedstudio.com/ReSpeaker-Mic-Array-v2-0.html) · AliExpress |

**Mi recomendación: el intermedio, el de conferencia USB de mesa, en el rango de $18.000 a $25.000.**

Por qué: es un disco chato que se apoya sobre la mesa o encima del gabinete, está diseñado exactamente para captar voces en una sala desde varios metros, es USB puro —cero controladores— y es barato. El Genius MIC-100U apareció a $21.050 en tienda local y hay genéricos 360° desde $18.000.

El económico sirve para la Fase 4 si querés empezar a probar sin gastar, pero captá que a tres metros y con ruido va a transcribir mal, y eso te va a hacer creer que el problema es Whisper cuando es el micrófono.

El Maono de $100.000 **no lo recomiendo**: cuesta cuatro veces más que el intermedio y no resuelve el problema que importa, que es la cancelación de eco. Si vas a gastar de más, gastalo en el ReSpeaker USB Mic Array, que sí la trae por hardware. Esa es la única compra que cambia cualitativamente la experiencia.

**Integración física:** el micrófono de conferencia es un disco negro discreto. Queda bien apoyado delante o al costado de la pantalla, o pegado arriba del gabinete. No es invisible, pero tampoco desentona: parece parte del equipo, no un cable suelto.

---

## 4. Parlante — barra de sonido

El amplificador suelto con un parlante adentro es barato y prolijo, pero suena a proyecto de taller y requiere soldar. **Una barra de sonido chica apoyada debajo de la pantalla queda mucho mejor**: es un objeto terminado, de línea limpia, que parece parte del equipo. Y se conecta con dos cables, sin soldadura.

### Las opciones

| | Modelo | Precio aprox. | Conexión | Dónde |
|---|---|---|---|---|
| **Económico** | **Netmak Hunter** RGB USB 2.0 | **$17.110 – $32.670** | USB (alimentación) + 3,5 mm | [Mercado Libre](https://listado.mercadolibre.com.ar/barra-sonido-pc-usb) |
| **Económico** | **Crown Mustang Koba** mini, 12 W | **~$21.999** | USB + 3,5 mm | [Mercado Libre](https://listado.mercadolibre.com.ar/mini-barra-de-sonido) |
| **Intermedio** ⭐ | **Genius SoundBar 100** | **$23.999 – $38.699** (ficha: $59.999) | USB (alimentación) + 3,5 mm | [Ficha en Mercado Libre](https://www.mercadolibre.com.ar/parlante-barra-sonido-genius-soundbar-100-usb-35mm-pc-gamer-computadora-notebook/p/MLA19480741) |
| **Alto** | **Trust Arys** USB, 12 W | **$47.068 – $69.999** | USB + 3,5 mm | [FullH4rd](https://fullh4rd.com.ar/prod/19419/barra-de-sonidos-para-pc-arys-usb-trust) · [Mercado Libre](https://listado.mercadolibre.com.ar/barra-de-sonido-pc) |
| **Inalámbrico** | **Creative Stage SE Mini 2.0** | **~$78.000** | Bluetooth + 3,5 mm | [Mercado Libre](https://listado.mercadolibre.com.ar/barra-de-sonido) |

**Mi recomendación: la Genius SoundBar 100, buscándola en el rango de $24.000 a $39.000.**

Por qué: es una barra compacta pensada para ir debajo de un monitor, **se alimenta del propio puerto USB de la Raspberry** —sin fuente adicional, sin otro cable a la pared— y tiene entrada de audio de 3,5 mm. Es de una marca conocida, se consigue en todos lados y el rango de precio es razonable. Estéticamente es exactamente lo que pediste: una barra negra sobria que queda como si viniera con el equipo.

**La Netmak Hunter es la más barata**, pero tiene iluminación RGB. Si te gusta, es el mejor precio del listado. Si buscás algo sobrio, no es.

**La Trust Arys suena mejor** y tiene más potencia, pero cuesta el doble que la Genius para un uso donde lo único que se reproduce es una voz hablando. No lo vale acá.

**Importante, no lo saltees:** estas barras se alimentan por USB pero **reciben el audio por el jack de 3,5 mm**, y la salida analógica de la Raspberry Pi 3 es mediocre: tiene un zumbido audible en los silencios. La solución cuesta **$5.000**: un **adaptador USB de audio**, que saca el sonido por USB limpio y de paso deja libre el jack. **Compralo junto con la barra**, no después.

**Si en algún momento querés que no se vea nada**, la alternativa sigue existiendo: un amplificador PAM8403 ($4.000) más un parlante de 3W, montados dentro del gabinete con unos agujeros al frente. Más barato y literalmente invisible, a cambio de un rato de soldadura. Pero suena peor que una barra.

**El Pirate Audio no lo recomiendo:** $34.300, ocupa el conector GPIO que necesitás para el pulsador de emergencia, y trae una pantallita de 1,3" que no usás.

---

## 5. Pantalla — comprar el panel pelado

> **Corrección respecto de la versión anterior de este documento.** Había recomendado la Waveshare "con case" de B&P Electrónica a $132.600. Al verificar la ficha: **hoy está a $159.120**, la publicación **no menciona que incluya carcasa**, y **sí menciona lápiz táctil**, lo que sugiere que es un panel resistivo y no capacitivo. No la recomiendo.

Tenías razón en la intuición: **la carcasa no es lo que encarece la compra.** Al verificarlo, resultó que se vende por separado y es barata.

### El hallazgo

**Todomicro (tienda argentina)** vende el panel solo:

| Qué | Precio | Link |
|---|---|---|
| Pantalla táctil **capacitiva** 7", 1024×600, HDMI (incluye cable HDMI y cable micro USB) | **$91.385** web, o **$82.329** pagando por transferencia o efectivo | [Todomicro](https://www.todomicro.com.ar/841-pantalla-tactil-raspberry-pi-lcd-touch-7-1024-x-600-hdmi.html) |
| Carcasa acrílica oscura para ese display, **vendida aparte** | **$21.693** | [Todomicro](https://www.todomicro.com.ar/841-pantalla-tactil-raspberry-pi-lcd-touch-7-1024-x-600-hdmi.html) |
| **Total con carcasa** | **~$113.078** | |

**Está sin stock**, pero la página tiene aviso por email cuando repone. Como la pantalla recién hace falta en la Fase 6, hay tiempo de sobra para esperar la reposición.

Es capacitiva de 5 puntos —la buena, la que responde al dedo— y es 1024×600, la resolución exacta del diseño.

### Comparación de caminos

| Camino | Precio | Comentario | Link |
|---|---|---|---|
| **Panel Todomicro + carcasa acrílica** ⭐ | **~$113.078** | El más barato con táctil capacitivo. Sin stock hoy. | [Todomicro](https://www.todomicro.com.ar/841-pantalla-tactil-raspberry-pi-lcd-touch-7-1024-x-600-hdmi.html) |
| Panel Todomicro solo, carcasa a medida después | **$91.385** | Si conseguís quien te la imprima en 3D. | [Todomicro](https://www.todomicro.com.ar/841-pantalla-tactil-raspberry-pi-lcd-touch-7-1024-x-600-hdmi.html) |
| Waveshare con case, Mercado Libre | **~$137.704** | Todo junto, vidrio templado, pero $25.000 más caro. | [Publicación](https://articulo.mercadolibre.com.ar/MLA-1467745223-pantalla-tactil-lcd-waveshare-raspberry-pi-7-pulgadas-1024x6-_JM) · [Doc oficial](https://www.waveshare.com/wiki/7inch_HDMI_LCD_(H)_(with_case)) |
| B&P Electrónica | **$159.120** | Más caro y con dudas sobre el tipo de táctil. | [B&P](https://www.electronicabyp.com.ar/producto/pantalla-5-tactil-raspberry-pi/) |
| AliExpress | **~US$37 – 58** + envío e impuestos | El más barato en origen, 30–45 días de espera. | [RobotShop (referencia)](https://www.robotshop.com/products/7-inch-1024x600-hdmi-lcd-w-touch-raspberry-pi) |

### Dato contraintuitivo: sacar el táctil no ahorra nada

Busqué monitores de 7" **sin** táctil pensando que serían más baratos. **No lo son:** los listados en Mercado Libre van de **$113.136 a $159.900**, el mismo rango o más caro que el panel táctil de Todomicro. En Argentina el táctil no tiene sobreprecio real.

Así que **comprá el táctil**. Poder tocar la pantalla para cancelar una alarma o marcar un producto vale mucho, sobre todo en la instalación de tu mamá, y no cuesta más.

### Lo que descarté

**La pantalla oficial de Raspberry Pi de 7":** es **800×480**, no 1024×600. Habría que rehacer el diseño para una resolución menor.

**Las carcasas SmartiPi Touch 2 / Pro:** están hechas solo para esa pantalla oficial. No sirven acá y no encontré stock en Argentina.

---

## 6. Cómo queda armado el conjunto

```text
        ┌──────────────────────────────┐
        │  ┌────────────────────────┐  │
        │  │                        │  │   ← 7", 1024×600, táctil capacitiva
        │  │   Interfaz de JARVIS   │  │
        │  │                        │  │
        │  └────────────────────────┘  │
        └──────────────────────────────┘
             ↑ carcasa acrílica (o impresa en 3D a medida),
               con la Raspberry Pi atornillada detrás

        ▬▬▬▬▬▬▬▬▬▬▬▬  barra de sonido, debajo de la pantalla
        ●  micrófono de conferencia, apoyado adelante
        ⬤  pulsador de emergencia, en su propia cajita con cable
```

La carcasa acrílica de $21.693 sujeta el panel y la Raspberry detrás, así que **el conjunto es un solo objeto parado**. La barra de sonido se apoya debajo y queda como la base. El micrófono, un disco chato adelante.

**El pulsador va suelto a propósito**, con su cable: tiene que poder estar al lado de la cama o en el baño, no necesariamente donde está la pantalla.

**Si conseguís quien te imprima una carcasa en 3D a medida**, se puede integrar también el micrófono y el parlante en un solo cuerpo. Ahí sí desaparece todo. Pero eso es una mejora para cuando el prototipo funcione, no ahora: con la acrílica ya se ve como un producto.

---

## 7. Pulsador de emergencia

Necesita ser **grande, rojo, evidente y accionable con la mano torpe de alguien que se acaba de caer**. No un botoncito.

| | Opción | Precio aprox. | Dónde |
|---|---|---|---|
| **Económico** | Pulsador plástico 22 mm sin retención (Aea u similar) | **$3.900** | [Mercado Libre](https://listado.mercadolibre.com.ar/pulsador-na-22mm) |
| **Intermedio** ⭐ | Pulsador metálico 22 mm con LED 12V | **$8.500 – $12.500** | [Mercado Libre](https://listado.mercadolibre.com.ar/pulsador-led-22mm) · [Metálicos](https://listado.mercadolibre.com.ar/boton-pulsador-metalico) |
| **Alto** | Pulsador luminoso metálico Chint 22 mm | **~$19.900** | [Mercado Libre](https://listado.mercadolibre.com.ar/pulsador-luminoso-22mm) |

**Recomendación: el metálico con LED de 12V, $8.500–12.500.** El LED importa de verdad: permite que el botón **se vea en la oscuridad** y que parpadee cuando una alerta está activa, confirmando visualmente que algo está pasando.

**Buscá específicamente "tipo hongo"** (la cabeza grande que sobresale) en lugar de rasante. Es mucho más fácil de apretar sin apuntar. Y **normalmente abierto (NA)**, no NC.

Los Schneider a $154.178 son para tableros industriales; acá no aportan nada.

**Armado:** el pulsador va en una cajita plástica de conexiones ($2.000–3.000) con un cable de dos conductores hasta los pines GPIO de la Raspberry. Simple, y queda prolijo.

---

## 8. Lo básico que falta

| Qué | Especificación | Precio aprox. | Dónde |
|---|---|---|---|
| **microSD** | 64 GB, clase 10, **A1 o A2**, SanDisk Extreme o Samsung EVO Select | **$12.000 – $20.000** | [Mercado Libre](https://listado.mercadolibre.com.ar/microsd-64gb-a1) |
| **Fuente** | 5V / 2,5A reales, micro-USB | **$8.000 – $15.000** | [Mercado Libre](https://listado.mercadolibre.com.ar/fuente-raspberry-pi-3-5v-2.5a) |
| **Adaptador USB de audio** | USB a jack 3,5 mm, para evitar el zumbido de la salida analógica | **~$5.000** | [Mercado Libre](https://listado.mercadolibre.com.ar/placa-de-sonido-usb-externa) |

Sobre la microSD, lo repito porque es el error más común: **la clase 10 mide velocidad secuencial, que no es lo que usa un sistema operativo.** Lo que importa es la clasificación **A1/A2**, que mide operaciones aleatorias por segundo. Una tarjeta "clase 10" barata sin A1 hace que todo el sistema se sienta lento, y el síntoma parece un problema de software.

---

## 9. Presupuestos

### Mínimo para arrancar hoy (Fases 0 a 2)

| Componente | Precio |
|---|---|
| microSD 64 GB A1 | $15.000 |
| Fuente 5V 2,5A | $12.000 |
| **Total** | **~$27.000** |

Con eso y el televisor que ya tenés, llegás hasta el final de la Fase 3: pantalla funcionando, backend, datos reales y uso desde el celular.

### Económico (todo el proyecto, mínimo viable)

| Componente | Precio |
|---|---|
| microSD + fuente | $27.000 |
| Mini micrófono USB | $6.000 |
| Barra de sonido Netmak Hunter | $20.000 |
| Panel táctil 7" (Todomicro) | $91.385 |
| Carcasa acrílica | $21.693 |
| Pulsador plástico + caja | $7.000 |
| **Total** | **~$173.078** |

### Recomendado ⭐

| Componente | Precio |
|---|---|
| microSD + fuente | $27.000 |
| Micrófono de conferencia USB omnidireccional | $22.000 |
| Barra de sonido Genius SoundBar 100 | $30.000 |
| Adaptador USB de audio | $5.000 |
| Panel táctil 7" (Todomicro) | $91.385 |
| Carcasa acrílica | $21.693 |
| Pulsador metálico con LED + caja | $14.000 |
| **Total** | **~$211.078** |

**Treinta y ocho mil pesos de diferencia entre el económico y el recomendado**, repartidos entre el micrófono y la barra de sonido. El micrófono es donde más se nota: es lo que decide si el asistente entiende o frustra. La barra es estética y de calidad de voz; ahí sí podés ahorrar si te da lo mismo el RGB de la Netmak.

### Con lo mejor en audio

Lo mismo que el recomendado, pero cambiando el micrófono por el **ReSpeaker USB Mic Array v2.0** (unos US$70–80 más envío e impuestos desde AliExpress, calculá unos $120.000–150.000 puestos acá). Total aproximado: **$310.000**.

Vale la pena **solo si** en la Fase 4 descubrimos que el eco y la distancia son un problema real. Es una decisión para tomar con datos medidos, no ahora.

---

## 10. Orden de compra

| Cuándo | Qué | Gasto |
|---|---|---|
| **Ahora** | microSD + fuente | ~$27.000 |
| **Fase 4** (voz) | Micrófono + barra de sonido + adaptador de audio | ~$57.000 |
| **Fase 6** (integraciones) | Panel táctil + carcasa | ~$113.000 |
| **Fase 7** (emergencias) | Pulsador + caja + UPS | ~$14.000 + UPS |
| **Fase 8** (segundo hogar) | Todo de nuevo para la casa de tu mamá | ~$211.000 |

**La pantalla se compra en la Fase 6, no antes**, por dos razones: hasta entonces el televisor alcanza, y para cuando la compres vas a haber visto el diseño funcionando durante meses, así que vas a saber exactamente si querés 7 o 10 pulgadas. Como la de Todomicro está sin stock, **anotate ahora en el aviso de reposición** — no cuesta nada y te asegura el mejor precio.

---

## 11. Antes de pagar, verificá

**Pantalla:** que diga 7", **1024×600**, IPS, **capacitiva** (no resistiva) y HDMI. **Si la publicación menciona "lápiz táctil", desconfiá**: casi siempre significa que es resistiva, que es la mala.

**Micrófono:** que diga **USB** (no jack 3,5 mm, la Pi 3 no tiene entrada de micrófono) y **omnidireccional** o 360°.

**Barra de sonido:** que se alimente por **USB** (no con fuente a la pared) y que tenga entrada de **3,5 mm**. Fijate el largo: entre 30 y 40 cm queda bien debajo de una pantalla de 7"; una de 60 cm la desborda.

**microSD:** que la foto o la descripción muestre el símbolo **A1** o **A2**. Si no lo dice, no lo tiene.

**Pulsador:** **normalmente abierto (NA)**, tipo **hongo**, 22 mm, y si tiene LED, que sea de **12V o 24V** (no 220V).

**Vendedor de Mercado Libre:** reputación verde, y **que esté en Argentina** — muchas publicaciones de estos componentes son envíos internacionales de 30 a 45 días disfrazados.

---

## Fuentes consultadas

- [Mercado Libre Argentina — micrófonos omnidireccionales de conferencia](https://listado.mercadolibre.com.ar/microfono-omnidireccional-conferencia)
- [Mercado Libre Argentina — pantallas 7" para Raspberry Pi](https://listado.mercadolibre.com.ar/pantalla-7-pulgadas-raspberry-pi)
- [Mercado Libre Argentina — Pantalla Táctil LCD Waveshare 7" 1024×600](https://articulo.mercadolibre.com.ar/MLA-1467745223-pantalla-tactil-lcd-waveshare-raspberry-pi-7-pulgadas-1024x6-_JM)
- [B&P Electrónica — Pantalla 7" táctil 1024×600](https://www.electronicabyp.com.ar/producto/pantalla-5-tactil-raspberry-pi/)
- [Waveshare — 7inch HDMI LCD (H) with case, documentación oficial](https://www.waveshare.com/wiki/7inch_HDMI_LCD_(H)_(with_case))
- [Mercado Libre Argentina — pulsadores luminosos 22 mm](https://listado.mercadolibre.com.ar/pulsador-luminoso-22mm)
- [Todomicro — Pantalla táctil capacitiva 7" 1024×600 HDMI](https://www.todomicro.com.ar/841-pantalla-tactil-raspberry-pi-lcd-touch-7-1024-x-600-hdmi.html)
- [Mercado Libre Argentina — barras de sonido USB para PC](https://listado.mercadolibre.com.ar/barra-sonido-pc-usb)
- [Mercado Libre Argentina — Genius SoundBar 100 USB + 3.5 mm](https://www.mercadolibre.com.ar/parlante-barra-sonido-genius-soundbar-100-usb-35mm-pc-gamer-computadora-notebook/p/MLA19480741)
- [Mercado Libre Argentina — monitores 7" HDMI sin táctil](https://listado.mercadolibre.com.ar/monitor-7-pulgadas-hdmi)
- [Mercado Libre Argentina — mini parlantes 3W](https://listado.mercadolibre.com.ar/mini-parlante-3w)
- [Mercado Libre Argentina — amplificadores de audio para Raspberry](https://listado.mercadolibre.com.ar/amplificador-audio-raspberry)
- [InnoMakeBright Argentina — ReSpeaker 2-Mics Pi HAT V2.0 (sin stock)](https://www.innomakebright.com.ar/productos/respeaker-2-mics-pi-hat-v2-0-para-procesamiento-de-audio-1lhaa/)
- [GitHub — seeed-voicecard, fallos con kernel 6.x](https://github.com/respeaker/seeed-voicecard/issues/339)
- [Foro Seeed Studio — problemas de dtoverlay del 2-Mic HAT](https://forum.seeedstudio.com/t/2-mic-hat-kernal-dtoverlay-problems/285036)
- [Foro Raspberry Pi — soporte de Seeed sobre compatibilidad de kernels](https://forums.raspberrypi.com/viewtopic.php?t=390964)
- [Adafruit — SmartiPi Touch (descatalogado, solo pantalla oficial)](https://www.adafruit.com/product/3187)
- [Pimoroni — ReSpeaker 2-Mics pHAT](https://shop.pimoroni.com/products/respeaker-2-mics-phat)
