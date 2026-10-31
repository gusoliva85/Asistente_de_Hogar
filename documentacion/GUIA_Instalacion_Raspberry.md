# Guía de instalación de la Raspberry Pi

**Para:** vos, siguiéndola sin que yo esté.
**Tiempo:** unos 40 minutos, la mayoría esperando.
**Resultado:** la Raspberry encendida, conectada al Wi-Fi, accesible por SSH desde tu PC, y mostrando 1024×600 en el televisor.

---

## Lo que necesitás

- La Raspberry Pi 3 Model B.
- La microSD de 64 GB A1/A2, **ya comprada**.
- Un lector de microSD para la PC.
- La fuente de 5 V / 2,5 A.
- Un cable HDMI y el televisor.
- Un teclado USB, **solo por las dudas** (si el Wi-Fi no engancha al primer arranque).

---

## Paso 1 — Instalar Raspberry Pi Imager

Descargalo de <https://www.raspberrypi.com/software/> e instalalo en tu PC.

---

## Paso 2 — Grabar la tarjeta

1. Poné la microSD en el lector.
2. Abrí **Raspberry Pi Imager**.
3. **Dispositivo:** `Raspberry Pi 3`.
4. **Sistema operativo:** `Raspberry Pi OS (other)` → **`Raspberry Pi OS Lite (64-bit)`**.
   **Importante: la versión Lite, sin escritorio.** El escritorio completo se come la RAM que necesitamos para Chromium.
5. **Almacenamiento:** tu microSD. Revisá dos veces que no sea otro disco: lo borra entero.
6. Antes de grabar, entrá a **Editar ajustes** (el engranaje o el botón "Siguiente" te lo ofrece):

   **Pestaña General**
   - Nombre de host: `jarvis`
   - Usuario: elegí uno y **anotá la contraseña** — la vas a necesitar para entrar por SSH.
   - Wi-Fi: el nombre de tu red y su contraseña. **País: AR.** Si el país queda mal, el Wi-Fi no conecta.
   - Zona horaria: `America/Argentina/Buenos_Aires`. Teclado: `es`.

   **Pestaña Servicios**
   - **Activá SSH** → "Usar contraseña para autenticar".

7. Grabá y esperá. Cuando termine, sacá la tarjeta.

---

## Paso 3 — Primer arranque

1. Poné la microSD en la Raspberry.
2. Conectá el HDMI al televisor y encendelo en esa entrada.
3. Enchufá la fuente. **El primer arranque tarda varios minutos** y reinicia una vez: es normal.
4. Cuando termine, el televisor muestra una consola de texto pidiendo usuario.

**Si no aparece nada en el televisor:** apagá, sacá la tarjeta, volvé a ponerla, y encendé de nuevo. Si sigue sin dar imagen, probá otra entrada HDMI del televisor.

---

## Paso 4 — Entrar por SSH desde tu PC

En tu PC, abrí PowerShell:

```powershell
ssh TU_USUARIO@jarvis.local
```

Si `jarvis.local` no resuelve, necesitás la IP. Mirala en tu router, o escribila en la consola de la Raspberry con el teclado:

```bash
hostname -I
```

Y después, desde tu PC:

```powershell
ssh TU_USUARIO@192.168.X.X
```

La primera vez pregunta si confiás en el equipo: respondé `yes`.

**A partir de acá no necesitás más el teclado ni el televisor para administrarla.**

---

## Paso 5 — Actualizar

```bash
sudo apt update && sudo apt full-upgrade -y
sudo reboot
```

Esperá un minuto y volvé a entrar por SSH.

---

## Paso 6 — Forzar la resolución a 1024×600

**Este paso es clave y es el que más se saltea.**

El televisor es de 1920×1080. La pantalla definitiva va a ser de 1024×600. Si desarrollamos mirando el televisor a resolución completa, todo se va a ver perfecto ahí y apretado en la pantalla real.

Primero, mirá qué sistema tenés y si usa el driver KMS:

```bash
grep PRETTY /etc/os-release
grep -n "kms" /boot/firmware/config.txt
```

> Si `/boot/firmware/config.txt` no existe, probá `/boot/config.txt` — según la versión está en un lugar o en el otro, y lo mismo vale para `cmdline.txt` más abajo.

