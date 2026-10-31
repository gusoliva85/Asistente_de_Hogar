#!/bin/sh
# JARVIS — muestreo de rendimiento del kiosco (F1.10).
#
# Toma una línea cada cinco minutos y la va escribiendo en un CSV. Existe
# porque las dos preguntas que importan no se contestan con una foto:
# si la memoria crece sin parar (fuga) y si la temperatura se estabiliza
# o sigue subiendo. Para eso hace falta una curva.
#
#   Arrancar:  setsid nohup ~/medir-rendimiento.sh >/dev/null 2>&1 &
#   Leer:      column -t -s';' ~/medicion-jarvis.csv
#   Parar:     pkill -f medir-rendimiento.sh

SALIDA="${1:-$HOME/medicion-jarvis.csv}"
INTERVALO="${2:-300}"

if [ ! -f "$SALIDA" ]; then
  echo "hora;min;mem_mb;chromium_mb;procs;swap_mb;temp_c;cpu_mhz;throttled;cpu_pct" > "$SALIDA"
fi

INICIO=$(date +%s)

while true; do
  MIN=$(( ($(date +%s) - INICIO) / 60 ))
  MEM=$(free -m | awk '/^Mem:/{print $3}')
  SWAP=$(free -m | awk '/^Swap:/{print $3}')
  RSS=$(ps -o rss= -C chromium 2>/dev/null | awk '{s+=$1} END {printf "%.0f", s/1024}')
  PROCS=$(pgrep -c chromium 2>/dev/null || echo 0)
  TEMP=$(vcgencmd measure_temp | tr -dc '0-9.')
  FREQ=$(( $(vcgencmd measure_clock arm | cut -d= -f2) / 1000000 ))
  THR=$(vcgencmd get_throttled | cut -d= -f2)
  CPU=$(ps -o %cpu= -C chromium 2>/dev/null | awk '{s+=$1} END {printf "%.1f", s}')
  echo "$(date +%H:%M);$MIN;$MEM;$RSS;$PROCS;$SWAP;$TEMP;$FREQ;$THR;$CPU" >> "$SALIDA"
  sleep "$INTERVALO"
done
