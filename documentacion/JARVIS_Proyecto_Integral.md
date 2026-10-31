# JARVIS — Proyecto integral
## Asistente personal por voz, organización doméstica y centro de asistencia familiar

**Versión del documento:** 1.0  
**Fecha:** 26 de octubre de 2026  
**Estado:** Definición inicial del proyecto  
**Idioma principal:** Español  
**Plataforma de prototipo:** Raspberry Pi 3 Model B  
**Arquitectura objetivo:** Dispositivos locales + servidor central + servicios externos opcionales

---

## 1. Resumen ejecutivo

JARVIS será un asistente doméstico propio, modular y personalizable, pensado para utilizarse en dos hogares: el del usuario y el de su madre, una persona jubilada que vive sola. El sistema combinará interacción por voz, una interfaz visual, listas compartidas, agenda, recordatorios, inteligencia artificial conversacional, automatizaciones domésticas y un sistema de alertas familiares.

No se pretende construir únicamente un altavoz inteligente. La meta es crear una plataforma ampliable que pueda adaptarse a las necesidades de cada hogar, mantener el control de los datos y sumar funciones sin tener que rehacer el proyecto desde cero.

La prioridad es desarrollar el primer prototipo usando el hardware que ya existe: una **Raspberry Pi 3 Model B con carcasa**. La computadora personal y la notebook del usuario se utilizarán únicamente para desarrollar y probar el código. No serán servidores de producción ni componentes necesarios para que JARVIS funcione.

El servidor contratado por el usuario será, si sus características lo permiten, el centro de la aplicación: backend, API, usuarios, listas, agenda, sincronización y coordinación de notificaciones. El proveedor, el tipo de alojamiento y sus recursos aún deben confirmarse. No se deben asumir credenciales, características del plan ni servicios contratados hasta verificarlos.

La cámara se incorporará en una etapa posterior. Primero se priorizarán la experiencia básica, la voz, la sincronización y las alertas de emergencia.

> **Principio de seguridad:** el sistema de emergencias no debe depender de un LLM, de una respuesta de DeepSeek ni de una conexión permanente a Internet para activar una alarma local. Ningún sistema doméstico casero garantiza por sí solo la asistencia de una persona; JARVIS debe complementar, no reemplazar, los servicios de emergencia y los procedimientos familiares.

---

## 2. Visión y objetivos

### 2.1 Visión

Crear un asistente llamado **JARVIS** que se active por voz, responda oralmente, muestre información útil en una pantalla y permita organizar actividades cotidianas desde dos hogares conectados de forma segura.

La experiencia debe ser más configurable y adaptable que un asistente comercial cerrado. El sistema debe permitir elegir los servicios de IA, personalizar la interfaz, configurar los comandos, definir permisos por hogar y ampliar las integraciones a medida que surjan nuevas necesidades.

### 2.2 Objetivos principales

1. Reutilizar la Raspberry Pi 3 Model B para el primer prototipo.
2. Construir una interfaz visual clara y atractiva, inicialmente en una pantalla HDMI de entre 7 y 10 pulgadas.
3. Interactuar por voz en español mediante una palabra de activación, por ejemplo, «Jarvis».
4. Gestionar listas de compras, agenda, alarmas y recordatorios.
5. Sincronizar los datos autorizados con una aplicación accesible desde los celulares.
6. Usar DeepSeek por API como proveedor inicial de IA conversacional, manteniendo la posibilidad de cambiarlo.
7. Ejecutar los comandos simples con lógica local y determinista para ahorrar tokens, reducir latencia y aumentar la fiabilidad.
8. Implementar un sistema de emergencia con alertas a familiares, confirmación de recepción y escalamiento.
9. Mantener separados los datos y permisos de cada hogar.
10. Incorporar cámara, detección de personas y posible reconocimiento facial al final.
11. Evitar compras de hardware innecesarias antes de validar el prototipo.
12. Documentar la instalación, el desarrollo, las pruebas y las operaciones de mantenimiento.

### 2.3 Principios de diseño

- **Modularidad:** cada capacidad debe poder sustituirse sin rehacer el sistema completo.
- **Primero la fiabilidad:** las funciones de emergencia tienen prioridad sobre la conversación.
- **Privacidad por defecto:** recopilar y compartir solo los datos necesarios.
- **Interfaz accesible:** texto legible, botones grandes, estados evidentes y pocos pasos.
- **Uso sencillo:** el sistema debe poder utilizarse sin conocimientos técnicos.
- **Degradación controlada:** si Internet o la IA fallan, las funciones locales esenciales deben seguir funcionando.
- **Costos transparentes:** registrar y controlar los gastos recurrentes de IA, mensajería, telefonía y alojamiento.
- **No fingir acciones:** JARVIS solo debe confirmar una acción cuando haya verificado que se ejecutó correctamente.
- **No confiar ciegamente en la IA:** las operaciones sensibles requieren reglas, permisos y confirmaciones explícitas.

---

## 3. Usuarios, hogares y permisos

### 3.1 Usuarios previstos

- **Administrador:** configura el sistema, los dispositivos, los contactos, los permisos y las integraciones.
- **Usuario del hogar A:** utiliza su propio dispositivo, listas, agenda y funciones personales.
- **Usuario del hogar B:** utiliza su dispositivo y recibe asistencia doméstica.
- **Contactos de emergencia:** reciben alertas y pueden confirmar que están atendiendo el incidente.

Una misma persona puede desempeñar más de un rol.

### 3.2 Separación de hogares

Cada hogar tendrá una configuración independiente:

- nombre e identificador del hogar;
- dispositivos conectados;
- listas privadas y compartidas;
- calendario y eventos;
- contactos de emergencia;
- sensores y cámaras autorizados;
- reglas de notificación;
- preferencias de voz, volumen e interfaz.

