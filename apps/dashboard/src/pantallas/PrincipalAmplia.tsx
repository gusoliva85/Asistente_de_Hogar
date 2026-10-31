import type { EstadoPantalla } from '../datos/tipos'
import { Encabezado } from '../componentes/Encabezado'
import { PanelPrincipal } from '../componentes/PanelPrincipal'
import { TarjetaRecordatorio } from '../componentes/TarjetaRecordatorio'
import { BarraVoz } from '../componentes/BarraVoz'
import { Grano } from '../componentes/Grano'
import { Caratula } from '../componentes/Caratula'
import { IconoAgenda, IconoPausa, IconoReproducir } from '../componentes/Iconos'
import type { Luz } from '../temas/tema'

const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

/**
 * Variante amplia de la pantalla principal (?diseno=amplio).
 *
 * Saca compras y dispositivos, y reparte ese espacio entre las tres
 * cosas que quedan: el panel de hora y clima crece a lo alto, la agenda
 * pasa a ocupar el ancho entero y muestra el día completo, y la música
 * deja de ser una barra para ser una tarjeta con su arte.
 *
 * La apuesta detrás: menos tarjetas y más grandes se leen mejor de lejos
 * que seis tarjetas apretadas. Convive con la versión completa hasta que
 * se decida cuál queda.
 */

interface Props {
  estado: EstadoPantalla
  ahora: Date
  luz: Luz
  automatico: boolean
  onLuz: () => void
  onEscuchar: () => void
  onAyuda: () => void
  onMusica: () => void
}

export function PrincipalAmplia({
  estado,
  ahora,
  luz,
  automatico,
  onLuz,
  onEscuchar,
  onAyuda,
  onMusica,
}: Props) {
  const porVenir = estado.eventos.filter((e) => new Date(e.comienza) >= ahora)

  return (
    <div className="pantalla pantalla--amplia">
      <Grano />

      <Encabezado hogar={estado.hogar} conexion={estado.conexion} luz={luz} automatico={automatico} onLuz={onLuz} />

      <div className="amplia__cuerpo">
        <div className="columna">
          <PanelPrincipal ahora={ahora} clima={estado.clima} />

          <section className="tarjeta vidrio vidrio--interactiva aparece" style={{ animationDelay: '120ms' }}>
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
                No queda nada agendado para hoy.
                <span>Podés agregar algo diciendo «Jarvis, agendá…».</span>
              </p>
            ) : (
              /* En fila y no apilados: con el ancho completo entra el día
                 entero de un vistazo, que es lo que uno quiere saber. */
              <ul className="agenda-ancha">
                {porVenir.slice(0, 3).map((evento) => (
                  <li
                    key={evento.id}
                    className={`agenda-ancha__fila${evento.destacado ? ' agenda-ancha__fila--proxima' : ''}`}
                  >
                    <span className="agenda-ancha__marca" aria-hidden="true" />
                    <time className="agenda-ancha__hora numero" dateTime={evento.comienza}>
                      {HORA.format(new Date(evento.comienza))}
                    </time>
                    <span className="agenda-ancha__titulo">{evento.titulo}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="columna columna--lateral">
          <TarjetaRecordatorio recordatorio={estado.recordatorio} />

          <section className="musica-alta aparece" style={{ animationDelay: '300ms' }}>
            <Grano intenso />
            {estado.musica ? (
              <>
                <button
                  type="button"
                  className="musica__abrir"
                  onClick={onMusica}
                  aria-label="Abrir música"
                />
                <Caratula titulo={estado.musica.titulo} tamano={150} />
                <div className="musica-alta__texto">
                  <div className="musica__titulo">{estado.musica.titulo}</div>
                  <div className="musica__artista">{estado.musica.artista}</div>
                </div>
                <div className="musica-alta__pie">
                  <span className="musica__origen">
                    {estado.musica.sonando && (
                      <span className="ondas" aria-hidden="true">
                        <span className="onda ambiental" />
                        <span className="onda ambiental" />
                        <span className="onda ambiental" />
                      </span>
                    )}
                    {estado.musica.origen}
                  </span>
                  <button
                    type="button"
                    className="musica__boton"
                    aria-label={estado.musica.sonando ? 'Pausar' : 'Reproducir'}
                  >
                    {estado.musica.sonando ? <IconoPausa /> : <IconoReproducir />}
                  </button>
                </div>
              </>
            ) : (
              <div className="musica-alta__vacia">
                <Caratula titulo="silencio" tamano={150} />
                <p className="vacio vacio--compacto">
                  Sin música
                  <span>«Jarvis, poné algo»</span>
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      <BarraVoz microfono={estado.microfono} onEscuchar={onEscuchar} onAyuda={onAyuda} />
    </div>
  )
}
