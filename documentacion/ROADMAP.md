# JARVIS — Plan de ejecución

**Versión:** 3.0
**Fecha:** 29 de octubre de 2026
**Documentos de referencia:** `ESPECIFICACION_Tecnica_Funcional.md`, `COMPARATIVA_Alexa.md`, `LIQUID_AI_Evaluacion.md`

**Cambios respecto de la v2.0:** se descartó la idea de usar un teléfono como dispositivo —el equipo disponible no tiene reparación— y se vuelve al plan de **Raspberry Pi 3 más componentes**. Se incorpora el **modelo de lenguaje local** de Liquid AI, las funciones que hacen falta para no quedar por debajo de Alexa, y el **modo acompañamiento**.

---

## Cómo está armado este plan

El proyecto es ambicioso y la forma más común de que un proyecto así muera es construir seis meses a ciegas y recién entonces enchufar todo junto. Así que el plan está ordenado con una sola regla:

> **Al final de cada fase tiene que haber algo que puedas encender, mirar y usar.**

Cada fase tiene tres bloques:

- **🔧 Lo que hacés vos** — compras, cables, flasheo, decisiones.
- **💻 Lo que programo yo** — tareas en orden, cada una con qué implica.
- **✅ Cómo sabemos que terminó** — pruebas concretas, no opiniones.

Las tareas van numeradas (`F2.4` = fase 2, tarea 4).

**Por qué las emergencias van en la Fase 7 y la música en la 8:** las emergencias dependen de que las notificaciones al celular estén probadas (Fase 6), pero van antes que música y domótica porque son el motivo por el que existe el proyecto. La música es comodidad; la emergencia es la razón.

**Las fases 0 a 3 no necesitan ninguna compra más allá de la tarjeta de memoria y la fuente.**

---

## Compras, ordenadas por cuándo hacen falta

> **Modelos concretos, precios y links: [HARDWARE_Opciones_y_Compras.md](HARDWARE_Opciones_y_Compras.md).**

| Cuándo | Qué | Gasto aprox. |
|---|---|---|
| **Ahora (Fase 0)** | microSD 64 GB A1/A2 + fuente 5V 2,5A | ~$27.000 |
| Fase 4 | Micrófono USB de conferencia + barra de sonido + adaptador USB de audio | ~$57.000 |
| Fase 6 | Panel táctil 7" 1024×600 + carcasa acrílica | ~$113.000 |
| Fase 7 | Pulsador de emergencia + caja + UPS | **Suspendido** (31/10/2026, decisión de Gus) |
| Fase 10 | Todo de nuevo para el segundo hogar | ~$211.000 |

---

## Dónde estamos

**Última actualización: 31 de octubre de 2026.**

| Fase | Qué es | Estado |
|---|---|---|
| **0** | Preparación | **Casi terminada** — solo faltan el dominio (F0.e) y las copias de seguridad de Contabo (F0.d), ambas dependen del usuario |
| 1 | La pantalla viva | **Casi terminada** — las cuatro pantallas aprobadas, desplegadas y andando en la Pi. **F1.10 en curso**: el muestreador corriendo desde el 31/10/2026 a las 17:55. Falta la curva de un día y dejarlo en arranque automático |
| 2 | Backend y datos reales | Sin empezar |
| 3 | El celular | Sin empezar |
| 4 | La voz | Sin empezar |
| 5 | La inteligencia | Sin empezar |
| 6 | El mundo exterior | Sin empezar |
| 7 | Emergencias y acompañamiento | Sin empezar |
| 8 | Música | Sin empezar |
| 9 | Dispositivos del hogar | Sin empezar |
| 10 | El segundo hogar | Sin empezar |
| 11 | Más adelante | Sin empezar |

**Lo que está funcionando hoy:** la Raspberry arranca, se conecta al Wi-Fi y se administra por SSH, con la resolución forzada a 1024×600. El VPS corre Ubuntu 24.04 con Docker, acceso solo por llave SSH y cortafuegos activo. Los tres contenedores —Caddy, API y PostgreSQL— están en marcha, y `http://13.140.36.93/health` responde desde internet.

El servidor además aplica parches de seguridad solo, sin reiniciarse por su cuenta, y ningún servicio corre como root.

**Lo próximo:** Fase 1, el frontend en la Raspberry. Antes conviene resolver el dominio, que bloquea el HTTPS y con él el micrófono de la Fase 4.

### Cómo se mantiene esto

> **Una tarea se marca `[x]` únicamente cuando se verificó contra la realidad** — una salida de comando, una respuesta HTTP, algo que se ve en pantalla. Nunca porque se haya escrito el código o porque "debería andar". Es la misma regla que le imponemos a JARVIS: no se confirma lo que no se comprobó.

Cada tarea terminada lleva su fecha al lado. Si una queda a medias, se abre en subtareas y se marca solo la parte hecha, como pasó con F0.5.

---

# Fase 0 — Preparación

**Objetivo:** servidor accesible, Raspberry encendida y repositorio listo.

### 🔧 Lo que hacés vos

- [x] **F0.a — Comprar la microSD.** 64 GB, clase 10, con **A1 o A2** impreso. Si no lo dice, no lo tiene. — *31/10/2026*
- [x] **F0.b — Verificar la fuente.** Tiene que decir **5 V / 2,5 A**. Una fuente floja causa reinicios al azar que parecen errores de software. — *31/10/2026*
- [x] **F0.c — Averiguar la versión de Ubuntu del VPS.** `cat /etc/os-release` por SSH. Pasámelo. — *31/10/2026*
- [ ] **F0.d — Decidir las copias de seguridad de Contabo.** Recomendación: contratarlas antes de que existan datos reales. **Pendiente.**
- [ ] **F0.e — Decidir dominio o IP.** Con dominio el certificado HTTPS sale solo. **Decidido ir sin dominio por ahora: se sirve por HTTP contra `13.140.36.93`.** Queda abierta porque el HTTPS hace falta antes de la Fase 4 — el navegador no da acceso al micrófono sin conexión segura.