Compartir una lista no debe dar acceso automáticamente a todos los eventos, grabaciones o datos de seguridad del otro hogar.

### 3.3 Modelo de permisos

Como mínimo, diferenciar:

- datos privados del usuario;
- datos compartidos por elección;
- datos operativos del dispositivo;
- información de emergencia;
- datos de cámara y biometría, si se incorporan.

Las acciones administrativas y los cambios de permisos deben requerir autenticación. No se deben incluir claves, tokens ni contraseñas en el código fuente o en este documento.

---

## 4. Arquitectura propuesta

### 4.1 Esquema general

```text
                  ┌────────────────────────────┐
                  │       Celular usuario A    │
                  │   PWA / notificaciones     │
                  └─────────────┬──────────────┘
                                │ HTTPS
                                │
┌────────────────────────┐      ▼       ┌────────────────────────┐
│ Raspberry Pi 3 - A     │◄────────────►│ Servidor central       │
│ Pantalla + micrófono   │    HTTPS/WSS │ API / autenticación    │
│ Audio + interfaz local │              │ Listas / agenda        │
│ Acciones locales       │              │ Sincronización         │
└────────────────────────┘              │ Notificaciones         │
                                        │ Base de datos          │
┌────────────────────────┐              └──────────┬─────────────┘
│ Raspberry Pi 3 - B     │◄────────────────────────┤
│ Pantalla + micrófono   │                         │
│ Audio + interfaz local │                         ▼
│ Emergencia local       │              ┌────────────────────────┐
└────────────────────────┘              │ Servicios externos     │
                                        │ DeepSeek API           │
                  ┌─────────────────────│ Push / SMS / telefonía │
                  │                     │ Calendario / integrac. │
                  ▼                     └────────────────────────┘
       ┌────────────────────────┐
       │ Celular usuario B      │
       │ PWA / alertas          │
       └────────────────────────┘
```

El esquema es conceptual. La arquitectura definitiva dependerá del tipo y los recursos del servidor contratado.

### 4.2 Responsabilidades del dispositivo local

La Raspberry ejecutará un programa ligero para:

- mostrar la interfaz en pantalla;
- escuchar la palabra de activación;
- capturar audio y reproducir respuestas;
- enviar peticiones autenticadas al backend;
- recibir actualizaciones y notificaciones;
- ofrecer controles locales esenciales;
- mantener una alarma local si se activa una emergencia y no hay Internet;
- informar si pierde conectividad con el servidor.

No se intentará ejecutar en la Pi 3 un LLM grande ni una pila pesada de visión artificial. La capacidad de procesamiento es limitada, especialmente con solo 1 GB de RAM.

### 4.3 Responsabilidades del servidor central

Si el alojamiento lo permite, el servidor se encargará de:

- API y lógica de negocio;
- autenticación y autorización;
- gestión de usuarios y hogares;
- persistencia de listas, agenda y configuración;
- sincronización entre dispositivos;
- integración con DeepSeek;
- coordinación de notificaciones y escalamiento;
- registro de eventos operativos;
- configuración y supervisión de los dispositivos;
- control de costos y límites de uso.

### 4.4 Servicios externos

Los proveedores externos se deben aislar detrás de adaptadores para que puedan reemplazarse:

- proveedor de LLM;
- servicio de notificaciones push;
- proveedor de SMS y telefonía;
- calendarios externos;
- servicio de mapas, clima o transporte, si se incorporan;
- alojamiento de archivos o almacenamiento de eventos, cuando sea necesario.

### 4.5 Conectividad y seguridad

- HTTPS para comunicaciones web y API.
- Autenticación por dispositivo, con credenciales individuales revocables.
- WebSocket seguro (WSS) solo cuando aporte valor para actualizaciones en tiempo real.
- No exponer directamente la Raspberry a Internet.
- No publicar interfaces administrativas sin autenticación.
- No almacenar claves en el repositorio.
- Usar variables de entorno o un mecanismo de secretos del servidor.
- Aplicar actualizaciones y copias de seguridad.
- Mantener un registro de acciones relevantes sin guardar audio o datos personales innecesarios.

---

## 5. Funcionalidades previstas

### 5.1 Interacción por voz

Ejemplos de comandos:

- «Jarvis, agregá leche a la lista de compras».
- «Jarvis, ¿qué me falta comprar?».
- «Jarvis, el jueves tengo médico a las diez».
- «Jarvis, recordame mañana que tengo que llamar al banco».
- «Jarvis, ¿qué tengo en la agenda de hoy?».
- «Jarvis, necesito ayuda».
- «Jarvis, llamá a mi contacto de emergencia».

Requisitos:

- español como idioma inicial;
- posibilidad de ajustar el volumen y la velocidad del habla;
- respuesta oral y visual;
- manejo de frases ambiguas mediante preguntas cortas;
- confirmación de datos críticos, como fecha, hora, contacto o acción;
- cancelación de acciones cuando sea apropiado;
- registro de resultado real antes de confirmar;
- funcionamiento de los comandos esenciales sin IA generativa.

### 5.2 Lista de compras

Funciones previstas:

- crear listas privadas y compartidas;
- agregar uno o varios productos por voz;
- registrar cantidades y unidades;
- evitar duplicados cuando sea razonable;
- editar, eliminar y marcar productos como comprados;
- sincronizar cambios entre dispositivos y celulares;
- consultar qué falta comprar;
- conservar una lista persistente;
- mostrar quién agregó o modificó un elemento, si resulta útil.

Ejemplo:

> «Jarvis, agregá dos kilos de papa, leche y detergente a las compras».

El sistema debería interpretar los tres productos, actualizar la lista y responder solo después de confirmar la operación en la base de datos.

