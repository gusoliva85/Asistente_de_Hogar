import { useEffect } from 'react'

/**
 * Escala la interfaz a la pantalla que le toque.
 *
 * El diseño mide 1024 × 600 fijos, que es el panel táctil de 7" que va a
 * tener el aparato. Pero durante el desarrollo se mira en un televisor
 * de 1920 × 1080, donde esos 1024 × 600 quedan dibujados en una esquina
 * y todo se ve diminuto.
 *
 * En vez de forzar el modo de video del televisor —que depende de que lo
 * acepte y no siempre pasa—, se escala la interfaz entera. En el panel
 * real la escala da 1 y no cambia nada; en cualquier otra pantalla se
 * agranda o achica manteniendo la proporción.
 *
 * Se escala con `transform`, que la GPU resuelve sin volver a calcular
 * la disposición: en una Pi 3 eso importa.
 */
export function usarEscala(): void {
  useEffect(() => {
    const aplicar = () => {
      const escala = Math.min(window.innerWidth / 1024, window.innerHeight / 600)
      document.documentElement.style.setProperty('--escala', String(escala))
    }
    aplicar()
    window.addEventListener('resize', aplicar)
    return () => window.removeEventListener('resize', aplicar)
  }, [])
}
