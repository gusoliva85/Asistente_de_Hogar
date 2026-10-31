import { useMemo } from 'react'
import { Principal } from './pantallas/Principal'
import { estadoFicticio, estadoVacio } from './datos/ficticios'
import { usarLuz, usarTema } from './temas/usarTema'
import { usarReloj } from './util/usarReloj'

/**
 * Fase 1: los datos son ficticios pero tienen la forma exacta que va a
 * devolver la API. En la Fase 2 solo cambia de dónde salen.
 *
 * `?datos=vacio` muestra la misma casa en su peor día —sin conexión, sin
 * clima, sin micrófono, la agenda vacía— para poder mirar los estados
 * vacíos en vez de suponerlos (F1.6).
 */
export function App() {
  const ahora = usarReloj()
  const { alternar } = usarTema()
  const { luz, alternarLuz, automatico } = usarLuz(ahora)

  const estado = useMemo(() => {
    const vacio = new URLSearchParams(location.search).get('datos') === 'vacio'
    return vacio ? estadoVacio() : estadoFicticio()
  }, [])

  return (
    <Principal
      estado={estado}
      ahora={ahora}
      onAjustes={alternar}
      luz={luz}
      automatico={automatico}
      onLuz={alternarLuz}
    />
  )
}
