import type { ArticuloCompra } from '../datos/tipos'
import { IconoCompras, IconoTilde } from './Iconos'

export function TarjetaCompras({ articulos }: { articulos: ArticuloCompra[] }) {
  const pendientes = articulos.filter((a) => !a.comprado).length

  // Primero lo que falta: lo comprado ya no es una tarea.
  const ordenados = [...articulos].sort((a, b) => Number(a.comprado) - Number(b.comprado))

  return (
    <section className="tarjeta vidrio vidrio--interactiva aparece" style={{ animationDelay: '180ms' }}>
      <div className="tarjeta__cabecera">
        <span className="tarjeta__insignia tarjeta__insignia--verde">
          <IconoCompras tamano={14} grosor={2.2} />
        </span>
        <h2 className="tarjeta__titulo">Compras</h2>
        {pendientes > 0 && <span className="insignia-conteo numero">{pendientes}</span>}
      </div>

      {articulos.length === 0 ? (
        <p className="vacio">
          La lista está vacía.
          <span>Decí «Jarvis, agregá leche a la lista».</span>
        </p>
      ) : pendientes === 0 ? (
        <p className="vacio vacio--logrado">
          Está todo comprado.
          <span>{articulos.length} artículos tachados.</span>
        </p>
      ) : (
        <ul className="compras">
          {ordenados.slice(0, 6).map((a) => (
            <li key={a.id} className={`compras__fila${a.comprado ? ' compras__fila--hecha' : ''}`}>
              <span className="casilla" aria-hidden="true">
                {a.comprado && <IconoTilde />}
              </span>
              <span className="compras__nombre">
                {a.nombre}
                {a.cantidad && <span className="compras__cantidad"> {a.cantidad}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
