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

/* Los tres motivos de emergencia, redibujados sobre las referencias de
   documentacion/ejemplos/. Van en color y rellenos, no en trazo gris:
   se eligen de un vistazo y en pánico, cuando nadie lee las etiquetas.
   Son símbolos genéricos dibujados de cero, no los archivos de muestra. */

export const IconoCaida = ({ tamano = 32 }: PropsIcono) => (
  <svg width={tamano} height={tamano} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {/* Las rayas de caída: sin ellas la figura parece estar bailando */}
    <g stroke="#F7C96B" strokeWidth="2.4" strokeLinecap="round" opacity=".6">
      <path d="M11 4.5v5" />
      <path d="M24.5 2.5v4" />
      <path d="M38 6v5.5" />
      <path d="M43 15v4.5" />
    </g>
    <g stroke="#F5C534" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.4 19.6 28.5 26.4" />
      <path d="M22.6 16.4 29.4 9.8 32.2 7.2" />
      <path d="M16.8 18.6 8.8 15.8 6.2 18.8" />
      <path d="M28.5 26.4 22.6 32.6 16.6 34.8" />
      <path d="M28.5 26.4 35.4 29.4 34.6 37.2" />
    </g>
    <circle cx="18.4" cy="14.6" r="4.4" fill="#F5C534" />
  </svg>
)

export const IconoSalud = ({ tamano = 32 }: PropsIcono) => (
  <svg width={tamano} height={tamano} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path
      d="M24 41.6S4 28.8 4 16.8A9.8 9.8 0 0 1 24 12.4 9.8 9.8 0 0 1 44 16.8c0 12-20 24.8-20 24.8Z"
      fill="#E8534B"
      stroke="#15191E"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <path
      d="M20.5 14.5h7v5h5v7h-5v5h-7v-5h-5v-7h5Z"
      fill="#DCEBF7"
      stroke="#15191E"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  </svg>
)

export const IconoPeligro = ({ tamano = 32 }: PropsIcono) => (
  <svg width={tamano} height={tamano} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path
      d="M24 7 43 39.5H5L24 7Z"
      fill="#FFFFFF"
      stroke="#E8201B"
      strokeWidth="6.6"
      strokeLinejoin="round"
    />
    <path d="M24 19v10.4" stroke="#121212" strokeWidth="5" strokeLinecap="round" />
    <circle cx="24" cy="34.2" r="2.8" fill="#121212" />
  </svg>
)

export const IconoReenviar = (p: PropsIcono) => (
  <Trazo {...p}>
    <path d="M20.5 11.5a8.5 8.5 0 1 1-2.6-6.1" />
    <path d="M20.8 3.5v5h-5" />
  </Trazo>
)

export const IconoAnterior = ({ tamano = 20 }: PropsIcono) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 5h2.4v14H6zM20 5v14L9.6 12z" />
  </svg>
)

export const IconoSiguiente = ({ tamano = 20 }: PropsIcono) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.6 5H18v14h-2.4zM4 5v14l10.4-7z" />
  </svg>
)

export const IconoAleatorio = (p: PropsIcono) => (
  <Trazo grosor={2.2} {...p}>
    <path d="M3 6.5h3.4l3.1 4" />
    <path d="M14.4 13.4 17 17h4" />
    <path d="M3 17.5h3.4L17 6.5h4" />
    <path d="M18.6 4.3 21 6.5l-2.4 2.2" />
    <path d="M18.6 14.8 21 17l-2.4 2.2" />
  </Trazo>
)

export const IconoBucle = (p: PropsIcono) => (
  <Trazo grosor={2.2} {...p}>
    <path d="M6.5 5h11A3.5 3.5 0 0 1 21 8.5v1" />
    <path d="M17.5 19h-11A3.5 3.5 0 0 1 3 15.5v-1" />
    <path d="m18.6 2.8 2.6 2.2-2.6 2.2" />
    <path d="m5.4 21.2-2.6-2.2 2.6-2.2" />
  </Trazo>
)

export const IconoVolumen = (p: PropsIcono) => (
  <Trazo grosor={2.1} {...p}>
    <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4Z" />
    <path d="M16 9.4a3.6 3.6 0 0 1 0 5.2" />
    <path d="M18.6 6.6a7.4 7.4 0 0 1 0 10.8" />
  </Trazo>
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
