# JARVIS — Especificación técnica y funcional

**Versión:** 1.0
**Fecha:** 28 de octubre de 2026
**Estado:** Base de trabajo para el desarrollo
**Documentos relacionados:** `JARVIS_Proyecto_Integral.md` (visión y alcance), `DECISION_Frontend_Temas.md` (interfaz), `ROADMAP.md` (plan de ejecución)

> Este documento dice **qué se construye y cómo**. El roadmap dice **en qué orden**. Si los dos se contradicen, manda este.

---

## 1. Propósito y alcance

JARVIS es un asistente doméstico por voz con interfaz en pantalla, pensado para funcionar en varios hogares independientes entre sí. Cada hogar tiene un dispositivo físico (Raspberry Pi con pantalla y micrófono) que muestra información útil y acepta órdenes habladas, conectado a un servidor central que guarda los datos y ejecuta la lógica.

**Dentro del alcance de la primera versión útil:** interfaz en pantalla, órdenes por voz en español, lista de compras, agenda y recordatorios, sincronización con el celular, conversación con un modelo de lenguaje para pedidos complejos, y un módulo de emergencias con aviso a familiares.

**Agregado el 28 de octubre de 2026:** reproducción de música (sección 12) y control de dispositivos del hogar por Wi-Fi (sección 13).

**Agregado el 29 de octubre de 2026**, tras comparar contra Alexa (`COMPARATIVA_Alexa.md`):

- **Timers y alarmas**, conversiones y cálculos, y conversación multi-turno. Son de lo más usado de un asistente: sin ellos el producto se siente incompleto aunque tenga cosas mejores.
- **Registro consultable**: «¿qué hiciste hoy?» devuelve la lista real de acciones con su resultado.
- **Memoria editable**: ver y borrar lo que el asistente aprendió de uno.
- **Modo acompañamiento** (sección 14.6): detección de inactividad inusual para el caso en que la persona **no pueda** pedir ayuda.
- **Modelo de lenguaje local** en el propio servidor (sección 10), lo que reduce el costo recurrente a casi cero y hace que los datos de cada hogar no salgan de nuestra infraestructura.

**Fuera del alcance de la primera versión:** cámara, detección de personas, reconocimiento facial, detección de caídas, automatización de dispositivos del hogar. Se abordan después, sin rehacer lo anterior.

### 1.1 Qué significa que el proyecto esté terminado

La primera versión está completa cuando una persona puede, en su casa, decir «Jarvis, agregá leche a las compras», ver el producto aparecer en la pantalla y en su celular, pedir «¿qué tengo mañana?» y escuchar la respuesta correcta, y apretar un botón para que su familia reciba un aviso de que necesita ayuda — todo sin que el sistema mienta nunca sobre lo que hizo.

---

## 2. Glosario

| Término | Significado en este proyecto |
|---|---|
| **Hogar** | Unidad de aislamiento de datos. Un hogar tiene sus usuarios, dispositivos, listas, agenda y contactos. Equivale a lo que en una aplicación comercial sería una «cuenta» o un «inquilino». |
| **Dispositivo** | La Raspberry Pi instalada en un hogar. Se autentica con credenciales propias y revocables. |
| **Wake word** | La palabra que despierta al asistente: «Jarvis». Se detecta en el dispositivo, sin enviar audio a ningún lado. |
| **STT** | Reconocimiento de voz: convierte audio en texto. |
| **TTS** | Síntesis de voz: convierte texto en audio. |
| **Intención** | Lo que el usuario quiere hacer: agregar a la lista, crear un evento, pedir ayuda. |
| **Herramienta** | Función concreta que el modelo de lenguaje puede invocar, con parámetros validados por el servidor. El modelo nunca toca la base de datos directamente. |
| **Ruta determinista** | Camino que resuelve una orden con reglas, sin pasar por el modelo de lenguaje. Más rápido, más barato y más confiable. |

---

## 3. Actores, hogares y permisos

### 3.1 Roles

| Rol | Puede |
|---|---|
| **Administrador** | Todo lo del hogar: crear usuarios, vincular dispositivos, definir contactos de emergencia, cambiar permisos, ver el registro de auditoría. |
| **Miembro** | Usar el asistente, gestionar sus listas y su agenda, ver lo compartido con él. |
| **Contacto de emergencia** | Recibir alertas de un hogar y confirmar que las está atendiendo. **No accede a ningún otro dato de ese hogar.** |

Una persona puede tener roles distintos en hogares distintos. El administrador del hogar A no tiene ningún poder sobre el hogar B salvo que sea también administrador allí.

### 3.2 Aislamiento entre hogares — requisito duro

Esta es la regla más fuerte del sistema y condiciona cada consulta que se escriba.

1. **Toda tabla con datos de usuario lleva `hogar_id`.** Sin excepción.
2. **Ninguna consulta se escribe sin filtrar por `hogar_id`.** No se confía en que el programador se acuerde: el acceso a datos pasa por una capa que inyecta el filtro a partir del token autenticado, y la base de datos tiene además políticas de seguridad a nivel de fila (RLS de PostgreSQL) como segunda barrera. Si la aplicación se olvida del filtro, la base lo rechaza igual.
3. **El contexto que se envía al modelo de lenguaje se arma exclusivamente con datos del hogar que hizo la pregunta.** Lo que el asistente «aprende» en una casa —preferencias, nombres, costumbres, correcciones— se guarda asociado a ese hogar y nunca entra en el prompt de otro.
4. **No hay búsquedas, estadísticas ni cachés globales** que mezclen hogares.
5. **Compartir es explícito y granular.** Compartir una lista no da acceso a la agenda, ni a los contactos, ni al historial de voz.
6. El diseño debe soportar **cinco o seis hogares** sin cambios estructurales.

### 3.3 Qué se registra y qué no

- **Sí se registra:** qué acción se ejecutó, cuándo, en qué hogar, por qué usuario o dispositivo, y si tuvo éxito o falló.
- **No se guarda:** el audio de las órdenes, una vez transcrito. La transcripción se conserva solo el tiempo necesario para resolver la orden, salvo que el usuario active explícitamente un historial.
- **Los datos biométricos** no existen en esta versión. Cuando se evalúe el reconocimiento facial, será con consentimiento informado y documento aparte.

---

## 4. Inventario real

Lo que hay confirmado hoy. Nada que no esté acá debe darse por disponible.

### 4.1 Servidor central — confirmado

