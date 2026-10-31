import { useId } from 'react'

/**
 * Grano: ruido tenue por encima del fondo.
 *
 * No es un adorno. Los degradados grandes en pantallas de 8 bits se ven
 * en bandas; una capa de ruido al 5 % las rompe y además da textura de
 * material impreso en lugar de plástico.
 *
 * Es `feTurbulence`, que se calcula una vez y no se vuelve a pintar.
 * Aun así se apaga en rendimiento reducido, porque en la Pi 3 el filtro
 * se rasteriza en CPU la primera vez.
 */
export function Grano({ intenso = false }: { intenso?: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      className="grano"
      aria-hidden="true"
      style={{ opacity: intenso ? 'var(--grano-opacidad-oscuro)' : 'var(--grano-opacidad)' }}
    >
      <filter id={`grano-${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grano-${id})`} />
    </svg>
  )
}
