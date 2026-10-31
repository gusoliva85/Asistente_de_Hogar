"""JARVIS — API.

Fase 0: solo salud y versión. La lógica de negocio llega en la Fase 2.
"""

from datetime import datetime, timezone

from fastapi import FastAPI

from .configuracion import configuracion

app = FastAPI(
    title="JARVIS API",
    version="0.1.0",
    docs_url="/api/docs" if configuracion.entorno != "produccion" else None,
    redoc_url=None,
)


@app.get("/health")
async def salud() -> dict:
    """Comprobación de vida. No revela nada sensible."""
    return {
        "estado": "ok",
        "entorno": configuracion.entorno,
        "momento": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/v1/version")
async def version() -> dict:
    return {"version": app.version}