### 💻 Lo que programo yo

- [x] **F0.1 — Crear el repositorio.** Estructura de carpetas, `.gitignore` que excluya `.env`, y un README que explique cómo levantar todo desde cero. — *30/10/2026*
- [x] **F0.2 — Escribir `.env.example`.** Todas las variables con sus nombres definitivos y valores vacíos. Es la documentación viva de qué secretos existen. — *30/10/2026*
- [x] **F0.3 — Armar el `docker-compose.yml` base.** Caddy con TLS automático, la API en Python, y PostgreSQL con volumen persistente y reinicio automático. — *30/10/2026*
- [x] **F0.4 — Escribir la guía de instalación de la Raspberry.** Paso a paso, pensada para que la sigas sin que yo esté. — *30/10/2026*
- [x] **F0.5 — Asegurar el servidor.** — *31/10/2026*
  - [x] Clave SSH instalada y acceso por contraseña deshabilitado — *31/10/2026*
  - [x] Cortafuegos `ufw` activo en 22/80/443, el resto denegado — *31/10/2026*
  - [x] Actualizaciones de seguridad automáticas (`unattended-upgrades`, sin reinicio automático) — *31/10/2026*
  - [x] Los servicios corren sin privilegios: la API como `jarvis` (uid 1000), PostgreSQL como `postgres` — *31/10/2026*
  - *Mejora anotada, fuera de F0:* en el anfitrión, `docker compose` se opera como `root`. Un usuario de sistema aparte sería más prolijo, pero pertenecer al grupo `docker` equivale a root igual, y no cambia la exposición desde internet.
- [x] **F0.6 — Publicar una página de prueba.** Para confirmar la cadena entera: DNS, certificado, proxy. — *31/10/2026*

### 🔧 Lo que hacés vos, después de F0.4

- [x] **F0.f — Flashear la tarjeta** con Raspberry Pi Imager, eligiendo **Raspberry Pi OS Lite (64-bit)** y configurando Wi-Fi, usuario y SSH desde el Imager. — *30/10/2026*
- [x] **F0.g — Primer arranque** conectando la Raspberry al televisor por HDMI. — *30/10/2026*
- [x] **F0.h — Forzar la resolución a 1024×600** en `config.txt`. Vas a ver bordes negros en el televisor: **ese rectángulo es tu pantalla futura**. Sin esto, todo se ve bien en la tele y apretado en la pantalla real. — *31/10/2026*
- [x] **F0.i — Confirmar el acceso por SSH** a la Raspberry, sin monitor ni teclado. — *30/10/2026*

### ✅ Cómo sabemos que terminó

Entrás por SSH a la Raspberry y al servidor. `https://tu-dominio` muestra la página de prueba con el candado cerrado. El televisor muestra la consola en un rectángulo de 1024×600.

**Estado al 31/10/2026 — verificado:**

- [x] SSH a la Raspberry (`ssh jarvis_gus@jarvis.local`) y al VPS (`ssh jarvis-vps`, solo por llave).
- [x] La página de prueba se sirve desde internet y `http://13.140.36.93/health` devuelve `200` con `{"estado":"ok"}`.
- [x] El televisor recibe señal de 1024×600 (`/sys/class/drm/card*-HDMI-A-1/modes`). No se ven bordes negros porque el televisor escala la imagen; es cosmético.
- [ ] **HTTPS con candado.** Bloqueado por no tener dominio (F0.e). Es lo único que falta del criterio de cierre.

---

# Fase 1 — La pantalla viva

**Objetivo:** que la Raspberry encienda y muestre el dashboard en pantalla completa con datos inventados. **Valida el riesgo técnico más importante: si el diseño rinde en una Pi 3.**

### 💻 Lo que programo yo

