"""Configuración leída del entorno. Ningún valor por defecto es un secreto."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Configuracion(BaseSettings):
    model_config = SettingsConfigDict(env_file=None, extra="ignore")

    entorno: str = "desarrollo"
    zona_horaria: str = "America/Argentina/Buenos_Aires"
    database_url: str = ""
    jwt_secret: str = ""

    @property
    def es_produccion(self) -> bool:
        return self.entorno == "produccion"


configuracion = Configuracion()
