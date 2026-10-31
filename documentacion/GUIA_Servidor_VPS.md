# Guía de montaje del servidor

**Para:** levantar el VPS desde cero, sin memoria de lo anterior.
**Tiempo:** unos 30 minutos.
**Resultado:** un servidor Ubuntu endurecido, con Docker, sirviendo la API por internet.

Esta guía documenta lo que se hizo el 31/10/2026 sobre el Contabo Cloud VPS 4. Sirve para reconstruirlo si se pierde, y para montar el servidor del segundo hogar en la Fase 10.

> **Las contraseñas y claves se generan en el servidor y no salen de ahí.** Nada de lo que esta guía produce debe pegarse en un chat, un ticket o el repositorio.

---

## Paso 0 — Pedir el servidor

En el panel de Contabo: **COMPUTAR → VPS**. De la instancia importan dos cosas: la **IP** y el acceso.

Si el servidor viene usado o con credenciales desconocidas, **reinstalalo** antes de empezar: **Reinstalar → Imagen estándar → Ubuntu 24.04 (LTS)**, sin aplicación preinstalada. Borra todo, que es lo que se busca.

La instalación estándar exige una contraseña. Generala con el botón del panel, guardala, y usala una sola vez: en el Paso 2 el acceso pasa a ser por clave y esa contraseña deja de servir.

**Contabo filtra ICMP:** que `ping` no responda no significa que el servidor esté caído. Para comprobar que está vivo, probá el puerto 22 en lugar del ping.

---

## Paso 1 — Generar la clave en tu PC

En tu máquina, no en el servidor:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/jarvis_deploy -N "" -C "jarvis-vps"
```

Y una entrada en `~/.ssh/config` para no repetir la IP:

```
Host jarvis-vps
    HostName LA_IP
    User root
    IdentityFile ~/.ssh/jarvis_deploy
    IdentitiesOnly yes
```

El archivo `jarvis_deploy` **sin** extensión es la clave privada: es el acceso al servidor. Copiá la carpeta `.ssh` a un lugar seguro; si la perdés, hay que volver al panel a cargar otra clave.

---

## Paso 2 — Instalar la clave y cerrar las contraseñas

Entrá con la contraseña del Paso 0:

```bash
ssh root@LA_IP
```

Instalá la clave pública —la línea completa de `~/.ssh/jarvis_deploy.pub`, en un solo renglón:

```bash
mkdir -p ~/.ssh
echo 'ssh-ed25519 AAAA... jarvis-vps' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

> **Verificá que el archivo quedó con contenido** (`wc -c < ~/.ssh/authorized_keys`) y **probá la conexión por clave en una segunda ventana** antes de seguir. El panel de Contabo ofrece cargar la clave al reinstalar, pero no siempre la aplica: si se da por hecho y se apagan las contraseñas, el servidor queda inaccesible.

Con la segunda ventana conectada por clave y **sin cerrarla**, apagá las contraseñas:

```bash
cat > /etc/ssh/sshd_config.d/00-jarvis.conf <<'EOF'
# JARVIS — endurecimiento de acceso SSH
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
PubkeyAuthentication yes
EOF
sshd -t && systemctl reload ssh
sshd -T | grep -E "^(passwordauthentication|permitrootlogin|kbdinteractiveauthentication)"
```

**El `00` del nombre no es decorativo.** Los archivos de `/etc/ssh/sshd_config.d/` se leen en orden numérico y **gana el primer valor leído, no el último**. Ubuntu trae un `50-cloud-init.conf` con `PasswordAuthentication yes`: cualquier archivo con número mayor a 50 sería ignorado.

`sshd -t` valida la sintaxis sin aplicarla. Si falla, no recargues.

### Comprobación

Desde tu PC, las dos mitades:

```bash
ssh jarvis-vps                                    # tiene que entrar sin pedir nada
ssh -o PreferredAuthentications=password \
    -o PubkeyAuthentication=no root@LA_IP         # tiene que fallar: Permission denied (publickey)
```

Con solo la segunda sabríamos que nadie entra, incluido vos. Hacen falta las dos.

---

## Paso 3 — Cortafuegos

```bash
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP - Caddy'
ufw allow 443/tcp comment 'HTTPS - Caddy'
ufw --force enable
ufw status verbose
```

**El orden importa.** `ufw enable` antes de abrir el 22 corta la sesión SSH en el acto.

El 80 es imprescindible aunque todo vaya por HTTPS: la validación del certificado de Let's Encrypt pasa por ahí.

---

## Paso 4 — Actualizaciones automáticas de seguridad

```bash
apt update && apt full-upgrade -y
apt install -y unattended-upgrades
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
cat > /etc/apt/apt.conf.d/51-jarvis-unattended <<'EOF'
// Reinicios a mano: este servidor atiende emergencias y no puede
// reiniciarse solo a las tres de la mañana sin que nadie lo sepa.
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
EOF
systemctl enable --now unattended-upgrades
```

Comprobalo:

```bash
systemctl is-enabled unattended-upgrades    # enabled
unattended-upgrade --dry-run --debug 2>&1 | tail -5
```

Solo se aplican parches del repositorio de **seguridad**: no actualiza versiones de paquetes por capricho.