- [x] **F1.1 — Montar el frontend.** React con TypeScript sobre Vite, compilado a estáticos livianos, sin librerías que impongan su estética. — *31/10/2026. Compila: 13 archivos, 385 KB; JS 70 KB comprimido, CSS 2,6 KB. Tipografía empaquetada, solo subconjunto latino.*
- [x] **F1.2 — Implementar los tokens de diseño.** Los temas de `DECISION_Frontend_Temas.md` como variables CSS intercambiables en bloque. Ningún color escrito a mano dentro de un componente. — *31/10/2026. Cambio de tema verificado en pantalla por el usuario. Incluye la capa de refinamiento de la sección 3.4 y el interruptor de rendimiento reducido.*
- [x] **F1.3 — Construir los componentes.** Reloj, clima con el ícono SVG animado, agenda, compras, recordatorio, estado de dispositivos, barra de música, pastillas de estado y botón de emergencia. — *31/10/2026. Once componentes sobre la maqueta, con tokens y sin colores literales.*
- [x] **F1.4 — Armar la pantalla principal (Lavanda).** El mosaico con el panel oscuro, alimentado con datos ficticios que tienen la forma exacta que va a devolver la API. — *31/10/2026. Rejilla de 600 px exactos, con datos ficticios con la forma de la API.*
- [x] **F1.5 — Armar Menta y el selector de tema**, con cambio en caliente. — *31/10/2026. **Menta quedó descartado**: lo reemplaza la variante oscura de Lavanda, adelantada de F10.2, que resuelve mejor el mismo problema. El selector de tema sale de la pantalla; el de claro/oscuro queda en el encabezado.*
- [x] **F1.6 — Implementar los estados vacíos y de error.** Lista vacía, agenda vacía, sin conexión, micrófono ausente, cargando. Una interfaz que solo contempla el caso feliz es inservible en una casa real. — *31/10/2026. Agenda, compras, recordatorio, música, micrófono, clima y dispositivos sin respuesta. Se miran con ?datos=vacio.*
- [x] **F1.7 — Implementar las otras pantallas de la maqueta:** escucha, emergencia y música, por ahora con datos fijos. — *31/10/2026. Tres pantallas completas, con navegación entre ellas. Aprobadas tras tres rondas de ajustes.*
- [x] **F1.8 — Desplegar el frontend** desde Caddy con las cabeceras de caché correctas. — *31/10/2026. Compilado en Docker, servido desde un volumen. Verificado desde internet: 200, index.html sin cache, estaticos inmutables un anio, gzip 256 KB -> 82 KB en el cable.*
- [x] **F1.9 — Configurar el modo kiosco.** Arranque automático a Chromium a pantalla completa, sin cursor ni barras ni diálogos de recuperación. — *31/10/2026. Se eligió `cage` sobre Wayland, sin probar Xorg: no trae barra, ni fondo, ni menús, y cada megabyte cuenta. Funcionando en la Pi. Falta `systemctl enable` para que arranque solo.*
- [ ] **F1.10 — Medir el rendimiento real.** Tiempo hasta pantalla pintada, fluidez, memoria de Chromium, temperatura tras una hora. Números, no impresiones. — *Lo único que falta de la fase, junto con dejar el kiosco en arranque automático.*
- [x] **F1.11 — Aplicar la degradación si hace falta.** Si el efecto vidrio no rinde, color sólido semitransparente y animaciones ambientales apagadas. — *31/10/2026. Hizo falta, y por una razón peor que el rendimiento: `backdrop-filter` tumba el renderizador de Chromium sobre el driver V3D. Se separó en dos interruptores —`?vidrio=solido` apaga solo el desenfoque, `?rendimiento=reducido` apaga además grano y animaciones— y alcanzó con el primero. Las animaciones quedan encendidas.*

### 🔧 Lo que hacés vos

- [x] **F1.a — Mirar la pantalla y opinar.** Es el momento más barato para cambiar cosas. — *31/10/2026. Dos rondas de ajustes aplicadas.*
- [ ] **F1.b — Dejarla encendida un día entero** y contarme si se calienta, se traba o se reinicia.

### ✅ Cómo sabemos que terminó

Enchufás la Raspberry y aparece el dashboard en pantalla completa sin tocar nada. La hora avanza. Se cambia de tema. Arranca en menos de 40 segundos. **Tenemos números medidos.**

---

# Fase 2 — Backend y datos reales

**Objetivo:** que lo que se ve salga de una base de datos real, con el aislamiento entre hogares funcionando desde el primer día.

### 💻 Lo que programo yo

- [ ] **F2.1 — Montar FastAPI.** Estructura por módulos, configuración por entorno, errores con código y mensaje en lenguaje claro —porque algunos llegan a la pantalla— y documentación automática.
- [ ] **F2.2 — Crear el esquema de base de datos** con Alembic. Todas las tablas de datos de usuario llevan `hogar_id`.
- [ ] **F2.3 — Implementar el aislamiento entre hogares.** Dos barreras independientes: la capa de datos inyecta el filtro desde el token autenticado, y PostgreSQL aplica políticas de seguridad a nivel de fila. Si el código se olvida del filtro, la base rechaza la consulta igual.
- [ ] **F2.4 — Escribir las pruebas de aislamiento, antes que la funcionalidad.** Un usuario del hogar A intenta leer, modificar y borrar datos del hogar B, por cada tabla y cada endpoint, y todo falla. **Si esto no está sólido, nada de lo que venga después es confiable.**
- [ ] **F2.5 — Autenticación de usuarios.** Argon2, tokens con expiración, refresco, y cierre de sesión que invalida de verdad.
- [ ] **F2.6 — Vinculación de dispositivos.** La Raspberry recibe un código, se vincula al hogar y obtiene su token. Se guarda hasheado, se muestra una sola vez, y se puede revocar de a uno.
- [ ] **F2.7 — API de listas.** Crear, agregar con cantidad y unidad, editar, marcar comprado, borrar, evitar duplicados obvios, y registrar quién hizo cada cosa.
- [ ] **F2.8 — API de agenda y recordatorios.** Eventos con inicio, fin, día completo, notas y recurrencia; recordatorios con hora y repetición; consultas por rango.
- [ ] **F2.9 — El endpoint `GET /dashboard`.** Todo lo que la pantalla necesita en una sola llamada. La Pi 3 no debería hacer ocho pedidos al arrancar.
- [ ] **F2.10 — Conectar el frontend a la API** y eliminar los datos ficticios, manejando los errores de red con los estados de F1.6.
- [ ] **F2.11 — Copias de seguridad y restauración probada.** Volcado diario, retención de varios días, y **una restauración real ejecutada al menos una vez**. Una copia que nunca se restauró no es una copia.
- [ ] **F2.12 — Registros y salud técnica.** Logs estructurados con rotación y un endpoint con estado de dispositivos, último contacto y errores recientes.

### 🔧 Lo que hacés vos

- [ ] **F2.a — Crear tu usuario y tu hogar** y cargar productos y eventos reales.
- [ ] **F2.b — Usarlo unos días** y decirme qué falta.

### ✅ Cómo sabemos que terminó

Agregás un producto desde el navegador y aparece en la pantalla de la Raspberry. Reiniciás y sigue ahí. Las pruebas de aislamiento pasan. La restauración se probó.

---

# Fase 3 — El celular

**Objetivo:** usar JARVIS desde el teléfono con sincronización instantánea.

### 💻 Lo que programo yo

