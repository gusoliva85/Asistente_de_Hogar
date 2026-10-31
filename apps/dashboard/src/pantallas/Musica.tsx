import type { EstadoMusica } from '../datos/tipos'
import { Grano } from '../componentes/Grano'
import { IconoAyuda, IconoNota, IconoPausa, IconoReproducir } from '../componentes/Iconos'

const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

function reloj(segundos: number): string {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

interface Props {
  musica: EstadoMusica
  ahora: Date
  onSalir: () => void
  onAyuda: () => void
}

export function Musica({ musica, ahora, onSalir, onAyuda }: Props) {
  const { pista, cola } = musica
  const avance =
    pista.duracion && pista.posicion !== null ? (pista.posicion / pista.duracion) * 100 : null

  return (
    <div className="pantalla pantalla--musica">
      <div className="musica__aura ambiental" aria-hidden="true" />
      <Grano />

      <header className="encabezado">
        <button type="button" className="boton-modo" onClick={onSalir}>
          Inicio
        </button>
        <div className="encabezado__derecha">
          <time className="pastilla numero" dateTime={ahora.toISOString()}>
            {HORA.format(ahora)}
          </time>
          <button type="button" className="boton-modo boton-modo--ayuda" onClick={onAyuda}>
            <IconoAyuda tamano={15} />
            Ayuda
          </button>
        </div>
      </header>

      <main className="repro">
        <div className="repro__arte">
          <span className="repro__disco ambiental" aria-hidden="true" />
          <span className="repro__tapa" aria-hidden="true">
            <IconoNota tamano={44} />
          </span>
        </div>

        <div className="repro__texto">
          {/* De dónde sale la música, siempre explícito y arriba de todo */}
          <span className="repro__origen">
            {pista.sonando && (
              <span className="ondas" aria-hidden="true">
                <span className="onda ambiental" />
                <span className="onda ambiental" />
                <span className="onda ambiental" />
              </span>
            )}
            Desde {pista.origen} · audio
          </span>

          <h1 className="repro__titulo">{pista.titulo}</h1>
          <p className="repro__artista">{pista.artista}</p>
          {pista.album && <p className="repro__album">{pista.album}</p>}

          {avance !== null && pista.posicion !== null && pista.duracion !== null ? (
            <div className="repro__avance">
              <span className="numero">{reloj(pista.posicion)}</span>
              <span className="barra-avance">
                <span className="barra-avance__relleno" style={{ width: `${avance}%` }} />
              </span>
              <span className="numero">{reloj(pista.duracion)}</span>
            </div>
          ) : (
            /* Bluetooth y algunas fuentes no informan la duración. Antes
               de inventar una barra de progreso, se dice que no se sabe. */
            <p className="repro__sin-tiempo">Esta fuente no informa la duración</p>
          )}

          <button type="button" className="repro__boton" aria-label={pista.sonando ? 'Pausar' : 'Reproducir'}>
            {pista.sonando ? <IconoPausa tamano={20} /> : <IconoReproducir tamano={20} />}
          </button>
        </div>
      </main>

      <section className="cola">
        <h2 className="tarjeta__titulo">A continuación</h2>
        {cola.length === 0 ? (
          <p className="vacio vacio--compacto">
            No hay nada en la cola.
            <span>Cuando termine esta, se corta.</span>
          </p>
        ) : (
          <ul className="cola__lista">
            {cola.slice(0, 3).map((p) => (
              <li key={p.titulo} className="cola__fila">
                <span className="cola__nota" aria-hidden="true">
                  <IconoNota tamano={13} />
                </span>
                <span className="cola__titulo">{p.titulo}</span>
                <span className="cola__artista">{p.artista}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="cola__pista">Decí «Jarvis» y la música se baja sola</p>
      </section>
    </div>
  )
}
