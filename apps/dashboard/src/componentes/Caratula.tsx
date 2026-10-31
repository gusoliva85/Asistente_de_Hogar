import { IconoNota } from './Iconos'

/**
 * Carátula de relleno, derivada del título.
 *
 * YouTube sí da miniatura y en la Fase 8 se usa la real. Hasta entonces,
 * un degradado estable por título es mejor que un cuadro gris: hace que
 * la cola se lea de un vistazo, que es para lo que sirve una carátula.
 */
function tono(texto: string): number {
  let h = 0
  for (const c of texto) h = (h * 31 + c.codePointAt(0)!) % 360
  return h
}

export function Caratula({ titulo, tamano }: { titulo: string; tamano: number }) {
  const h = tono(titulo)
  return (
    <span
      className="caratula"
      style={{
        width: tamano,
        height: tamano,
        background: `linear-gradient(145deg, hsl(${h} 42% 32%), hsl(${(h + 48) % 360} 55% 52%))`,
      }}
      aria-hidden="true"
    >
      <IconoNota tamano={Math.round(tamano * 0.36)} />
    </span>
  )
}