- [ ] **F3.1 — Adaptar la interfaz a pantalla de celular**, reusando los componentes, con tarjetas apiladas y toques más grandes.
- [ ] **F3.2 — Convertirla en PWA instalable**: manifiesto, íconos, service worker y arranque en pantalla completa.
- [ ] **F3.3 — Pantalla de inicio de sesión** con sesión persistente.
- [ ] **F3.4 — WebSocket para tiempo real**, con reconexión automática.
- [ ] **F3.5 — Compartir listas entre usuarios del mismo hogar**, con permisos explícitos: compartir una lista no da acceso a la agenda.
- [ ] **F3.6 — Indicadores de autoría** donde aporten.

### 🔧 Lo que hacés vos

- [ ] **F3.a — Instalar la PWA** y usarla una semana haciendo las compras.

### ✅ Cómo sabemos que terminó

Agregás algo desde el supermercado y aparece en la pantalla de casa sin refrescar. Y al revés.

---

# Fase 4 — La voz

**Objetivo:** hablarle y que haga caso. **Sin inteligencia artificial todavía**: solo reglas. Es la fase de mayor incertidumbre técnica, por eso se separa de la IA.

### 🔧 Lo que hacés vos, antes de empezar

- [ ] **F4.a — Comprar el micrófono de conferencia, la barra de sonido y el adaptador USB de audio.** Los tres juntos; el adaptador evita el zumbido de la salida analógica de la Pi 3.
- [ ] **F4.b — Conectarlos** y confirmar que el sistema los detecta, con el comando que te paso.

### 💻 Lo que programo yo

- [ ] **F4.1 — Crear el agente local.** Servicio en Python que arranca solo, se reinicia si se cae, y es **independiente del navegador**: el día que haya que sonar una alarma con Chromium colgado, tiene que haber algo vivo.
- [ ] **F4.2 — Captura de audio y detección de fin de frase**, con tope de 15 segundos.
- [ ] **F4.3 — Probar la palabra de activación** y **medir las falsas activaciones durante un día normal con la casa en uso**. Una cada tanto es tolerable; cada diez minutos es inusable.
- [ ] **F4.4 — Montar la transcripción en el servidor** y **medir el tiempo real por frase** con modelos de distinto tamaño, buscando el punto donde la precisión alcanza sin que la latencia moleste.
- [ ] **F4.5 — Probar la síntesis de voz en español** y decidir si alguna voz es aceptable; si no, moverla al servidor.
- [ ] **F4.6 — Implementar las órdenes deterministas.** Agregar productos —varios en una frase, con cantidades—, consultar qué falta, marcar comprado, consultar agenda, crear recordatorio con hora explícita, ajustar volumen y cancelar la última acción. Todo con reglas, sin gastar un token.
- [ ] **F4.7 — Timers y alarmas.** «Poné un timer de diez minutos», «despertame a las siete». **Es de lo más usado de un asistente y Alexa lo hace muy bien**: si no está, el producto se siente incompleto. Con aviso en pantalla, sonido y cancelación por voz.
- [ ] **F4.8 — Conversiones y cálculos.** «¿Cuántos gramos son dos tazas de harina?», «¿cuánto es 15% de 4.500?». Muy usado en la cocina y resoluble con reglas, sin modelo.
- [ ] **F4.9 — Conversación multi-turno.** Poder seguir hablando unos segundos sin repetir «Jarvis» cada vez, con la ventana claramente indicada en pantalla.
- [ ] **F4.10 — Confirmaciones y preguntas de aclaración.** Cuando la fecha o la hora son ambiguas, preguntar en una frase corta en vez de adivinar.
- [ ] **F4.11 — Conectar el estado de escucha a la interfaz.** Que se vea cuándo escucha, cuándo piensa, qué entendió y qué hizo. El usuario nunca debe mirar una pantalla quieta sin saber si lo escucharon.
- [ ] **F4.12 — Manejo de errores hablados.** «No te entendí», «no te escucho, ¿está conectado el micrófono?», «falló al guardar». Siempre honestos.
- [ ] **F4.13 — Medir la precisión en condiciones reales:** español rioplatense, televisor encendido, tres metros, nombres propios locales.

### 🔧 Lo que hacés vos

- [ ] **F4.c — Hablarle normalmente**, no articulando como locutor, y anotar qué no entiende.

### ✅ Cómo sabemos que terminó

Decís «Jarvis, agregá dos kilos de papa, leche y detergente a las compras» desde el otro lado de la habitación, con ruido, y los tres productos aparecen con la cantidad correcta. Lo confirma en voz **después** de guardarlo. Y un timer de diez minutos suena a los diez minutos.

---

# Fase 5 — La inteligencia

**Objetivo:** que entienda lo que las reglas no cubren, **sin costo recurrente y sin que los datos de tu casa salgan del servidor**.

> **Novedad respecto del plan anterior.** Liquid AI publica modelos de pesos abiertos que corren en nuestro propio VPS y saben invocar herramientas. Eso permite tres niveles: reglas → modelo local → DeepSeek solo para lo que ninguno de los dos resuelve. Ver `LIQUID_AI_Evaluacion.md`.

### 🔧 Lo que hacés vos

- [ ] **F5.a — Crear la cuenta de DeepSeek y generar la clave.** **La cargás vos en el servidor; no me la mandes por chat.** Sigue siendo el tercer nivel, aunque se use poco.

### 💻 Lo que programo yo

