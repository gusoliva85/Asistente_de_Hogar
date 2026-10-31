/**
 * Íconos propios, en trazo, dibujados a mano.
 *
 * No se usa una biblioteca de íconos: todas traen su propia estética y
 * pesan de más para lo que hacen falta acá. Son nueve íconos.
 *
 * Todos son decorativos y llevan `aria-hidden`: el significado lo pone
 * el texto que los acompaña. El único con `role="img"` es el del clima,
 * porque ahí el ícono *es* la información.
 */

interface PropsIcono {
  tamano?: number
  grosor?: number
}

function Trazo({
  tamano = 16,
  grosor = 2.1,
  children,
}: PropsIcono & { children: React.ReactNode }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const IconoAgenda = (p: PropsIcono) => (
  <Trazo {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M3.5 10h17" />
  </Trazo>
)

export const IconoCompras = (p: PropsIcono) => (
  <Trazo {...p}>
    <path d="M9 6h11" />
    <path d="M9 12h11" />
    <path d="M9 18h11" />
    <path d="m3.5 6 1.3 1.3L7.2 4.9" />
    <path d="m3.5 12 1.3 1.3 2.4-2.4" />
  </Trazo>
)

export const IconoReloj = (p: PropsIcono) => (
  <Trazo {...p}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9.5V13l2.3 1.4" />
    <path d="M9 2.5h6" />
  </Trazo>
)

export const IconoLuz = (p: PropsIcono) => (
  <Trazo {...p}>
    <path d="M9 18h6" />
    <path d="M10 21.5h4" />
    <path d="M12 2.5a6.5 6.5 0 0 1 4 11.6V18H8v-3.9A6.5 6.5 0 0 1 12 2.5Z" />
  </Trazo>
)

export const IconoAspiradora = (p: PropsIcono) => (
  <Trazo {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3" />
  </Trazo>
)

export const IconoEnchufe = (p: PropsIcono) => (
  <Trazo {...p}>
    <path d="M9 2.5v6" />
    <path d="M15 2.5v6" />
    <path d="M5.5 8.5h13v3a6.5 6.5 0 0 1-13 0Z" />
    <path d="M12 18v3.5" />
  </Trazo>
)

export const IconoTermostato = (p: PropsIcono) => (
  <Trazo {...p}>
    <path d="M14 14.8V4.5a2 2 0 1 0-4 0v10.3a4 4 0 1 0 4 0Z" />
  </Trazo>
)

export const IconoMicrofono = (p: PropsIcono) => (
  <Trazo {...p}>
    <rect x="9" y="2.6" width="6" height="11" rx="3" />
    <path d="M5.5 11.2a6.5 6.5 0 0 0 13 0" />
    <path d="M12 17.7v3.7" />
  </Trazo>
)

export const IconoMicrofonoTachado = (p: PropsIcono) => (
  <Trazo {...p}>
    <path d="M9 5.6a3 3 0 0 1 6 0v5" />
    <path d="M9 9.4v2.2a3 3 0 0 0 4.6 2.5" />
    <path d="M5.5 11.2a6.5 6.5 0 0 0 9.8 5.6" />
    <path d="M18.5 11.2a6.4 6.4 0 0 1-.4 2.2" />
    <path d="M12 17.7v3.7" />
    <path d="m3.5 3 17 18" />
  </Trazo>
)

export const IconoConexion = (p: PropsIcono) => (
  <Trazo grosor={2.2} {...p}>
    <path d="M4.5 9.5a11 11 0 0 1 15 0" />
    <path d="M7.7 13a6.6 6.6 0 0 1 8.6 0" />
    <path d="M12 16.6h.01" />
  </Trazo>
)

export const IconoSinConexion = (p: PropsIcono) => (
  <Trazo grosor={2.2} {...p}>
    <path d="M4.5 9.5a11 11 0 0 1 6.2-3.1" />
    <path d="M16.2 7.2a11 11 0 0 1 3.3 2.3" />
    <path d="M9 13.7a6.6 6.6 0 0 1 5.8-.5" />
    <path d="M12 16.6h.01" />
    <path d="m3.5 3 17 18" />
  </Trazo>
)

export const IconoAjustes = (p: PropsIcono) => (
  <Trazo grosor={2} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.6v3" />
    <path d="M12 18.4v3" />
    <path d="M2.6 12h3" />
    <path d="M18.4 12h3" />
    <path d="m5.5 5.5 2.1 2.1" />
    <path d="m16.4 16.4 2.1 2.1" />
    <path d="m18.5 5.5-2.1 2.1" />
    <path d="m7.6 16.4-2.1 2.1" />
  </Trazo>
)

export const IconoViaje = (p: PropsIcono) => (
  <Trazo grosor={2} {...p}>
    <path d="M3 12h3l2-5h8l2 5h3" />
    <path d="M5 12v5h14v-5" />
    <circle cx="8" cy="17.5" r="1.6" />
    <circle cx="16" cy="17.5" r="1.6" />
  </Trazo>
)

export const IconoSol = (p: PropsIcono) => (
  <Trazo grosor={2} {...p}>
    <circle cx="12" cy="12" r="4.4" />
    <path d="M12 2.5v2.4" />
    <path d="M12 19.1v2.4" />
    <path d="M2.5 12h2.4" />
    <path d="M19.1 12h2.4" />
    <path d="m5.3 5.3 1.7 1.7" />
    <path d="m17 17 1.7 1.7" />
    <path d="m18.7 5.3-1.7 1.7" />
    <path d="m7 17-1.7 1.7" />
  </Trazo>
)

export const IconoLuna = (p: PropsIcono) => (
  <Trazo grosor={2} {...p}>
    <path d="M20.5 14.3A8.8 8.8 0 0 1 9.7 3.5a8.8 8.8 0 1 0 10.8 10.8Z" />
  </Trazo>
)

export const IconoTilde = ({ tamano = 9 }: PropsIcono) => (
  <svg
    width={tamano}
    height={tamano}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m4 12.5 5.5 5.5L20 6.5" />
  </svg>
)

export const IconoPausa = ({ tamano = 14 }: PropsIcono) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5h3.2v14H8zM12.8 5H16v14h-3.2z" />
  </svg>
)

export const IconoReproducir = ({ tamano = 14 }: PropsIcono) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 4.8 19 12 8 19.2z" />
  </svg>
)

export const IconoNota = (p: PropsIcono) => (
  <Trazo grosor={2} {...p}>
    <path d="M9 18V5.5l10-2V16" />
    <circle cx="6.5" cy="18" r="2.6" />
    <circle cx="16.5" cy="16" r="2.6" />
  </Trazo>
)

export const IconoAyuda = (p: PropsIcono) => (
  <Trazo grosor={2.2} {...p}>
    <path d="M12 21s-7.5-4.6-7.5-10a4.3 4.3 0 0 1 7.5-2.9A4.3 4.3 0 0 1 19.5 11c0 5.4-7.5 10-7.5 10Z" />
  </Trazo>
)

const PORCLASE = {
  luz: IconoLuz,
  aspiradora: IconoAspiradora,
  enchufe: IconoEnchufe,
  termostato: IconoTermostato,
} as const

export function iconoDeDispositivo(clase: keyof typeof PORCLASE) {
  return PORCLASE[clase]
}
