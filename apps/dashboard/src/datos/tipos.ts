/**
 * La forma de los datos de la pantalla.
 *
 * Estos tipos son el contrato con la API de la Fase 2. En la Fase 1 los
 * llena `ficticios.ts`; después va a llenarlos la API sin que los
 * componentes cambien. Por eso las fechas son cadenas ISO y no objetos
 * `Date`: es lo que viaja por la red.
 *
 * Todo lo que puede faltar está declarado como opcional o nulo a
 * propósito. Una casa real tiene la agenda vacía, el clima caído y la
 * música apagada, y la pantalla tiene que seguir siendo legible (F1.6).
 */

export type EstadoConexion = 'conectado' | 'reconectando' | 'sin-conexion'
export type EstadoMicrofono = 'listo' | 'escuchando' | 'ausente' | 'silenciado'

export interface Hogar {
  id: string
  nombre: string
  /** Modo acompañamiento: hubo actividad reciente en la casa. */
  activa: boolean
}

export interface Evento {
  id: string
  /** ISO 8601 con zona. La pantalla formatea; el servidor no. */
  comienza: string
  titulo: string
  /** El próximo del día se resalta. Lo decide el servidor, no la pantalla. */
  destacado: boolean
}

export interface ArticuloCompra {
  id: string
  nombre: string
  cantidad: string | null
  comprado: boolean
}

export interface Recordatorio {
  id: string
  momento: string
  titulo: string
}

export type ClaseDispositivo = 'luz' | 'aspiradora' | 'enchufe' | 'termostato'

export interface Dispositivo {
  id: string
  nombre: string
  clase: ClaseDispositivo
  /** Nulo cuando el dispositivo no responde: no se inventa un estado. */
  encendido: boolean | null
  /** Batería o nivel, 0–100. Nulo si no aplica. */
  nivel: number | null
}

export interface Clima {
  temperatura: number
  maxima: number
  minima: number
  /** Texto ya traducido por el servidor; la pantalla no interpreta códigos. */
  condicion: string
  /** Para el ícono y para `aria-label`. */
  esDeNoche: boolean
  /** Seis valores para la curva. Vacío si no hay pronóstico. */
  porHora: number[]
}

export interface Viaje {
  destino: string
  minutos: number
}

export interface Pista {
  titulo: string
  artista: string
  origen: string
  sonando: boolean
}

export interface EstadoPantalla {
  hogar: Hogar
  conexion: EstadoConexion
  microfono: EstadoMicrofono
  clima: Clima | null
  viaje: Viaje | null
  eventos: Evento[]
  compras: ArticuloCompra[]
  recordatorio: Recordatorio | null
  dispositivos: Dispositivo[]
  musica: Pista | null
}