| Dato | Valor |
|---|---|
| Proveedor | Contabo |
| Plan | Cloud VPS 4 (2026) |
| CPU | 4 núcleos |
| Memoria | 8 GB |
| Disco | 100 GB |
| Región | US-east |
| Sistema operativo | Linux, Ubuntu — **versión por confirmar** |
| Acceso | root por SSH; VNC habilitado |
| Costo | 8,50 USD mensuales |
| Copias de seguridad | **No contratadas.** Hay que resolverlo antes de que existan datos reales. |

**Lectura de esos recursos:** alcanzan cómodamente para la API, la base de datos y el reconocimiento de voz ejecutándose en el mismo servidor. La región US-east es favorable: desde Argentina la latencia ronda los 120–160 ms, aceptable para voz. Habría sido un problema si estuviera en Europa.

### 4.2 Dispositivo — parcialmente disponible

| Elemento | Estado |
|---|---|
| Raspberry Pi 3 Model B | **Disponible** |
| Carcasa | **Disponible** (básica) |
| microSD | **Falta.** Recomendación: 64 GB, clase 10, **A1 o A2**, marca reconocida. |
| Fuente de alimentación | **Por confirmar.** Necesita 5 V / 2,5 A reales. |
| Pantalla | **Falta.** Provisoriamente se usa un televisor por HDMI. |
| Micrófono | **Falta.** USB, compatible con Linux sin controladores. |
| Parlante | **Falta.** USB o jack de 3,5 mm. |
| Botón de emergencia | **Falta.** Pulsador grande a GPIO. |
| Alimentación de respaldo | **Falta.** Se evalúa en la fase de emergencias. |

**Sobre la microSD:** la clase 10 mide velocidad secuencial, que no es lo que limita a un sistema operativo. Lo que importa es la clasificación **A1/A2**, que garantiza operaciones aleatorias por segundo. Una tarjeta clase 10 sin A1 puede hacer que el sistema se sienta lento aunque el número grande de la caja sea alto. 64 GB no es por espacio —el sistema ocupa menos de 10 GB— sino porque el doble de celdas significa el doble de vida útil ante la escritura constante de registros.

**Sobre el televisor como pantalla provisoria:** sirve perfectamente para desarrollar, con una advertencia. El televisor es de 1920×1080 y la pantalla final será de 1024×600. Si se desarrolla mirando el televisor a resolución completa, el diseño se va a ver bien ahí y mal en la pantalla real. **Hay que forzar la Raspberry a 1024×600 por `config.txt`** desde el primer arranque, aunque se vea con bordes negros en el televisor. Es la única forma de validar legibilidad y rendimiento de verdad.

### 4.3 Entorno de desarrollo

Computadora personal y notebook con Windows 11. **Solo para desarrollar.** No son parte de la infraestructura de producción y el sistema no puede depender de que estén encendidas.

---

## 5. Arquitectura

### 5.1 Componentes

```text
┌───────────────────────────────┐
│ Raspberry Pi (hogar A)        │
│                               │
│  ┌─────────────────────────┐  │
│  │ Chromium en kiosco      │  │  ← la interfaz, servida desde Contabo
│  └─────────────────────────┘  │
│  ┌─────────────────────────┐  │
│  │ Agente local (Python)   │  │  ← proceso independiente del navegador
│  │  · wake word            │  │
│  │  · captura de audio     │  │
│  │  · reproducción (TTS)   │  │
│  │  · botón GPIO           │  │
│  │  · alarma local         │  │
│  └─────────────────────────┘  │
└───────────────┬───────────────┘
                │ HTTPS / WebSocket seguro
                ▼
┌───────────────────────────────┐
│ Contabo — Docker Compose      │
│  · Caddy (TLS, proxy inverso) │
│  · API FastAPI                │
│  · PostgreSQL                 │
│  · Servicio STT (Whisper)     │
│  · Archivos estáticos del front│
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Servicios externos            │
│  · DeepSeek (modelo)          │
│  · Clima                      │
│  · Notificaciones push        │
│  · SMS / telefonía (fase 5)   │
└───────────────────────────────┘
```

**Por qué el agente local es un proceso aparte y no código dentro del navegador:** porque el día que haya que hacer sonar una alarma con el navegador colgado, la red caída o la pantalla apagada, tiene que haber algo vivo que responda al botón. Es barato construirlo así desde el principio y caro agregarlo después.

### 5.2 Recorrido completo de una orden de voz

Este recorrido es el corazón del sistema. Cada paso tiene un responsable y un modo de fallar.

1. **Escucha pasiva.** El agente local analiza el audio en busca de «Jarvis». No sale nada del dispositivo. Si no hay coincidencia, el audio se descarta inmediatamente.
2. **Activación.** Detectada la palabra, la interfaz lo muestra —el micrófono cambia de estado visiblemente— y el agente empieza a grabar.
3. **Fin de frase.** Se detecta silencio y se corta la grabación. Tope máximo: 15 segundos.
4. **Atajo de emergencia.** Antes de cualquier otra cosa, el texto se compara contra las frases de emergencia. Si coincide, se dispara el protocolo de emergencia y el recorrido termina acá. **Este paso no depende del modelo de lenguaje ni de que la nube responda.**
5. **Transcripción.** El audio va al servidor, que lo convierte en texto.
6. **Ruta determinista.** El servidor intenta resolver la orden con reglas: patrones para agregar a la lista, consultar la agenda, poner un recordatorio, subir el volumen. Si una regla coincide con confianza, se ejecuta y no se consume ni un token.
7. **Ruta con modelo.** Si ninguna regla coincide, el texto va a DeepSeek junto con el catálogo de herramientas disponibles y el contexto mínimo del hogar. El modelo elige una herramienta y sus parámetros.
8. **Validación.** El servidor valida los parámetros y los permisos. Una herramienta mal invocada se rechaza; no se ejecuta «lo más parecido».
9. **Ejecución y verificación.** Se ejecuta la acción contra la base de datos y **se verifica el resultado real**.
10. **Respuesta.** Recién ahí se arma la confirmación, se envía a la pantalla y se sintetiza en voz.
11. **Registro.** Se anota la acción, el resultado y el costo si hubo consumo de modelo.

**Regla de oro, repetida porque es la que más fácil se viola:** el paso 10 nunca ocurre antes del paso 9. JARVIS no dice «listo, agregué leche» hasta que la leche está en la base de datos.

### 5.3 Latencia objetivo

Medida desde que el usuario termina de hablar hasta que empieza a escuchar la respuesta.

| Tipo de orden | Objetivo | Aceptable |
|---|---|---|
| Ruta determinista | menos de 1,5 s | 2,5 s |
| Ruta con modelo | menos de 3,5 s | 5 s |
| Emergencia (alarma local) | inmediata | 300 ms |

