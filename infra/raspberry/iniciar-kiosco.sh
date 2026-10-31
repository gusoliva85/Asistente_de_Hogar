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

# Raspberry Pi OS llama al paquete chromium-browser; Debian puro, chromium.
if command -v chromium-browser >/dev/null 2>&1; then
  NAVEGADOR=chromium-browser
else
  NAVEGADOR=chromium
fi

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

exec "$NAVEGADOR" \
  --user-data-dir="$PERFIL" \
  --kiosk \
  --app="$URL" \
  --window-size="$ANCHO,$ALTO" \
  --window-position=0,0 \
  --ozone-platform=wayland \
  --enable-features=UseOzonePlatform \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --no-default-browser-check \
  --disable-session-crashed-bubble \
  --disable-features=Translate,TranslateUI,InfiniteSessionRestore \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --check-for-update-interval=31536000 \
  --autoplay-policy=no-user-gesture-required \
  --password-store=basic \
  --disable-component-update
