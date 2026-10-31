import type { EstadoEscucha, OrigenRespuesta } from '../datos/tipos'
import { Grano } from '../componentes/Grano'
import { IconoAyuda, IconoMicrofono, IconoTilde } from '../componentes/Iconos'

const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

/**
 * De dónde salió la respuesta. Se dice siempre y sin eufemismos.
 *
 * Es la diferencia entre un asistente que explica qué hace con tu voz y
 * uno que no. Que algo se resuelva en casa no es un detalle técnico:
 * significa que lo que dijiste no salió de la casa.
 */
const ORIGEN: Record<OrigenRespuesta, { texto: string; enCasa: boolean }> = {
  reglas: { texto: 'Resuelto en casa · sin salir a la nube', enCasa: true },
  'modelo-local': { texto: 'Resuelto en casa · sin salir a la nube', enCasa: true },
  nube: { texto: 'Consultado en la nube', enCasa: false },
}

interface Props {
  estado: EstadoEscucha
  ahora: Date
  onSalir: () => void
  onAyuda: () => void
}

export function Escucha({ estado, ahora, onSalir, onAyuda }: Props) {
  const origen = ORIGEN[estado.origen]

  return (
    <div className="escucha">
      <div className="escucha__aura escucha__aura--1 ambiental" aria-hidden="true" />
      <div className="escucha__aura escucha__aura--2 ambiental" aria-hidden="true" />
      <Grano intenso />

      <header className="escucha__encabezado">
        <button type="button" className="escucha__volver" onClick={onSalir}>
          Volver
        </button>
        <div className="escucha__estado">
          <span className={`sello${origen.enCasa ? ' sello--casa' : ''}`}>
            <span className="sello__punto ambiental" aria-hidden="true" />
            {origen.texto}
          </span>
          <time className="escucha__hora numero" dateTime={ahora.toISOString()}>
            {HORA.format(ahora)}
          </time>
        </div>
      </header>

      <main className="escucha__cuerpo">
        <div className={`orbe${estado.escuchando ? ' orbe--activo' : ''}`} aria-hidden="true">
          <span className="orbe__anillo ambiental" />
          <span className="orbe__anillo orbe__anillo--2 ambiental" />
          <span className="orbe__nucleo">
            <IconoMicrofono tamano={38} grosor={1.8} />
          </span>
        </div>

        {estado.escuchando ? (
          <p className="escucha__titulo">Te estoy escuchando</p>
        ) : (
          <p className="escucha__dicho">«{estado.transcripcion}»</p>
        )}

        {estado.accion && (
          <section className="resultado sube">
            {/* La confirmación y la prueba van juntas. Sin la hora de
                verificación esto sería una promesa, no un hecho. */}
            <h2 className="resultado__titulo">
              <span className="resultado__tilde" aria-hidden="true">
                <IconoTilde tamano={13} />
              </span>
              {estado.accion.resumen}
            </h2>
            {estado.accion.verificadoA ? (
              <p className="resultado__prueba">
                Verificado en la base de datos a las{' '}
                {HORA.format(new Date(estado.accion.verificadoA))}
              </p>
            ) : (
              <p className="resultado__prueba resultado__prueba--pendiente">
                Todavía no pude confirmarlo contra la base de datos
              </p>
            )}

            <ul className="resultado__detalles">
              {estado.accion.detalles.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <footer className="resultado__pie">
              <span className="resultado__pista">Decí «cancelá» para deshacer</span>
              {estado.sincronizado === true && (
                <span className="resultado__sincro">Ya está en tu celular</span>
              )}
              {estado.sincronizado === false && (
                <span className="resultado__sincro resultado__sincro--no">
                  Todavía no llegó al celular
                </span>
              )}
            </footer>
          </section>
        )}
      </main>

      <button type="button" className="ayuda ayuda--escucha" onClick={onAyuda}>
        <IconoAyuda tamano={22} />
        Necesito ayuda
      </button>
    </div>
  )
}