**Si aparece `dtoverlay=vc4-kms-v3d`** — es el caso de Raspberry Pi OS actual, Debian 13 (Trixie) incluido — la resolución se fuerza desde `cmdline.txt`. Las directivas `hdmi_group`, `hdmi_mode` y `hdmi_cvt` de `config.txt` **no sirven acá: el driver KMS las ignora en silencio**, y es el motivo por el que este paso parece no hacer nada.

```bash
sudo nano /boot/firmware/cmdline.txt
```

Ese archivo es **una sola línea larga**. No agregues renglones. Andá al final con `Ctrl+E`, poné un espacio y agregá:

```
video=HDMI-A-1:1024x600M@60D
```

Sin Enter al final. Guardá con `Ctrl+O`, Enter, salí con `Ctrl+X`, y reiniciá:

```bash
sudo reboot
```

**Si el televisor se queda sin imagen**, no perdiste nada: SSH y Wi-Fi no dependen del HDMI, así que entrás igual desde la PC, borrás lo que agregaste a `cmdline.txt` y reiniciás. Algunos televisores no aceptan 1024×600 por no ser una resolución estándar.

**Si tenés un sistema viejo, sin la línea `vc4-kms-v3d`**, entonces sí van las directivas clásicas al final de `config.txt`:

```ini
# Simular la pantalla de 7" de 1024x600 mientras usamos el televisor
hdmi_group=2
hdmi_mode=87
hdmi_cvt=1024 600 60 6 0 0 0
hdmi_drive=2
hdmi_force_hotplug=1
disable_overscan=1
```

### Cómo saber si funcionó

Comprobalo desde SSH, que es lo que manda:

```bash
cat /sys/class/drm/card*-HDMI-A-1/modes | head -3
```

La primera línea tiene que decir `1024x600`.

En el televisor vas a ver una de dos cosas, y **las dos están bien**:

- La consola en un rectángulo más chico, con bordes negros alrededor. Ese rectángulo es tu pantalla futura.
- La imagen ocupando la pantalla entera igual, pero con el texto más grande y algo menos nítido. Eso es el televisor **escalando** la señal de 1024×600 hasta llenar el panel: la Raspberry está emitiendo lo correcto. Si querés los bordes negros de verdad, buscá en el menú de imagen del televisor el modo "Just Scan", "Original", "1:1" o "Sin escalar" — cada marca lo llama distinto. Es cosmético: para desarrollar alcanza con que `modes` diga `1024x600`.

---

## Paso 7 — Verificar zram

La Pi 3 tiene 1 GB de RAM y Chromium es glotón. `zram` comprime memoria y evita que el sistema se arrastre.

**En Raspberry Pi OS actual (Debian 13 / Trixie) no hay nada que instalar: ya viene activo.** El sistema lo configura con `systemd-zram-generator`, usando el archivo propio de Raspberry Pi `/usr/lib/systemd/zram-generator.conf.d/20-rpi-swap-zram0-ctrl.conf`. Solo hay que comprobarlo:

```bash
zramctl
swapon --show
free -h
```

Tiene que aparecer `/dev/zram0`, con algoritmo `zstd` y unos 900 MB de `DISKSIZE`, montado como `[SWAP]`. Si está así, el paso terminó.

> **No instales `zram-tools`.** Es el paquete que se usaba en versiones anteriores y en este sistema **sobra**: su servicio `zramswap` arranca después de que el generador de systemd ya creó y montó `/dev/zram0`, encuentra el dispositivo ocupado y falla con `Device or resource busy` y `mkswap: error: /dev/zram0 is mounted`. El error asusta pero no rompe nada: zram sigue funcionando por el camino del sistema. Si ya lo instalaste, sacalo con `sudo systemctl disable --now zramswap.service` y `sudo apt purge -y zram-tools`.

**Si `zramctl` no muestra nada** — sistema más viejo, sin `systemd-zram-generator` — entonces sí corresponde instalar el paquete, y conviene editar el archivo en lugar de agregar líneas al final, para no duplicar las que ya trae:

```bash
sudo apt install -y zram-tools
sudo sed -i 's/^ALGO=.*/ALGO=zstd/; s/^PERCENT=.*/PERCENT=50/' /etc/default/zramswap
sudo systemctl restart zramswap
```

Sobre el algoritmo: `zstd` comprime más, `lz4` cuesta menos procesador. En una Pi 3 el CPU también es escaso, así que si más adelante la pantalla se nota pesada con Chromium abierto, probar `lz4` es de los primeros ajustes a tocar.

---

