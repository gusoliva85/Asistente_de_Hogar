import type { Pista } from '../datos/tipos'
import { IconoNota, IconoPausa, IconoReproducir } from './Iconos'
import { Grano } from './Grano'

export function BarraMusica({ pista }: { pista: Pista | null }) {
  // Sin música, el visor sigue estando: mismo marco, misma tapa, mismo
  // botón, apagados. Un hueco en blanco no deja saber a qué pertenece
  // ese espacio ni que ahí va a aparecer lo que suene.
  if (!pista) {
    return (
      <section className="musica musica--apagada aparece" style={{ animationDelay: '360ms' }}>
        <Grano intenso />
        <div className="musica__tapa musica__tapa--vacia" aria-hidden="true">
          <IconoNota tamano={22} />
        </div>
        <div className="musica__texto">
          <div className="musica__titulo musica__titulo--vacio">Sin música</div>
          <div className="musica__artista">Nada sonando ahora</div>
          <div className="musica__origen">«Jarvis, poné algo»</div>
        </div>
        <button type="button" className="musica__boton" disabled aria-label="No hay nada para reproducir">
          <IconoReproducir />
        </button>
      </section>
    )
  }

  return (
    <section className="musica aparece" style={{ animationDelay: '360ms' }}>
      <Grano intenso />
      <div className="musica__tapa" aria-hidden="true" />
      <div className="musica__texto">
        <div className="musica__titulo">{pista.titulo}</div>
        <div className="musica__artista">{pista.artista}</div>
        <div className="musica__origen">
          {pista.sonando && (
            <span className="ondas" aria-hidden="true">
              <span className="onda ambiental" />
              <span className="onda ambiental" />
              <span className="onda ambiental" />
            </span>
          )}
          {/* De dónde sale la música, siempre explícito */}
          <span>{pista.origen}</span>
        </div>
      </div>
      <button type="button" className="musica__boton" aria-label={pista.sonando ? 'Pausar' : 'Reproducir'}>
        {pista.sonando ? <IconoPausa /> : <IconoReproducir />}
      </button>
    </section>
  )
}
