import type { EstadoMicrofono } from '../datos/tipos'
import { IconoAyuda, IconoMicrofono, IconoMicrofonoTachado } from './Iconos'

interface Props {
  microfono: EstadoMicrofono
  onEscuchar: () => void
  onAyuda: () => void
}

const MENSAJES: Record<EstadoMicrofono, { titulo: React.ReactNode; nota: string }> = {
  listo: {
    titulo: (
      <>
        Decime <strong>«Jarvis»</strong> y hablá
      </>
    ),
    nota: 'Nada sale de casa hasta que me nombres',
  },
  escuchando: {
    titulo: <>Te escucho</>,
    nota: 'Hablá tranquilo, no hay apuro',
  },
  silenciado: {
    titulo: <>Micrófono silenciado</>,
    nota: 'Tocá acá para volver a activarlo',
  },
  ausente: {
    titulo: <>No encuentro el micrófono</>,
    nota: 'Revisá que esté enchufado. Todo lo demás sigue funcionando',
  },
}

export function BarraVoz({ microfono, onEscuchar, onAyuda }: Props) {
  const roto = microfono === 'ausente' || microfono === 'silenciado'
  const { titulo, nota } = MENSAJES[microfono]

  return (
    <div className="barra-inferior aparece" style={{ animationDelay: '420ms' }}>
      <button type="button" className="voz vidrio" onClick={onEscuchar}>
        <span
          className={`voz__mic${microfono === 'listo' || microfono === 'escuchando' ? ' voz__mic--vivo ambiental' : ''}${roto ? ' voz__mic--roto' : ''}`}
          aria-hidden="true"
        >
          {roto ? <IconoMicrofonoTachado tamano={25} grosor={2} /> : <IconoMicrofono tamano={25} grosor={2} />}
        </span>
        <div className="voz__texto">
          <p className="voz__titulo">{titulo}</p>
          <p className="voz__nota">{nota}</p>
        </div>
      </button>

      {/* Siempre en pantalla, nunca detrás de un menú. Es la razón por la
          que existe el proyecto. */}
      <button type="button" className="ayuda" onClick={onAyuda}>
        <IconoAyuda tamano={22} />
        Necesito ayuda
      </button>
    </div>
  )
}
