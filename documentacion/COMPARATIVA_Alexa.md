# JARVIS frente a Alexa — análisis competitivo

**Versión:** 1.0
**Fecha:** 29 de octubre de 2026
**Objetivo:** saber exactamente contra qué competimos, qué hay que igualar, dónde podemos ser mejores y dónde conviene no intentarlo.

---

## 1. Contra qué competimos, exactamente

### 1.1 Alexa+ — el asistente

Alexa+ es la versión con inteligencia artificial generativa del asistente de Amazon. Datos verificados:

- **Disponible para todos los clientes de Estados Unidos desde el 4 de febrero de 2026.** Gratis para miembros de Prime; unos 19,99 USD mensuales para el resto. Hay versión web y de aplicación de uso libre con limitaciones.
- **Capacidades agénticas:** reserva mesas en restaurantes, pide autos y comida a través de socios —OpenTable, Uber, Grubhub, Ticketmaster— desde una tienda dentro de la app.
- **Fiabilidad:** acá está el dato interesante. Las reseñas reportan problemas concretos. En una prueba de Consumer Reports, **una reserva de Uber salió con la dirección de origen y la de destino equivocadas**. Otra reseña concluye que «sufre de los mismos problemas de consistencia que aquejan a los sistemas de IA, y hay que revisar su trabajo».
- **Alcance:** está descrito como un asistente doméstico, no un agente de trabajo.

### 1.2 Echo Show 11 — el hardware

El modelo de 2025, que es el tope de la línea de pantallas:

| | Echo Show 11 | Nuestro prototipo (opción pantalla 7") |
|---|---|---|
| Pantalla | 10,95" · 1920×1200 | 7" · 1024×600 |
| Procesador | AZ3 Pro con acelerador de IA | Raspberry Pi 3 / Snapdragon 870 |
| Cámara | 13 MP con encuadre automático | No, por ahora |
| Hub domótico | Matter, Zigbee y Thread Border Router | No |
| Precio | ~180–220 USD | ~113.000 ARS en componentes, o reutilización |

**Lo que las reseñas critican:** «la interfaz necesita trabajo» y «rendimiento inconsistente de la pantalla táctil». Además, el audio es idéntico al del modelo de 8 pulgadas —pagás más solo por pantalla— y **la cámara no tiene tapa física deslizante**, algo que varios reseñadores señalan que van a extrañar.

Eso último importa: **es una crítica de privacidad en el producto líder del mercado.** Es exactamente el terreno donde podemos ganar.

---

## 2. Comparación funcional

Leyenda: 🟰 lo igualamos · ✅ somos mejores · ❌ no lo alcanzamos

| Función | Alexa+ | JARVIS | |
|---|---|---|---|
| Reconocimiento de voz | Excelente, muy pulido | Whisper en el servidor | 🟰 |
| Palabra de activación robusta con música sonando | Sí, chip dedicado | Detección local, a medir | 🟰 |
| Conversación natural | Muy buena | DeepSeek o modelo local | 🟰 |
| Listas de compras | Sí | Sí, con cantidades y unidades | 🟰 |
| Agenda y recordatorios | Sí | Sí | 🟰 |
| Clima | Sí | Sí | 🟰 |
| Música bajo demanda | **Solo con suscripción paga** | **YouTube: gratis** | ✅ |
| Música sin suscripción | Degrada a «radio de…» sin avisar que no es lo pedido | Dice la verdad y ofrece alternativa | ✅ |
| Bluetooth como parlante | Sí | Sí, con metadatos y control en pantalla | 🟰 |
| Control de luces y aspiradora | Sí | Sí, vía Tuya | 🟰 |
| Hub Matter / Zigbee / Thread | **Sí, integrado** | No | ❌ |
| Llamadas y Drop-In entre dispositivos | Sí | No está en el alcance | ❌ |
| Catálogo de miles de «skills» | Sí | No | ❌ |
| Reservas, pedidos de comida, autos | Sí, con errores reportados | No | ❌ |
| Compras en Amazon | Sí | No | ❌ |
| Calidad de audio | Buena, parlantes dedicados | Depende del hardware elegido | ❌ |
| Reconocimiento de personas (Visual ID) | Sí, con cámara | Planeado para la última fase | ❌ |
| **Emergencias con escalamiento y confirmación** | **No existe** | **Módulo central del proyecto** | ✅ |
| **Aislamiento real entre hogares** | Perfiles, pero mismo ecosistema | Estanco por diseño | ✅ |
| **Honestidad sobre lo que hizo** | Reporta éxito con errores | Verifica antes de confirmar | ✅ |
| **Privacidad del audio** | Se procesa en la nube de Amazon | Wake word local, audio no se guarda | ✅ |
| **Funciona sin la nube del fabricante** | No. Sin Amazon, es un ladrillo | Servidor propio | ✅ |
| **Sin publicidad ni venta cruzada** | Promociona productos de Amazon | Nada | ✅ |
| **Personalizable** | Lo que Amazon permita | Todo | ✅ |
| **Interfaz propia** | Criticada en las reseñas | Diseñada a medida | ✅ |

---

## 3. Lo que hay que igualar

Estas son las capacidades de Alexa que un usuario da por sentadas. Si no están, el producto se siente peor aunque tenga cosas mejores. Ya están todas en el roadmap:

1. **Entender a la primera, con ruido y a distancia.** Es la vara más alta. Alexa lo hace muy bien y es a lo que la gente está acostumbrada. Fase 4.
2. **Responder rápido.** Más de tres segundos y se siente roto. Objetivos de latencia en la especificación.
3. **Arrancar sin configuración visible.** Se enchufa y anda.
4. **Recuperarse sola.** Si se cae el Wi-Fi, vuelve sin que nadie toque nada.
5. **Timers y alarmas.** Es de lo más usado de Alexa y es trivial de implementar. **Hay que agregarlo explícitamente al alcance.**
6. **Preguntas generales.** «¿Cuánto mide el Aconcagua?». Lo cubre el modelo.
7. **Conversión de unidades y cálculos.** Muy usado en la cocina. Ruta determinista, sin modelo.
8. **Multi-turno.** Que se pueda seguir hablando sin repetir «Jarvis» cada vez.

---

## 4. Dónde lo superamos — los diferenciadores reales

### 4.1 Emergencias con verificación

**Alexa no tiene nada equivalente.** Tiene rutinas y puede llamar a un contacto, pero no hay escalamiento, ni confirmación de recepción, ni registro de intentos, ni distinción entre «enviado» y «entregado».

Para una persona mayor que vive sola, **esto solo ya justifica el proyecto entero**.

### 4.2 Honestidad verificable

Es nuestra ventaja filosófica, y tiene evidencia concreta a favor: Alexa+ reserva un Uber con las direcciones cambiadas y lo reporta como éxito. Y sin suscripción de música, anuncia «reproduciendo radio de X» como si fuera lo que pediste.

**JARVIS verifica contra la base de datos o contra el dispositivo real antes de confirmar.** Si la luz no respondió, lo dice. Si no encontró la canción, lo dice y ofrece otra cosa. Nunca inventa un éxito.

### 4.3 Privacidad que se puede auditar

- La palabra de activación se detecta **en el dispositivo**; sin activación no sale audio de la casa.
- El audio **no se guarda** una vez transcrito.
- Los datos están en **un servidor propio**, no en la nube de un tercero que los usa para otra cosa.
- No hay cámara en el prototipo. Cuando la haya, con consentimiento y control explícitos — y con la tapa física que el Echo Show 11 no tiene.

### 4.4 Aislamiento entre hogares

Alexa tiene perfiles de voz, pero todo vive en el mismo ecosistema de Amazon. **Nuestro aislamiento es estructural**: lo que JARVIS aprende en una casa no puede alcanzar a otra, ni siquiera por accidente de programación, porque la base de datos lo rechaza.

Para el caso de uso —tu casa y la de tu mamá, con la posibilidad de escalar a cinco o seis— es una diferencia de fondo.

### 4.5 Sin publicidad y sin dueño

Un Echo promociona productos de Amazon y deja de funcionar si Amazon apaga el servicio. JARVIS no vende nada y **el servicio es tuyo**.

### 4.6 La interfaz

Las reseñas del producto líder dicen que su interfaz «necesita trabajo». Es el punto más fácil de superar, y es donde ya tenemos ventaja: un diseño pensado para una sola cosa en vez de una plataforma genérica con widgets de todo.

---

## 5. Lo que conviene agregar para superarlo claramente

Funciones que Alexa no tiene o hace mal, y que tienen sentido en este proyecto:

| Idea | Por qué | Costo |
|---|---|---|
| **Registro consultable de lo que hizo** | «¿Qué hiciste hoy?» con la lista real de acciones. Alexa no ofrece nada así. | Bajo, el registro ya existe |
| **Modo invitado / no escuchar** | Un botón que corta el micrófono con estado visible. | Bajo |
| **Explicar por qué falló** | En vez de «no pude hacerlo», decir qué pasó. | Bajo |
| **Memoria explícita y editable** | Ver y borrar lo que el asistente aprendió de uno. Alexa es una caja negra. | Medio |
| **Rutinas por voz en lenguaje natural** | «Cuando diga buenas noches, apagá las luces.» | Medio |
| **Panel de gastos de IA** | Cuánto costó el mes. Nadie lo ofrece. | Bajo |
| **Modo acompañamiento** | Si no detecta actividad en X horas en el hogar de una persona sola, pregunta y puede avisar. **Nada en el mercado doméstico hace esto.** | Medio-alto |
| **Pedir y confirmar medicación** | Con registro de confirmación, sin afirmar que se tomó. | Medio |

**El «modo acompañamiento» merece atención.** Es el complemento natural del botón de emergencia: cubre el caso en que la persona **no puede** pedir ayuda. Se puede empezar sin cámara, solo con señales de uso (interacciones, movimiento detectado por el micrófono, luces encendidas). Es la función que convierte esto de «un parlante mejor» a «algo que no se puede comprar».

---

## 6. Lo que NO vamos a igualar, y está bien

Decirlo explícitamente evita frustración:

- **Hub Matter / Zigbee / Thread.** Requiere radios específicas. Si algún día hace falta, se agrega con hardware dedicado.
- **Miles de skills.** No es el objetivo. Nosotros hacemos bien diez cosas.
- **Reservas y pedidos con socios comerciales.** Son acuerdos de Amazon. Y según las reseñas, funcionan a medias.
- **Compras.** No.
- **Llamadas y Drop-In.** Fuera del alcance inicial.
- **Calidad de audio de un Echo.** Tienen parlantes diseñados a medida. Nosotros tenemos lo que se consiga.
- **Pulido general.** Amazon tiene miles de personas. Nosotros, una. **Por eso hacemos menos cosas, mejor.**

---

## 7. El posicionamiento

JARVIS no es un clon de Alexa más barato. Es otra cosa:

> **Un asistente doméstico que prioriza cuidar a quien vive solo, que no miente sobre lo que hizo, que no manda los datos de tu casa a ninguna empresa, y que hace bien las diez cosas que se usan todos los días.**

Alexa gana en amplitud: más integraciones, más socios, más pulido. **Nosotros ganamos en lo que importa cuando alguien se cae en el baño y no se puede levantar.**

---

## Fuentes

- [Amazon rolls out Alexa+ to all U.S. customers — GeekWire](https://www.geekwire.com/2026/amazon-rolls-out-alexa-to-all-u-s-customers-making-its-ai-assistant-free-for-prime-members/)
- [Alexa+ is now available to everyone in the US — TechCrunch](https://techcrunch.com/2026/02/04/alexa-amazons-ai-assistant-is-now-available-to-everyone-in-the-u-s/)
- [Alexa+ review — Consumer Reports](https://www.consumerreports.org/electronics/digital-assistants/amazon-alexa-plus-ai-assistant-review-a1667486499/)
- [Can Alexa+ deliver on its agentic AI promises — Cybernews](https://cybernews.com/ai-news/alexa-plus-amazon-ai-assistant-subscription/)
- [Amazon Echo Show 11 review — Trusted Reviews](https://www.trustedreviews.com/reviews/amazon-echo-show-11)
- [Echo Show 11 (2025) review — Expert Reviews](https://www.expertreviews.co.uk/technology/headphones-audio/amazon-echo-show-11-review)
- [Echo Show 8 y 11 oficiales — PhoneArena](https://www.phonearena.com/news/amazon-echo-show-8-echo-show-11-official-features-prices-release-dates_id174552)