**Contrapartida de `Automatic-Reboot "false"`:** las actualizaciones de núcleo quedan instaladas pero sin efecto hasta que alguien reinicie. Conviene mirar de vez en cuando si existe `/var/run/reboot-required` y reiniciar en un momento elegido.

---

## Paso 5 — Docker

Desde el repositorio oficial, **no** el paquete de Ubuntu: el de Ubuntu está atrasado y no trae `docker compose` como subcomando.

```bash
apt install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
docker run --rm hello-world
```

> **Docker se saltea `ufw`.** Un servicio con `ports:` queda expuesto a internet aunque el cortafuegos lo niegue, porque Docker escribe sus propias reglas por debajo. En `docker-compose.yml` solo Caddy publica puertos; la base de datos y la API usan `expose`, visibles únicamente dentro de la red interna. **Agregar `ports:` a la base de datos la publica en internet.**

---

## Paso 6 — Clave de despliegue para GitHub

El repositorio es privado, así que el servidor necesita credenciales propias. Una **clave de despliegue** sirve para un solo repositorio y puede ser de solo lectura, a diferencia de una clave personal que abre todos.

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N "" -C "jarvis-vps-deploy"
cat ~/.ssh/github_deploy.pub
cat >> ~/.ssh/config <<'EOF'

Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_deploy
    IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

Esa clave pública va en **Settings → Deploy keys → Add deploy key** del repositorio, **sin** marcar *Allow write access*.

```bash
ssh -T git@github.com
```

Tiene que responder `Hi usuario/repo! You've successfully authenticated, but GitHub does not provide shell access.` Ese mensaje es el éxito: GitHub nunca da consola.

La huella de GitHub se verifica contra <https://docs.github.com/en/authentication/keeping-your-account-secure/githubs-ssh-key-fingerprints>. Responder `yes` a ciegas vuelve inútil esa pregunta.

Si aparece `Permission denied (publickey)` y en GitHub la clave figura como **"Never used"**, el problema está en el servidor: no la está ofreciendo. Casi siempre es que el bloque de `~/.ssh/config` no se escribió, o que el archivo tiene permisos demasiado abiertos —SSH ignora un `config` legible por otros, en silencio y sin avisar.

---

## Paso 7 — Clonar y configurar

```bash
git clone git@github.com:USUARIO/REPO.git /opt/jarvis
cd /opt/jarvis
```

Las contraseñas se generan acá y no se escriben a mano:

```bash
PGPASS=$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 32)
JWT=$(openssl rand -hex 32)
cat > .env <<EOF
ENTORNO=desarrollo
ZONA_HORARIA=America/Argentina/Buenos_Aires
DOMINIO=
EMAIL_CERTIFICADO=
POSTGRES_USUARIO=jarvis
POSTGRES_PASSWORD=$PGPASS
POSTGRES_DB=jarvis
DATABASE_URL=postgresql+asyncpg://jarvis:$PGPASS@db:5432/jarvis
JWT_SECRET=$JWT
JWT_MINUTOS_EXPIRACION=30
JWT_DIAS_REFRESCO=30
EOF
chmod 600 .env
unset PGPASS JWT
```

`DOMINIO` vacío hace que Caddy sirva por HTTP contra la IP. Con dominio, poné el nombre ahí.

---

## Paso 8 — Levantar

```bash
docker compose up -d --build
docker compose ps
curl -s http://localhost/health
```

Los tres servicios tienen que figurar como `running`, y `db` además como `healthy`. El `curl` devuelve `{"estado":"ok", ...}`.

La prueba que vale es **desde afuera**, no desde el servidor: abrí `http://LA_IP/health` en el navegador de otra máquina. Eso confirma la cadena entera, cortafuegos incluido.

---

## Actualizar lo desplegado

```bash
cd /opt/jarvis
git pull
docker compose up -d
```

`up -d` recrea solo lo que cambió. Los volúmenes —y con ellos la base de datos— no se tocan.

---

## Si algo sale mal

| Síntoma | Causa más probable |
|---|---|
| `ping` sin respuesta | Contabo filtra ICMP. Probá el puerto 22, no el ping. |
| `Permission denied (publickey)` al entrar | La clave no está en `authorized_keys`, o el archivo quedó vacío. Entrá por la consola VNC del panel. |
| El cambio en `sshd_config` no tiene efecto | Hay un archivo en `sshd_config.d/` con número menor que gana. Comprobá siempre con `sshd -T`, nunca leyendo el archivo. |
| Quedaste afuera por SSH | Consola VNC en el panel de Contabo. No pasa por la red. |
| Caddy reinicia en bucle | Error de sintaxis en el `Caddyfile`. Validalo con `docker compose run --rm --entrypoint caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile`. |
| `email` sin argumento en Caddy | `EMAIL_CERTIFICADO` vacío en un bloque global. No uses bloque global: va `tls <correo>` dentro del sitio. |
| La base de datos quedó accesible desde internet | Alguien agregó `ports:` al servicio `db`. `ufw` no protege de esto. |
| GitHub rechaza la clave y figura "Never used" | El servidor no la ofrece: falta el bloque en `~/.ssh/config` o sobran permisos. |
