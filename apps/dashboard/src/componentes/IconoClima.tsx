import { useId } from 'react'

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
 * Curva de temperatura por hora. Es una sola línea con un relleno
 * degradado debajo: dice la forma del día sin ocupar espacio ni exigir
 * que nadie lea números.
 */
export function CurvaTemperatura({ valores }: { valores: number[] }) {
  const id = useId().replace(/:/g, '')
  if (valores.length < 2) return null

  const ancho = 138
  const alto = 30
  const margen = 4
  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const rango = max - min || 1

  const puntos = valores.map((v, i) => {
    const x = 2 + (i * (ancho - 4)) / (valores.length - 1)
    const y = margen + (1 - (v - min) / rango) * (alto - margen * 2 - 2)
    return [x, y] as const
  })

  const linea = puntos.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')
  const primero = puntos[0]
  const ultimo = puntos[puntos.length - 1]
  if (!primero || !ultimo) return null

  const masAlto = puntos[valores.indexOf(max)] ?? primero

  return (
    <svg
      width={ancho}
      height={alto}
      viewBox={`0 0 ${ancho} ${alto}`}
      fill="none"
      style={{ marginTop: 8, display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`curva-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,205,120,.45)" />
          <stop offset="100%" stopColor="rgba(255,205,120,0)" />
        </linearGradient>
      </defs>
      <path
        d={`M ${linea} L ${ultimo[0].toFixed(1)} ${alto} L ${primero[0].toFixed(1)} ${alto} Z`}
        fill={`url(#curva-${id})`}
      />
      <path d={`M ${linea}`} stroke="#FFD08A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={masAlto[0]} cy={masAlto[1]} r="3" fill="#FFF3D6" />
    </svg>
  )
}
