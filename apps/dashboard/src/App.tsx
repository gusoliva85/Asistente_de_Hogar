import { useCallback, useMemo, useState } from 'react'
import { Principal } from './pantallas/Principal'
import { Escucha } from './pantallas/Escucha'
import { Emergencia } from './pantallas/Emergencia'
import { Musica } from './pantallas/Musica'
import {
  emergenciaFicticia,
  escuchaConResultado,
  escuchaFicticia,
  estadoFicticio,
  estadoVacio,
  musicaFicticia,
} from './datos/ficticios'
import { usarLuz, usarTema } from './temas/usarTema'
import { usarReloj } from './util/usarReloj'

/**
 * Fase 1: los datos son ficticios pero tienen la forma exacta que va a
 * devolver la API. En la Fase 2 solo cambia de dónde salen.
 *
 * La navegación es un `useState` y no un enrutador: son cuatro pantallas
 * que nunca van a tener URL propia —es un kiosco sin barra de
 * direcciones— y una biblioteca de rutas sería peso de más en una Pi 3.
 * El parámetro `?pantalla=` existe solo para poder mirarlas durante el
 * desarrollo.
 *
 * `?datos=vacio` muestra la casa en su peor día: sin conexión, sin
 * clima, sin micrófono y con la agenda vacía (F1.6).
 */

const PANTALLAS = ['principal', 'escucha', 'emergencia', 'musica'] as const
type Pantalla = (typeof PANTALLAS)[number]

function pantallaInicial(): Pantalla {
  const pedida = new URLSearchParams(location.search).get('pantalla')
  return (PANTALLAS as readonly string[]).includes(pedida ?? '') ? (pedida as Pantalla) : 'principal'
}

export function App() {
  const ahora = usarReloj()
  // El tema queda fijo en Lavanda: Menta se descarta por ahora, pero los
  // tokens siguen ahí y el selector vuelve en la pantalla de ajustes.
  usarTema()
  const { luz, alternarLuz, automatico } = usarLuz(ahora)
  const [pantalla, setPantalla] = useState<Pantalla>(pantallaInicial)

  const estado = useMemo(() => {
    const vacio = new URLSearchParams(location.search).get('datos') === 'vacio'
    return vacio ? estadoVacio() : estadoFicticio()
  }, [])
  const escucha = useMemo(
    () =>
      new URLSearchParams(location.search).get('escucha') === 'resultado'
        ? escuchaConResultado()
        : escuchaFicticia(),
    [],
  )
  const emergencia = useMemo(emergenciaFicticia, [])
  const musica = useMemo(musicaFicticia, [])

  const inicio = useCallback(() => setPantalla('principal'), [])

  switch (pantalla) {
    case 'escucha':
      return (
        <Escucha
          estado={escucha}
          ahora={ahora}
          onSalir={inicio}
          onAyuda={() => setPantalla('emergencia')}
        />
      )
    case 'emergencia':
      return <Emergencia emergencia={emergencia} ahora={ahora} onCancelar={inicio} />
    case 'musica':
      return (
        <Musica
          musica={musica}
          ahora={ahora}
          onSalir={inicio}
          onAyuda={() => setPantalla('emergencia')}
        />
      )
    default:
      return (
        <Principal
          estado={estado}
          ahora={ahora}
          luz={luz}
          automatico={automatico}
          onLuz={alternarLuz}
          onEscuchar={() => setPantalla('escucha')}
          onAyuda={() => setPantalla('emergencia')}
          onMusica={() => setPantalla('musica')}
        />
      )
  }
}
