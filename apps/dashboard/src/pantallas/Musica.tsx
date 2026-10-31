import { useState } from 'react'
import type { EstadoMusica } from '../datos/tipos'
import { Grano } from '../componentes/Grano'
import {
  IconoAleatorio,
  IconoAnterior,
  IconoBucle,
  IconoNota,
  IconoPausa,
  IconoReproducir,
  IconoSiguiente,
  IconoVolumen,
} from '../componentes/Iconos'
import { BotonAyuda, BotonSalir, PieAcciones, Reloj } from '../componentes/Navegacion'

function reloj(segundos: number): string {
  const m = Math.floor(segundos / 60)
  return `${m}:${String(segundos % 60).padStart(2, '0')}`
}

/**
 * Carátula de relleno, derivada del título.
 *
 * YouTube sí da miniatura y en la Fase 8 se usa la real. Hasta entonces,
 * un degradado estable por título es mejor que un cuadro gris: hace que
 * la cola se lea de un vistazo, que es para lo que sirve una carátula.
 */
function tono(texto: string): number {
  let h = 0
  for (const c of texto) h = (h * 31 + c.codePointAt(0)!) % 360
  return h
}

function Caratula({ titulo, tamano }: { titulo: string; tamano: number }) {
  const h = tono(titulo)
  return (
    <span
      className="caratula"
      style={{
        width: tamano,
        height: tamano,
        background: `linear-gradient(145deg, hsl(${h} 42% 32%), hsl(${(h + 48) % 360} 55% 52%))`,
      }}
      aria-hidden="true"
    >
      <IconoNota tamano={Math.round(tamano * 0.36)} />
    </span>
  )
}

interface Props {
  musica: EstadoMusica
  ahora: Date
  onSalir: () => void
  onAyuda: () => void
}

export function Musica({ musica, ahora, onSalir, onAyuda }: Props) {
  const { pista, cola } = musica

  // Estado local: en la Fase 8 esto viaja al servidor, que es el único
  // que sabe si el reproductor obedeció. Por ahora es la maqueta viva.
  const [sonando, setSonando] = useState(pista.sonando)
  const [aleatorio, setAleatorio] = useState(false)
  const [bucle, setBucle] = useState(false)

  const avance =
    pista.duracion && pista.posicion !== null ? (pista.posicion / pista.duracion) * 100 : null

  return (
    <div className="pantalla pantalla--musica">
      <div className="musica__aura ambiental" aria-hidden="true" />
      <Grano />

      {/* Arriba solo la hora. Inicio y ayuda bajan al pie, al mismo
          lugar que en el resto de las pantallas. */}
      <header className="encabezado encabezado--solo-reloj">
        <Reloj ahora={ahora} />
      </header>

      <main className="repro">
        <div className="repro__arte">
          {/* El disco asoma por detrás y gira. El giro va en un elemento
              propio: si se anima el mismo que está centrado con
              translate, la rotación pisa ese translate y el disco se
              descuelga. */}
          <span className="repro__disco" aria-hidden="true">
            <span className="repro__disco-gira ambiental" />
          </span>
          <Caratula titulo={pista.titulo} tamano={190} />
        </div>

        <div className="repro__texto">
          {/* De dónde sale la música, siempre explícito y arriba de todo */}
          <span className="repro__origen">
            {sonando && (
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
                <span className="barra-avance__relleno" style={{ width: `${avance}%` }}>
                  <span className="barra-avance__perilla" />
                </span>
              </span>
              <span className="numero">{reloj(pista.duracion)}</span>
            </div>
          ) : (
            /* Bluetooth y algunas fuentes no informan la duración. Antes
               de inventar una barra de progreso, se dice que no se sabe. */
            <p className="repro__sin-tiempo">Esta fuente no informa la duración</p>
          )}

          <div className="controles">
            <button
              type="button"
              className={`control${aleatorio ? ' control--activo' : ''}`}
              aria-pressed={aleatorio}
              aria-label="Orden aleatorio"
              onClick={() => setAleatorio((v) => !v)}
            >
              <IconoAleatorio tamano={21} />
            </button>

            <button type="button" className="control" aria-label="Anterior">
              <IconoAnterior tamano={24} />
            </button>

            <button
              type="button"
              className="control control--principal"
              aria-label={sonando ? 'Pausar' : 'Reproducir'}
              onClick={() => setSonando((v) => !v)}
            >
              {sonando ? <IconoPausa tamano={24} /> : <IconoReproducir tamano={24} />}
            </button>

            <button type="button" className="control" aria-label="Siguiente">
              <IconoSiguiente tamano={24} />
            </button>

            <button
              type="button"
              className={`control${bucle ? ' control--activo' : ''}`}
              aria-pressed={bucle}
              aria-label="Repetir"
              onClick={() => setBucle((v) => !v)}
            >
              <IconoBucle tamano={21} />
            </button>

            <span className="controles__volumen">
              <IconoVolumen tamano={19} />
              <label className="solo-lectores" htmlFor="volumen">
                Volumen
              </label>
              <input id="volumen" className="deslizador" type="range" min="0" max="100" defaultValue="70" />
            </span>
          </div>
        </div>
      </main>

      <section className="cola">
        <div className="cola__cabecera">
          <h2 className="tarjeta__titulo">A continuación</h2>
          <span className="tarjeta__conteo">
            {cola.length === 0 ? 'nada en cola' : `${cola.length} en cola`}
          </span>
        </div>

        {cola.length === 0 ? (
          <p className="vacio vacio--compacto">
            No hay nada en la cola.
            <span>Cuando termine esta, se corta.</span>
          </p>
        ) : (
          <ul className="cola__lista">
            {cola.slice(0, 3).map((p, i) => (
              <li key={p.titulo}>
                <button type="button" className="cola__fila">
                  <Caratula titulo={p.titulo} tamano={42} />
                  <span className="cola__texto">
                    <span className="cola__titulo">{p.titulo}</span>
                    <span className="cola__artista">{p.artista}</span>
                  </span>
                  <span className="cola__orden numero" aria-hidden="true">
                    {i + 1}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PieAcciones>
        <BotonSalir onClick={onSalir} />
        <BotonAyuda onClick={onAyuda} />
      </PieAcciones>
    </div>
  )
}
