import { useEffect, useState } from 'react'

/**
 * El reloj de toda la interfaz.
 *
 * Un solo temporizador: cada componente con su propio `setInterval`
 * sería un despertar más por minuto en una Pi 3 que tiene que estar
 * encendida durante meses.
 *
 * El primer salto se alinea con el segundo 0 del minuto siguiente, para
 * que la hora no cambie con medio minuto de retraso.
 */
export function usarReloj(): Date {
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
