import { useId } from 'react'
import type { FranjaClima } from '../datos/tipos'

/**
 * Ícono del clima: SVG compuesto, no un ícono plano de biblioteca
 * (DECISION_Frontend_Temas.md, 3.5). Tres piezas: rayos girando, sol con
 * degradado radial y halo, y nube flotando.
 *
 * Lleva `role="img"` y un `aria-label` con la condición real: acá el
 * ícono es la información, no decoración.
 *
 * De noche el sol se reemplaza por luna. Mostrar un sol a las once de la
 * noche es el tipo de detalle que delata que nadie miró la pantalla.
 */

interface Props {
  condicion: string
  esDeNoche: boolean
  ancho?: number
}

export function IconoClima({ condicion, esDeNoche, ancho = 92 }: Props) {
  // useId: puede haber más de un ícono en pantalla y los id de los
  // degradados tienen que ser únicos o se pisan entre sí.
  const id = useId().replace(/:/g, '')
  const sol = `sol-${id}`
  const nube = `nube-${id}`
  const brillo = `brillo-${id}`

  return (
    <svg
      width={ancho}
      height={(ancho * 74) / 92}
      viewBox="0 0 112 90"
      fill="none"
      style={{ flexShrink: 0 }}
      role="img"
      aria-label={condicion}
    >
      <defs>
        <radialGradient id={sol} cx="36%" cy="30%" r="70%">
          {esDeNoche ? (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="48%" stopColor="#E6E8FF" />
              <stop offset="100%" stopColor="#A8ADE0" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FFFBEC" />
              <stop offset="48%" stopColor="#FFE194" />
              <stop offset="100%" stopColor="#F2A648" />
            </>
          )}
        </radialGradient>
        <linearGradient id={nube} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="var(--nube-desde)" />
          <stop offset="100%" stopColor="var(--nube-hasta)" />
        </linearGradient>
        <filter id={brillo} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* Halo: lo que hace que el sol parezca emitir luz y no ser un disco */}
      <circle
        cx="42"
        cy="34"
        r="20"
        fill={esDeNoche ? '#C3C8F5' : '#FFD36E'}
        opacity={esDeNoche ? 0.34 : 0.5}
        filter={`url(#${brillo})`}
      />

      {esDeNoche ? (
        /* Luna: un círculo al que otro le muerde un lado */
        <path
          d="M52 34a15 15 0 1 1-16.4-14.9A12.4 12.4 0 0 0 52 34Z"
          fill={`url(#${sol})`}
        />
      ) : (
        <>
          <g className="rayos ambiental" stroke="#FFE9B0" strokeWidth="3.2" strokeLinecap="round" opacity=".92">
            <path d="M42 4v9" />
            <path d="M42 55v9" />
            <path d="M9 34h9" />
            <path d="M66 34h9" />
            <path d="m19.4 11.4 6 6" />
            <path d="m58.6 50.6 6 6" />
            <path d="m64.6 11.4-6 6" />
            <path d="m25.4 50.6-6 6" />
          </g>
          <circle cx="42" cy="34" r="15" fill={`url(#${sol})`} />
        </>
      )}

      <path
        className="nube ambiental"
        d="M54 76h36a13 13 0 0 0 1.6-26 19.4 19.4 0 0 0-36.8-4.8A14.5 14.5 0 0 0 54 76Z"
        fill={`url(#${nube})`}
      />
    </svg>
  )
}

/**
 * Pronóstico del día en tres franjas: mañana, tarde y noche.
 *
 * Reemplaza a la curva de temperatura que había antes. Una línea sin
 * números se ve prolija pero no responde ninguna pregunta: nadie mira la
 * pantalla de reojo para enterarse de la forma del día, sino para saber
 * si a la tarde va a hacer frío.
 */
export function Pronostico({ franjas }: { franjas: FranjaClima[] }) {
  if (franjas.length === 0) return null

  return (
    <ul className="pronostico">
      {franjas.map((f) => (
        <li key={f.hora} className="pronostico__franja">
          <span className="pronostico__hora numero">{f.hora}</span>
          <IconoClimaMini condicion={f.condicion} esDeNoche={f.esDeNoche} />
          <span className="pronostico__grados numero">{f.temperatura}°</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Versión chica del ícono, sin animación ni halo: a 18 px no se ven y
 * son tres repeticiones más que pintar en una Pi 3.
 *
 * Con color propio, no `currentColor`: en blanco los tres se veían
 * iguales de un vistazo, que es justo cuando se miran. El amarillo del
 * sol contra el violeta de la nube distingue sol de nublado sin tener
 * que reconocer la forma.
 */
function IconoClimaMini({ condicion, esDeNoche }: { condicion: string; esDeNoche: boolean }) {
  const nublado = /nublad|cubiert|lluvi|tormenta/i.test(condicion)

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" role="img" aria-label={condicion}>
      {!nublado &&
        (esDeNoche ? (
          <path
            d="M18 14.5A7.5 7.5 0 0 1 9.5 6a6.2 6.2 0 1 0 8.5 8.5Z"
            fill="var(--clima-luna)"
          />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.6" fill="var(--clima-sol)" />
            <g stroke="var(--clima-sol)" strokeWidth="1.7" strokeLinecap="round" opacity=".85">
              <path d="M12 2.6v2.2" />
              <path d="M12 19.2v2.2" />
              <path d="M2.6 12h2.2" />
              <path d="M19.2 12h2.2" />
              <path d="m5.6 5.6 1.6 1.6" />
              <path d="m16.8 16.8 1.6 1.6" />
              <path d="m18.4 5.6-1.6 1.6" />
              <path d="m7.2 16.8-1.6 1.6" />
            </g>
          </>
        ))}
      {nublado && (
        <>
          {/* El sol asoma detrás de la nube: distingue "parcialmente
              nublado" de "cubierto" sin leer el texto. */}
          {!esDeNoche && <circle cx="9.5" cy="8.5" r="3.6" fill="var(--clima-sol)" />}
          {esDeNoche && (
            <path d="M13 9.6A5 5 0 0 1 7.4 4a4.2 4.2 0 1 0 5.6 5.6Z" fill="var(--clima-luna)" />
          )}
          <path
            d="M8.5 19h8.2a3.6 3.6 0 0 0 .4-7.2 5.4 5.4 0 0 0-10.2-1.3A4 4 0 0 0 8.5 19Z"
            fill="var(--clima-nube)"
          />
        </>
      )}
    </svg>
  )
}
