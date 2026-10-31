import type { Pista } from '../datos/tipos'
import { Caratula } from './Caratula'
import { Grano } from './Grano'
import { IconoPausa, IconoReproducir } from './Iconos'

/**
 * La música, como tarjeta con su arte.
 *
 * Sin música el visor sigue estando: mismo marco, misma tapa, mismo
 * botón, apagados. Un hueco en blanco no deja saber a qué pertenece ese
 * espacio ni que ahí va a aparecer lo que suene.
 */
export function TarjetaMusica({ pista, onAbrir }: { pista: Pista | null; onAbrir: () => void }) {
  return (
    <section
      className={`musica aparece${pista ? '' : ' musica--apagada'}`}
      style={{ animationDelay: '300ms' }}
    >
      <Grano intenso />
      <button type="button" className="musica__abrir" onClick={onAbrir} aria-label="Abrir música" />

      <Caratula titulo={pista ? pista.titulo : 'silencio'} tamano={134} />

      <div className="musica__texto">
        <div className="musica__titulo">{pista ? pista.titulo : 'Sin música'}</div>
        <div className="musica__artista">{pista ? pista.artista : 'Nada sonando ahora'}</div>
      </div>

      <div className="musica__pie">
        <span className="musica__origen">
          {pista?.sonando && (
            <span className="ondas" aria-hidden="true">
              <span className="onda ambiental" />
              <span className="onda ambiental" />
              <span className="onda ambiental" />
            </span>
          )}
          {pista ? pista.origen : '«Jarvis, poné algo»'}
        </span>

        <button
          type="button"
          className="musica__boton"
          disabled={!pista}
          aria-label={pista?.sonando ? 'Pausar' : 'Reproducir'}
        >
          {pista?.sonando ? <IconoPausa /> : <IconoReproducir />}
        </button>
      </div>
    </section>
  )
}
