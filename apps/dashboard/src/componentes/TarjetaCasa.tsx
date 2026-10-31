import type { Dispositivo } from '../datos/tipos'
import { iconoDeDispositivo } from './Iconos'

/**
 * Estado real de los dispositivos.
 *
 * `encendido: null` significa que el dispositivo no contestó. Se muestra
 * como «Sin respuesta», nunca como apagado: decir que una luz está
 * apagada cuando no lo sabemos es exactamente lo que no hacemos.
 */
export function TarjetaCasa({ dispositivos }: { dispositivos: Dispositivo[] }) {
  const responden = dispositivos.filter((d) => d.encendido !== null).length

  return (
    <section className="tarjeta vidrio vidrio--interactiva aparece" style={{ animationDelay: '300ms' }}>
      <div className="tarjeta__cabecera">
        <h2 className="tarjeta__titulo">Casa</h2>
        <span className="tarjeta__conteo">
          {responden === dispositivos.length
            ? `${dispositivos.length} dispositivos`
            : `${responden} de ${dispositivos.length} responden`}
        </span>
      </div>

      {dispositivos.length === 0 ? (
        <p className="vacio">
          No hay dispositivos vinculados.
          <span>Se configuran desde el celular.</span>
        </p>
      ) : (
        <ul className="casa">
          {dispositivos.slice(0, 2).map((d) => {
            const Icono = iconoDeDispositivo(d.clase)
            const sinRespuesta = d.encendido === null
            return (
              <li key={d.id} className="casa__fila">
                <span
                  className={`casa__icono${d.encendido ? ' casa__icono--encendido' : ''}${sinRespuesta ? ' casa__icono--mudo' : ''}`}
                >
                  <Icono tamano={16} />
                </span>
                <span className="casa__nombre">{d.nombre}</span>
                {sinRespuesta ? (
                  <span className="casa__mudo">Sin respuesta</span>
                ) : d.nivel !== null ? (
                  <span className="casa__nivel numero">{d.nivel}%</span>
                ) : (
                  <span className={`interruptor${d.encendido ? ' interruptor--si' : ''}`} aria-hidden="true">
                    <span className="interruptor__perilla" />
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