- [ ] **F5.1 — Adaptador de proveedor de modelo.** Una capa donde el modelo local y DeepSeek son implementaciones intercambiables, para no atarse a ninguno.
- [ ] **F5.2 — Montar LFM2.5 en el VPS** con llama.cpp, cuantizado, como servicio en el `docker-compose`.
- [ ] **F5.3 — Medirlo en serio.** Latencia por consulta, calidad en español rioplatense, acierto al elegir herramientas, y consumo de RAM **conviviendo con Whisper**. Los dos juntos, no por separado: comparten 8 GB y 4 núcleos. Si no entran, se baja a un modelo más chico para intenciones y DeepSeek cubre el resto.
- [ ] **F5.4 — Comparar contra DeepSeek** con las mismas 50 órdenes reales. Decidir con datos, no con entusiasmo.
- [ ] **F5.5 — Verificar la licencia** del modelo exacto en Hugging Face antes de integrarlo.
- [ ] **F5.6 — Catálogo de herramientas con validación estricta.** Cada herramienta declara sus parámetros y tipos; una invocación mal formada se rechaza, no se ejecuta «lo más parecido».
- [ ] **F5.7 — Armado del contexto.** Lo mínimo necesario y **solo del hogar que pregunta**. Es privacidad y control de costos a la vez.
- [ ] **F5.8 — La derivación de tres niveles.** Reglas primero; modelo local si no alcanzan; DeepSeek solo para conversación abierta.
- [ ] **F5.9 — Memoria del asistente por hogar**, aislada. Lo que aprende en tu casa **nunca** entra en el contexto de otra.
- [ ] **F5.10 — Registro de consumo y límite de gasto** del nivel remoto, con tope mensual configurable; al alcanzarlo sigue andando con los dos primeros niveles y lo dice.
- [ ] **F5.11 — Degradación.** Sin Internet hacia afuera, los niveles 1 y 2 siguen funcionando completos. Es una mejora grande respecto del plan anterior.

### ✅ Cómo sabemos que terminó

Le decís algo enrevesado —«el jueves que viene tengo que llevar el auto al taller a la mañana temprano»— y crea el evento correcto preguntando la hora. **Desenchufás el acceso a DeepSeek y casi todo sigue funcionando**, porque lo resuelve el modelo local.

---

# Fase 6 — El mundo exterior

**Objetivo:** completar la pantalla con información real y que el celular reciba avisos. **Incluye la prueba que puede frenar la Fase 7.**

### 🔧 Lo que hacés vos

- [ ] **F6.a — Comprar la pantalla.** Acá ya viste el diseño andando meses, así que la compra es informada. **Revisar antes [HARDWARE_AliExpress_vs_MercadoLibre.md](HARDWARE_AliExpress_vs_MercadoLibre.md)**: conviene importarla, y en vez de panel + carcasa + barra de sonido puede alcanzar con **un monitor de 7" 1024×600 con parlantes incorporados**, que es un solo objeto y un solo envío. **Comprar las dos casas en el mismo pedido**: la franquicia es de USD 400 y solo hay cinco envíos por año. Verificar antes las cuatro cosas que lista ese documento, sobre todo **si el audio entra por HDMI** —si entra, sobra el adaptador USB de audio.
- [ ] **F6.b — Decidir qué calendario sincronizar.**

### 💻 Lo que programo yo

- [ ] **F6.1 — Integrar el clima**, con caché en el servidor y pronóstico por hora. **La estación tiene que ser la más próxima posible a donde está cada hogar**, no «Buenos Aires» a secas: la provincia es enorme y un pronóstico de La Plata no sirve en Caballito. Se elige el proveedor comparando qué estación real usa para CABA y a cuántos kilómetros queda, no por la marca.
- [ ] **F6.1b — Elegir el proveedor del clima con criterio escrito.** Comparar al menos tres por: estación más cercana a CABA, pronóstico por hora, límite de consultas gratis, y si entrega un código de condición estable con el que mapear el ícono. **El Servicio Meteorológico Nacional entra en la comparación**, por ser la fuente local.
- [ ] **F6.2 — Integrar el tiempo de viaje**, con destino configurable.
- [ ] **F6.3 — Sincronizar el calendario externo** sin duplicar eventos, respetando de quién es cada agenda.
- [ ] **F6.4 — Notificaciones push**: registro del dispositivo, envío desde el servidor, y manejo del caso en que el navegador revoca el permiso.
- [ ] **F6.5 — Probarlas en serio.** Con la aplicación **cerrada** y el teléfono **bloqueado**, en los teléfonos reales de la familia, varias veces y a distintas horas. Es donde las PWA suelen fallar. **Si no resultan confiables, lo digo y evaluamos alternativas antes de construir las emergencias encima.**
- [ ] **F6.6 — Recordatorios que avisan de verdad**: pantalla, voz y celular, con confirmación. Un recordatorio de medicación registra que se avisó y que el usuario confirmó; **nunca afirma que el remedio fue tomado**.
- [ ] **F6.7 — Registro consultable.** «Jarvis, ¿qué hiciste hoy?» devuelve la lista real de acciones con su resultado. **Alexa no ofrece nada así**, y sale casi gratis porque la auditoría ya existe desde la Fase 2.
- [ ] **F6.8 — Memoria editable.** Una vista donde ver y borrar lo que el asistente aprendió de uno. Alexa es una caja negra; esto es lo contrario.
- [ ] **F6.10 — Reemplazar los íconos del clima por un juego animado ya hecho.** Hoy son SVG dibujados a mano por mí, y se nota: costaron tres rondas de correcciones y aun así no tienen la calidad de un juego profesional. Hay que adoptar uno externo, **animado o en 3D**, y mapear cada código de condición del proveedor de F6.1b a su ícono. Requisitos: licencia que permita usarlo, peso razonable para una Pi 3 —un Lottie pesado la ahoga, hay que medirlo— y que tenga variantes de día y de noche. **Pendiente: Gus tiene que pasarme la página de donde quiere sacarlos**; la mencionó el 31/10/2026 pero no quedó el link.
- [ ] **F6.9 — Montar la pantalla definitiva**: instalarla en la carcasa, ajustar resolución, calibrar el táctil y revisar el diseño en el tamaño físico real.

### ✅ Cómo sabemos que terminó

