#!/bin/sh
# JARVIS — arranque del navegador en modo kiosco.
#
# Lo llama jarvis-kiosco.service. No se ejecuta a mano salvo para probar.
#
# Cada opción de Chromium que está acá es deliberada: las que no se
# entiendan no hay que borrarlas sin leer el comentario, porque varias
# existen para evitar que aparezca un cuadro de diálogo en una pantalla
# sin teclado, en una casa donde nadie lo va a poder cerrar.

set -eu

URL="${JARVIS_URL:-http://13.140.36.93}"
ANCHO="${JARVIS_ANCHO:-1024}"
ALTO="${JARVIS_ALTO:-600}"

# --- Por qué no se llama a `chromium` a secas -------------------------
#
# En Raspberry Pi OS /usr/bin/chromium no es el navegador: es un guion que
# antes de arrancarlo lee todo /etc/chromium.d/ y le agrega opciones que
# nosotros nunca elegimos. El 31/10/2026, en esta misma máquina, metía:
#
#   --force-renderer-accessibility   construye el árbol de accesibilidad
#                                    entero y lo mantiene vivo. En un
#                                    kiosco sin lector de pantalla es
#                                    trabajo y memoria tirados.
#   --enable-gpu-rasterization       dibuja en la GPU. En la V3D de la
#                                    Pi 3 es justo el camino frágil.
#   --enable-remote-extensions
#   --load-extension=                (vacío)
#   --show-component-extension-options
#
# Se descubrió comparando el guion con /proc/<pid>/cmdline, que es lo
# único que dice qué se está ejecutando de verdad. Por eso se llama al
# binario real: así la línea de comandos es exactamente ésta y nada más.
BINARIO="${JARVIS_CHROMIUM:-/usr/lib/chromium/chromium}"
[ -x "$BINARIO" ] || BINARIO=/usr/lib/chromium-browser/chromium-browser

# El perfil vive en un sitio propio: si se corrompe, se borra esta
# carpeta y listo, sin tocar nada más.
PERFIL="${JARVIS_PERFIL:-/var/lib/jarvis/chromium}"
mkdir -p "$PERFIL"

# Chromium marca la sesión como "no cerrada correctamente" ante cualquier
# corte de luz, y al arrancar muestra la barra de restaurar pestañas.
# En una casa sin teclado eso se queda en pantalla para siempre.
if [ -f "$PERFIL/Default/Preferences" ]; then
  sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/; s/"exited_cleanly":false/"exited_cleanly":true/' \
    "$PERFIL/Default/Preferences" || true
fi

# Rasterizado. Va en la GPU, y está medido.
#
# El 31/10/2026 se probó pasarlo a la CPU para esquivar un defecto del
# driver V3D —deja mosaicos viejos sin invalidar y tras unas horas la
# pantalla se ensucia con elementos repetidos y superpuestos, sin un
# solo error en el journal. Salió peor, y los números lo dicen:
#
#                     GPU        CPU
#   temperatura    79,5 °C    85,4 °C
#   reloj del ARM  1195 MHz    603 MHz   (capada por calor)
#   CPU libre         --          7 %
#
# Con la CPU, el renderizador solo se comía el 210 % y el proceso
# gráfico otro 129 %. La máquina quedaba ahogada. Las animaciones
# ambientales obligan a redibujar seguido, y eso en la CPU de una Pi 3
# no entra. Así que vuelve a la GPU.
#
# Contra los mosaicos viejos queda --disable-partial-raster, que obliga
# a redibujar el mosaico entero en vez de parchear un pedazo. Es la
# hipótesis, no un hecho: hay que dejarla encendida horas para saberlo.
#
# Para volver a probar la CPU: JARVIS_RASTER=cpu en el servicio.
if [ "${JARVIS_RASTER:-gpu}" = "cpu" ]; then
  RASTER="--disable-gpu-rasterization"
else
  RASTER="--enable-gpu-rasterization --disable-partial-raster"
fi

exec "$BINARIO" \
  --user-data-dir="$PERFIL" \
  --kiosk \
  --app="$URL" \
  --window-size="$ANCHO,$ALTO" \
  --window-position=0,0 \
  --ozone-platform=wayland \
  --enable-features=UseOzonePlatform \
  --use-angle=gles \
  $RASTER \
  --disable-dev-shm-usage \
  --lang=es-AR \
  --noerrdialogs \
  --no-first-run \
  --no-default-browser-check \
  --disable-session-crashed-bubble \
  --disable-features=Translate,TranslateUI,InfiniteSessionRestore \
  --disable-pinch \
  --hide-scrollbars \
  --overscroll-history-navigation=0 \
  --check-for-update-interval=31536000 \
  --autoplay-policy=no-user-gesture-required \
  --password-store=basic \
  --disable-component-update \
  --disable-background-networking \
  --disable-breakpad \
  --disable-sync \
  --disable-notifications