Si no se llega a estos números, se revisa antes de seguir agregando funciones. Un asistente lento no se usa.

---

## 6. Tecnologías

Elegidas por compatibilidad con el hardware real, mantenimiento y licencia. Las versiones se fijan al iniciar cada fase.

| Capa | Elección | Por qué |
|---|---|---|
| Interfaz | **React + TypeScript + Vite** | Ecosistema conocido, compilación liviana, y la misma base sirve para la pantalla y la PWA. |
| Estilos | **CSS con variables (tokens)** | El cambio de tema es intercambiar un bloque de variables. Sin librerías de componentes que impongan su estética. |
| Backend | **Python + FastAPI** | Validación de entrada robusta, asíncrono, y el mismo lenguaje que el agente local y el servicio de voz. |
| Base de datos | **PostgreSQL** | Hace falta seguridad a nivel de fila para el aislamiento entre hogares. SQLite no la tiene. Se usa PostgreSQL desde el principio para no migrar después. |
| Migraciones | **Alembic** | El esquema va a cambiar muchas veces. |
| Agente local | **Python** | Acceso directo a GPIO y audio. |
| Wake word | **openWakeWord** (a validar) | Funciona sin conexión y permite entrenar «Jarvis». Alternativa si no rinde en la Pi 3: Porcupine. |
| STT | **faster-whisper** en el servidor | Modelo `small` o `medium` en CPU. En la Pi 3 es inviable; en 4 núcleos del VPS, razonable. **Hay que medir el tiempo real por frase.** |
| TTS | **Piper** en el dispositivo | Rápido y sin conexión. **Hay que verificar que exista una voz en español que suene bien**; si no, se sintetiza en el servidor. |
| Modelo de lenguaje | **DeepSeek por API**, detrás de un adaptador | Decisión del usuario. El adaptador permite cambiar de proveedor sin tocar la lógica. |
| Contenedores | **Docker Compose** | Despliegue reproducible y vuelta atrás simple. |
| TLS y proxy | **Caddy** | Certificados automáticos, configuración mínima. |
| Kiosco | **Chromium** sobre Raspberry Pi OS Lite | Se decide en la Fase 1 entre `cage` (Wayland) y Xorg con openbox, según qué arranque más rápido y consuma menos en 1 GB de RAM. |

### 6.1 Lo que deliberadamente no se usa

- **Home Assistant como sistema operativo:** no tiene entorno gráfico; no puede mostrar la interfaz.
- **Un modelo de lenguaje local en la Pi 3:** imposible con 1 GB de RAM.
- **SQLite en producción:** sin seguridad a nivel de fila, el aislamiento entre hogares quedaría dependiendo solo del código.
- **Una app móvil nativa, por ahora:** se empieza con PWA. Si las notificaciones no resultan confiables en las pruebas, se reevalúa.

---

## 7. Modelo de datos

Esquema inicial. Todas las tablas de datos de usuario llevan `hogar_id` y política de seguridad a nivel de fila.

| Tabla | Campos principales | Notas |
|---|---|---|
| `hogares` | id, nombre, zona_horaria, creado_en | Raíz del aislamiento. |
| `usuarios` | id, email, nombre, hash_contraseña, creado_en | Un usuario puede pertenecer a varios hogares. |
| `membresias` | usuario_id, hogar_id, rol | Define qué puede hacer cada quien dónde. |
| `dispositivos` | id, hogar_id, nombre, token_hash, ultimo_contacto, activo | Revocables de a uno. |
| `listas` | id, hogar_id, nombre, tipo, privada | Compras, tareas, lo que sea. |
| `items_lista` | id, lista_id, hogar_id, texto, cantidad, unidad, comprado, agregado_por, creado_en | `hogar_id` redundante a propósito: permite filtrar sin unir tablas. |
| `eventos` | id, hogar_id, usuario_id, titulo, inicio, fin, todo_el_dia, notas, recurrencia, origen_externo_id | `origen_externo_id` evita duplicados al sincronizar calendarios. |
| `recordatorios` | id, hogar_id, usuario_id, texto, momento, repeticion, estado, confirmado_en | Un recordatorio de medicación puede registrar confirmación, nunca afirmar que se tomó. |
| `contactos_emergencia` | id, hogar_id, nombre, telefono, canal_preferido, orden_escalamiento, activo | El orden importa. |
| `alertas` | id, hogar_id, disparada_por, metodo_activacion, iniciada_en, estado, cerrada_en, cerrada_por | Una fila por incidente. |
| `intentos_notificacion` | id, alerta_id, contacto_id, canal, enviado_en, estado, detalle_error | Una fila por intento. Lo que permite no mentir. |
| `confirmaciones` | id, alerta_id, contacto_id, confirmado_en | Quién se hizo cargo. |
| `preferencias` | hogar_id, usuario_id, clave, valor | Tema visual, densidad, volumen, velocidad de habla. |
| `memoria_asistente` | id, hogar_id, clave, valor, actualizado_en | Lo que el asistente aprende. **Nunca sale de su hogar.** |
| `consumo_modelo` | id, hogar_id, fecha, tokens_entrada, tokens_salida, costo_estimado | Control de gastos. |
| `auditoria` | id, hogar_id, actor, accion, objeto, resultado, creado_en | Sin datos personales innecesarios. |
| `cuentas_servicio` | id, hogar_id, usuario_id, servicio, token_cifrado, refresco_cifrado, expira_en | Spotify, YouTube Music, Tuya. **Cifradas y por hogar.** |
| `dispositivos_hogar` | id, hogar_id, proveedor, id_externo, nombre, tipo, ambiente, capacidades, ultimo_estado, visto_en | Luces, aspiradora y lo que se agregue. |
| `escenas` | id, hogar_id, nombre, acciones | «Modo noche» y similares. |

---

## 8. API

Principios: REST sobre HTTPS, JSON, versionada bajo `/api/v1`. Cada respuesta de error trae un código y un mensaje en lenguaje claro, porque algunos llegan a la pantalla.

