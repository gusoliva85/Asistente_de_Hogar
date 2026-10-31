# JARVIS — Qué comprar en AliExpress

**31 de octubre de 2026.** Modelos concretos para buscar, qué descalifica a cada uno, y qué preguntar antes de pagar.

**Prioridad acordada:** pantalla, parlantes, carcasa y micrófono. **El pulsador de emergencia y el UPS quedan suspendidos.**

> Tipo de cambio: **$1.550 por dólar**. Importando se paga **solo IVA (21 %)** sobre el precio del producto, hasta USD 400 por envío y 5 envíos al año (Decreto 604/2026). El arancel del 50 % que aparece en los blogs viejos **ya no existe**.

---

## 1. La pantalla — lo único que no podemos errar

Buscá **estos nombres exactos** en AliExpress. Los cuatro son 7", 1024×600, IPS, táctil capacitivo por USB y video por HDMI.

| Buscar | Parlantes | Precio ref. | Veredicto |
|---|---|---|---|
| **WIMAXIT M728** | **Sí**, traseros dobles | ~USD 55-70 | ⭐ **La primera opción.** Rueda física para volumen y brillo, vidrio templado, 5 puntos táctiles |
| **Hosyond 7 inch 1024x600** | **Sí** + jack | ~USD 45-53 | ⭐ **La más barata que sirve.** Reseñas confirman **audio por HDMI** |
| **52Pi 7 inch capacitive IPS 1024x600 with speakers** | **Sí** | ~USD 70 | Buena. Es la única que **nombra al Pi 3B** en su propia ficha |
| **Elecrow RC070P** | Sí | USD 51,50 | Sirve, pero **un solo punto táctil en Raspberry** (para nosotros alcanza) |
| **Waveshare 7inch HDMI LCD (H)** | **NO** | ~USD 60 | Solo si las otras fallan. **Sin parlantes**, pero su jack de 3,5 mm sí saca el audio del HDMI |

**Qué descalifica una pantalla — si pasa cualquiera de estas, no la compres:**

1. **No dice 1024×600.** Muchas de 7" son 800×480. Con esa resolución hay que rehacer el diseño entero.
2. **Menciona lápiz táctil.** Es resistiva: hay que apretar con la uña. Inservible para tu mamá.
3. **Dice solo DSI y no HDMI.** El cable plano DSI es otra historia y no está probado acá.
4. **No dice IPS.** Sin IPS, mirar la pantalla desde un costado la deja negra.

**Qué preguntarle al vendedor antes de pagar:** *«¿Los parlantes reciben el audio por el cable HDMI, o hay que conectar un cable de 3,5 mm aparte?»* Si es por HDMI, **te ahorrás el adaptador USB de audio** y el zumbido de la Pi 3 desaparece de raíz.

### Tres detalles del Pi 3 que las fichas no aclaran

**El HDMI del Pi 3 es grande, no micro.** Casi todas estas pantallas se venden apuntando al Pi 4 y 5, que usan micro-HDMI, así que vienen con adaptador micro. **Vos necesitás un cable HDMI común macho-macho.** Si el kit no lo trae, agregalo al pedido.

**No alimentes la pantalla desde el USB de la Pi.** Estas pantallas se alimentan por USB y tiran entre 0,5 y 1 A. El Pi 3 entero no puede dar más de 1,2 A por sus cuatro puertos. Si la colgás de ahí, se reinicia sola a cualquier hora. **Enchufá la pantalla a su propio cargador de 5 V.**

**Que necesite forzar la resolución no es un problema.** Algunas reseñas se quejan de eso. **Nosotros ya la forzamos** desde `cmdline.txt` por el driver KMS, así que para este proyecto es indiferente.

---

## 2. Parlantes — esperá antes de comprar

**No compres la barra de sonido todavía.** Si la pantalla trae parlantes, puede que alcancen y te ahorres $24.000 a $39.000.

**Pero te aviso de entrada que probablemente no alcancen.** Los parlantes traseros de estos monitores son de 1 o 2 W. Sirven para una voz en una habitación silenciosa. **Para tu mamá, que puede no escuchar bien, y para la música de la Fase 8, van a quedar cortos.**

