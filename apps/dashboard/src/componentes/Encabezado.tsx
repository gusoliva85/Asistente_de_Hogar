import type { EstadoConexion, Hogar, Viaje } from '../datos/tipos'
import { IconoAjustes, IconoConexion, IconoSinConexion, IconoViaje } from './Iconos'

interface Props {
  hogar: Hogar
  conexion: EstadoConexion
  viaje: Viaje | null
  /** Provisional: hasta que exista la pantalla de ajustes (Fase 3),
      este botón alterna el tema para poder compararlos (F1.5). */
  onAjustes: () => void
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

export function Encabezado({ hogar, conexion, viaje, onAjustes }: Props) {
  const hora = new Date().getHours()
  const caido = conexion === 'sin-conexion'

  return (
    <header className="encabezado">
      <div className="encabezado__izquierda">
        <span className="marca" aria-hidden="true">J</span>
        <h1 className="encabezado__saludo">{saludo(hora)}</h1>
        <span className="pastilla">{hogar.nombre}</span>
      </div>

      <div className="encabezado__derecha">
        {/* Modo acompañamiento: solo aparece si hubo actividad. Un chip
            que dice "Casa activa" cuando no lo está sería mentir. */}
        {hogar.activa && (
          <span className="pastilla pastilla--viva">
            <span className="punto-vivo ambiental" aria-hidden="true" />
            Casa activa
          </span>
        )}

        {viaje && (
          <span className="pastilla pastilla--viaje">
            <IconoViaje tamano={13} />
            {viaje.minutos} min a {viaje.destino}
          </span>
        )}

        <span className={`pastilla${caido ? ' pastilla--alerta' : ''}`}>
          {caido ? <IconoSinConexion tamano={13} /> : <IconoConexion tamano={13} />}
          {TEXTO_CONEXION[conexion]}
        </span>

        <button type="button" className="boton-icono" aria-label="Cambiar tema" onClick={onAjustes}>
          <IconoAjustes tamano={15} />
        </button>
      </div>
    </header>
  )
}