| Grupo | Endpoints |
|---|---|
| Autenticación | `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` |
| Dispositivos | `POST /devices/pair`, `POST /devices/{id}/revoke`, `POST /devices/heartbeat` |
| Hogares | `GET /homes`, `GET /homes/{id}`, `PATCH /homes/{id}` |
| Listas | `GET /lists`, `POST /lists`, `GET /lists/{id}/items`, `POST /lists/{id}/items`, `PATCH /items/{id}`, `DELETE /items/{id}` |
| Agenda | `GET /events?desde=&hasta=`, `POST /events`, `PATCH /events/{id}`, `DELETE /events/{id}` |
| Recordatorios | `GET /reminders`, `POST /reminders`, `POST /reminders/{id}/confirm` |
| Voz | `POST /voice/transcribe`, `POST /voice/command` |
| Panel | `GET /dashboard` — una sola llamada con todo lo que la pantalla necesita |
| Clima | `GET /weather` — el servidor consulta y cachea; el dispositivo nunca habla directo con el proveedor |
| Emergencias | `POST /emergency/trigger`, `POST /emergency/{id}/ack`, `POST /emergency/{id}/cancel`, `GET /emergency/{id}` |
| Tiempo real | `WS /ws` — cambios en listas, agenda y estado de alertas |

**`GET /dashboard` existe por una razón concreta:** la pantalla no debe hacer ocho llamadas al arrancar en una Raspberry Pi 3 con una conexión doméstica. Una llamada, una respuesta, pintado inmediato.

---

## 9. Capa de voz

### 9.1 Reparto de responsabilidades

| Tarea | Dónde corre | Por qué |
|---|---|---|
| Wake word | Dispositivo | Privacidad: sin activación, no sale audio. |
| Detección de fin de frase | Dispositivo | Evita mandar silencio. |
| Transcripción | Servidor | La Pi 3 no puede. |
| Interpretación | Servidor | Donde están los datos y las reglas. |
| Síntesis de voz | Dispositivo | Respuesta inmediata, funciona aunque la red esté lenta. |

### 9.2 Problemas conocidos a resolver

- **Eco y interrupción.** Si el micrófono escucha al parlante, el asistente se oye a sí mismo. Hace falta cancelación de eco o, como mínimo, silenciar el micrófono mientras habla. Lo segundo impide interrumpirlo, lo cual es molesto pero aceptable en la primera versión.
- **Español rioplatense.** Hay que medir la precisión con «agregá», «poné», «decime» y con nombres propios locales. Es un criterio de aceptación, no un detalle.
- **Ruido doméstico.** Las pruebas se hacen con televisor encendido y a tres metros, no en silencio a veinte centímetros.
- **Falsas activaciones.** Hay que medir cuántas veces se despierta solo durante un día normal.

### 9.3 Órdenes que deben funcionar sin el modelo de lenguaje

Estas se resuelven con reglas, siempre:

- agregar uno o varios productos a una lista;
- preguntar qué falta comprar;
- marcar un producto como comprado;
- preguntar qué hay en la agenda hoy o mañana;
- crear un recordatorio con hora explícita;
- **poner, consultar y cancelar timers y alarmas**;
- **conversiones y cálculos** («cuántos gramos son dos tazas», «cuánto es 15% de 4.500»);
- subir, bajar o silenciar el volumen;
- **pedir ayuda**;
- cancelar la última acción.

---

## 10. Capa de inteligencia artificial

### 10.0 Tres niveles, no uno

Desde octubre de 2026 la interpretación se resuelve en tres niveles, de más barato a más caro:

1. **Reglas deterministas.** Comandos simples y emergencias. Instantáneo, gratis, totalmente confiable.
2. **Modelo local** en nuestro servidor: un LFM2.5 de Liquid AI, de pesos abiertos, con invocación de herramientas. Gratis, privado, funciona sin Internet hacia afuera.
3. **Modelo remoto** (DeepSeek) solo para conversación abierta y preguntas generales.

**La mayoría del tráfico real de un asistente doméstico no pasa del segundo nivel.** Detalle, medición y licencias en `LIQUID_AI_Evaluacion.md`.

### 10.1 Qué puede y qué no puede hacer el modelo

**Puede:** interpretar frases ambiguas, extraer datos de un pedido en lenguaje natural, elegir una herramienta del catálogo, redactar respuestas conversacionales, responder preguntas generales.

**No puede:** ejecutar consultas a la base de datos, acceder a datos de otro hogar, disparar una emergencia, modificar permisos, gastar sin límite, ni ejecutar código.

### 10.2 Herramientas disponibles

El modelo recibe un catálogo acotado. Cada invocación se valida contra un esquema antes de ejecutarse.

`agregar_items`, `listar_items`, `marcar_comprado`, `crear_evento`, `consultar_agenda`, `crear_recordatorio`, `consultar_clima`, `ajustar_preferencia`.

Desde la Fase 8 se agregan `reproducir_musica`, `controlar_reproduccion` y `consultar_reproduccion`. Desde la Fase 9, `controlar_dispositivo`, `consultar_dispositivo` y `ejecutar_escena`, siempre limitadas a los dispositivos del hogar que hizo la pregunta.

**`disparar_emergencia` no está en el catálogo.** La emergencia se activa por regla o por botón, nunca por decisión de un modelo.

### 10.3 Control de costos

- Primero se intenta siempre la ruta determinista.
- El contexto enviado es el mínimo necesario, no el historial completo.
- Límite de gasto mensual por hogar, configurable; al alcanzarlo, el asistente sigue funcionando solo con rutas deterministas y avisa que lo está haciendo.
- Cada llamada se registra en `consumo_modelo`.
- Las tarifas se consultan al proveedor cuando haga falta estimar; **no se asumen precios de memoria.**

---

## 11. Interfaz

La especificación visual completa está en `DECISION_Frontend_Temas.md`. Acá va lo funcional.

### 11.1 Pantallas

| Pantalla | Contenido |
|---|---|
| **Principal** | La que está siempre. Hora, fecha, clima, agenda, compras, próximo recordatorio, estado de conexión, estado del micrófono, acceso a emergencia, tiempo de viaje. |
| **Escucha** | Estado superpuesto mientras el asistente escucha y responde: transcripción en vivo y confirmación de la acción. |
| **Listas** | Vista completa de una lista, con posibilidad de marcar y borrar. |
| **Agenda** | Día y próximos días. |
| **Emergencia** | Estado del incidente: a quién se avisó, quién confirmó, qué falló. |
| **Configuración** | Tema visual, densidad de texto, volumen, voz, dispositivos vinculados, contactos. |

### 11.2 Estados que la interfaz debe saber mostrar

Una interfaz que solo contempla el caso feliz es inservible en una casa real.

- cargando, por primera vez y al refrescar;
- sin conexión con el servidor, indicando desde cuándo;
- micrófono desconectado o sin permiso;
- orden no entendida, con sugerencia de reformular;
- acción fallida, diciendo qué falló;
- lista vacía, agenda vacía, sin recordatorios;
- modelo de lenguaje no disponible, aclarando que las órdenes simples siguen andando;
- emergencia activa, que tiene prioridad visual sobre todo lo demás.

