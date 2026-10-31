# JARVIS — Asistente de hogar

Asistente doméstico por voz con pantalla, para dos hogares (el del usuario y el de su madre, jubilada y viviendo sola).

Documentos, en orden de lectura:

1. [documentacion/JARVIS_Proyecto_Integral.md](documentacion/JARVIS_Proyecto_Integral.md) — visión, alcance y decisiones.
2. [documentacion/ESPECIFICACION_Tecnica_Funcional.md](documentacion/ESPECIFICACION_Tecnica_Funcional.md) — **qué se construye y cómo**: arquitectura, modelo de datos, API, voz, IA, música, domótica, emergencias, seguridad, despliegue y criterios de aceptación.
3. [documentacion/ROADMAP.md](documentacion/ROADMAP.md) — **en qué orden**: fases 0 a 11, con tareas numeradas y pruebas de cierre por fase.
4. [documentacion/DECISION_Frontend_Temas.md](documentacion/DECISION_Frontend_Temas.md) — la interfaz.
5. [documentacion/GUIA_Servidor_VPS.md](documentacion/GUIA_Servidor_VPS.md) — **cómo se monta el servidor**, de cero a desplegado, con las trampas que ya nos mordieron.
6. [documentacion/HARDWARE_Opciones_y_Compras.md](documentacion/HARDWARE_Opciones_y_Compras.md) — **qué comprar**: modelos concretos, precios en Argentina y links.
7. [documentacion/COMPARATIVA_Alexa.md](documentacion/COMPARATIVA_Alexa.md) — contra qué competimos, qué igualar y dónde ganamos.
8. [documentacion/LIQUID_AI_Evaluacion.md](documentacion/LIQUID_AI_Evaluacion.md) — el modelo de lenguaje local: qué sirve y cómo entra.

Si la especificación y el roadmap se contradicen, manda la especificación.

## Decisiones cerradas — no volver a discutirlas sin pedido explícito

**Dispositivo.** **Raspberry Pi 3 Model B + panel táctil de 7" a 1024×600**, con Raspberry Pi OS Lite y Chromium en kiosco. Home Assistant OS quedó descartado como sistema operativo: no tiene entorno gráfico. **La idea de reutilizar un teléfono quedó cerrada**: el equipo disponible no tiene reparación, y sus piezas no se pueden conectar a una Raspberry en ningún caso.

**Servidor.** Contabo Cloud VPS 4 (2026) — 4 vCPU, 8 GB RAM, 100 GB, US-east, Ubuntu, root por SSH.

**Interfaz.** Un solo tema: **Lavanda Suave**, con variante **clara y oscura** (`data-luz`). **Menta Clínica quedó descartado el 31/10/2026**: el modo oscuro resuelve mejor el mismo problema y no obliga a elegir entre la paleta y la legibilidad. **No se hacen otras paletas** salvo pedido explícito. Maquetas en [documentacion/mockups/](documentacion/mockups/), editables en <https://claude.ai/artifact/3dozfkTjcVtj7wCBAwrSEQ>.

**Navegación.** Una sola regla en todas las pantallas, implementada en `componentes/Navegacion.tsx` y no en cada pantalla: **abajo a la izquierda se sale** (Inicio, o «Estoy bien — cancelar» en emergencia), **abajo a la derecha se pide ayuda o se insiste** (Necesito ayuda, o «Reenviar alarma»), **arriba a la derecha va la hora**. Si hace falta mover un botón, se mueve ahí y se mueve en todas.

**Voz e inteligencia.** Palabra de activación y síntesis de voz en el dispositivo; reconocimiento de voz en el servidor. La interpretación va en tres niveles: reglas → modelo local (Liquid AI, en nuestro VPS) → DeepSeek solo para conversación abierta.

## Reglas que condicionan todo el código

1. **Aislamiento entre hogares.** Cada hogar es estanco: ni los datos ni lo que el modelo aprende en uno pueden alcanzar a otro. Multi-inquilino desde el inicio, con dos barreras: filtro en la capa de datos y políticas a nivel de fila en PostgreSQL. Debe escalar a cinco o seis hogares.
2. **Las emergencias no dependen de la IA.** Se detectan por reglas y rutas prioritarias, nunca por el criterio de un modelo.
3. **No fingir acciones.** Confirmar solo después de verificar contra la base de datos o contra el dispositivo real. Nunca decir «ya avisé» si solo se intentó. **Es nuestra principal ventaja competitiva frente a Alexa**, que reporta éxitos que no ocurrieron.
4. **Sin secretos en el repositorio.** Variables de entorno y `.env.example` sin valores reales.
5. **Todo color, radio y sombra es un token.** Un literal dentro de un componente rompe el cambio de tema.

