# JARVIS — Asistente de hogar

Asistente doméstico por voz con pantalla, para dos hogares (el del usuario y el de su madre, jubilada y viviendo sola).

Documentos, en orden de lectura:

1. [documentacion/JARVIS_Proyecto_Integral.md](documentacion/JARVIS_Proyecto_Integral.md) — visión, alcance y decisiones.
2. [documentacion/ESPECIFICACION_Tecnica_Funcional.md](documentacion/ESPECIFICACION_Tecnica_Funcional.md) — **qué se construye y cómo**: arquitectura, modelo de datos, API, voz, IA, música, domótica, emergencias, seguridad, despliegue y criterios de aceptación.
3. [documentacion/ROADMAP.md](documentacion/ROADMAP.md) — **en qué orden**: fases 0 a 11, con tareas numeradas y pruebas de cierre por fase.
4. [documentacion/DECISION_Frontend_Temas.md](documentacion/DECISION_Frontend_Temas.md) — la interfaz.
5. [documentacion/HARDWARE_Opciones_y_Compras.md](documentacion/HARDWARE_Opciones_y_Compras.md) — **qué comprar**: modelos concretos, precios en Argentina y links.
6. [documentacion/COMPARATIVA_Alexa.md](documentacion/COMPARATIVA_Alexa.md) — contra qué competimos, qué igualar y dónde ganamos.
7. [documentacion/LIQUID_AI_Evaluacion.md](documentacion/LIQUID_AI_Evaluacion.md) — el modelo de lenguaje local: qué sirve y cómo entra.

Si la especificación y el roadmap se contradicen, manda la especificación.

## Decisiones cerradas — no volver a discutirlas sin pedido explícito

**Dispositivo.** **Raspberry Pi 3 Model B + panel táctil de 7" a 1024×600**, con Raspberry Pi OS Lite y Chromium en kiosco. Home Assistant OS quedó descartado como sistema operativo: no tiene entorno gráfico. **La idea de reutilizar un teléfono quedó cerrada**: el equipo disponible no tiene reparación, y sus piezas no se pueden conectar a una Raspberry en ningún caso.

**Servidor.** Contabo Cloud VPS 4 (2026) — 4 vCPU, 8 GB RAM, 100 GB, US-east, Ubuntu, root por SSH.

**Interfaz.** Dos temas: **Lavanda Suave por defecto** y **Menta Clínica opcional**. Cinco pantallas maquetadas en [documentacion/mockups/](documentacion/mockups/), editables en <https://claude.ai/artifact/3dozfkTjcVtj7wCBAwrSEQ>: principal, escucha, emergencia, música y Menta. No proponer direcciones visuales nuevas: los ajustes van sobre estos temas.

**Voz e inteligencia.** Palabra de activación y síntesis de voz en el dispositivo; reconocimiento de voz en el servidor. La interpretación va en tres niveles: reglas → modelo local (Liquid AI, en nuestro VPS) → DeepSeek solo para conversación abierta.

## Reglas que condicionan todo el código

1. **Aislamiento entre hogares.** Cada hogar es estanco: ni los datos ni lo que el modelo aprende en uno pueden alcanzar a otro. Multi-inquilino desde el inicio, con dos barreras: filtro en la capa de datos y políticas a nivel de fila en PostgreSQL. Debe escalar a cinco o seis hogares.
2. **Las emergencias no dependen de la IA.** Se detectan por reglas y rutas prioritarias, nunca por el criterio de un modelo.
3. **No fingir acciones.** Confirmar solo después de verificar contra la base de datos o contra el dispositivo real. Nunca decir «ya avisé» si solo se intentó. **Es nuestra principal ventaja competitiva frente a Alexa**, que reporta éxitos que no ocurrieron.
4. **Sin secretos en el repositorio.** Variables de entorno y `.env.example` sin valores reales.
5. **Todo color, radio y sombra es un token.** Un literal dentro de un componente rompe el cambio de tema.

## Estado

**Fase 0 en curso.** Repositorio git inicializado (rama `main`, sin commits todavía). Hecho: estructura de carpetas, `.gitignore`, `.env.example`, `docker-compose.yml` (Caddy + API + PostgreSQL), API mínima con `/health`, página de prueba y [guía de instalación de la Raspberry](documentacion/GUIA_Instalacion_Raspberry.md).

**Falta de F0:** subir el código al VPS, desplegar y verificar HTTPS. **Docker instalado** desde el repositorio oficial (no el de Ubuntu), con `docker compose` v2 y `hello-world` verificado. Ojo: **Docker se saltea `ufw`** — agregar `ports:` a un servicio lo expone a internet aunque el cortafuegos lo niegue. **VPS ya asegurado** (31/10/2026): acceso por contraseña apagado en `/etc/ssh/sshd_config.d/00-jarvis.conf` — ojo, en SSH **gana el archivo de número más bajo**, no el último, por eso el `00`; `ufw` activo con 22, 80 y 443 abiertos y el resto denegado. Verificado con `sshd -T` y con un intento real de login por contraseña, que es rechazado.

**VPS:** `vmi3573476`, **Ubuntu 24.04.5 LTS x86_64**, 7,8 GB RAM, 96 GB disco, sin swap. Reinstalado limpio el 31/10/2026. Acceso **solo por llave SSH** (`~/.ssh/jarvis_deploy` en la PC del usuario, alias `jarvis-vps` en su `~/.ssh/config`): no hay contraseña de root utilizable. Alcanzable, puerto 22 abierto; **no responde ICMP** (Contabo lo filtra: un `ping` sin respuesta no significa caído). **Latencia ~165 ms** de ida y vuelta desde Buenos Aires — presupuesto a respetar en el camino de voz: palabra de activación siempre en el dispositivo, y audio en streaming hacia el servidor en vez de esperar a que la frase termine.

**Raspberry:** instalada y en marcha. Raspberry Pi OS sobre **Debian 13 (Trixie)**, con `dtoverlay=vc4-kms-v3d` — el driver KMS ignora las directivas `hdmi_*` de `config.txt`, así que la resolución se fuerza con `video=HDMI-A-1:1024x600M@60D` en `cmdline.txt`. Host `jarvis`, accesible por SSH en la LAN. zram ya viene activo de fábrica por `systemd-zram-generator` (zstd, ~900 MB): **no instalar `zram-tools`**, choca con él. Guía de instalación **terminada** (pasos 1 a 8). Arquitectura **aarch64 (64 bits)**: anda, pero pesa más que `armhf` en 1 GB de RAM — si Chromium en kiosco se arrastra en la Fase 1, regrabar en 32 bits es la palanca, libera 100-200 MB. En reposo: 156 MB usados de 905, 49 °C, 2,8 GB de disco.

**Pendientes que dependen del usuario:** versión de Ubuntu del VPS (`cat /etc/os-release`) y dominio (la IP ya la tenemos; va al `.env`, nunca al repositorio).