### 11.3 Rendimiento en la Raspberry Pi 3

Es el riesgo técnico más concreto de la interfaz.

- El efecto vidrio (`backdrop-filter`) es costoso. **Se mide en la Fase 1.** Si no rinde, se reemplaza por color sólido semitransparente, que es visualmente cercano y mucho más barato.
- Las animaciones ambientales se pueden apagar con una preferencia, y se apagan solas si el sistema respeta `prefers-reduced-motion`.
- Objetivo: arranque hasta pantalla pintada en menos de 40 segundos desde el encendido, y desplazamiento fluido sin saltos perceptibles.
- Chromium en 1 GB de RAM necesita atención: sin pestañas extra, sin extensiones, con `zram` activado.

---

## 12. Música y multimedia

Se construye en la Fase 8. Requisito del usuario: poder pedirle música por voz y acceder a sus listas de reproducción de **Spotify** y **YouTube Music**.

### 12.0 El punto de partida: no hay Spotify Premium

El usuario **no tiene Premium**, y eso define todo lo demás. Hoy, con Alexa, al pedir un artista o una canción concreta recibe siempre la misma respuesta: «reproduciendo radio de…» y suena algo parecido, nunca lo que pidió. Eso pasa porque **Spotify no permite reproducción bajo demanda en cuentas gratuitas**, ni desde su API ni desde ningún cliente.

**El objetivo de esta función es superar eso:** que al pedir «poné De música ligera de Soda Stereo» suene esa canción, no una aproximación.

### 12.1 Fuentes de música

El sistema tiene una **capa de fuentes** intercambiables. Cuando se pide una canción, se recorre la lista hasta que una pueda reproducirla.

| Fuente | Qué resuelve | Costo | Estado |
|---|---|---|---|
| **YouTube (audio)** | **Canción o artista concreto.** Catálogo prácticamente completo. | Gratis | **La única que cumple el objetivo sin Premium** |
| **Radio por internet** | Géneros, emisoras, «algo de rock nacional». | Gratis y legítimo | Complemento |
| **Bluetooth** | Cualquier app del celular, incluida YouTube Music. | Gratis | Siempre disponible |
| **Spotify Connect** | Todo, con control por voz fino. | **Requiere Premium** | Solo si algún día lo contrata |

#### YouTube como fuente de audio

Se usa **yt-dlp** para resolver el título pedido y obtener el flujo de audio, que se reproduce con un reproductor local. **No se descarga el video ni se guarda el archivo**: se reproduce el audio del flujo, como haría un navegador.

Tres cosas que hay que decir con claridad, porque el usuario tiene que decidir con la información completa:

1. **Es zona gris respecto de los términos de servicio de YouTube.** No es una API oficial. Para uso personal en la propia casa es lo que hace medio mundo con sus asistentes caseros, pero no es algo para distribuir ni para un producto comercial.
2. **Se rompe cada tanto.** YouTube cambia cosas y `yt-dlp` se actualiza para seguirle el ritmo. Hay que mantener la herramienta al día; conviene una actualización automática periódica.
3. **No necesita las cookies de tu cuenta de Google** para contenido público, a diferencia de la vía no oficial de YouTube Music. Esa es una diferencia importante a favor: no se guardan credenciales de una cuenta que tiene tu correo y tus archivos.

#### Radio por internet

Mediante un directorio abierto de emisoras (**Radio Browser**, gratuito y sin clave). Resuelve pedidos de género o de emisora y es **completamente legítimo**: son flujos públicos que las radios publican para ser escuchados.

Sirve además como **modo radio honesto**: si se pide un artista y por algún motivo no se puede traer la canción, se puede ofrecer una emisora del género, **diciendo claramente que es una radio y no la canción pedida**. A diferencia de Alexa, que dice «reproduciendo radio de X» como si fuera lo mismo, JARVIS debe decir qué está haciendo realmente.

### 12.2 Spotify, si alguna vez hay Premium

La integración queda **diseñada pero apagada**, lista para encenderse si el usuario contrata Premium.

- **Reproducción:** la Raspberry se convierte en un receptor de **Spotify Connect**, es decir, aparece como un parlante más en la lista de dispositivos de la app de Spotify del celular. Dos opciones:
  - **Spotify Soloist**, el cliente oficial sin interfaz gráfica que Spotify publicó en agosto de 2026 para Raspberry Pi y Linux. Expone una API local por WebSocket con reproducir, pausar, avanzar, volumen, aleatorio y repetición. Su configuración inicial exige Premium, pero una vez andando se le pueden conectar cuentas gratuitas.
  - **librespot**, el cliente de código abierto, más probado en el tiempo. Su documentación dice explícitamente que **solo funciona con Premium y eso no va a cambiar**.
- **Control y búsqueda:** la **Spotify Web API** oficial, para buscar canciones, leer las listas de reproducción del usuario y controlar la reproducción. Requiere que el usuario autorice la aplicación una vez (OAuth), y el token de refresco se guarda cifrado asociado a su hogar.
- **Decisión:** empezar con **Soloist**, por ser oficial y traer API local. Si da problemas, librespot es el plan B. La capa de música se escribe detrás de un adaptador, igual que el proveedor de IA, para poder cambiar sin tocar nada más.

- **Reproducción:** la Raspberry como receptor de **Spotify Connect**, con **Spotify Soloist** (el cliente oficial sin interfaz que Spotify publicó en agosto de 2026, con API local por WebSocket) o **librespot** como plan B. Ambos exigen Premium; librespot lo dice explícitamente y aclara que no va a cambiar.
- **Control y búsqueda:** la Spotify Web API oficial, con autorización OAuth del usuario y token de refresco cifrado por hogar.

**YouTube Music no se integra por API.** No tiene vía oficial de reproducción, y la no oficial (`ytmusicapi`) exige guardar las cookies de la cuenta de Google. Para YouTube Music se usan las otras dos vías: el audio de YouTube para canciones concretas, y el Bluetooth para reproducir desde la app del celular.

### 12.3 Reproducción desde el celular por Bluetooth

La Pi 3 tiene Bluetooth integrado. Configurada como receptor de audio (perfil **A2DP**), aparece como un parlante en el celular, y **cualquier aplicación del teléfono suena por el equipo**: YouTube Music, un podcast, un video de WhatsApp.

Y no es un canal mudo: por **AVRCP** la Raspberry recibe los metadatos de lo que está sonando y puede mandar comandos de vuelta al teléfono.