**Qué hacer:** comprá la pantalla con parlantes, probala, y **recién ahí** decidís si hace falta la barra. Si hace falta, se compra acá: la Genius SoundBar 100 está en [HARDWARE_Opciones_y_Compras.md](HARDWARE_Opciones_y_Compras.md). No tiene sentido importar una barra de sonido antes de saber si sobra.

---

## 3. Carcasa — probablemente no haga falta

Las cinco pantallas de arriba **traen soporte y agujeros para atornillar la Raspberry atrás**. Eso ya es la carcasa: un solo objeto parado sobre la mesa, con la Pi escondida detrás.

**Verificá que la ficha diga** *stand*, *bracket* o *holder*, y que mencione tornillos o separadores. Si no lo dice, buscá aparte **«acrylic case for 7 inch 1024x600 HDMI LCD»**, que son unos $8.000.

---

## 4. Micrófono — acá sí conviene gastar

Es el componente que más define si JARVIS se siente bien o mal. Tiene que captar **desde tres metros, con ruido de fondo**.

| Buscar | Precio ref. | Veredicto |
|---|---|---|
| **ReSpeaker USB Mic Array** (o **XVF3800**) | USD 65-75 | ⭐ **Lo que hay que comprar.** 4 micrófonos, **cancelación de eco y formación de haz por hardware**, 360°, hasta 5 m |
| Micrófono USB de conferencia 360° genérico | USD 15-25 | Aceptable. Capta a 3 m pero **sin cancelación de eco** |
| Mini micrófono USB tipo pendrive | USD 3-5 | **No.** A 3 m transcribe mal |

**Por qué el ReSpeaker vale los USD 70, y es la única compra de la lista donde digo que gastes más:**

La **cancelación de eco por hardware** es lo que permite **interrumpirlo mientras habla**. Sin ella hay que silenciar el micrófono cada vez que JARVIS responde, y entonces no podés cortarlo. Para tu mamá esa diferencia es grande: si el aparato se puso a hablar y ella necesita algo ya, tiene que poder cortarlo con la voz.

**Ojo con la versión.** Buscá **«ReSpeaker USB Mic Array»** —la placa redonda con cuatro micrófonos y carcasa de aluminio—, **no** el *ReSpeaker 2-Mics Pi HAT*, que es otra cosa y que ya descartamos: su driver se rompe con los kernels actuales.

---

## 5. El pedido, armado

**Todo en un solo pedido y, si se puede, de un solo vendedor.** Productos de vendedores distintos viajan en paquetes distintos, y **cada paquete gasta uno de tus cinco envíos del año**.

| Qué | Cuánto |
|---|---|
| Pantalla con parlantes | ~USD 60 |
| Micrófono ReSpeaker | ~USD 70 |
| Cable HDMI macho-macho | ~USD 3 |
| **Subtotal** | **~USD 133** (~$206.000) |
| IVA 21 % | ~$43.000 |
| **Total puesto en casa** | **~$250.000** |

Entra holgado en la franquicia de USD 400.

**Y consideralo seriamente: comprá dos juegos.** La Fase 10 duplica todo para la casa de tu mamá. Dos pantallas y dos micrófonos son USD 266: **siguen entrando en un solo envío y en una sola franquicia.** Comprarlo después cuesta otro flete, otra franquicia y otras seis semanas.

**Comprá acá, no importes:**

- **El disipador**, hoy. La Pi está a 81 °C y esperar seis semanas no tiene sentido.
- **El cargador de 5 V para la pantalla**, por lo mismo y porque es barato.

---

## 6. Si querés que lo confirme

Pasame **el título completo de la publicación** y la lista de especificaciones, y te digo si sirve. Las cuatro cosas que voy a mirar son: que diga 1024×600, que diga IPS, que diga capacitivo (y no lápiz), y qué dice sobre el audio.

**No pude abrir los siete links que pasaste**: AliExpress bloquea la lectura automática de las fichas en sus tres dominios y los códigos no están indexados en ningún buscador. Por eso esta lista está armada con modelos que sí pude verificar en fichas de fabricantes y distribuidores.
