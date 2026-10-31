import type { EstadoConexion, Hogar } from '../datos/tipos'
import { IconoConexion, IconoLuna, IconoSinConexion, IconoSol } from './Iconos'
import type { Luz } from '../temas/tema'

interface Props {
  hogar: Hogar
  conexion: EstadoConexion
  luz: Luz
  /** Si la luz la está decidiendo el horario y no una elección a mano. */
  automatico: boolean
  onLuz: () => void
}

function saludo(hora: number): string {
  if (hora < 6) return 'Buenas noches'
  if (hora < 13) return 'Buen día'
  if (hora < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

const TEXTO_CONEXION: Record<EstadoConexion, string> = {
  conectado: 'Conectado',
  reconectando: 'Reconectando',
  'sin-conexion': 'Sin conexión',
}

export function Encabezado({ hogar, conexion, luz, automatico, onLuz }: Props) {
  const hora = new Date().getHours()
  const caido = conexion === 'sin-conexion'

  return (
    <header className="encabezado">
      <div className="encabezado__izquierda">
        <span className="marca" aria-hidden="true">J</span>
        <h1 className="encabezado__saludo">{saludo(hora)}</h1>
        {/* El nombre del hogar no se muestra: el dispositivo pertenece a
            una sola casa y nunca cambia. Decirlo en cada pantalla es
            ocupar lugar para informar algo que ya se sabe. */}
      </div>

      <div className="encabezado__derecha">
        {/* Modo acompañamiento: solo en los hogares que lo tienen
            encendido —el de alguien que vive solo—, y solo si hubo
            actividad. En la casa propia no informa nada. */}
        {hogar.acompanamiento && hogar.activa && (
          <span className="pastilla pastilla--viva">
            <span className="punto-vivo ambiental" aria-hidden="true" />
            Casa activa
          </span>
        )}

        {/* El ícono lleva el color —verde conectado, rojo y tachado sin
            conexión— y el texto queda en gris. Así el estado se ve de
            lejos sin que la pastilla grite. */}
        <span className="pastilla">
          <span className={`pastilla__senal pastilla__senal--${caido ? 'mala' : 'buena'}`}>
            {caido ? <IconoSinConexion tamano={15} /> : <IconoConexion tamano={15} />}
          </span>
          {TEXTO_CONEXION[conexion]}
        </span>

        {/* Con texto y no solo ícono: en una pantalla de 7" un botón de
            30 px no se acierta con el dedo, y un sol suelto no dice si
            enciende o apaga. Dice a qué modo te lleva. */}
        <button
          type="button"
          className="boton-modo"
          onClick={onLuz}
          title={automatico ? 'Ahora la decide el horario' : 'Elegido a mano, hasta mañana'}
        >
          {luz === 'oscuro' ? <IconoSol tamano={17} /> : <IconoLuna tamano={17} />}
          {luz === 'oscuro' ? 'Modo claro' : 'Modo oscuro'}
        </button>

      </div>
    </header>
  )
}