- **Lo que se recibe de forma confiable:** título, artista, álbum, duración, posición y estado de reproducción, a través de la interfaz `MediaPlayer1` de BlueZ.
- **Lo que se puede mandar:** reproducir, pausar, siguiente, anterior. Es decir, **los botones de la pantalla controlan el celular**.
- **Lo que NO llega de forma confiable: la carátula.** Ver 12.5.

### 12.4 La pantalla «Reproduciendo» — requisito visual

> **Esto no es un adorno.** El usuario lo marcó como importante: lo visual y la accesibilidad son parte del valor del proyecto. Cada vez que suene música, **tiene que notarse en la pantalla**.

Cuando empieza a sonar algo, por cualquier fuente, la pantalla principal transiciona a una **vista de reproducción a pantalla completa**, en el tema activo (Lavanda o Menta).

Tiene que mostrar:

1. **La carátula, grande.** Es el elemento visual dominante.
2. **Título y artista**, con el título en tipografía grande y legible desde lejos.
3. **De dónde sale la música**, explícito y sin ambigüedad: «desde YouTube», «radio La 100», o **«desde el iPhone de Germán, por Bluetooth»** cuando viene del celular. El usuario tiene que saber siempre qué está escuchando y de dónde sale.
4. **Barra de progreso** con tiempo transcurrido y total, cuando la fuente los informa.
5. **Controles táctiles grandes**: anterior, reproducir/pausar, siguiente, volumen. Mínimo 44 px, y bastante más en el modo de densidad aumentada del hogar B.
6. **Acceso a emergencia, siempre visible.** Ni la pantalla de reproducción lo tapa.
7. **Una forma evidente de volver** al panel principal, y un regreso automático tras un rato de inactividad, manteniendo una barra compacta de «sigue sonando» abajo.

**Cuando la música está sonando pero el usuario volvió al panel principal**, la tarjeta de reproducción no desaparece: queda una **barra compacta en la parte inferior** con carátula chica, título, artista y pausa. Nunca hay música sonando sin que la pantalla lo refleje.

**Transiciones:** entrada y salida con las mismas curvas del resto de la interfaz. El cambio de canción cruza la carátula con un fundido, no un corte.

### 12.5 Carátulas

Acá hay un detalle técnico que conviene tener claro desde ahora, porque afecta a lo visual.

**Por Bluetooth, la carátula casi nunca llega.** BlueZ expone título, artista y álbum sin problema, pero la imagen depende de una extensión experimental (OBEX BIP sobre AVRCP 1.6) que requiere una compilación especial de BlueZ, que el teléfono la publique y que el reproductor la soporte. En la práctica, la mayoría de las veces no está.

**Solución:** se busca la carátula por separado, con el artista y el título que sí llegaron, contra un servicio público y gratuito de metadatos musicales (la API de búsqueda de iTunes, Deezer o Cover Art Archive, ninguna de las cuales requiere clave). Se cachea localmente por canción, para no consultar dos veces lo mismo.

**Si no se encuentra carátula**, se muestra un marcador generado con las iniciales del artista en los colores del tema. **Nunca un hueco vacío ni un ícono roto.**

### 12.6 Qué tiene que poder hacerse por voz

- «Jarvis, poné De música ligera» → busca y reproduce esa canción.
- «Jarvis, poné Soda Stereo» → reproduce temas de ese artista.
- «Jarvis, poné rock nacional» → género, por YouTube o por radio.
- «Jarvis, poné radio Aspen» → emisora concreta.
- «siguiente», «pará la música», «subí el volumen», «¿qué está sonando?».

### 12.7 Reglas

- La música **se silencia automáticamente** al detectar la palabra de activación, y vuelve al volumen anterior al terminar la respuesta.
- Una **alerta de emergencia corta la música inmediatamente**. Sin excepción.
- Los recordatorios bajan el volumen, no lo cortan.
- **JARVIS nunca dice que está reproduciendo algo que no es lo pedido.** Si no encontró la canción y ofrece una radio del género, lo dice: «No la encontré, ¿querés que ponga una radio de rock nacional?». Es la misma regla de honestidad de todo el sistema, aplicada a la música.
- Los tokens de cada servicio se guardan **cifrados y asociados a un hogar**.

---

## 13. Dispositivos del hogar

Se construye en la Fase 9. Requisito del usuario: controlar lo que hoy maneja con Alexa — **luces LEDVANCE SMART+ WiFi** y una **aspiradora robot Liectroux**, que desde el celular usa con la app **Tuya Smart**.

### 13.1 La buena noticia: los dos son Tuya

Tanto las luces LEDVANCE SMART+ WiFi como la aspiradora Liectroux funcionan sobre la plataforma **Tuya**. LEDVANCE SMART+ WiFi está construido sobre Tuya, y Liectroux usa directamente la app Tuya Smart.

**Eso significa una sola integración para los dos dispositivos**, y además deja la puerta abierta a casi cualquier accesorio barato de casa inteligente que se compre después, porque la enorme mayoría son Tuya por debajo.

### 13.2 Dos caminos de control

| | Tuya Cloud API | Control local (tinytuya / tuya-local) |
|---|---|---|
| **Desde dónde** | El servidor en Contabo | La Raspberry, en la red de casa |
| **Necesita Internet** | Sí, siempre | No |
| **Latencia** | 1–3 segundos | Inmediata |
| **Configuración** | Cuenta de desarrollador en Tuya IoT Platform y vinculación de la cuenta Smart Life | Hay que extraer la **clave local** de cada dispositivo |
| **Fragilidad** | La cuenta de desarrollador de Tuya tiene períodos de prueba que hay que renovar | Los modelos nuevos usan protocolo 3.5, que no todas las bibliotecas soportan |

**Decisión: empezar por Tuya Cloud**, porque no requiere extraer claves y funciona para ambos dispositivos desde el primer día. **Agregar control local después**, para ganar velocidad y que las luces sigan andando aunque se caiga Internet.

### 13.3 Advertencia a verificar

Hay un reporte de mayo de 2026 de un usuario cuyo foco SMART+ dejó de funcionar tras un cambio de Wi-Fi, preguntando si los dispositivos SMART+ **siguen siendo Tuya**. No pude confirmarlo. Es posible que LEDVANCE esté migrando a una plataforma propia en sus modelos nuevos.

**Por eso la Fase 9 empieza con una tarea de verificación con los dispositivos reales**, antes de escribir una línea de integración. Si LEDVANCE se separó de Tuya, la aspiradora igual funciona y las luces necesitan otro camino.

