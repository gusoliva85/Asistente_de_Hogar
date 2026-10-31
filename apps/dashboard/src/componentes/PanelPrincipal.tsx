import type { Clima } from '../datos/tipos'
import { CurvaTemperatura, IconoClima } from './IconoClima'
import { Grano } from './Grano'

interface Props {
  ahora: Date
  clima: Clima | null
}

const FECHA = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

/** Semana del año. Dato chico que ancla el día dentro del año. */
function semanaDelAno(d: Date): number {
  const inicio = new Date(d.getFullYear(), 0, 1)
  const dias = Math.floor((d.getTime() - inicio.getTime()) / 86_400_000)
  return Math.ceil((dias + inicio.getDay() + 1) / 7)
}

/**
 * El panel oscuro: hora, fecha y clima.
 *
 * Es el único elemento oscuro de la pantalla y es deliberado: da
 * jerarquía sin volver oscura toda la interfaz.
 */
export function PanelPrincipal({ ahora, clima }: Props) {
  const fecha = FECHA.format(ahora)

  return (
    <section className="panel aparece">
      <div className="panel__aura ambiental" aria-hidden="true" />
      <div className="panel__aura panel__aura--2 ambiental" aria-hidden="true" />
      <Grano intenso />

      <div className="panel__tiempo">
        <time className="panel__hora" dateTime={ahora.toISOString()}>
          {HORA.format(ahora)}
        </time>
        <div className="panel__fecha">
          <span className="panel__fecha-dia">
            {fecha.charAt(0).toUpperCase() + fecha.slice(1)}
          </span>
          <span className="panel__separador" aria-hidden="true" />
          <span className="panel__semana">Semana {semanaDelAno(ahora)}</span>
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
              <CurvaTemperatura valores={clima.porHora} />
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
