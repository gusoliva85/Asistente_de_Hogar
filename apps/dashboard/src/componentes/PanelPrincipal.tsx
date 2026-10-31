import type { Clima } from '../datos/tipos'
import { IconoClima, Pronostico } from './IconoClima'
import { Grano } from './Grano'

interface Props {
  ahora: Date
  clima: Clima | null
  /** Variante amplia: el pronóstico pasa a ocupar el ancho del panel. */
  amplio?: boolean
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
export function PanelPrincipal({ ahora, clima, amplio = false }: Props) {
  const tiempo = (
    <div className="panel__tiempo">
      <time className="panel__hora" dateTime={ahora.toISOString()}>
        {HORA.format(ahora)}
      </time>
      {/* El día de la semana manda sobre el número: es lo que alguien
          necesita saber al despertarse. */}
      <div className="panel__fecha">
        <span className="panel__dia">{mayuscula(DIA.format(ahora))}</span>
        <span className="panel__numero">{FECHA.format(ahora)}</span>
      </div>
    </div>
  )

  const sinDato = (
    <p className="panel__sin-dato">
      Sin datos del clima
      <span>No pude consultarlo. Lo vuelvo a intentar solo.</span>
    </p>
  )

  const cifras = clima && (
    <>
      <IconoClima
        condicion={clima.condicion}
        esDeNoche={clima.esDeNoche}
        ancho={amplio ? 112 : 100}
      />
      <div>
        <div className="clima__cifras">
          <span className="clima__temperatura numero">{clima.temperatura}°</span>
          <span className="clima__extremos numero">
            {clima.maxima}° / {clima.minima}°
          </span>
        </div>
        <div className="clima__condicion">{clima.condicion}</div>
      </div>
    </>
  )

  /* En la variante amplia el pronóstico sale del bloque del clima y pasa
     a ocupar el ancho entero del panel. Es lo que le devuelve el aire:
     metido al costado competía con la hora por el mismo ancho y las dos
     cosas quedaban estrujadas. */
  if (amplio) {
    return (
      <section className="panel panel--amplio aparece">
        <div className="panel__aura ambiental" aria-hidden="true" />
        <div className="panel__aura panel__aura--2 ambiental" aria-hidden="true" />
        <Grano intenso />

        <div className="panel__superior">
          {tiempo}
          <div className="panel__clima">
            <span className="panel__division" aria-hidden="true" />
            {clima ? cifras : sinDato}
          </div>
        </div>

        {clima && <Pronostico franjas={clima.pronostico} />}
      </section>
    )
  }

  return (
    <section className="panel aparece">
      <div className="panel__aura ambiental" aria-hidden="true" />
      <div className="panel__aura panel__aura--2 ambiental" aria-hidden="true" />
      <Grano intenso />

      {tiempo}

      <div className="panel__clima">
        <span className="panel__division" aria-hidden="true" />
        {clima ? (
          <div className="clima">
            <div className="clima__arriba">{cifras}</div>
            <Pronostico franjas={clima.pronostico} />
          </div>
        ) : (
          sinDato
        )}
      </div>
    </section>
  )
}