## Paso 8 — Pasarme los datos

Ejecutá esto y mandame la salida:

```bash
cat /etc/os-release | head -2
uname -m
free -h
vcgencmd measure_temp
df -h /
```

Con eso confirmo versión del sistema, arquitectura, memoria, temperatura y espacio libre, y seguimos con el modo kiosco en la Fase 1.

---

## Paso 9 — Modo kiosco

**Resultado:** la Raspberry enciende y muestra la pantalla de JARVIS sola, sin teclado ni login.

### Qué se instala y por qué

```bash
sudo apt install -y cage chromium-browser
```

**`cage`** es un compositor Wayland mínimo: muestra una sola ventana a pantalla completa y nada más. No tiene barra de tareas, ni fondo de escritorio, ni gestor de archivos, ni menús. Se eligió frente a un escritorio completo porque la Pi 3 tiene 1 GB de RAM y cada cosa que no sea el navegador se la está sacando a Chromium.

### Copiar los archivos desde tu PC

Desde PowerShell, en la carpeta del proyecto:

```powershell
scp infra/raspberry/iniciar-kiosco.sh infra/raspberry/jarvis-kiosco.service jarvis_gus@jarvis.local:~
```

Y en la Raspberry:

```bash
sudo install -m 755 ~/iniciar-kiosco.sh /usr/local/bin/iniciar-kiosco.sh
sudo install -m 644 ~/jarvis-kiosco.service /etc/systemd/system/jarvis-kiosco.service
sudo mkdir -p /var/lib/jarvis
sudo chown jarvis_gus:jarvis_gus /var/lib/jarvis
```

### Probarlo antes de automatizarlo

```bash
sudo systemctl daemon-reload
sudo systemctl start jarvis-kiosco
```

Mirá el televisor: en unos segundos tiene que aparecer la pantalla de JARVIS, a pantalla completa y sin ninguna barra.

**Si no aparece**, el error está en los registros:

```bash
journalctl -u jarvis-kiosco -n 40 --no-pager
```

### Dejarlo encendido para siempre

Solo cuando lo hayas visto funcionar:

```bash
sudo systemctl enable jarvis-kiosco
sudo reboot
```

Después del reinicio la pantalla tiene que aparecer sola, sin que nadie toque nada.

### Lo que hace cada decisión rara

El servicio y el script llevan comentarios, pero tres cosas merecen aparecer también acá:

- **`MemoryMax=620M`.** Con 1 GB de RAM, un Chromium desbocado deja la máquina sin memoria y ya no se puede ni entrar por SSH para arreglarla. El límite hace que lo mate el sistema y se reinicie solo, en lugar de llevarse puesto todo el equipo.
- **`Restart=always`.** Es un dispositivo sin teclado colgado de una pared. Si el navegador se cae, nadie va a ir a levantarlo.
- **El arreglo de `exit_type` en el script.** Ante cualquier corte de luz, Chromium marca la sesión como terminada mal y al arrancar muestra la barra de «restaurar pestañas». En una casa sin teclado, eso se queda en pantalla para siempre. El script limpia esa marca antes de arrancar.

---

## Si algo sale mal

| Síntoma | Causa más probable |
|---|---|
| No enciende ninguna luz | Fuente insuficiente. Tiene que ser 5 V / 2,5 A reales. |
| Luz roja fija, nada en pantalla | La tarjeta no arrancó. Regrabala. |
| Arranca y se reinciia solo | Fuente floja, casi siempre. |
| El Wi-Fi no conecta | País mal configurado en el Imager, o la red es de 5 GHz: **la Pi 3 solo toma 2,4 GHz**. |
| `jarvis.local` no resuelve | Usá la IP directa. |
| La resolución no cambia tras editar `config.txt` | El sistema usa el driver KMS, que ignora las líneas `hdmi_*`. Va por `cmdline.txt`: ver Paso 6. |
| `zramswap.service` falla con `Device or resource busy` | zram ya está activo por systemd. No hace falta `zram-tools`: ver Paso 7. |
| La resolución es 1024×600 pero llena la pantalla | El televisor escala la señal. Buscá "Just Scan" u "Original" en su menú de imagen. Es cosmético. |
| Se pone muy lenta con el tiempo | microSD sin clasificación A1/A2. |

**Un reinicio al azar casi siempre es la fuente, no el software.** Es el error más común y el más difícil de diagnosticar si no se sospecha primero.
