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
  /**
   * Si este hogar tiene el modo acompañamiento encendido. Es el caso del
   * hogar de una persona que vive sola: alguien de afuera quiere saber
   * que hubo movimiento. En el hogar propio no tiene sentido mostrarlo.
   */
  acompanamiento: boolean
  /** Hubo actividad reciente. Solo se muestra si `acompanamiento`. */
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
  /**
   * Tres franjas del día: mañana, tarde y noche. No una curva por hora:
   * una línea sin números no responde ninguna pregunta que alguien se
   * haga mirando la pantalla de reojo.
   */
  pronostico: FranjaClima[]
}

export interface FranjaClima {
  /** Etiqueta ya resuelta por el servidor: «09:00», «14:00», «19:00». */
  hora: string
  temperatura: number
  condicion: string
  esDeNoche: boolean
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

/* ── Pantalla de escucha ────────────────────────────────────────────────── */

/**
 * Dónde se resolvió lo que se pidió. Se muestra siempre y sin eufemismos:
 * es la diferencia entre un asistente que explica qué hace con tu voz y
 * uno que no.
 */
export type OrigenRespuesta = 'reglas' | 'modelo-local' | 'nube'

export interface AccionVerificada {
  /** Lo que se hizo, en pasado y en una línea. */
  resumen: string
  /**
   * Cuándo se comprobó contra la base de datos. **Nulo mientras no se
   * verificó.** No hay confirmación sin este dato: es la regla 3 del
   * proyecto puesta en el modelo.
   */
  verificadoA: string | null
  /** Lo concreto que cambió: los artículos, los eventos, lo que sea. */
  detalles: string[]
}

export interface EstadoEscucha {
  /** Lo que se entendió, tal cual. Vacío mientras todavía escucha. */
  transcripcion: string
  escuchando: boolean
  origen: OrigenRespuesta
  accion: AccionVerificada | null
  /** Si el cambio ya llegó al celular. Nulo si todavía no se sabe. */
  sincronizado: boolean | null
}

/* ── Pantalla de emergencia ─────────────────────────────────────────────── */

export type CanalAviso = 'notificacion' | 'sms' | 'llamada'

/**
 * El estado real de un aviso, sin suavizar.
 *
 * «Entregado» y «confirmó» son cosas distintas y se muestran distintas:
 * que un mensaje llegue al teléfono no significa que alguien lo haya
 * leído, y decir lo contrario sería exactamente lo que no hacemos.
 */
export type EstadoAviso =
  | 'pendiente'
  | 'enviado'
  | 'entregado'
  | 'confirmado'
  | 'fallido'
  | 'llamando'

export interface Aviso {
  id: string
  nombre: string
  vinculo: string
  canal: CanalAviso
  estado: EstadoAviso
  /** Línea de detalle ya redactada por el servidor. */
  detalle: string
  /** Etiqueta corta del resultado: «VA EN CAMINO», «SMS ENVIADO». */
  etiqueta: string | null
  /** Segundos hasta el siguiente intento. Nulo si no hay escalamiento. */
  escalaEn: number | null
}

export interface Emergencia {
  /** Cómo se disparó: botón, voz, caída detectada. */
  origen: string
  comenzo: string
  alarmaSonando: boolean
  servidorEnLinea: boolean
  escalando: boolean
  avisos: Aviso[]
}

/* ── Pantalla de música ─────────────────────────────────────────────────── */

export interface PistaCompleta extends Pista {
  album: string | null
  /** Segundos. Nulo si la fuente no los informa. */
  duracion: number | null
  posicion: number | null
}

export interface EstadoMusica {
  pista: PistaCompleta
  cola: Pista[]
}