### 5.3 Agenda, turnos y recordatorios

Funciones previstas:

- crear eventos por voz;
- guardar fecha, hora, duración y notas;
- preguntar cuando la fecha o la hora sean ambiguas;
- mostrar agenda de hoy y próximos días;
- recordatorios anticipados;
- eventos recurrentes y cumpleaños;
- sincronización opcional con Google Calendar u otro calendario compatible;
- distinguir la agenda de cada persona;
- evitar duplicar eventos al sincronizar.

Los recordatorios relacionados con medicación pueden avisar y registrar una confirmación, pero no deben afirmar que un medicamento fue tomado sin evidencia. No se deben realizar recomendaciones médicas automáticas basadas solo en un LLM.

### 5.4 Conversación con IA

DeepSeek será el proveedor inicial para:

- interpretar frases naturales complejas;
- responder preguntas generales;
- extraer datos de una solicitud;
- seleccionar herramientas autorizadas;
- ayudar a navegar listas, agenda y funciones del hogar.

La IA no debe tener acceso directo e irrestricto a la base de datos ni ejecutar código arbitrario. Debe utilizar herramientas definidas por el backend, con validación de permisos y parámetros.

Se recomienda una capa de proveedor independiente, de modo que cambiar de modelo no obligue a modificar la interfaz ni la lógica de negocio.

### 5.5 Dashboard visual

El dashboard inicial debería mostrar:

- hora y fecha;
- estado de conexión;
- saludo y nombre del hogar;
- próximos eventos;
- lista de compras;
- recordatorios pendientes;
- estado del asistente y del micrófono;
- notificaciones recientes;
- acceso visual al modo de emergencia.

La interfaz debe priorizar legibilidad, contraste y elementos grandes. En la instalación de la madre se debe evitar una pantalla recargada y minimizar los pasos necesarios para solicitar ayuda.

### 5.6 Aplicación para celulares

Primera opción: una **PWA** (aplicación web instalable), con diseño adaptable a móviles.

Funciones:

- iniciar sesión;
- consultar y editar listas;
- consultar agenda;
- recibir notificaciones;
- confirmar alertas;
- consultar el estado de los dispositivos;
- administrar contactos y permisos según el rol.

Una PWA reduce el esfuerzo inicial porque comparte gran parte del frontend con la pantalla de JARVIS. Las capacidades de notificaciones y funcionamiento en segundo plano varían según el sistema operativo y el navegador. Si las pruebas no ofrecen suficiente fiabilidad, se evaluará una app nativa.

### 5.7 Automatizaciones domésticas futuras

Posibles ampliaciones:

- luces y enchufes inteligentes;
- sensores de apertura;
- temperatura y humedad;
- detección de pérdidas de agua;
- sensores compatibles de humo u otros riesgos;
- información meteorológica;
- transporte público;
- calendarios y cumpleaños;
- panel de estado de dispositivos.

Home Assistant puede servir como plataforma de integración para dispositivos y automatizaciones, sin obligar a que toda la aplicación JARVIS sea una instancia estándar de Home Assistant.

---

## 6. Sistema de emergencias: requisito prioritario

Este módulo es especialmente importante porque una persona podría caerse, no poder levantarse o necesitar asistencia estando sola.

### 6.1 Activación

Vías posibles:

1. Comando de voz: «Jarvis, necesito ayuda».
2. Frases alternativas: «Me caí», «llamá a mi familia» o frases configuradas.
3. Botón físico grande, accesible y claramente identificado.
4. En una fase posterior, sensores o dispositivos especializados compatibles.

No se debe depender únicamente de una frase exacta ni de la IA. Los comandos de emergencia se deben detectar mediante reglas y rutas prioritarias.

### 6.2 Flujo propuesto

1. Se detecta una solicitud de ayuda.
2. Se activa inmediatamente el estado de emergencia y una señal local.
3. JARVIS anuncia que va a avisar a los contactos.
4. Se envían alertas a los contactos autorizados.
5. Cada contacto puede confirmar que está atendiendo el incidente.
6. Si nadie confirma dentro del intervalo configurado, el sistema escala al siguiente contacto o canal.
7. Se informa a la persona si la alerta se envió, si se recibió confirmación o si hubo un fallo.
8. Se registra la hora de activación, los intentos, los resultados y quién respondió.
9. La alarma solo se cierra de acuerdo con el procedimiento definido; una falsa activación debe poder cancelarse de forma sencilla, sin borrar el historial relevante.

### 6.3 Canales de comunicación

**Notificaciones de aplicación**
- Permiten avisar a varios familiares y ofrecer botones de respuesta.
- Dependen de conectividad, permisos y funcionamiento del servicio de notificaciones.
- Deben probarse con la aplicación cerrada y el teléfono bloqueado.

**SMS**
- Puede utilizarse un proveedor de mensajería o un módem celular compatible.
- Requiere cobertura y servicio activo.
- Deben validarse costo, entrega y compatibilidad en Argentina.

**Llamada telefónica automática**
- Puede implementarse mediante un proveedor de telefonía o hardware celular adecuado.
- Se debe probar el inicio de llamada, la reproducción del mensaje y la posibilidad de reintentar.
- Deben verificarse los costos y las restricciones del proveedor.

**WhatsApp**
- Se puede estudiar la apertura de una conversación o el envío de mensajes mediante integraciones compatibles.
- No se debe asumir que existe una API pública general que permita iniciar automáticamente cualquier llamada grupal de WhatsApp.
- Abrir una conversación o preparar un mensaje no equivale a completar una llamada.
- WhatsApp no debe ser el único canal de emergencia.

### 6.4 Respaldo ante fallos

Casos que deben contemplarse:

- Internet caído;
- Wi-Fi desconectado;
- servidor no disponible;
- proveedor de IA sin respuesta;
- proveedor de notificaciones caído;
- corte de energía;
- teléfono de un contacto apagado;
- falta de confirmación;
- falso positivo o cancelación accidental.

La Raspberry debe poder activar una alerta local sin Internet. Para avisar remotamente durante un corte, se necesitará una vía independiente que continúe disponible, como una conexión celular apropiada, además de alimentación de respaldo. Una UPS pequeña puede ayudar, pero su autonomía debe calcularse considerando también router y módem.

El sistema debe comunicar fallos con honestidad. Nunca debe decir «ya llamé» si solamente abrió una pantalla o intentó iniciar una llamada.

### 6.5 Límites de seguridad

JARVIS no es un servicio médico ni un sistema de alarma certificado. Antes de depender de él en situaciones reales se deben ejecutar pruebas de extremo a extremo, documentar sus límites y mantener un procedimiento alternativo que no dependa de JARVIS.

---

## 7. Voz: componentes y flujo de procesamiento

La voz se divide en cuatro tareas:

1. **Palabra de activación (wake word):** detectar «Jarvis».
2. **Reconocimiento de voz (STT):** convertir el audio en texto.
3. **Interpretación y acción:** determinar qué quiere hacer el usuario.
4. **Síntesis de voz (TTS):** convertir la respuesta en audio.

### 7.1 STT y Whisper

Whisper es una tecnología de reconocimiento automático del habla. Por ejemplo, recibe un audio y devuelve una transcripción como «agregá leche a la lista».

Puede ejecutarse localmente o en un equipo/servicio remoto, según la implementación. En la Raspberry Pi 3, ejecutar modelos de reconocimiento puede resultar lento y consumir demasiados recursos. Se probarán opciones antes de decidir.

### 7.2 TTS y Piper

Piper es una opción de síntesis de voz que convierte texto en audio. Se debe comprobar la disponibilidad y calidad de una voz en español adecuada para el dispositivo objetivo.

### 7.3 Diseño híbrido

La arquitectura recomendada combina:

- detección de palabra de activación local cuando sea viable;
- comandos sencillos con reglas deterministas;
- reconocimiento y síntesis de voz seleccionados según rendimiento y costo;
- DeepSeek por API para conversación y solicitudes complejas;
- una ruta de emergencia que no dependa del LLM.

No se debe transmitir audio de forma continua a un proveedor remoto sin una decisión explícita de privacidad. El comportamiento del micrófono y la indicación de escucha deben ser visibles y comprensibles.

### 7.4 Pruebas de voz

Medir:

- precisión con español rioplatense;
- reconocimiento de nombres propios;
- funcionamiento con ruido doméstico;
- latencia desde el final de la frase hasta la respuesta;
- uso de memoria y CPU;
- costo por consulta, si se utiliza un servicio de pago;
- tasa de errores en comandos esenciales.

---

## 8. Hardware

### 8.1 Hardware disponible

- Raspberry Pi 3 Model B.
- Carcasa de la Raspberry Pi 3.
- Computadora personal y notebook para desarrollo, no para producción.

No se ha confirmado que existan fuente, microSD, pantalla, micrófono, parlante, cámara, UPS ni otros accesorios.

### 8.2 Compras iniciales por investigar

**Prioridad 1: pantalla**
- Pantalla HDMI de 7 a 10 pulgadas.
- Táctil opcional.
- Resolución y consumo compatibles con la Pi 3.
- Alimentación adecuada y montaje estable.
- Disponibilidad local y facilidad para conseguir repuestos.

**Prioridad 2: almacenamiento y alimentación**
- microSD fiable y de capacidad apropiada.
- Fuente estable y compatible con Raspberry Pi 3.
- Considerar almacenamiento más resistente si la carga de escritura lo justifica.

**Prioridad 3: audio**
- Micrófono USB compatible con Linux.
- Parlante USB o amplificador/parlante adecuado.
- Verificar calidad de captación y volumen en una habitación real.

**Prioridad 4: emergencia**
- Botón físico grande, visible y fácil de accionar.
- Mecanismo de conexión compatible con la Pi o un controlador dedicado.
- Alimentación de respaldo, una vez definidos consumo y autonomía necesarios.

### 8.3 Comparación de opciones futuras

**Raspberry Pi 3**
- Se utilizará para el prototipo.
- Adecuada para interfaz ligera, comunicación con servidor y comandos básicos.
- Limitada para varias tareas de audio y visión artificial simultáneas.

**Raspberry Pi 4 o Pi 5**
- Se evaluarán únicamente cuando las pruebas indiquen que hace falta más memoria o capacidad.
- No se comprarán dos equipos nuevos antes de validar la arquitectura.

**ESP32-S3**
- Posible satélite para micrófono, audio, sensores o botón de emergencia.
- No sustituye una Raspberry Pi ni un backend completo.

**Arduino convencional**
- No es la opción principal para el asistente.
- Puede servir para tareas de electrónica específicas, pero un ESP32-S3 suele resultar más apropiado para un periférico conectado con Wi-Fi.

### 8.4 Pantalla táctil o no táctil

Una pantalla no táctil es suficiente para mostrar información. Una pantalla táctil agrega la posibilidad de seleccionar productos, cancelar alarmas y confirmar acciones manualmente.

Para el primer prototipo se prioriza compatibilidad, legibilidad y costo. La decisión final entre 7 y 10 pulgadas, táctil o no táctil, debe basarse en precios locales, alimentación y disponibilidad.

---

## 9. Cámara y visión artificial: fase posterior

La cámara no forma parte del primer prototipo. Se investigará después de que la voz, el backend, la sincronización y el sistema de emergencias hayan sido probados.

### 9.1 Opciones de cámara

