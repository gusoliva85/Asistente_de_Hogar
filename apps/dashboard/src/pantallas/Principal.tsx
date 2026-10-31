import type { EstadoPantalla } from '../datos/tipos'
import { Encabezado } from '../componentes/Encabezado'
import { PanelPrincipal } from '../componentes/PanelPrincipal'
import { TarjetaAgenda } from '../componentes/TarjetaAgenda'
import { TarjetaRecordatorio } from '../componentes/TarjetaRecordatorio'
import { TarjetaMusica } from '../componentes/TarjetaMusica'
import { BarraVoz } from '../componentes/BarraVoz'
import { Grano } from '../componentes/Grano'
import type { Luz } from '../temas/tema'

/**
 * Pantalla principal.
 *
 * Cuatro bloques y no seis: hora y clima, la agenda del día, el próximo
 * recordatorio y la música. La lista de compras y el estado de los
 * dispositivos salieron de acá —se consultan por voz y desde el celular
 * en la Fase 3—, y ese espacio se repartió entre lo que quedó.
 *
 * La apuesta: menos tarjetas y más grandes se leen mejor de lejos que
 * seis apretadas. El aparato se mira de paso y desde dos metros.
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

export function Principal({
  estado,
  ahora,
  luz,
  automatico,
  onLuz,
  onEscuchar,
  onAyuda,
  onMusica,
}: Props) {
  return (
    <div className="pantalla">
      <Grano />

      <Encabezado
        hogar={estado.hogar}
        conexion={estado.conexion}
        luz={luz}
        automatico={automatico}
        onLuz={onLuz}
      />

      <div className="pantalla__cuerpo">
        <div className="columna">
          <PanelPrincipal ahora={ahora} clima={estado.clima} />
          <TarjetaAgenda eventos={estado.eventos} ahora={ahora} />
        </div>

        <div className="columna columna--lateral">
          <TarjetaRecordatorio recordatorio={estado.recordatorio} />
          <TarjetaMusica pista={estado.musica} onAbrir={onMusica} />
        </div>
      </div>

      <BarraVoz microfono={estado.microfono} onEscuchar={onEscuchar} onAyuda={onAyuda} />
    </div>
  )
}
