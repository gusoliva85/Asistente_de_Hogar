import { useCallback, useEffect, useState } from 'react'
import { aplicarTema, guardarTema, leerTemaGuardado, TEMAS, type Tema } from './tema'

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
