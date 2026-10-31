import type { Evento } from '../datos/tipos'
import { IconoAgenda } from './Iconos'

const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

/**
 * La agenda del día, a lo ancho.
 *
 * Filas horizontales y no columna angosta: con el ancho completo entra
 * el día entero de un vistazo, que es lo que uno quiere saber al mirar
 * la pantalla de paso.
 */
export function TarjetaAgenda({ eventos, ahora }: { eventos: Evento[]; ahora: Date }) {
  const porVenir = eventos.filter((e) => new Date(e.comienza) >= ahora)

  return (
    <section className="tarjeta tarjeta--agenda vidrio vidrio--interactiva aparece" style={{ animationDelay: '120ms' }}>
      <div className="tarjeta__cabecera">
        <span className="tarjeta__insignia tarjeta__insignia--acento">
          <IconoAgenda tamano={14} grosor={2.2} />
        </span>
        <h2 className="tarjeta__titulo">Hoy tenés</h2>
        <span className="tarjeta__conteo">
          {porVenir.length === 0
            ? 'nada más por hoy'
            : `${porVenir.length} ${porVenir.length === 1 ? 'pendiente' : 'pendientes'}`}
        </span>
      </div>

      {porVenir.length === 0 ? (
        <p className="vacio">
          {eventos.length === 0 ? 'No hay nada agendado para hoy.' : 'Ya pasó todo lo de hoy.'}
          <span>Podés agregar algo diciendo «Jarvis, agendá…».</span>
        </p>
      ) : (
        <ul className="agenda">
          {porVenir.slice(0, 3).map((evento) => (
            <li key={evento.id} className={`agenda__fila${evento.destacado ? ' agenda__fila--proxima' : ''}`}>
              <span className="agenda__marca" aria-hidden="true" />
              <time className="agenda__hora numero" dateTime={evento.comienza}>
                {HORA.format(new Date(evento.comienza))}
              </time>
              <span className="agenda__titulo">{evento.titulo}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