La pantalla muestra el clima de tu ciudad, tus eventos reales y cuánto tardás al centro. Un recordatorio suena a horario y te llega al celular bloqueado en el bolsillo. Y podés preguntarle qué hizo en el día.

---

# Fase 7 — Emergencias y acompañamiento

**Objetivo:** el módulo más importante del proyecto. Va último de los esenciales porque necesita todo lo anterior, pero **está diseñado desde el primer día**.

### 🔧 Lo que hacés vos

- [ ] **F7.a — Comprar el pulsador.** Tipo hongo, 22 mm, normalmente abierto, con LED de 12 V.
- [ ] **F7.b — Investigar proveedores de SMS y telefonía en Argentina** con sus costos reales.
- [ ] **F7.c — Hablar con la familia.** Quiénes son los contactos, en qué orden y cuánto se espera antes de escalar. **Es una conversación familiar, no una decisión técnica.**
- [ ] **F7.d — Evaluar la UPS**, calculando autonomía **con el router y el módem incluidos**: sin ellos, el respaldo de la Raspberry sola no sirve para avisar a nadie.

### 💻 Lo que programo yo

- [ ] **F7.1 — Conectar el pulsador a GPIO**, con antirrebote, manejado por el agente local y no por el navegador. Es el camino más confiable: no depende de la voz, ni de la red, ni del modelo.
- [ ] **F7.2 — Detección de frases de emergencia por regla**, comparadas **antes** que cualquier otra interpretación, con varias formulaciones configurables y sin pasar nunca por el modelo.
- [ ] **F7.3 — Alarma local**: sonido fuerte y pantalla roja, disparados desde el agente, **funcionando con Internet caído y servidor apagado**.
- [ ] **F7.4 — Registro del incidente**: una fila por alerta, una por cada intento de notificación con su resultado, y una por cada confirmación. Es lo que permite no mentir después.
- [ ] **F7.5 — Escalamiento** por contacto y por canal, con reintentos y paso al siguiente al vencer el plazo.
- [ ] **F7.6 — Confirmación desde el celular del familiar**, registrando quién se hizo cargo y a qué hora.
- [ ] **F7.7 — Pantalla de emergencia** con el **estado real** de cada aviso: enviado, entregado, confirmado o fallido. Cada uno significa algo distinto y no se muestran como equivalentes jamás. La maqueta ya está hecha.
- [ ] **F7.8 — Cancelación de falsa alarma**, fácil y rápida, sin borrar el registro.
- [ ] **F7.9 — Integrar SMS o llamada** según el proveedor elegido.
- [ ] **F7.10 — Pruebas de fallo, una por una.** Sin Internet. Servidor caído. Push sin responder. Teléfono del contacto apagado. Nadie confirma. Corte de luz. Reinicio en medio del incidente. **Cada una documentada con su resultado.**
- [ ] **F7.11 — Escribir el procedimiento familiar alternativo**, el que no depende de JARVIS.

**Modo acompañamiento** — el complemento del botón, para cuando la persona **no puede** pedir ayuda:

- [ ] **F7.12 — Señales de actividad.** Registrar sin cámara y sin guardar audio: interacciones con la pantalla, órdenes de voz, luces encendidas o apagadas, movimiento detectado. Solo marcas de tiempo, nada de contenido.
- [ ] **F7.13 — Detección de inactividad inusual.** Si no hay ninguna señal en una ventana configurable, JARVIS **pregunta primero** en voz alta y da tiempo a responder.
- [ ] **F7.14 — Aviso escalado si nadie responde**, por el mismo circuito de la emergencia, con un mensaje distinto que aclare que es una alerta de inactividad y no una emergencia confirmada.
- [ ] **F7.15 — Control del usuario.** Se puede apagar, pausar por un rato y ajustar la ventana. **La persona tiene que saber que está activo y poder desactivarlo.**

### ✅ Cómo sabemos que terminó

Apretás el botón y suena la alarma. La familia recibe el aviso, alguien confirma y la pantalla lo muestra. Repetís con el Wi-Fi desenchufado: la alarma suena igual y la pantalla dice con todas las letras que no se pudo avisar afuera. Y una prueba de inactividad simulada dispara la pregunta antes de avisar a nadie.

---

# Fase 8 — Música

**Objetivo:** que JARVIS reproduzca lo que le pidas, gratis, y que se vea en pantalla.

> **Leé antes la sección 12 de la especificación.** Sin Spotify Premium no hay reproducción bajo demanda en Spotify — es la razón por la que Alexa contesta siempre «reproduciendo radio de…». La vía que sí trae la canción pedida es el **audio de YouTube**.

### 🔧 Lo que hacés vos

- [ ] **F8.a — Decidir sobre YouTube como fuente.** Es lo único que permite pedir una canción concreta sin pagar Premium. Es zona gris respecto de los términos de YouTube, hay que mantener la herramienta actualizada, y **no necesita las cookies de tu cuenta de Google**.
- [ ] **F8.b — Emparejar tu celular** cuando el Bluetooth esté andando.

### 💻 Lo que programo yo

