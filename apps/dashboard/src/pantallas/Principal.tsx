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
import type { Luz } from '../temas/tema'

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
          <div className="columna__par">
            <TarjetaAgenda eventos={estado.eventos} />
            <TarjetaCompras articulos={estado.compras} />
          </div>
        </div>

        <div className="columna columna--lateral">
          <TarjetaRecordatorio recordatorio={estado.recordatorio} />
          <TarjetaCasa dispositivos={estado.dispositivos} />
          <BarraMusica pista={estado.musica} onAbrir={onMusica} />
        </div>
      </div>

      <BarraVoz microfono={estado.microfono} onEscuchar={onEscuchar} onAyuda={onAyuda} />
    </div>
  )
}
