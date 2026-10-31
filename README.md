# JARVIS

Asistente doméstico por voz con pantalla, para dos hogares. Voz en español, listas, agenda, música, dispositivos del hogar y un módulo de emergencias con escalamiento y confirmación.

La documentación completa está en [`documentacion/`](documentacion/). Si vas a tocar el código, empezá por [`documentacion/ESPECIFICACION_Tecnica_Funcional.md`](documentacion/ESPECIFICACION_Tecnica_Funcional.md) y seguí por [`documentacion/ROADMAP.md`](documentacion/ROADMAP.md).

---

## Estructura

```text
.
├── documentacion/          Especificación, roadmap, hardware, mockups
├── services/
│   └── api/                Backend FastAPI
├── apps/
│   ├── dashboard/          Interfaz de la pantalla y PWA (Fase 1)
│   └── device-agent/       Agente local de la Raspberry (Fase 4)
├── infra/
│   ├── caddy/              Proxy inverso, TLS y página de prueba
│   └── scripts/            Copias de seguridad y utilidades
├── tests/                  Pruebas automatizadas
├── docker-compose.yml
└── .env.example
```

---

## Levantarlo

### 1. Variables de entorno

```bash
cp .env.example .env
```

Completá `.env` **en el servidor**. Los valores que no pueden quedar vacíos:

| Variable | Cómo generarla |
|---|---|
| `POSTGRES_PASSWORD` | `openssl rand -base64 36` |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `DATABASE_URL` | la misma contraseña que pusiste arriba |
| `DOMINIO` | tu dominio, o `:80` para probar por IP sin HTTPS |
| `EMAIL_CERTIFICADO` | tu correo, para los avisos de Let's Encrypt |

**`.env` no se versiona nunca.** El `.gitignore` ya lo bloquea.

### 2. Arrancar

```bash
docker compose up -d --build
docker compose ps
```

### 3. Comprobar

```bash
curl -fsS https://TU_DOMINIO/health
```

Tiene que responder `{"estado":"ok", ...}`. Y en el navegador, `https://TU_DOMINIO` muestra la página de prueba con el candado cerrado.

### Comandos útiles

```bash
docker compose logs -f api      # ver qué hace la API
docker compose restart api      # reiniciar solo la API
docker compose down             # bajar todo (los datos quedan en los volúmenes)
```

---

## Reglas del proyecto

Están en [`CLAUDE.md`](CLAUDE.md), pero las dos que más condicionan el código:

1. **Aislamiento entre hogares.** Toda tabla de datos de usuario lleva `hogar_id`, toda consulta lo filtra, y PostgreSQL lo exige además con políticas a nivel de fila. Lo que pasa en una casa no puede alcanzar a otra.
2. **No fingir acciones.** Nada se confirma hasta haber verificado que ocurrió, contra la base de datos o contra el dispositivo real.

---

## Estado

**Fase 0** — infraestructura. La API solo responde `/health`; la interfaz llega en la Fase 1.
