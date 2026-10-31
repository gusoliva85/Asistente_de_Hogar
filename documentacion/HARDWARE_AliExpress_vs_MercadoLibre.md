# JARVIS — Comprar afuera o comprar acá

**Versión:** 1.0
**Fecha:** 31 de octubre de 2026
**Complementa a:** [HARDWARE_Opciones_y_Compras.md](HARDWARE_Opciones_y_Compras.md), que es el documento de modelos concretos. Este responde una pregunta distinta: **de dónde conviene traerlos.**

> **Tipo de cambio usado en todas las cuentas: $1.550 por dólar**, que es donde cerró el oficial en octubre de 2026 según [dolarhistórico](https://dolarhistorico.com/cotizacion-dolar-oficial/mes/octubre-2026) e [indicadores.ar](https://indicadores.ar/cotizacion-dolar/2026-10). Si cuando leas esto el dólar está en otro lado, las conclusiones cualitativas siguen valiendo pero los números no.

---

## 0. Lo que pude verificar y lo que no

Esto va primero porque cambia cuánto confiar en el resto.

**No pude leer los siete links que pasaste.** AliExpress bloquea la lectura automática de sus fichas: devuelve el menú del sitio y nada más, en los tres dominios que probé (`es.`, `www.` y `m.`). Y los códigos de producto no están indexados en ningún buscador. **Así que no sé qué son esos siete productos**, más allá de lo que se puede deducir del precio que viaja dentro de la propia dirección.

Lo que sí pude verificar: el régimen de importación vigente, los tiempos reales de entrega, y que existe una categoría de producto que no teníamos en el radar y que cambia la compra. De eso va el resto.

---

## 1. Cómo funciona importar hoy

El régimen cambió en julio de 2026 y es **más favorable de lo que era**. Conviene entenderlo porque define toda la cuenta.

El **Decreto 604/2026**, en vigor desde el 17 de julio de 2026, y la **RG ARCA 5884/2026** del 30 de julio unificaron el correo y el courier privado, que antes tenían reglas distintas. Hoy, para envíos sin fin comercial:

| Regla | Valor |
|---|---|
| Franquicia por envío | **USD 400 FOB** |
| Envíos por año y por persona | **5** |
| Dentro de la franquicia se paga | **Solo IVA (21 %)** |
| Dentro de la franquicia NO se paga | Derechos de importación ni tasa de estadística |
| Tope por envío | **USD 3.000** |
| Sobre el excedente de USD 400 | IVA + aranceles según mercadería + tasa de estadística |

Fuentes: [Derecho en Zapatillas](https://www.derechoenzapatillas.com/2026/envios-postales-franquicia-400-dolares-correo-courier/), [Comprar en el Exterior](https://comprarenelexterior.com.ar/guias/aliexpress-en-argentina/), [nacho.com.ar](https://nacho.com.ar/nuevo-regimen-puerta-a-puerta/).

**FOB significa sin el flete ni el seguro**: el IVA se calcula sobre el precio del producto, no sobre lo que pagaste con envío incluido.

**El viejo arancel plano del 50 % sobre lo que pasaba de USD 50 ya no existe.** Si leíste eso en algún blog, es de 2023 y te va a hacer descartar la compra por un impuesto que no se cobra más.

> **Dos cosas que no pude cerrar y que conviene que confirmes en ARCA antes de pagar.** Primero, **la percepción del 30 % a cuenta de Ganancias**: la mayoría de las fuentes dice que se eliminó para compras con tarjeta en enero de 2026, pero hay guías recientes que la siguen mencionando bajo la RG 5617. Segundo, las fuentes no coinciden en si la tasa de estadística está o no exenta dentro de la franquicia. Ninguna de las dos cambia la recomendación de este documento, pero sí mueven el total entre un 0 % y un 30 %.

---

## 2. La cuenta real: cuánto sale puesto en casa

El error típico es comparar el precio de AliExpress contra el de Mercado Libre. No son comparables: uno es el precio del producto y el otro es el precio puesto en tu casa, con garantía y sin esperar.

**La fórmula honesta:**

```
Costo real = precio del producto
           + envío
           + 21 % de IVA sobre el precio del producto
           + (riesgo de que no sirva × precio del producto)
           + (semanas de espera × lo que valga tu tiempo)
```

Los dos últimos términos no tienen un número, pero existen, y son los que deciden casi todas las comparaciones de este proyecto.

**Un ejemplo con la pantalla**, que es la compra grande:

| | Acá (Todomicro) | AliExpress |
|---|---|---|
| Panel 7" capacitivo 1024×600 | $91.385 (web) / $82.329 (transferencia) | ~$35.000 |
| Carcasa | $21.693 | a veces incluida |
| Envío | incluido | ~$10.000 |
| IVA 21 % | ya incluido en el precio | ~$7.350 |
| **Total** | **~$113.000** | **~$52.000** |
| Espera | días | **3 a 8 semanas** |
| Garantía | local, reclamable | disputa en la plataforma |

**La diferencia es de unos $60.000, o sea más de la mitad.** Eso es demasiado para ignorarlo, y por eso tu intuición era correcta.

**Sobre los tiempos de entrega, las fuentes no coinciden** y conviene saberlo antes de planificar: [Wise](https://wise.com/ar/blog/comprar-en-aliexpress-desde-argentina) y La Nación hablan de 40 a 60 días para el envío estándar, mientras que [alidatos](https://alidatos.com/cuanto-tarda-en-llegar-aliexpress/) da 15 a 40 días, y 3 a 12 para los envíos *Choice*. Hay un [relato de julio de 2026](https://www.sirchandler.com.ar/2026/07/comprar-en-aliexpress-cuanto-tardo-en-llegar-a-argentina/) de un pedido que llegó en 13 días sin costos extra. **Planificá con 8 semanas y alegrate si llega antes.**

---

## 3. Cuándo conviene cada uno

Después de hacer la cuenta para cada componente del proyecto, la regla no es «AliExpress siempre» ni «Mercado Libre siempre». Es más fina, y depende de **tres preguntas**.

### Pregunta 1: ¿falla de entrada o falla a los ocho meses?

Esta es la que más manda, y es la que casi nadie se hace.

Hay componentes que **o andan o no andan**, y te enterás el día que llegan: una pantalla, un micrófono, un cable. Si llega fallado, lo ves en diez minutos y abrís la disputa. El riesgo de AliExpress sobre estos es bajo, porque la plataforma retiene el pago hasta que confirmás la recepción.

Y hay componentes que **fallan con el tiempo**: una fuente de alimentación, una batería, un UPS. Esos pueden andar perfecto tres meses y morirse en el cuarto. Ahí la garantía local no es un lujo: es la diferencia entre cambiarlo en una semana y quedarte sin aparato.

**En este proyecto eso pesa el doble**, porque la mitad del hardware va a vivir en la casa de tu mamá, donde **nadie va a estar mirando si algo dejó de andar**. Una fuente barata que se degrada hace que la Raspberry se reinicie sola a cualquier hora, y eso no se diagnostica por teléfono.

> **Regla: lo que se rompe de entrada, de afuera. Lo que se rompe con el tiempo, acá.**

### Pregunta 2: ¿cuándo lo necesitás de verdad?

Acá está la ventaja que este proyecto tiene y que casi ningún comprador tiene: **el roadmap ya dice cuándo hace falta cada cosa.**

| Componente | Fase | ¿Cuándo hace falta? | Conclusión |
|---|---|---|---|
| Disipador | **ya** | La Pi está a 81 °C hoy | **Acá.** Esperar 6 semanas a 81 °C no tiene sentido |
| Micrófono, barra de sonido | 4 | meses | Afuera, hay tiempo |
| Pantalla, carcasa | 6 | muchos meses | **Afuera, sin dudarlo** |
| Pulsador de emergencia, UPS | 7 | más lejos todavía | **Acá** — ver pregunta 1 |
| Todo duplicado | 10 | el año que viene | Afuera, y planificado |

**Las seis semanas de espera son gratis si el componente no se usa hasta dentro de seis meses.** Ese es el argumento central a favor de importar para este proyecto, y no aplica a quien compra para usar el martes.

### Pregunta 3: ¿cuántos envíos te quedan?

**Son cinco por año y no se acumulan.** Esto cambia cómo hay que comprar, y es el detalle que más plata hace perder.

**Un pedido con productos de vendedores distintos viaja en paquetes distintos, y cada paquete es un envío.** Comprar el micrófono a un vendedor, la pantalla a otro y los cables a un tercero gasta **tres** de tus cinco franquicias para traer menos de USD 400 en total. Es el peor uso posible del régimen.

**Qué hacer en cambio:**

- Agrupar en **un solo vendedor** todo lo que se pueda, aunque alguno salga un poco más caro.
- Aprovechar que la franquicia es de USD 400: con USD 150 de compra estás usando un envío entero para menos de la mitad del cupo.
- **Comprar las dos casas juntas.** La Fase 10 duplica todo. Dos pantallas en un envío entran holgadas en los USD 400, pagan un flete y gastan una franquicia en lugar de dos. Y te deja la Fase 10 resuelta de hardware.

---

## 4. El hallazgo: la pantalla que reemplaza tres compras

Esto es lo más valioso que salió de la investigación, y responde directo a lo que preguntaste sobre «algo para tener todo junto».

**Existe una categoría de producto que no teníamos en el radar:** monitores de 7 pulgadas, 1024×600, IPS, táctiles capacitivos, **con parlantes incorporados**, soporte, y agujeros en la parte de atrás para atornillar la Raspberry. O sea: pantalla, carcasa y parlantes en un solo objeto.

Modelos concretos de esa categoría:

| Modelo | Precio de referencia | Dónde |
|---|---|---|
| **Elecrow RC070P** | USD 51,50 (sin stock en Elecrow) | [Elecrow](https://www.elecrow.com/rc070p-7-inch-1024x600-raspberry-pi-monitor-touchscreen-capacitive-ips-display-with-built-in-speaker-stand.html) |
| **52Pi 7" con parlantes** | 55,39 libras en oferta | [RobotShop](https://uk.robotshop.com/products/52pi-7-inch-ips-touch-screen-1024x600-w-speakers-raspberry-pi-windows-pc) |
| **Hosyond 7"** | USD 45 a 53 | marketplaces |
| **LESOWN 7"** | USD 84,40 | Walmart |

El Elecrow trae, según su propia ficha: 1024×600 IPS, táctil capacitivo por USB, video por HDMI, parlantes incorporados, menú en pantalla con control de brillo y **volumen**, soporte, y los cuatro tornillos y separadores para montar la Pi atrás. Mide 179 × 125 × 23 mm y pesa 380 g.

### Por qué esto importa más de lo que parece

**Reemplaza tres compras del plan por una.** Hoy el plan son panel ($91.385) + carcasa ($21.693) + barra de sonido ($24.000 a $39.000) + adaptador USB de audio ($5.000) = **entre $142.000 y $157.000**. Una de estas unidades, a USD 50 más envío e IVA, queda en el orden de **$105.000 puestos en casa**. Y además:

**Resuelve el problema del zumbido sin el adaptador.** El documento de hardware advierte que la salida analógica de 3,5 mm de la Pi 3 zumba en los silencios, y por eso incluía un adaptador USB de audio de $5.000. **Si estos monitores reciben el audio por el mismo cable HDMI, el problema desaparece de raíz**: el audio va digital hasta la pantalla y nunca pasa por el conversor malo de la Pi.

**Y cumple el criterio que vos pusiste primero**, el de que no parezca una computadora desarmada: es un solo objeto, con la Raspberry atornillada atrás y los parlantes adentro. Hoy el plan son cuatro objetos y tres cables.

### Lo que hay que verificar antes de comprar una

No la recomiendo a ciegas. Son cuatro cosas, y las cuatro se preguntan al vendedor antes de pagar:

1. **¿El audio entra por HDMI o por un conector de 3,5 mm?** Es la pregunta más importante y la ficha de Elecrow **no lo aclara**. Si es por 3,5 mm, volvés a necesitar el adaptador USB y se pierde la mitad de la gracia.
2. **¿Es 1024×600 de verdad?** Nuestro diseño mide exactamente 1024×600. Muchos paneles baratos de 7" son 800×480, y con esa resolución hay que rehacer la maquetación entera.
3. **¿Es capacitivo?** Si la publicación menciona *lápiz táctil*, es resistivo: hay que apretar con la uña y es horrible para una persona mayor. Es la misma trampa por la que ya descartamos una publicación local.
4. **¿Cuántos puntos de contacto reconoce en Raspberry?** La ficha de Elecrow dice cinco puntos en Windows pero **un solo punto en Raspberry Pi**. Para JARVIS **un punto alcanza y sobra** —botones grandes, nada de pellizcar para hacer zoom—, pero mejor saberlo que descubrirlo.

---

## 5. Los siete links que pasaste

No pude abrirlos. Lo único que pude sacar es **el precio que viaja dentro de la propia dirección**, en el parámetro de seguimiento `pdp_npi`:

| # | Código del producto | Precio en el link |
|---|---|---|
| 1 | 1005012319537517 | $95.116 → **$32.169** |
| 2 | 1005006471099177 | $98.342 → **$37.619** |
| 3 | 1005009096258871 | $108.119 → **$41.524** |
| 4 | 1005006398301793 | $63.768 → **$30.827** |
| 5 | 1005006490826608 | $63.301 → **$10.886** |
| 6 | 1005010720997952 | $52.648 → **$29.717** |
| 7 | 1005004229032696 | $38.030 → **$24.732** |

**Tres advertencias sobre esta tabla:**

**El precio tachado no es un precio real.** Que diga «$95.116 → $32.169» no significa que valga $95.116: el precio alto es de vidriera. Lo único que importa es la segunda columna.

**Varios son precios de cliente nuevo.** Las reseñas de esta clase de paneles mencionan que el precio bajo se ofrece solo a cuentas nuevas y que al segundo pedido sube. Si usás la cuenta para la compra chica, podés perder el precio para la compra grande. **Si vas a comprar, empezá por lo caro.**

**Puede que no incluyan el envío.** Hay que mirarlo en el carrito, con la dirección argentina puesta, no en la ficha.

El rango de $24.000 a $41.000 encaja con paneles de 7" **sin** parlantes. Los que sí los traen están más cerca de USD 50, o sea unos $78.000 antes de impuestos. **Si alguno de tus siete los tuviera a ese precio, sería la mejor compra del proyecto** — pero no lo puedo saber sin ver la ficha.

---

## 6. Recomendación

**Importar la pantalla: sí, claramente.** La diferencia es de más de la mitad del precio, el riesgo es de los que se detectan el día que llega, y no hace falta hasta la Fase 6. Es el caso de libro a favor de AliExpress.

**Comprar una unidad con parlantes incorporados en lugar de panel + carcasa + barra.** Un solo objeto, un solo envío, probablemente sin el adaptador de audio, y más cerca de lo que querías estéticamente.

**Comprar las dos casas en el mismo envío.** Dos unidades a USD 50 son USD 100: entran cómodas en la franquicia de USD 400, pagan un flete y gastan una sola de las cinco.

**Comprar acá, igual, estas tres cosas:**

- **El disipador**, porque hace falta hoy y la Pi está a 81 °C.
- **El pulsador de emergencia y el UPS** de la Fase 7. Son los dos únicos componentes de los que depende que una emergencia se avise. Si fallan a los ocho meses en la casa de tu mamá, nadie se entera hasta que hagan falta. Esa es exactamente la clase de riesgo por la que existe la garantía local, y es plata bien gastada.
- **La fuente de alimentación**, por lo mismo: se degrada con el tiempo y su falla se disfraza de otra cosa.

**Lo que falta para cerrar esto:** que me pases el título de los productos, o una captura de las fichas. Con eso puedo decirte cuál de los siete sirve y cuál no, que es lo que pediste y lo único que quedó sin responder.

---

## 7. Tabla resumen

| Componente | Fase | Dónde | Por qué |
|---|---|---|---|
| Disipador | **ya** | **Acá** | Hace falta hoy, a 81 °C |
| Pantalla con parlantes | 6 | **AliExpress** | La mitad de precio, falla de entrada, hay meses |
| Micrófono USB | 4 | AliExpress, en el mismo envío | Mismo razonamiento |
| Barra de sonido | 4 | **Probablemente ninguno** | La reemplazan los parlantes de la pantalla |
| Adaptador USB de audio | 4 | **Probablemente ninguno** | Si el audio entra por HDMI, sobra |
| Fuente de alimentación | 0 | **Acá** | Se degrada con el tiempo |
| Pulsador de emergencia | 7 | **Acá** | De él depende que se avise una emergencia |
| UPS | 7 | **Acá** | Batería: se degrada, y es crítico |
| Todo del segundo hogar | 10 | AliExpress, **en el mismo envío que el primero** | Una franquicia en vez de dos |