## Estado

> **El estado del proyecto vive en [documentacion/ROADMAP.md](documentacion/ROADMAP.md), no acá.** Cada tarea es una casilla con fecha, y la sección «Dónde estamos» resume en qué fase estamos. **Al terminar cualquier tarea hay que marcarla ahí, en el mismo momento**, junto con el commit que la cierra. Una tarea se marca `[x]` solo cuando se verificó contra la realidad —una salida de comando, una respuesta HTTP, algo visible en pantalla—, nunca porque el código esté escrito. Si queda a medias, se abre en subtareas y se marca solo lo hecho.
>
> Esta sección guarda únicamente los datos del entorno que no se deducen del código.

**Fase 0 casi terminada.** Falta el dominio (y con él el HTTPS), las copias de seguridad de Contabo, las actualizaciones automáticas y dejar de correr los servicios como `root`. Detalle y criterios de cierre, en el roadmap.

**Despliegue.** Vive en `/opt/jarvis` en el VPS, clonado de <https://github.com/gusoliva85/Asistente_de_Hogar> (privado, cuenta `gusoliva85`) con una llave de despliegue de solo lectura. Ciclo de actualización: commit y push desde la PC, después `cd /opt/jarvis && git pull && docker compose up -d` en el servidor. El `.env` real se genera en el servidor y nunca se versiona.

**VPS.** `vmi3573476` en `13.140.36.93`. **Ubuntu 24.04.5 LTS x86_64**, 7,8 GB RAM, 96 GB disco, sin swap. Reinstalado limpio el 31/10/2026.

- Acceso **solo por llave SSH**: `~/.ssh/jarvis_deploy` en la PC del usuario, alias `jarvis-vps`. No hay contraseña de root utilizable.
- El apagado de contraseñas está en `/etc/ssh/sshd_config.d/00-jarvis.conf`. **En SSH gana el archivo de número más bajo, no el último** — por eso el `00`: hay un `50-cloud-init.conf` que habilita contraseñas y lo pisaría.
- `ufw` activo: 22, 80 y 443; el resto denegado. **Docker se saltea `ufw`**: agregar `ports:` a un servicio lo expone a internet aunque el cortafuegos lo niegue.
- **No responde ICMP** (Contabo lo filtra): un `ping` sin respuesta no significa que esté caído.
- **Latencia ~165 ms** desde Buenos Aires. Es el presupuesto a respetar en el camino de voz: palabra de activación siempre en el dispositivo, y audio en streaming hacia el servidor en vez de esperar a que la frase termine.
- Caddy: **no** usar un bloque global con `email`, que aborta si la variable viene vacía. Cuando haya dominio, va `tls <correo>` dentro del bloque del sitio.

**Raspberry.** Host `jarvis`, usuario `jarvis_gus`, accesible por SSH en la LAN. Raspberry Pi OS sobre **Debian 13 (Trixie)**, **aarch64**.

- El driver KMS (`dtoverlay=vc4-kms-v3d`) **ignora las directivas `hdmi_*` de `config.txt`**. La resolución se fuerza con `video=HDMI-A-1:1024x600M@60D` en `cmdline.txt`.
- zram ya viene activo de fábrica por `systemd-zram-generator` (zstd, ~900 MB). **No instalar `zram-tools`**: choca con él y deja un servicio en estado `failed`.
- Ser de 64 bits pesa más que `armhf` en 1 GB de RAM. Si Chromium en kiosco se arrastra en la Fase 1, regrabar en 32 bits libera 100-200 MB.
- En reposo: 156 MB usados de 905, 49 °C, 2,8 GB de disco.

**Pendiente que depende del usuario:** conseguir un dominio y apuntarlo a `13.140.36.93`. Bloquea el HTTPS, y el HTTPS bloquea el micrófono del navegador en la Fase 4.