### 13.4 Qué tiene que poder hacerse

- **Luces:** encender, apagar, regular intensidad, cambiar color o temperatura, y agrupar por ambiente («las luces del living»).
- **Aspiradora:** empezar a limpiar, parar, volver a la base, y consultar el estado y la batería.
- **Escenas:** una orden que dispara varias acciones («modo noche» apaga las luces y pone la aspiradora en la base).
- **Automatizaciones básicas:** por horario o por evento del calendario.

### 13.5 Arquitectura

Los dispositivos del hogar se exponen al resto del sistema detrás de un **adaptador de domótica**, igual que la IA y la música. Hoy ese adaptador habla con Tuya; mañana puede hablar con Home Assistant, con Matter o con lo que haga falta, **sin tocar la lógica ni la interfaz**.

Cada dispositivo pertenece a un hogar. **La aspiradora del hogar A no existe para el hogar B**, ni aparece en sus listados, ni puede ser encendida desde allí, ni se menciona en el contexto que se le manda al modelo.

### 13.6 Reglas de seguridad

- Las órdenes a dispositivos físicos **se confirman contra el estado real** antes de responder. Si la luz no respondió, JARVIS dice que no pudo, no que la apagó.
- El modelo de lenguaje puede invocar `controlar_dispositivo`, pero **solo sobre dispositivos del hogar que pregunta** y con parámetros validados.
- Las credenciales de Tuya se guardan cifradas, por hogar, fuera del repositorio.

---

## 14. Emergencias

Se construye en la Fase 7, pero se diseña ahora porque condiciona decisiones previas.

### 14.1 Activación

1. Botón físico en GPIO — **el más confiable, no depende de nada**;
2. frase de emergencia detectada por regla;
3. botón en pantalla.

### 14.2 Flujo

1. Se registra la alerta y se enciende la señal local: sonido y pantalla roja. **Esto pasa aunque no haya Internet.**
2. JARVIS anuncia en voz alta que va a avisar a la familia.
3. Se notifica al primer contacto según el orden de escalamiento.
4. Se espera confirmación durante el intervalo configurado.
5. Sin confirmación, se escala al siguiente contacto y, si corresponde, al siguiente canal.
6. La pantalla muestra en todo momento **el estado real**: enviado, entregado, confirmado o fallido. Cada uno significa algo distinto y no se confunden.
7. El incidente se cierra según el procedimiento definido. Una falsa alarma se cancela fácil, pero queda registrada.

### 14.3 Qué pasa cuando algo falla

| Falla | Respuesta del sistema |
|---|---|
| Sin Internet | Alarma local igual. La pantalla dice con todas las letras que no se pudo avisar afuera. |
| Servidor caído | El agente local dispara la alarma y reintenta el aviso cuando vuelva. |
| Notificación sin entregar | Se registra como fallida y se escala. **Nunca se muestra como entregada.** |
| Contacto sin responder | Se escala al siguiente pasado el intervalo. |
| Corte de luz | Sin alimentación de respaldo, el dispositivo se apaga. **Esta limitación se documenta y se le comunica a la familia.** |

### 14.5 Modo acompañamiento

El botón y la frase cubren el caso en que la persona **puede** pedir ayuda. El modo acompañamiento cubre el caso en que **no puede**: se desmayó, se cayó lejos del botón, o simplemente no llega.

**Cómo funciona, sin cámara y sin guardar audio:**

1. Se registran **señales de actividad**, solo marcas de tiempo y nunca contenido: interacciones con la pantalla, órdenes de voz, luces encendidas o apagadas, movimiento detectado.
2. Si no hay **ninguna señal** durante una ventana configurable, JARVIS **pregunta primero** en voz alta y da tiempo generoso a responder.
3. Si nadie responde, se avisa por el mismo circuito de escalamiento de la emergencia, **con un mensaje distinto** que aclare que es una alerta de inactividad y no una emergencia confirmada. La diferencia importa: quien recibe el aviso tiene que saber qué se está afirmando.

**Control del usuario, no negociable:** se puede apagar, pausar por un rato y ajustar la ventana. **La persona tiene que saber que está activo.** Vigilar a alguien sin que lo sepa no es cuidarlo.

**Límites:** no detecta caídas. Detecta ausencia de actividad, que es otra cosa y tiene falsos positivos evidentes —una siesta larga, un fin de semana afuera—. Por eso pregunta antes de avisar, y por eso la ventana es generosa y configurable.

### 14.6 Límite honesto

JARVIS no es un servicio médico ni un sistema de alarma certificado. Antes de que alguien dependa de él, se prueba de punta a punta, se documentan sus límites y la familia tiene un procedimiento alternativo que no pasa por JARVIS.

---

## 15. Seguridad y secretos

### 15.1 Sobre las contraseñas

**En este documento no hay ni va a haber credenciales.** Tampoco en el repositorio, ni en los mensajes de commit, ni en capturas de pantalla.

Cómo se manejan:

- Un archivo `.env` vive **solo en el servidor**, fuera del control de versiones, con permisos restringidos al usuario que corre los servicios.
- El repositorio tiene un `.env.example` con los nombres de las variables y valores de ejemplo vacíos.
- Las contraseñas de los usuarios se guardan con **Argon2**, nunca reversibles.
- Los tokens de dispositivo se guardan **hasheados**; el valor en claro se muestra una sola vez al vincular.
- Si una credencial se filtra alguna vez, se rota: se cambia en el proveedor, se actualiza el `.env` y se reinician los servicios.

### 15.2 Secretos que el sistema necesita

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL |
| `JWT_SECRET` | Firma de tokens de sesión |
| `DEEPSEEK_API_KEY` | Modelo de lenguaje |
| `WEATHER_API_KEY` | Clima |
| `PUSH_*` | Notificaciones a celulares |
| `SMS_*` / `TELEFONIA_*` | Fase 5, cuando se elija proveedor |

### 15.3 Resto de la seguridad

- HTTPS obligatorio; sin excepciones ni siquiera en pruebas contra el servidor.
- La Raspberry **no se expone a Internet**: solo hace conexiones salientes.
- Acceso SSH al servidor por clave, con contraseña deshabilitada, y cortafuegos abierto únicamente en 22, 80 y 443.
- Las sesiones expiran; los dispositivos se revocan de a uno.
- Dependencias actualizadas con una revisión periódica.
- Copias de seguridad diarias de la base de datos **con restauración probada**. Una copia que nunca se restauró no es una copia.

---

## 16. Despliegue

### 16.1 Entornos

