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