- Cámara conectada directamente a la Raspberry.
- Cámara IP de vigilancia económica compatible con protocolos o integraciones adecuados.
- Cámara USB, si resulta compatible con el sistema y el entorno.

La elección dependerá de calidad de imagen, visión nocturna, alimentación, conectividad, privacidad, almacenamiento y posibilidad de integrar el flujo de video sin depender de servicios cerrados.

### 9.2 Niveles de visión

**Nivel 1: visualización**
- Mostrar la cámara a usuarios autorizados.
- Definir si se guardan grabaciones o solo se visualiza en directo.
- Limitar el acceso y la retención de imágenes.

**Nivel 2: detección de personas**
- Detectar presencia o movimiento mediante un modelo de visión.
- Crear eventos y notificaciones configurables.
- No confundir detección de personas con detección fiable de caídas.

**Nivel 3: reconocimiento facial**
- Evaluar el enfoque previo del usuario: YOLOv8 para detección, InsightFace para representación facial y ChromaDB como base de datos vectorial.
- Verificar versiones, compatibilidad, licencias, rendimiento y mantenimiento.
- Probar el sistema en una computadora de desarrollo antes de seleccionar hardware de producción.
- Evitar que una coincidencia dudosa active acciones críticas.

**Nivel 4: posible detección de caídas**
- Requiere un modelo y un proceso de validación específicos.
- Evaluar falsos positivos, falsos negativos, iluminación, zonas ciegas y oclusiones.
- Considerar sensores o dispositivos especializados como complemento.
- No depender exclusivamente de la cámara para solicitar ayuda.

### 9.3 Privacidad

- Consentimiento informado de la persona que vive en el hogar.
- Cámaras solo en espacios acordados.
- Indicadores claros de funcionamiento.
- Acceso restringido y autenticado.
- Retención limitada de imágenes.
- Evitar grabación de audio innecesaria.
- Evaluar con especial cuidado el almacenamiento de datos biométricos.

---

## 10. Tecnología propuesta

La selección definitiva se hará durante la implementación, comprobando compatibilidad con el servidor disponible.

| Capa | Candidato inicial | Función |
|---|---|---|
| Dispositivo | Raspberry Pi OS u otra distribución compatible y estable | Sistema local de la Pi 3 |
| Interfaz | React + TypeScript, o alternativa equivalente | Dashboard y aplicación web adaptable |
| Aplicación móvil inicial | PWA | Acceso desde celulares |
| Backend | Python + FastAPI | API y lógica de negocio |
| Base de datos inicial | SQLite para prototipo; evaluar PostgreSQL para producción | Persistencia |
| Comunicación | HTTPS; WSS si se necesita tiempo real | Intercambio seguro |
| IA | DeepSeek API detrás de una capa de proveedor | Conversación y selección de herramientas |
| STT | Whisper u otra opción que supere las pruebas | Reconocimiento del habla |
| TTS | Piper u otra opción compatible | Respuesta oral |
| Automatización doméstica | Home Assistant, si las integraciones lo justifican | Dispositivos y automatizaciones |
| Cámara | Frigate u otra opción compatible, más adelante | Detección y gestión de video |
| Reconocimiento facial | Evaluar YOLOv8 + InsightFace + ChromaDB | Identificación opcional de rostros |

Las tecnologías de la tabla son propuestas, no decisiones irreversibles. Se priorizarán mantenimiento, compatibilidad, licencias, seguridad y rendimiento en el hardware real.

### 10.1 Base de datos

Para el prototipo se puede comenzar con SQLite si la aplicación tiene una sola instancia y la carga es baja. Si el servidor central necesita concurrencia, copias de seguridad robustas y operación multiusuario, se evaluará PostgreSQL.

El modelo de datos debería contemplar, como mínimo:

- usuarios;
- hogares;
- membresías y permisos;
- dispositivos;
- listas;
- elementos de lista;
- eventos de calendario;
- recordatorios;
- contactos de emergencia;
- alertas;
- intentos de notificación;
- confirmaciones de recepción;
- preferencias;
- estado de conectividad;
- registro de auditoría limitado.

---

## 11. Servidor y despliegue

El usuario informa que ya paga un servicio de alojamiento y quiere utilizarlo para la aplicación central. Se debe verificar el proveedor y el tipo de plan antes de diseñar el despliegue.

### 11.1 Datos que faltan confirmar

- proveedor exacto;
- tipo de servicio (VPS, hosting compartido, contenedores u otro);
- sistema operativo;
- acceso SSH o consola administrativa;
- memoria RAM y CPU;
- almacenamiento y límites de transferencia;
- disponibilidad de Docker, si se desea usar;
- dominio y certificados HTTPS;
- posibilidad de ejecutar servicios persistentes;
- política de copias de seguridad.

No pedir ni compartir contraseñas, claves privadas o tokens en el chat ni en el repositorio.

### 11.2 Entornos

- **Desarrollo:** computadora personal o notebook del usuario.
- **Pruebas:** entorno separado, con datos ficticios y sin contactos reales de emergencia.
- **Producción:** servidor contratado y Raspberry Pi conectada al backend.

La computadora de desarrollo no debe ser una dependencia de producción.

### 11.3 Despliegue recomendado

Si el servidor lo permite, utilizar servicios versionados y un proceso reproducible de despliegue. Docker Compose puede ser una opción si es compatible con el alojamiento.

Los secretos se configuran en el entorno de ejecución. Se debe contar con una forma de volver a la versión anterior si una actualización falla.

---

## 12. Costos y control de presupuesto

El presupuesto inicial todavía no está definido. Se priorizará reutilizar la Pi 3 y comprar solo los accesorios necesarios para probar la idea.

### 12.1 Costos iniciales posibles

