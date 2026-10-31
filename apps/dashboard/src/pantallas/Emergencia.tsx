import { useState } from 'react'
import type {
  Aviso,
  CanalAviso,
  Emergencia as DatosEmergencia,
  EstadoAviso,
  MotivoEmergencia,
} from '../datos/tipos'
import { Grano } from '../componentes/Grano'
import { IconoCaida, IconoMicrofono, IconoPeligro, IconoSalud } from '../componentes/Iconos'
import { BotonCancelar, BotonReenviar, PieAcciones } from '../componentes/Navegacion'

/**
 * Pantalla de emergencia.
 *
 * Es la razón por la que existe el proyecto, así que acá las reglas se
 * aplican sin excepción:
 *
 * - **No depende de la IA.** Lo que se ve es el estado de cada canal,
 *   reportado por quien lo envió, no la interpretación de un modelo.
 * - **No se finge nada.** «Entregado» y «confirmó» son distintos y se
 *   muestran distintos.
 * - **Todo es más grande de lo que parece necesario.** La va a mirar
 *   una persona mayor, desde lejos y asustada.
 */

const CANAL: Record<CanalAviso, string> = {
  notificacion: 'Notificación',
  sms: 'SMS',
  llamada: 'Llamada',
}

const ESTADO: Record<EstadoAviso, { texto: string; clase: string }> = {
  pendiente: { texto: 'Pendiente', clase: 'espera' },
  enviado: { texto: 'Enviado', clase: 'espera' },
  entregado: { texto: 'Entregado', clase: 'espera' },
  confirmado: { texto: 'Confirmó', clase: 'bien' },
  fallido: { texto: 'No llegó', clase: 'mal' },
  llamando: { texto: 'Llamando', clase: 'curso' },
}

const MOTIVOS: { id: MotivoEmergencia; texto: string; Icono: typeof IconoCaida }[] = [
  { id: 'caida', texto: 'Me caí', Icono: IconoCaida },
  { id: 'salud', texto: 'Me siento mal', Icono: IconoSalud },
  { id: 'peligro', texto: 'Estoy en peligro', Icono: IconoPeligro },
]

function transcurrido(desde: string, ahora: Date): string {
  const s = Math.max(0, Math.floor((ahora.getTime() - new Date(desde).getTime()) / 1000))
  const m = Math.floor(s / 60)
  return m > 0 ? `hace ${m} min ${s % 60} s` : `hace ${s} s`
}

function FilaAviso({ aviso }: { aviso: Aviso }) {
  const e = ESTADO[aviso.estado]
  return (
    <li className={`aviso aviso--${e.clase}`}>
      <span className="aviso__marca" aria-hidden="true" />
      <div className="aviso__texto">
        <div className="aviso__nombre">
          {aviso.nombre} <span className="aviso__vinculo">— {aviso.vinculo}</span>
        </div>
        <div className="aviso__detalle">{aviso.detalle}</div>
      </div>
      <div className="aviso__derecha">
        {aviso.etiqueta && (
          <span className={`aviso__etiqueta aviso__etiqueta--${e.clase}`}>{aviso.etiqueta}</span>
        )}
        {aviso.escalaEn !== null && (
          <span className="aviso__escala numero">
            llamando en 0:{String(aviso.escalaEn).padStart(2, '0')}
          </span>
        )}
        {aviso.estado === 'llamando' && <span className="aviso__escala">sonando…</span>}
        <span className="solo-lectores">
          {CANAL[aviso.canal]}: {e.texto}
        </span>
      </div>
    </li>
  )
}

interface Props {
  emergencia: DatosEmergencia
  ahora: Date
  onCancelar: () => void
}

export function Emergencia({ emergencia, ahora, onCancelar }: Props) {
  // En la Fase 7 esto va al servidor y cambia el mensaje de los avisos.
  const [motivo, setMotivo] = useState<MotivoEmergencia | null>(emergencia.motivo)
  const confirmaron = emergencia.avisos.filter((a) => a.estado === 'confirmado').length

  return (
    <div className="emergencia">
      <div className="emergencia__aura emergencia__aura--1 ambiental" aria-hidden="true" />
      <div className="emergencia__aura emergencia__aura--2 ambiental" aria-hidden="true" />
      <div className="emergencia__marco ambiental" aria-hidden="true" />
      <Grano intenso />

      <header className="emergencia__encabezado">
        <span className="faro ambiental" aria-hidden="true" />
        <div className="emergencia__titulos">
          <h1 className="emergencia__titulo">Emergencia activa</h1>
          <p className="emergencia__origen">
            {emergencia.origen} · <strong>{transcurrido(emergencia.comenzo, ahora)}</strong>
          </p>
        </div>

        {/* El micrófono queda abierto sin palabra de activación: quien se
            cayó puede no llegar a decir «Jarvis». */}
        {emergencia.escuchando && (
          <span className="emergencia__escuchando">
            {/* Radar: el micrófono en un disco con dos anillos que salen
                desde él. Se lee como «está captando», que es lo que pasa. */}
            <span className="radar" aria-hidden="true">
              <span className="radar__onda ambiental" />
              <span className="radar__onda radar__onda--2 ambiental" />
              <span className="radar__nucleo">
                <IconoMicrofono tamano={19} grosor={2.2} />
              </span>
            </span>
            Te escucho — contame qué pasó
          </span>
        )}

        {emergencia.alarmaSonando && (
          <span className="emergencia__alarma">
            <span className="ondas" aria-hidden="true">
              <span className="onda ambiental" />
              <span className="onda ambiental" />
              <span className="onda ambiental" />
            </span>
            Alarma sonando
          </span>
        )}
      </header>

      {emergencia.mensaje && (
        <p className="emergencia__mensaje">
          Dijiste: <strong>«{emergencia.mensaje}»</strong>
        </p>
      )}

      {/* Decir qué pasa cambia lo que reciben los contactos: «se cayó» y
          «se siente mal» mandan a buscar cosas distintas. */}
      <section className="motivos">
        {MOTIVOS.map(({ id, texto, Icono }) => (
          <button
            key={id}
            type="button"
            className={`motivo${motivo === id ? ' motivo--elegido' : ''}`}
            aria-pressed={motivo === id}
            onClick={() => setMotivo(id)}
          >
            <Icono tamano={32} />
            {texto}
          </button>
        ))}
      </section>

      <main className="emergencia__cuerpo">
        <div className="emergencia__cabecera">
          <h2 className="emergencia__subtitulo">A quién se avisó</h2>
          <span className="emergencia__conteo numero">
            {confirmaron} de {emergencia.avisos.length} confirmó
          </span>
        </div>
        <ul className="avisos">
          {emergencia.avisos.map((a) => (
            <FilaAviso key={a.id} aviso={a} />
          ))}
        </ul>
      </main>

      {/* Misma regla que en el resto: izquierda sale, derecha insiste. */}
      <PieAcciones>
        <BotonCancelar onClick={onCancelar} />
        <BotonReenviar onClick={() => undefined} />
      </PieAcciones>
    </div>
  )
}
