import type { Recordatorio } from '../datos/tipos'
import { IconoReloj } from './Iconos'

const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

export function TarjetaRecordatorio({ recordatorio }: { recordatorio: Recordatorio | null }) {
  return (
    <section
      className={`tarjeta tarjeta--ambar vidrio vidrio--interactiva aparece${recordatorio ? '' : ' tarjeta--apagada'}`}
      style={{ animationDelay: '240ms' }}
    >
      <span className="recordatorio__icono">
        <IconoReloj tamano={22} />
      </span>
      {recordatorio ? (
        <div className="recordatorio__texto">
          <div className="recordatorio__etiqueta">Próximo</div>
          <time className="recordatorio__hora numero" dateTime={recordatorio.momento}>
            {HORA.format(new Date(recordatorio.momento))}
          </time>
          <div className="recordatorio__titulo">{recordatorio.titulo}</div>
        </div>
      ) : (
        <div className="recordatorio__texto">
          <div className="recordatorio__etiqueta">Próximo</div>
          <p className="vacio vacio--compacto">
            No hay recordatorios.
            <span>«Jarvis, recordame las pastillas a las nueve».</span>
          </p>
        </div>
      )}
    </section>
  )
}
