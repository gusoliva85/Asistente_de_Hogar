import type { Clima, Viaje } from '../datos/tipos'
import { IconoClima, Pronostico } from './IconoClima'
import { IconoViaje } from './Iconos'
import { Grano } from './Grano'

interface Props {
  ahora: Date
  clima: Clima | null
  viaje: Viaje | null
}

const DIA = new Intl.DateTimeFormat('es-AR', { weekday: 'long' })
const FECHA = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' })
const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

function mayuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/**
 * El panel oscuro: hora, fecha y clima.
 *
 * Es el único elemento oscuro de la pantalla y es deliberado: da
 * jerarquía sin volver oscura toda la interfaz.
 */
export function PanelPrincipal({ ahora, clima, viaje }: Props) {

  return (
    <section className="panel aparece">
      <div className="panel__aura ambiental" aria-hidden="true" />
      <div className="panel__aura panel__aura--2 ambiental" aria-hidden="true" />
      <Grano intenso />

      <div className="panel__tiempo">
        <time className="panel__hora" dateTime={ahora.toISOString()}>
          {HORA.format(ahora)}
        </time>
        {/* El día de la semana manda sobre el número: es lo que alguien
            necesita saber al despertarse. La semana del año se sacó
            porque no respondía ninguna pregunta. */}
        <div className="panel__fecha">
          <span className="panel__dia">{mayuscula(DIA.format(ahora))}</span>
          <span className="panel__numero">{FECHA.format(ahora)}</span>
        </div>
      </div>

      <div className="panel__clima">
        <span className="panel__division" aria-hidden="true" />
        {clima ? (
          <>
            <IconoClima condicion={clima.condicion} esDeNoche={clima.esDeNoche} />
            <div>
              <div className="clima__cifras">
                <span className="clima__temperatura numero">{clima.temperatura}°</span>
                <span className="clima__extremos numero">
                  {clima.maxima}° / {clima.minima}°
                </span>
              </div>
              <div className="clima__condicion">{clima.condicion}</div>
              <Pronostico franjas={clima.pronostico} />
              {viaje && (
                <p className="clima__viaje">
                  <IconoViaje tamano={12} grosor={2} />
                  {viaje.minutos} min a {viaje.destino}
                </p>
              )}
            </div>
          </>
        ) : (
          /* Sin clima no se inventa un número ni se deja un hueco:
             se dice qué pasa. */
          <p className="panel__sin-dato">
            Sin datos del clima
            <span>No pude consultarlo. Lo vuelvo a intentar solo.</span>
          </p>
        )}
      </div>
    </section>
  )
}