- pantalla HDMI;
- fuente de alimentación;
- microSD;
- micrófono;
- parlante;
- botón de emergencia;
- soporte o carcasa para pantalla;
- UPS o respaldo eléctrico, más adelante;
- cámara, en la fase final;
- segunda Raspberry, solo cuando el prototipo esté validado.

### 12.2 Costos recurrentes posibles

- alojamiento existente;
- tokens de DeepSeek;
- servicios de STT/TTS, si son externos;
- notificaciones push;
- SMS;
- telefonía;
- almacenamiento de video;
- dominio o servicios de red, si no están incluidos.

### 12.3 Estrategia para controlar costos

- ejecutar comandos simples sin LLM;
- enviar a la IA solo el contexto necesario;
- definir límites de uso y presupuestos;
- registrar errores y consumo de tokens;
- usar una capa intercambiable para los proveedores;
- evitar grabar o transmitir audio innecesario;
- no añadir servicios de pago antes de demostrar que son necesarios.

No se deben asumir precios fijos sin consultar la tarifa vigente del proveedor y medir el uso real.

---

## 13. Plan de desarrollo por fases

### Fase 0 — Inventario y diseño técnico

**Objetivo:** confirmar los recursos y definir un entorno reproducible.

Tareas:
- identificar el servidor contratado;
- comprobar las características de la Raspberry Pi 3;
- confirmar el sistema operativo y el almacenamiento disponible;
- investigar pantalla, micrófono y parlante;
- elegir repositorio y estructura del proyecto;
- definir variables de entorno y estrategia de secretos;
- redactar criterios de aceptación.

**Resultado:** documento técnico validado y lista de compras mínima.

### Fase 1 — Dashboard funcional

**Objetivo:** mostrar una interfaz propia en la pantalla.

Tareas:
- crear la estructura inicial del frontend;
- diseñar la pantalla principal;
- mostrar fecha, hora, listas y agenda de prueba;
- crear estados visibles de conexión;
- adaptar la interfaz a resolución y tamaño de pantalla;
- validar el rendimiento en la Pi 3.

**Resultado:** pantalla funcional con datos de prueba, sin necesidad de voz.

### Fase 2 — Backend y datos

**Objetivo:** persistir y servir información.

Tareas:
- crear API;
- modelar usuarios, hogares, listas y eventos;
- implementar validación y permisos;
- configurar base de datos;
- implementar autenticación de dispositivos;
- agregar logs de errores y copias de seguridad;
- probar desde la Pi y desde un navegador móvil.

**Resultado:** listas y eventos persistentes accesibles desde los dispositivos autorizados.

### Fase 3 — Voz

**Objetivo:** ejecutar comandos hablados en español.

Tareas:
- probar micrófono y parlante;
- elegir detector de palabra de activación;
- comparar motores de reconocimiento;
- evaluar síntesis de voz;
- implementar comandos simples;
- integrar DeepSeek para consultas complejas;
- medir latencia, memoria, CPU y costo;
- diseñar manejo de errores y confirmaciones.

**Resultado:** una interacción por voz de extremo a extremo.

### Fase 4 — Sincronización y aplicación móvil

**Objetivo:** utilizar el sistema desde ambos hogares y celulares.

Tareas:
- desarrollar la PWA;
- autenticar usuarios;
- compartir listas según permisos;
- separar agendas personales;
- implementar actualización de datos;
- evaluar notificaciones en los sistemas móviles de destino.

**Resultado:** listas y agenda sincronizadas con permisos definidos.

### Fase 5 — Emergencias

**Objetivo:** construir y probar el circuito de asistencia.

Tareas:
- implementar el comando de emergencia;
- conectar un botón físico;
- definir contactos y orden de escalamiento;
- implementar notificaciones con confirmación;
- evaluar proveedor de SMS/telefonía;
- definir mensajes y tiempos de reintento;
- registrar resultados y fallos;
- probar pérdida de Internet, servidor, energía y servicio de notificaciones;
- documentar un procedimiento familiar alternativo.

**Resultado:** protocolo de emergencia probado y límites documentados antes de uso real.

### Fase 6 — Instalación de la madre y piloto

**Objetivo:** comprobar la usabilidad en el hogar real.

Tareas:
- instalar el dispositivo;
- ajustar volumen, tamaño de texto y ubicación;
- configurar contactos autorizados;
- probar comandos cotidianos;
- ensayar alertas con todos los familiares involucrados;
- documentar problemas y simplificar la experiencia.

**Resultado:** piloto supervisado con funcionamiento y expectativas claras.

### Fase 7 — Cámara y visión artificial

**Objetivo:** agregar monitoreo visual sin comprometer el resto del sistema.

Tareas:
- comparar cámara USB, módulo de cámara y cámara IP;
- evaluar compatibilidad, visión nocturna y privacidad;
- probar visualización;
- evaluar detección de personas;
- analizar viabilidad de YOLOv8, InsightFace y ChromaDB;
- investigar detección de caídas como función independiente;
- medir rendimiento y decidir si se necesita hardware adicional.

**Resultado:** módulo de cámara opcional con limitaciones conocidas.

### Fase 8 — Mejoras y mantenimiento

Posibles ampliaciones:
- sensores domésticos;
- más integraciones;
- voz personalizada;
- perfiles y rutinas;
- panel de salud técnica del dispositivo;
- estadísticas de uso;
- recuperación automática de servicios;
- actualizaciones remotas seguras;
- segunda unidad de hardware optimizada.

---

## 14. Criterios de aceptación y pruebas

### 14.1 Funcionalidad básica

- Una frase hablada agrega un producto correctamente.
- La lista persiste tras reiniciar el dispositivo.
- Los cambios autorizados aparecen en el celular.
- Un evento se crea con fecha y hora correctas.
- Las solicitudes ambiguas generan una pregunta de aclaración.
- El sistema no afirma haber realizado una acción que falló.
- Se puede identificar el hogar y el usuario al que pertenece cada dato.

