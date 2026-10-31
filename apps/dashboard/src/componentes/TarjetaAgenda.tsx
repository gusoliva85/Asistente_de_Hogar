import type { Evento } from '../datos/tipos'
import { IconoAgenda } from './Iconos'

const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

export function TarjetaAgenda({ eventos }: { eventos: Evento[] }) {
  const porVenir = eventos.filter((e) => new Date(e.comienza) >= new Date())

  return (
    <section className="tarjeta vidrio vidrio--interactiva aparece" style={{ animationDelay: '120ms' }}>
      <div className="tarjeta__cabecera">
        <span className="tarjeta__insignia tarjeta__insignia--acento">
          <IconoAgenda tamano={14} grosor={2.2} />
        </span>
        <h2 className="tarjeta__titulo">Hoy tenés</h2>
        <span className="tarjeta__conteo">
          {eventos.length === 0
            ? 'sin eventos'
            : `${eventos.length} ${eventos.length === 1 ? 'evento' : 'eventos'}`}
        </span>
      </div>

      {porVenir.length === 0 ? (
        <p className="vacio">
          {eventos.length === 0 ? 'No hay nada agendado para hoy.' : 'Ya pasó todo lo de hoy.'}
          <span>Podés agregar algo diciendo «Jarvis, agendá…».</span>
        </p>
      ) : (
        <ul className="agenda">
          {porVenir.slice(0, 2).map((evento) => (
            <li key={evento.id} className={`agenda__fila${evento.destacado ? ' agenda__fila--proxima' : ''}`}>
              <span className="agenda__marca" aria-hidden="true" />
              <div className="agenda__texto">
                <time className="agenda__hora numero" dateTime={evento.comienza}>
                  {HORA.format(new Date(evento.comienza))}
                </time>
                <div className="agenda__titulo">{evento.titulo}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
