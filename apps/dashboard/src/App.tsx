import { useEffect, useState } from 'react'
import './App.css'
import { usarTema } from './temas/usarTema'

/**
 * Banco de pruebas de tokens (F1.2).
 *
 * No es la pantalla del producto: es la comprobación de que el cambio de
 * tema funciona sobre un único conjunto de variables y de que ningún
 * color está escrito a mano. La pantalla principal llega en F1.4 y
 * reemplaza este componente.
 */

const MUESTRAS = [
  ['Texto', '--texto'],
  ['Texto 2', '--texto-2'],
  ['Texto 3', '--texto-3'],
  ['Acento', '--acento'],
  ['Confirmación', '--confirmacion'],
  ['Recordatorio', '--recordatorio'],
  ['Viaje', '--viaje'],
  ['Emergencia', '--emergencia-plano'],
] as const

function usarReloj(): Date {
  const [ahora, setAhora] = useState(() => new Date())
  useEffect(() => {
    // Alinea el primer salto con el segundo 0 del minuto siguiente, para
    // que el reloj no cambie con medio minuto de retraso.
    const alMinuto = 60_000 - (Date.now() % 60_000)
    let intervalo: number | undefined
    const primero = window.setTimeout(() => {
      setAhora(new Date())
      intervalo = window.setInterval(() => setAhora(new Date()), 60_000)
    }, alMinuto)
    return () => {
      window.clearTimeout(primero)
      if (intervalo !== undefined) window.clearInterval(intervalo)
    }
  }, [])
  return ahora
}

export function App() {
  const { tema, alternar } = usarTema()
  const ahora = usarReloj()

  const hora = new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(ahora)

  const fecha = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(ahora)

  return (
    <div className="banco">
      <header className="banco__encabezado vidrio">
        <div>
          <h1 className="banco__titulo">JARVIS — tokens de diseño</h1>
          <p className="banco__nota">
            Banco de pruebas de F1.2. La pantalla principal llega en F1.4.
          </p>
        </div>
        <button className="boton-tema" onClick={alternar}>
          Tema: {tema === 'lavanda' ? 'Lavanda Suave' : 'Menta Clínica'}
        </button>
      </header>

      <div className="banco__cuerpo">
        <section className="panel-oscuro">
          <div className="panel-oscuro__aura ambiental" aria-hidden="true" />
          <time className="panel-oscuro__hora" dateTime={ahora.toISOString()}>
            {hora}
          </time>
          <p className="panel-oscuro__fecha">{fecha}</p>
        </section>

        <section className="tarjeta vidrio">
          <h2 className="tarjeta__titulo">Color</h2>
          <div className="muestras">
            {MUESTRAS.map(([nombre, token]) => (
              <div className="muestra" key={token}>
                <span
                  className="muestra__color"
                  style={{ background: `var(${token})` }}
                  aria-hidden="true"
                />
                {nombre}
              </div>
            ))}
          </div>
        </section>

        <section className="tarjeta vidrio">
          <h2 className="tarjeta__titulo">Forma y estado</h2>
          <div className="chips">
            <span className="chip chip--confirmacion">Agregado a la lista</span>
            <span className="chip chip--recordatorio">Pastillas 20:00</span>
            <span className="chip chip--viaje">Viaje 24 min</span>
            <span className="chip">Casa activa</span>
          </div>
          <button className="boton-emergencia">Necesito ayuda</button>
        </section>
      </div>
    </div>
  )
}
