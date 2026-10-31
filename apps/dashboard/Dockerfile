# Compila el frontend y deja los estáticos listos para que Caddy los sirva.
#
# No corre nada en producción: la segunda etapa existe solo para que un
# contenedor efímero copie los archivos al volumen compartido. Node no
# queda en el servidor.

FROM node:22-alpine AS compilacion
WORKDIR /app

# Las dependencias primero y por separado: mientras package-lock.json no
# cambie, Docker reutiliza esta capa y no vuelve a instalar.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM alpine:3.21
COPY --from=compilacion /app/dist /sitio
