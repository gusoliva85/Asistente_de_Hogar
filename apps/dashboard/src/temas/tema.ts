/**
 * El tema es una preferencia por usuario y por hogar, no una constante
 * del código: la casa principal puede usar Lavanda mientras la de la
 * madre usa Menta (DECISION_Frontend_Temas.md, sección 1).
 *
 * En la Fase 2 el valor va a venir de la tabla de preferencias del
 * hogar. Hasta entonces vive en el navegador, que alcanza para la Pi en
 * kiosco: es siempre el mismo equipo y el mismo hogar.
 */

export const TEMAS = ['lavanda', 'menta'] as const
export type Tema = (typeof TEMAS)[number]

export const TEMA_POR_DEFECTO: Tema = 'lavanda'

const CLAVE = 'jarvis.tema'

function esTema(valor: unknown): valor is Tema {
  return typeof valor === 'string' && (TEMAS as readonly string[]).includes(valor)
}

export function leerTemaGuardado(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return esTema(guardado) ? guardado : TEMA_POR_DEFECTO
  } catch {
    // Modo privado o almacenamiento bloqueado: no es motivo para fallar
    return TEMA_POR_DEFECTO
  }
}

export function guardarTema(tema: Tema): void {
  try {
    localStorage.setItem(CLAVE, tema)
  } catch {
    /* ídem */
  }
}

/** Aplica el tema al documento. Es lo único que mira el CSS. */
export function aplicarTema(tema: Tema): void {
  document.documentElement.dataset.tema = tema
}

/**
 * Modo de rendimiento reducido: cambia el vidrio por color sólido y apaga
 * las animaciones ambientales. Se decide con números en F1.10, no por
 * impresión. Mientras tanto se puede forzar con ?rendimiento=reducido.
 */
export function aplicarRendimiento(reducido: boolean): void {
  if (reducido) {
    document.documentElement.dataset.rendimiento = 'reducido'
  } else {
    delete document.documentElement.dataset.rendimiento
  }
}

/* ── Luz: claro u oscuro ────────────────────────────────────────────────────
   Es una dimensión aparte del tema. Lavanda y Menta tienen cada uno su
   versión de noche, así que elegir el color y elegir la hora del día son
   decisiones distintas.
   ─────────────────────────────────────────────────────────────────────── */

export type Luz = 'claro' | 'oscuro'
export type ModoLuz = 'auto' | Luz

const CLAVE_LUZ = 'jarvis.luz'

/** De 20:00 a 06:59 la pantalla va oscura. */
export const HORA_OSCURO = 20
export const HORA_CLARO = 7

export function luzPorHorario(ahora: Date): Luz {
  const h = ahora.getHours()
  return h >= HORA_OSCURO || h < HORA_CLARO ? 'oscuro' : 'claro'
}

interface EleccionGuardada {
  modo: ModoLuz
  /** Día en que se eligió, en formato local AAAA-MM-DD. */
  dia: string
}

function hoy(ahora: Date): string {
  return `${ahora.getFullYear()}-${ahora.getMonth() + 1}-${ahora.getDate()}`
}

export function leerModoLuz(ahora: Date): ModoLuz {
  try {
    const crudo = localStorage.getItem(CLAVE_LUZ)
    if (!crudo) return 'auto'
    const guardada = JSON.parse(crudo) as EleccionGuardada
    // La elección a mano vale hasta el día siguiente. Si alguien puso la
    // pantalla en claro a las once de la noche, no queremos que siga
    // clara para siempre: al otro día vuelve a decidir el horario.
    if (guardada.dia !== hoy(ahora)) return 'auto'
    return guardada.modo === 'claro' || guardada.modo === 'oscuro' ? guardada.modo : 'auto'
  } catch {
    return 'auto'
  }
}

export function guardarModoLuz(modo: ModoLuz, ahora: Date): void {
  try {
    if (modo === 'auto') localStorage.removeItem(CLAVE_LUZ)
    else localStorage.setItem(CLAVE_LUZ, JSON.stringify({ modo, dia: hoy(ahora) }))
  } catch {
    /* almacenamiento bloqueado */
  }
}

export function resolverLuz(modo: ModoLuz, ahora: Date): Luz {
  return modo === 'auto' ? luzPorHorario(ahora) : modo
}

export function aplicarLuz(luz: Luz): void {
  document.documentElement.dataset.luz = luz
  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute('content', luz === 'oscuro' ? 'dark' : 'light')
}