### 14.2 Seguridad

- Un usuario no puede leer datos de un hogar sin permiso.
- No hay credenciales en el repositorio.
- Las comunicaciones remotas usan conexiones cifradas.
- Los dispositivos se pueden revocar.
- Las alertas de emergencia no dependen del LLM.
- Los fallos de notificación se detectan y registran.
- El sistema no muestra falsamente una entrega confirmada.
- Se realizan copias de seguridad y se prueba la recuperación.

### 14.3 Emergencias

Antes del uso real, probar al menos:

- comando de voz correcto;
- activación por botón;
- ruido y frases alternativas;
- Internet desconectado;
- servidor fuera de servicio;
- servicio push sin respuesta;
- teléfono del contacto sin conexión;
- ausencia de confirmación;
- reintentos y escalamiento;
- cancelación accidental;
- recuperación tras reinicio;
- autonomía durante un corte eléctrico, si hay respaldo.

Los resultados deben documentarse. Una prueba exitosa no garantiza que todas las alertas futuras vayan a llegar.

### 14.4 Usabilidad

- La información principal se lee a una distancia habitual.
- La alerta es visual y auditivamente clara.
- La persona puede pedir ayuda con una frase sencilla.
- Los botones críticos son grandes y fáciles de encontrar.
- La interfaz no requiere navegar por menús complejos.
- Los errores se expresan en lenguaje claro.

---

## 15. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Raspberry Pi 3 lenta para audio | Probar motores ligeros o remotos; limitar servicios locales. |
| Dependencia de Internet | Mantener comandos y alarma local; evaluar conectividad alternativa. |
| DeepSeek no disponible | Separar la IA de las funciones esenciales; implementar fallback. |
| Notificaciones no recibidas | Confirmación, reintentos, canales alternativos y pruebas. |
| Llamada automática no compatible | Verificar proveedor y API antes de desarrollar la integración. |
| Pérdida de datos | Copias de seguridad y pruebas de restauración. |
| Exposición de datos personales | Permisos por hogar, cifrado y mínima retención. |
| Falsas detecciones de emergencia | Confirmaciones cuando sean seguras, reglas configurables y botón físico. |
| Cámara no detecta una caída | No depender exclusivamente de visión; ofrecer mecanismos alternativos. |
| Costos inesperados | Límites de uso, monitorización y elección consciente de proveedores. |
| Actualización defectuosa | Entorno de pruebas, despliegue versionado y rollback. |
| Dependencia del desarrollador | Documentación, configuración reproducible y procedimientos de mantenimiento. |

---

## 16. Organización del código

Estructura inicial sugerida para un repositorio único:

```text
jarvis/
├── README.md
├── docs/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── security.md
│   ├── emergency-protocol.md
│   ├── hardware.md
│   ├── deployment.md
│   └── testing.md
├── apps/
│   ├── dashboard/          # Interfaz de pantalla y PWA
│   └── device-agent/       # Agente ligero para Raspberry
├── services/
│   └── api/                # Backend y lógica de negocio
├── packages/
│   ├── shared-types/       # Tipos y contratos compartidos
│   └── ui/                 # Componentes visuales reutilizables
├── integrations/
│   ├── llm/                # Adaptadores de proveedores de IA
│   ├── speech/             # Wake word, STT y TTS
│   ├── notifications/      # Push, SMS y telefonía
│   ├── calendar/           # Integración de calendarios
│   └── home-assistant/     # Integraciones domésticas futuras
├── infra/
│   ├── deployment/
│   └── scripts/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── emergency/
└── .env.example
```

La estructura puede ajustarse según el lenguaje y el sistema de despliegue elegidos. No hace falta crear todos estos directorios en la primera sesión: se implementarán progresivamente.

### 16.1 Prácticas de desarrollo

- Git para control de versiones.
- Commits pequeños y descriptivos.
- Archivo `.env.example` sin secretos.
- Pruebas automatizadas de la lógica crítica.
- Datos ficticios para desarrollo.
- Documentación actualizada junto al código.
- Versionado de API y migraciones de base de datos cuando corresponda.
- No desplegar cambios no probados directamente en el dispositivo de la madre.

---

## 17. Decisiones tomadas y cuestiones pendientes

### 17.1 Decisiones acordadas

- El nombre de trabajo será **JARVIS**.
- El primer prototipo se hará sobre la Raspberry Pi 3 Model B existente.
- La carcasa de la Pi ya está disponible.
- La computadora personal y la notebook serán solo para desarrollo y pruebas.
- El servidor contratado será el centro de la aplicación si el plan lo permite.
- DeepSeek será el proveedor inicial de IA por API.
- Se prefiere un sistema híbrido: comandos simples locales y conversación compleja por Internet.
- La cámara se deja para la última etapa.
- La interfaz visual es importante.
- Se necesita comprar una pantalla HDMI; el tamaño y si será táctil quedan pendientes.
- Se requieren micrófono y parlante, aún por seleccionar.
- La emergencia debe priorizar notificaciones al celular y llamadas.
- WhatsApp puede estudiarse como complemento, pero no debe asumirse que puede iniciar automáticamente una llamada grupal.
- Los datos de ambos hogares deben separarse y compartirse mediante permisos.
- La detección de personas y el reconocimiento facial son ampliaciones futuras, no requisitos del prototipo inicial.

**Añadidas el 28 de octubre de 2026:**

