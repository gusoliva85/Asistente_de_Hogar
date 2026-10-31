import type { Aviso, CanalAviso, Emergencia as DatosEmergencia, EstadoAviso } from '../datos/tipos'
import { Grano } from '../componentes/Grano'

/**
 * Pantalla de emergencia.
 *
 * Es la razón por la que existe el proyecto, así que acá las reglas se
 * aplican sin excepción:
 *
 * - **No depende de la IA.** Lo que se ve es el estado de cada canal,
 *   reportado por quien lo envió, no la interpretación de un modelo.
 * - **No se finge nada.** «Entregado» y «confirmó» son distintos y se
 *   muestran distintos. Que un mensaje llegue a un teléfono no dice
 *   nada sobre si alguien lo leyó.
 * - **Un fallo se muestra como fallo**, en rojo y con el motivo.
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
        {aviso.etiqueta && <span className={`aviso__etiqueta aviso__etiqueta--${e.clase}`}>{aviso.etiqueta}</span>}
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
  const confirmaron = emergencia.avisos.filter((a) => a.estado === 'confirmado').length
  const primero = emergencia.avisos.find((a) => a.estado === 'confirmado')

  return (
    <div className="emergencia">
      <div className="emergencia__aura emergencia__aura--1 ambiental" aria-hidden="true" />
      <div className="emergencia__aura emergencia__aura--2 ambiental" aria-hidden="true" />
      <div className="emergencia__marco ambiental" aria-hidden="true" />
      <Grano intenso />

      <header className="emergencia__encabezado">
        <span className="faro ambiental" aria-hidden="true" />
        <div>
          <h1 className="emergencia__titulo">Emergencia activa</h1>
          <p className="emergencia__origen">
            {emergencia.origen} · <strong>{transcurrido(emergencia.comenzo, ahora)}</strong>
          </p>
        </div>
        {emergencia.alarmaSonando && (
          <span className="emergencia__alarma">
            <span className="ondas" aria-hidden="true">
              <span className="onda ambiental" />
              <span className="onda ambiental" />
              <span className="onda ambiental" />
            </span>
            Alarma sonando en casa
          </span>
        )}
      </header>

      <main className="emergencia__cuerpo">
        <section className="emergencia__avisos">
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
        </section>

        <aside className="emergencia__estado">
          <h2 className="emergencia__subtitulo">Estado</h2>
          <ul className="estado-lista">
            <li className={emergencia.alarmaSonando ? 'bien' : 'mal'}>
              {emergencia.alarmaSonando ? 'Alarma local sonando' : 'Alarma local apagada'}
            </li>
            <li className={emergencia.servidorEnLinea ? 'bien' : 'mal'}>
              {emergencia.servidorEnLinea
                ? 'Internet y servidor en línea'
                : 'Sin internet · avisando por SMS'}
            </li>
            {emergencia.escalando && <li className="curso">Escalando al siguiente canal</li>}
          </ul>

          {/* Esta aclaración no es un detalle de diseño: es el contrato
              con quien está mirando la pantalla en el peor momento. */}
          <p className="emergencia__aclaracion">
            Todo lo que ves es el estado <strong>real</strong> de cada aviso.
            <span>«Entregado» no quiere decir que lo hayan leído.</span>
          </p>
        </aside>
      </main>

      <footer className="emergencia__acciones">
        {primero && (
          <button type="button" className="emergencia__boton emergencia__boton--hablar">
            Hablar con {primero.nombre}
          </button>
        )}
        <button
          type="button"
          className="emergencia__boton emergencia__boton--cancelar"
          onClick={onCancelar}
        >
          Estoy bien — cancelar la alerta
        </button>
      </footer>
    </div>
  )
}