- [ ] **F8.1 — Receptor Bluetooth A2DP.** La Pi aparece como parlante y **cualquier app del celular suena por el equipo**: YouTube Music, podcasts, videos.
- [ ] **F8.2 — Leer los metadatos por AVRCP** con la interfaz `MediaPlayer1` de BlueZ —título, artista, álbum, duración, posición— y mandar comandos de vuelta, para que **los botones de la pantalla controlen el teléfono**.
- [ ] **F8.3 — Emparejamiento desde la pantalla**, con el nombre del teléfono conectado visible.
- [ ] **F8.4 — Fuente YouTube.** Resolver «artista + título» y reproducir el **flujo de audio**, sin descargar el video ni guardar archivos, con actualización automática periódica de la herramienta.
- [ ] **F8.5 — Fuente de radio por internet** contra el directorio abierto Radio Browser, gratuito y sin clave.
- [ ] **F8.6 — Adaptador de música**, donde YouTube, radio, Bluetooth y —si algún día hay Premium— Spotify son fuentes intercambiables.
- [ ] **F8.7 — Servicio de carátulas.** Buscarlas por artista y título contra un servicio público gratuito, con caché local. **Hace falta porque por Bluetooth la carátula casi nunca llega.** Si no se encuentra, un marcador con las iniciales del artista en los colores del tema; nunca un hueco vacío.
- [ ] **F8.8 — Pantalla «Reproduciendo»** en los dos temas: carátula grande, título y artista legibles de lejos, **de dónde sale la música dicho explícitamente**, progreso, controles grandes, cola, y acceso a emergencia siempre visible. La maqueta ya está hecha.
- [ ] **F8.9 — Barra compacta de reproducción** en la pantalla principal. **Nunca hay música sonando sin que la pantalla lo refleje.**
- [ ] **F8.10 — Órdenes de voz de música.**
- [ ] **F8.11 — Reglas de convivencia del audio.** La música se silencia sola al detectar la palabra de activación y vuelve al volumen anterior. Los recordatorios bajan el volumen. **Una alerta de emergencia corta la música de inmediato, sin excepción.**
- [ ] **F8.12 — Honestidad en las respuestas.** Si no encuentra la canción, lo dice y ofrece alternativa. **Nunca anuncia una radio como si fuera lo que pediste.**
- [ ] **F8.13 — Spotify, diseñado y apagado**, listo para el día que haya Premium.

### ✅ Cómo sabemos que terminó

Decís «Jarvis, poné De música ligera de Soda Stereo» y **suena esa canción**, no una parecida. La pantalla muestra carátula, título y de dónde sale. Decís «Jarvis» y la música se baja sola. Y desde el celular mandás cualquier cosa por Bluetooth viéndolo en pantalla.

---

# Fase 9 — Dispositivos del hogar

**Objetivo:** reemplazar lo que hoy hacés con Alexa: encender las luces LEDVANCE y mandar la aspiradora Liectroux a limpiar.

> **Las dos funcionan sobre Tuya**, así que es **una sola integración**. Y deja la puerta abierta a casi cualquier accesorio barato que compres después.

### 🔧 Lo que hacés vos

- [ ] **F9.a — Pasarme los modelos exactos** de las luces y de la aspiradora.
- [ ] **F9.b — Crear la cuenta de desarrollador en Tuya IoT Platform** y vincular tu cuenta de Tuya Smart / SMART+.
- [ ] **F9.c — Tener los dispositivos encendidos y en la red** durante F9.1.

### 💻 Lo que programo yo

- [ ] **F9.1 — Verificar que los dispositivos siguen siendo Tuya.** **Primera tarea, antes de escribir una línea.** Hay un reporte de mayo de 2026 de focos SMART+ que dejaron de responder, con la duda de si LEDVANCE se está separando de Tuya en sus modelos nuevos. Mejor saberlo el día uno que el quince.
- [ ] **F9.2 — Adaptador de domótica**, donde Tuya es una implementación entre varias; mañana puede ser Home Assistant o Matter sin tocar la lógica ni la interfaz.
- [ ] **F9.3 — Integrar la API en la nube de Tuya**: descubrimiento de dispositivos, capacidades y estado. Se empieza por la nube porque funciona sin extraer claves de nada.
- [ ] **F9.4 — Guardar los dispositivos por hogar**, con nombre amigable y ambiente. **La aspiradora del hogar A no existe para el hogar B.**
- [ ] **F9.5 — Control de luces**: encender, apagar, intensidad, color y temperatura, agrupadas por ambiente.
- [ ] **F9.6 — Control de la aspiradora**: limpiar, parar, volver a la base, estado y batería.
- [ ] **F9.7 — Verificación de estado real.** Después de cada orden se lee el estado del dispositivo. **Si la luz no respondió, JARVIS dice que no pudo, no que la apagó.**
- [ ] **F9.8 — Órdenes de voz.**
- [ ] **F9.9 — Controles táctiles en la pantalla**, con interruptores grandes. Importante para el hogar B, donde la voz puede fallar.
- [ ] **F9.10 — Escenas.** «Modo noche» apaga las luces y manda la aspiradora a la base.
- [ ] **F9.11 — Rutinas en lenguaje natural.** «Cuando diga buenas noches, apagá las luces.» Creadas hablando, no en un menú.
- [ ] **F9.12 — Control local como respaldo.** Claves locales y control directo desde la Raspberry: inmediato en vez de uno a tres segundos, y **las luces siguen funcionando aunque se caiga Internet**.

### 🔎 Más allá de Tuya — investigación pendiente

> **Pedido de Gus, 31/10/2026:** que JARVIS llegue a **todo lo que tenga Bluetooth o Wi-Fi** en la casa —pulseras, relojes, aspiradoras, luces, lo que aparezca—, no solo a lo que hable Tuya. No hay plan todavía: hay que investigarlo. Estas tareas son ese trabajo, y van **después** de que Tuya funcione, porque Tuya es lo que ya está comprado y en uso.