| Entorno | Dónde | Datos |
|---|---|---|
| Desarrollo | PC y notebook del usuario | Ficticios |
| Pruebas | Contenedores separados en Contabo | Ficticios, **sin contactos de emergencia reales** |
| Producción | Contabo + Raspberry en el hogar | Reales |

### 16.2 Procedimiento

Todo corre en Docker Compose detrás de Caddy. Desplegar es traer la versión nueva, aplicar migraciones y levantar los contenedores. Volver atrás es levantar la etiqueta anterior y, si hizo falta, restaurar la base.

**Nunca se despliega sin probar en el hogar propio primero.** El dispositivo de la madre recibe solo versiones ya validadas.

### 16.3 El dispositivo

La Raspberry arranca sola: enciende, levanta el agente local y abre Chromium en pantalla completa sin intervención. Si pierde conexión, reintenta y lo muestra. Si se corta la luz y vuelve, arranca sin que nadie toque nada.

---

## 17. Observabilidad

- Registros estructurados en el servidor, con rotación.
- Una vista de salud técnica: estado de cada dispositivo, último contacto, errores recientes, consumo del modelo.
- Alertas al administrador si un dispositivo deja de reportarse por más de un intervalo definido.
- **Métricas que importan de verdad:** tasa de acierto en órdenes de voz, latencia real, falsas activaciones, fallos de notificación.

---

## 18. Pruebas y criterios de aceptación

### 18.1 Qué se prueba automáticamente

- Lógica de interpretación de órdenes deterministas.
- Permisos y aislamiento entre hogares — **con pruebas que intenten explícitamente leer datos de otro hogar y verifiquen que fallan**.
- Validación de parámetros de herramientas.
- Flujo de escalamiento de emergencias, con el reloj simulado.
- Migraciones, hacia adelante y hacia atrás.

### 18.2 Qué se prueba a mano, en la casa

Porque hay cosas que un test no captura: ruido, distancia, acento, luz sobre la pantalla, y una persona mayor usándolo sin que nadie le explique.

### 18.3 Criterios de aceptación de la primera versión

- Una frase hablada agrega el producto correcto a la lista correcta.
- La lista sobrevive a un reinicio del dispositivo.
- El cambio aparece en el celular.
- Un evento se crea con la fecha y la hora correctas, y si la frase era ambigua, el asistente pregunta.
- **El sistema nunca confirma una acción que falló.**
- Un usuario no puede leer datos de un hogar al que no pertenece.
- La emergencia funciona por botón y por voz, y la pantalla refleja el estado real de cada aviso.
- No hay credenciales en el repositorio.
- Hay copias de seguridad y la restauración se probó al menos una vez.

---

## 19. Riesgos

| Riesgo | Probabilidad | Impacto | Qué se hace |
|---|---|---|---|
| El efecto vidrio no rinde en la Pi 3 | Media | Bajo | Degradación ya prevista; se mide en Fase 1. |
| Whisper demasiado lento en el VPS | Media | Alto | Probar modelos más chicos; si no alcanza, STT por API. |
| Sin voz en español aceptable para Piper | Media | Medio | Sintetizar en el servidor. |
| Notificaciones push poco confiables | **Alta** | **Alto** | Probar con la app cerrada y el teléfono bloqueado. Si falla, SMS o llamada. Nunca canal único. |
| Falsas activaciones molestas | Media | Medio | Ajustar sensibilidad; permitir silenciar. |
| Costos del modelo más altos de lo previsto | Baja | Medio | Rutas deterministas, límites, registro de consumo. |
| Corte de luz durante una emergencia | Baja | **Crítico** | Documentarlo con honestidad; evaluar respaldo. |
| El proyecto se estanca por ambicioso | **Alta** | Alto | Fases cortas con algo funcionando al final de cada una. |
| Dependencia de una sola persona | Alta | Medio | Documentar mientras se construye, no después. |
| YouTube Music sin API oficial: la vía no oficial se rompe | **Alta** | Bajo | El Bluetooth A2DP resuelve el caso de uso sin depender de nadie. |
| LEDVANCE migrando fuera de Tuya | Media | Medio | Verificar con los dispositivos reales antes de integrar (Fase 9.1). |
| Cuenta de desarrollador de Tuya con prueba vencida | Media | Medio | Agregar control local como respaldo. |
| Spotify exige Premium | Confirmado | Bajo | Es una condición conocida, no un riesgo: si no hay Premium, queda el Bluetooth. |

---

## 20. Decisiones que siguen abiertas

| # | Pendiente | Quién decide | Cuándo hace falta |
|---|---|---|---|
| 1 | Versión exacta de Ubuntu en Contabo | Usuario (verificar) | Fase 0 |
| 2 | Copias de seguridad del VPS | Usuario | Antes de datos reales |
| 3 | Dominio para el servidor | Usuario | Fase 0 |
| 4 | Pantalla: tamaño y si es táctil | Usuario | Fase 6 (hasta entonces, televisor) |
| 5 | Micrófono y parlante concretos | Usuario, con recomendación | Fase 4 |
| 6 | Proveedor de notificaciones push | A definir tras pruebas | Fase 6 |
| 7 | Proveedor de SMS y telefonía en Argentina | Usuario, con investigación | Fase 7 |
| 8 | Contactos y tiempos de escalamiento | Usuario y familia | Fase 7 |
| 9 | Calendario externo a sincronizar | Usuario | Fase 6 |
| 10 | Alimentación de respaldo | Usuario | Fase 7 |
| 11 | Wake word, STT y TTS definitivos | Tras medir | Fase 4 |
| 12 | Escala de densidad para el hogar B | A definir | Fase 8 |
| 13 | Modo nocturno | A definir | Fase 8 |
| 14 | Segunda Raspberry | Usuario | Fase 10 |
| 19 | Verificar la licencia del modelo de Liquid AI en Hugging Face | A verificar | Fase 5 |
| 20 | Ventana de inactividad del modo acompañamiento, acordada con la persona | Usuario y familia | Fase 7 |
| 15 | ¿Tenés o vas a tener Spotify Premium? Sin Premium no hay integración posible | Usuario | Fase 8 |
| 16 | ¿Aceptás la vía no oficial de YouTube Music, con sus riesgos, o alcanza con Bluetooth? | Usuario | Fase 8 |
| 17 | Modelos exactos de las luces LEDVANCE y de la aspiradora Liectroux | Usuario (verificar) | Fase 9 |
| 18 | Crear la cuenta de desarrollador en Tuya IoT Platform | Usuario | Fase 9 |
