import type { ReactNode } from 'react'
import { IconoAyuda, IconoReenviar, IconoVolver } from './Iconos'

/**
 * Navegación compartida por todas las pantallas.
 *
 * Existe para que una sola regla valga en las cuatro, y para que no se
 * pueda romper sin querer: si cada pantalla arma su propia barra, en dos
 * semanas los botones vuelven a estar cada uno en un lugar distinto.
 *
 *   Abajo a la izquierda  →  salir de acá
 *   Abajo a la derecha    →  pedir ayuda o insistir
 *   Arriba a la derecha   →  la hora
 *
 * El criterio: la mano izquierda retrocede, la derecha avanza o pide
 * auxilio. Lo importante no es cuál de los dos lados se elija, sino que
 * no cambie nunca. Alguien que usa esto todos los días tiene que poder
 * tocar sin mirar.
 */

const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

/** La hora arriba a la derecha. Se ve en todas las pantallas: en una
 *  casa, saber la hora no debería obligar a volver al inicio. */
export function Reloj({ ahora, sobreOscuro = false }: { ahora: Date; sobreOscuro?: boolean }) {
  return (
    <time
      className={`reloj${sobreOscuro ? ' reloj--oscuro' : ''} numero`}
      dateTime={ahora.toISOString()}
    >
      {HORA.format(ahora)}
    </time>
  )
}

export function PieAcciones({ children }: { children: ReactNode }) {
  return <footer className="pie-acciones">{children}</footer>
}

interface PropsBoton {
  onClick: () => void
  texto?: string
  sobreOscuro?: boolean
}

/** Izquierda: salir. */
export function BotonSalir({ onClick, texto = 'Inicio', sobreOscuro = false }: PropsBoton) {
  return (
    <button
      type="button"
      className={`boton-grande boton-grande--salir${sobreOscuro ? ' boton-grande--oscuro' : ''}`}
      onClick={onClick}
    >
      <IconoVolver tamano={24} />
      {texto}
    </button>
  )
}

/** Derecha: pedir ayuda. Lleva el destello cada 5 segundos en todas las
 *  pantallas, para que se comporte igual en cualquiera. */
export function BotonAyuda({ onClick, texto = 'Necesito ayuda' }: PropsBoton) {
  return (
    <button type="button" className="boton-grande boton-grande--ayuda" onClick={onClick}>
      <IconoAyuda tamano={24} />
      {texto}
    </button>
  )
}

/** Derecha, solo en emergencia: insistir sobre los canales que fallaron. */
export function BotonReenviar({ onClick, texto = 'Reenviar alarma' }: PropsBoton) {
  return (
    <button type="button" className="boton-grande boton-grande--reenviar" onClick={onClick}>
      <IconoReenviar tamano={24} grosor={2.2} />
      {texto}
    </button>
  )
}

/** Izquierda, solo en emergencia: salir de la alerta. */
export function BotonCancelar({ onClick, texto = 'Estoy bien — cancelar' }: PropsBoton) {
  return (
    <button type="button" className="boton-grande boton-grande--cancelar" onClick={onClick}>
      <IconoVolver tamano={24} />
      {texto}
    </button>
  )
}