- El servidor contratado es **Contabo, Cloud VPS 4 (2026)**: 4 vCPU, 8 GB de RAM, 100 GB de disco, región US-east, acceso root por SSH, Ubuntu (versión por confirmar). Alcanza para ejecutar el reconocimiento de voz en el propio servidor.
- El sistema operativo de la Raspberry será **Raspberry Pi OS Lite con Chromium en modo kiosco**. Se descartó Home Assistant OS como sistema operativo porque no incluye entorno gráfico ni navegador y no puede mostrar la aplicación en la pantalla HDMI. Home Assistant, si se usa, irá como contenedor aparte.
- El frontend vive en el servidor y la Raspberry lo muestra. **Por ahora se asume conectividad permanente**; el modo sin conexión se vuelve a evaluar al construir el módulo de emergencias (Fase 5), manteniendo mientras tanto el agente local como proceso independiente del navegador.
- El **aislamiento entre hogares es un requisito duro, no una preferencia**. Cada cuenta es estanca: ni los datos ni lo que el modelo aprende en un hogar pueden alcanzar a otro. Se prevé escalar a cinco o seis hogares, por lo que el diseño es multi-inquilino desde el inicio.
- **El diseño de la interfaz está cerrado**: dos temas seleccionables, **Lavanda Suave por defecto** y **Menta Clínica opcional**. Las especificaciones completas, los tokens de diseño y las reglas de accesibilidad están en `DECISION_Frontend_Temas.md`; los mockups, en `mockups/`.
- Se incorpora el **tiempo de viaje** al contenido de la pantalla principal, que no figuraba en la versión 1.0 de este documento.

### 17.2 Cuestiones pendientes

1. ~~Nombre exacto y características del servidor contratado.~~ **Resuelto**: Contabo Cloud VPS 4. Queda confirmar la versión exacta de Ubuntu y contratar copias de seguridad.
2. Presupuesto inicial para pantalla, audio y almacenamiento.
3. Elección entre pantalla de 7 y 10 pulgadas.
4. Pantalla táctil o no táctil. **Nota:** los dos temas elegidos asumen interacción táctil; si la pantalla no lo es, hay que revisar las afordancias.
5. Micrófono y parlante.
6. Método de notificación push.
7. Proveedor de SMS/telefonía y costos en Argentina.
8. Disponibilidad de una conexión de respaldo.
9. Contactos, reglas y tiempos de escalamiento de emergencia.
10. Calendario externo que se quiere sincronizar.
11. Cámara, protocolo de conexión y política de retención.
12. Elección final de wake word, STT y TTS tras las pruebas.
13. Necesidad de una segunda Raspberry, solo después de validar el prototipo.
14. Rendimiento de los efectos de vidrio y las animaciones en la Pi 3; definir la degradación visual si no rinde (ver `DECISION_Frontend_Temas.md`, sección 5).
15. Escala de densidad tipográfica para la instalación del hogar B.
16. Modo nocturno o de reposo de la pantalla.

---

## 18. Próximos pasos inmediatos

El orden recomendado para comenzar es:

1. **Verificar el servidor existente.** Confirmar proveedor, tipo de alojamiento, sistema operativo, memoria, acceso y límites.
2. **Inventariar la Raspberry Pi 3.** Confirmar revisión de placa, fuente, microSD y sistema operativo actual.
3. **Investigar la pantalla HDMI.** Comparar modelos disponibles en Argentina, con alimentación y montaje apropiados.
4. **Elegir audio básico.** Comprar un micrófono y un parlante que funcionen en Linux sin configuraciones complejas.
5. **Crear el repositorio.** Preparar estructura, documentación y entorno de desarrollo.
6. **Construir el dashboard.** Mostrar información ficticia y validar legibilidad y rendimiento en la Pi.
7. **Implementar backend y datos.** Listas y eventos persistentes antes de integrar la IA.
8. **Agregar voz.** Medir el funcionamiento real antes de elegir definitivamente Whisper u otra alternativa.
9. **Integrar DeepSeek.** Incorporar herramientas limitadas, manejo de errores y control de costos.
10. **Construir el módulo de emergencia.** No posponer su diseño de seguridad, aunque se incorpore después de la primera interfaz.
11. **Probar y documentar.** Validar cada fase antes de usarla en el hogar de la madre.
12. **Agregar cámara al final.** Elegir hardware a partir de los requisitos y las pruebas.

---

## 19. Definición de éxito

JARVIS habrá alcanzado su primera versión útil cuando:

- arranque de forma estable en la Raspberry Pi 3;
- muestre un dashboard claro en la pantalla;
- responda a comandos de voz en español;
- permita agregar y consultar productos;
- permita crear y consultar eventos;
- sincronice los datos autorizados con el celular;
- utilice DeepSeek sin depender de él para comandos esenciales;
- tenga una ruta de emergencia local y un mecanismo probado para notificar a familiares;
- informe honestamente los fallos;
- mantenga los datos de cada hogar protegidos;
- pueda actualizarse desde el servidor sin depender de la computadora de desarrollo;
- cuente con documentación de instalación, recuperación y mantenimiento.

La cámara, el reconocimiento facial, la detección de caídas y las automatizaciones avanzadas se considerarán logros posteriores.

---

## 20. Nota final

Este documento define la visión, las funcionalidades, la arquitectura inicial y el plan de trabajo. No implica que las integraciones, el hardware o los proveedores mencionados ya estén instalados o validados. Cada componente deberá verificarse en el entorno real.

La estrategia central es **construir primero una base pequeña, segura y funcional, y ampliar JARVIS de forma progresiva**. La Raspberry Pi 3 será suficiente para iniciar el desarrollo y comprobar la experiencia. Las decisiones de inversión mayores se tomarán cuando las pruebas indiquen qué capacidad falta.

La prioridad no es tener muchas funciones cuanto antes: es crear un asistente útil, mantenible, privado y especialmente confiable cuando una persona necesita ayuda.
