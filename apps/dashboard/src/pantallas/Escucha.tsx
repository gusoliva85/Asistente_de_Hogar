import type { EstadoEscucha } from '../datos/tipos'
import { Grano } from '../componentes/Grano'
import { IconoMicrofono, IconoTilde } from '../componentes/Iconos'
import { BotonAyuda, BotonSalir, PieAcciones, Reloj } from '../componentes/Navegacion'

const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

interface Props {
  estado: EstadoEscucha
  ahora: Date
  onSalir: () => void
  onAyuda: () => void
}

/**
 * Pantalla de escucha.
 *
 * El estado por defecto es «escuchando sin haber oído nada todavía», que
 * es donde la pantalla pasa la mayor parte del tiempo. Sigue el patrón
 * que usan los asistentes que ya existen: una frase corta de que está
 * escuchando, que la transcripción en vivo va reemplazando a medida que
 * la persona habla. Nunca un texto de ejemplo fijo.
 */
export function Escucha({ estado, ahora, onSalir, onAyuda }: Props) {
  const hayTexto = estado.transcripcion.trim().length > 0

  return (
    <div className="escucha">
      {/* Latido de fondo: toda la pantalla respira mientras escucha. Es
          lo que hace que se entienda que el aparato está captando, sin
          tener que leer nada. */}
      {estado.escuchando && <div className="escucha__latido ambiental" aria-hidden="true" />}
      <div className="escucha__aura escucha__aura--1 ambiental" aria-hidden="true" />
      <div className="escucha__aura escucha__aura--2 ambiental" aria-hidden="true" />
      <Grano intenso />

      <header className="escucha__encabezado">
        <Reloj ahora={ahora} sobreOscuro />
      </header>

      <main className="escucha__cuerpo">
        <div className={`orbe${estado.escuchando ? ' orbe--activo' : ''}`} aria-hidden="true">
          <span className="orbe__anillo ambiental" />
          <span className="orbe__anillo orbe__anillo--2 ambiental" />
          <span className="orbe__anillo orbe__anillo--3 ambiental" />
          <span className="orbe__nucleo">
            <IconoMicrofono tamano={52} grosor={1.7} />
          </span>
        </div>

        {hayTexto ? (
          /* La transcripción en vivo reemplaza a la frase de espera */
          <p className="escucha__dicho">{estado.transcripcion}</p>
        ) : (
          <>
            <p className="escucha__titulo">Te escucho</p>
            <p className="escucha__ayuda">Decime qué necesitás</p>
          </>
        )}

        {estado.accion && (
          <section className="resultado sube">
            <span className="resultado__tilde" aria-hidden="true">
              <IconoTilde tamano={16} />
            </span>

            <div className="resultado__texto">
              <h2 className="resultado__titulo">{estado.accion.resumen}</h2>
              {/* Sin la hora de verificación, el título de arriba sería
                  una promesa y no un hecho comprobado. */}
              {estado.accion.verificadoA ? (
                <p className="resultado__prueba">
                  Verificado en la base a las {HORA.format(new Date(estado.accion.verificadoA))}
                  {estado.sincronizado === true && ' · ya está en tu celular'}
                  {estado.sincronizado === false && ' · todavía no llegó al celular'}
                </p>
              ) : (
                <p className="resultado__prueba resultado__prueba--pendiente">
                  Todavía no pude confirmarlo contra la base de datos
                </p>
              )}
            </div>

            <ul className="resultado__detalles">
              {estado.accion.detalles.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <span className="resultado__pista">Decí «cancelá» para deshacer</span>
          </section>
        )}
      </main>

      <PieAcciones>
        <BotonSalir onClick={onSalir} sobreOscuro />
        <BotonAyuda onClick={onAyuda} />
      </PieAcciones>
    </div>
  )
}
