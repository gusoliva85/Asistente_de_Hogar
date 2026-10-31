import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  aplicarLuz,
  aplicarTema,
  guardarModoLuz,
  guardarTema,
  leerModoLuz,
  leerTemaGuardado,
  resolverLuz,
  TEMAS,
  type Luz,
  type ModoLuz,
  type Tema,
} from './tema'

export function usarTema(): { tema: Tema; cambiarTema: (t: Tema) => void; alternar: () => void } {
  const [tema, setTema] = useState<Tema>(leerTemaGuardado)

  useEffect(() => {
    aplicarTema(tema)
    guardarTema(tema)
  }, [tema])

  const cambiarTema = useCallback((siguiente: Tema) => setTema(siguiente), [])

  const alternar = useCallback(() => {
    setTema((actual) => {
      const i = TEMAS.indexOf(actual)
      return TEMAS[(i + 1) % TEMAS.length] ?? actual
    })
  }, [])

  return { tema, cambiarTema, alternar }
}

/**
 * Claro u oscuro.
 *
 * Por defecto lo decide el horario. Si alguien lo cambia a mano, su
 * elección manda **hasta el día siguiente**: a la mañana vuelve a
 * mandar el horario. Así el botón sirve para "ahora no", sin que una
 * decisión de una noche quede congelada para siempre.
 */
export function usarLuz(ahora: Date): { luz: Luz; alternarLuz: () => void; automatico: boolean } {
  const [modo, setModo] = useState<ModoLuz>(() => leerModoLuz(new Date()))

  // Si el día cambió, la elección manual caduca sola.
  const modoVigente = useMemo(() => (leerModoLuz(ahora) === 'auto' ? 'auto' : modo), [ahora, modo])
  const luz = resolverLuz(modoVigente, ahora)

  useEffect(() => {
    aplicarLuz(luz)
  }, [luz])

  const alternarLuz = useCallback(() => {
    const siguiente: ModoLuz = resolverLuz(modoVigente, new Date()) === 'oscuro' ? 'claro' : 'oscuro'
    guardarModoLuz(siguiente, new Date())
    setModo(siguiente)
  }, [modoVigente])

  return { luz, alternarLuz, automatico: modoVigente === 'auto' }
}
