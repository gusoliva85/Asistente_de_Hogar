import type { Pista } from '../datos/tipos'
import { IconoPausa, IconoReproducir } from './Iconos'
import { Grano } from './Grano'

export function BarraMusica({ pista }: { pista: Pista | null }) {
  if (!pista) {
    return (
      <section className="musica musica--apagada aparece" style={{ animationDelay: '360ms' }}>
        <p className="vacio vacio--compacto">
          No hay música sonando.
          <span>«Jarvis, poné algo de Soda Stereo».</span>
        </p>
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