- [ ] **F9.13 — Inventario real de las dos casas.** Recorrer cada hogar y listar qué hay con Bluetooth o Wi-Fi, con marca y modelo exactos. **Primero esto**: sin saber qué dispositivos existen de verdad, cualquier investigación de protocolos es teoría.
- [ ] **F9.14 — Estudiar los caminos de integración y elegir.** Las opciones realistas son Matter (el estándar al que están migrando casi todos), Home Assistant usado como biblioteca de integraciones detrás de nuestra API, BLE directo desde la Raspberry, y las nubes propietarias de cada marca. Hay que escribir qué cubre cada uno **de los dispositivos de F9.13**, qué cuesta y qué deja afuera. El resultado es una decisión argumentada, no un listado.
- [ ] **F9.15 — Medir qué aguanta la Raspberry.** El Bluetooth de la Pi 3 es uno solo y ya lo quiere la música (Fase 8). Mantener conexiones permanentes con varias pulseras **y** reproducir audio por el mismo radio es, probablemente, pedirle demasiado. Hay que medirlo antes de prometer nada, y la respuesta puede ser un segundo adaptador USB.
- [ ] **F9.16 — Pulseras y relojes, con cuidado especial.** Son los únicos de la lista que tocan la salud: pulsaciones, sueño, caídas. **Cruza con la Fase 7 y con la detección de caídas de la Fase 11**, así que hereda su regla más dura: una emergencia no puede depender de que una pulsera haya sincronizado bien. Sirven para acompañar y para avisar, **nunca como único detector**. También son datos de salud de la madre de Gus: entran en el aislamiento entre hogares como todo lo demás, y antes de guardarlos hay que decidir qué se guarda y por cuánto tiempo.
- [ ] **F9.17 — Que el adaptador de F9.2 aguante lo que salga de acá.** Si la investigación termina en Matter o en Home Assistant, tiene que entrar como una implementación más al lado de Tuya, sin tocar la lógica ni la interfaz. Si no entra, el adaptador estaba mal pensado y se corrige acá.

### ✅ Cómo sabemos que terminó

Decís «apagá las luces del living» y se apagan. «Mandá la aspiradora a limpiar» y arranca. Desenchufás el módem y las luces **siguen respondiendo**. Y si un dispositivo está desconectado, lo dice en vez de fingir.

---

# Fase 10 — El segundo hogar

**Objetivo:** instalar el sistema en la casa de tu mamá y que lo use una persona que no participó de la construcción.

### 🔧 Lo que hacés vos

- [ ] **F10.a — Comprar la segunda Raspberry y sus accesorios.** **Recién ahora**, con la arquitectura validada.
- [ ] **F10.b — Elegir dónde se instala**: altura, luz, distancia desde donde se habla.

### 💻 Lo que programo yo

- [ ] **F10.1 — Escala de densidad tipográfica.** Niveles de tamaño que afectan a los tokens en bloque, para que el hogar B tenga texto y botones más grandes sin ser un diseño distinto.
- [ ] **F10.2 — Modo nocturno y de reposo**, con brillo bajo manteniendo la hora y el acceso a emergencia visibles. — *El modo oscuro ya está hecho desde F1.5 (automático de 20:00 a 07:00, más botón). Acá queda solo el modo de reposo con la pantalla casi apagada.*
- [ ] **F10.3 — Preparar el segundo dispositivo** con su hogar, sus credenciales y sus contactos.
- [ ] **F10.4 — Verificar el aislamiento con datos reales de los dos hogares.** Ni listas, ni agenda, ni dispositivos, ni lo que el asistente aprendió. Es la prueba definitiva de F2.4, ahora de verdad.
- [ ] **F10.5 — Actualizaciones remotas seguras**, con vuelta atrás si algo sale mal.
- [ ] **F10.6 — Simplificar según el uso real**, sacando lo que confunde.

### 🔧 Lo que hacés vos

- [ ] **F10.c — Instalarlo y mirarla usarlo sin explicarle nada.** Lo que no entienda sola hay que arreglarlo en el diseño.
- [ ] **F10.d — Ensayar la emergencia completa** con toda la familia.

### ✅ Cómo sabemos que terminó

Tu mamá agrega algo a la lista hablando, sin ayuda. La emergencia se probó con la familia. Los datos de los dos hogares están separados y se verificó.

---

# Fase 11 — Más adelante

Nada de esto es necesario para que el proyecto sea un éxito.

- Cámara y visualización, con tapa física —algo que el Echo Show 11 no tiene.
- Detección de personas.
- Reconocimiento facial.
- Detección de caídas, con sus límites medidos. **Se cruza con F9.16**: si para entonces hay una pulsera integrada, es una señal más, nunca el único detector.
- Más sensores: apertura, temperatura, humedad, pérdidas de agua.
- Modelo local corriendo en el propio dispositivo, si alguna vez hay hardware que lo aguante.
- Más hogares.
- Carcasa impresa en 3D que integre pantalla, micrófono y parlante en un solo cuerpo.

---

## Resumen de fases

| Fase | Qué entrega | Compras |
|---|---|---|
| 0 | Servidor seguro, Raspberry encendida, repositorio | microSD, fuente |
| 1 | Las cuatro pantallas funcionando en la Pi | — |
| 2 | Datos reales, aislamiento entre hogares probado | — |
| 3 | Uso desde el celular, sincronización instantánea | — |
| 4 | Órdenes por voz, timers y alarmas, sin IA | micrófono, barra de sonido |
| 5 | Inteligencia local gratuita, DeepSeek de respaldo | — |
| 6 | Clima, calendario, viaje, notificaciones, registro | panel táctil, carcasa |
| 7 | **Emergencias probadas y modo acompañamiento** | pulsador, UPS |
| 8 | Música: YouTube por voz, todo lo demás por Bluetooth | — |
| 9 | Luces y aspiradora por voz, rutinas habladas, **e investigar todo lo que tenga Bluetooth o Wi-Fi** | — |
| 10 | Segundo hogar funcionando | segunda Raspberry |
| 11 | Cámara y ampliaciones | a definir |

**Nota honesta sobre los plazos:** no pongo fechas porque no sé cuántas horas por semana le vas a poder dedicar, y una fecha inventada no le sirve a nadie. Lo que sí vale: las fases 0 a 3 son las más predecibles, la 4 es la de mayor incertidumbre técnica, la 7 es la que no se puede apurar, y la 9 depende de un dato que todavía no tenemos.
