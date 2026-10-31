import { useEffect, useState } from 'react'
import type { EstadoPantalla } from '../datos/tipos'
import { Encabezado } from '../componentes/Encabezado'
import { PanelPrincipal } from '../componentes/PanelPrincipal'
import { TarjetaAgenda } from '../componentes/TarjetaAgenda'
import { TarjetaCompras } from '../componentes/TarjetaCompras'
import { TarjetaRecordatorio } from '../componentes/TarjetaRecordatorio'
import { TarjetaCasa } from '../componentes/TarjetaCasa'
import { BarraMusica } from '../componentes/BarraMusica'
import { BarraVoz } from '../componentes/BarraVoz'
import { Grano } from '../componentes/Grano'

/**
 * Reloj de la pantalla.
 *
 * Un solo temporizador para toda la interfaz: cada componente que
 * quisiera su propio `setInterval` sería un despertar más por minuto en
 * una Pi 3 que tiene que durar encendida meses.
 *
 * El primer salto se alinea con el segundo 0 del minuto siguiente, para
 * que la hora no cambie con medio minuto de retraso.
 */
function usarReloj(): Date {
  const [ahora, setAhora] = useState(() => new Date())

  useEffect(() => {
    let intervalo: number | undefined
    const primero = window.setTimeout(
      () => {
        setAhora(new Date())
        intervalo = window.setInterval(() => setAhora(new Date()), 60_000)
      },
      60_000 - (Date.now() % 60_000),
    )
    return () => {
      window.clearTimeout(primero)
      if (intervalo !== undefined) window.clearInterval(intervalo)
    }
  }, [])

  return ahora
}

interface Props {
  estado: EstadoPantalla
  onAjustes: () => void
}

export function Principal({ estado, onAjustes }: Props) {
  const ahora = usarReloj()

  return (
    <div className="pantalla">
      <Grano />

      <Encabezado
        hogar={estado.hogar}
        conexion={estado.conexion}
        viaje={estado.viaje}
        onAjustes={onAjustes}
      />

      <div className="pantalla__cuerpo">
        <div className="columna">
          <PanelPrincipal ahora={ahora} clima={estado.clima} />
          <div className="columna__par">
            <TarjetaAgenda eventos={estado.eventos} />
            <TarjetaCompras articulos={estado.compras} />
          </div>
        </div>

        <div className="columna columna--lateral">
          <TarjetaRecordatorio recordatorio={estado.recordatorio} />
          <TarjetaCasa dispositivos={estado.dispositivos} />
          <BarraMusica pista={estado.musica} />
        </div>
      </div>

      <BarraVoz microfono={estado.microfono} />
    </div>
  )
}
