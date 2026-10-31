import type { EstadoConexion, Hogar } from '../datos/tipos'
import { IconoAjustes, IconoConexion, IconoLuna, IconoSinConexion, IconoSol } from './Iconos'
import type { Luz } from '../temas/tema'

interface Props {
  hogar: Hogar
  conexion: EstadoConexion
  /** Provisional: hasta que exista la pantalla de ajustes (Fase 3),
      este botón alterna el tema para poder compararlos (F1.5). */
  onAjustes: () => void
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

export function Encabezado({ hogar, conexion, onAjustes, luz, automatico, onLuz }: Props) {
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

        <span className={`pastilla${caido ? ' pastilla--alerta' : ''}`}>
          {caido ? <IconoSinConexion tamano={13} /> : <IconoConexion tamano={13} />}
          {TEXTO_CONEXION[conexion]}
        </span>

        <button
          type="button"
          className="boton-icono"
          onClick={onLuz}
          aria-label={luz === 'oscuro' ? 'Pasar a modo claro' : 'Pasar a modo oscuro'}
          title={automatico ? 'La decide el horario' : 'Elegido a mano, hasta mañana'}
        >
          {luz === 'oscuro' ? <IconoSol tamano={15} /> : <IconoLuna tamano={15} />}
        </button>

        <button type="button" className="boton-icono" aria-label="Cambiar tema" onClick={onAjustes}>
          <IconoAjustes tamano={15} />
        </button>
      </div>
    </header>
  )
}
