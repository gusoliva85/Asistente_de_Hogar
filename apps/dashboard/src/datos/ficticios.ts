import type { EstadoPantalla } from './tipos'

/**
 * Datos de la Fase 1. Se reemplazan por la API en la Fase 2.
 *
 * Los horarios se calculan a partir de "ahora" para que la pantalla no
 * muestre eventos de ayer cada vez que se abre, y para que el resaltado
 * del próximo evento tenga sentido a cualquier hora del día.
 */

function aLasHoras(horas: number, minutos = 0): string {
  const d = new Date()
  d.setHours(horas, minutos, 0, 0)
  return d.toISOString()
}

export function estadoFicticio(): EstadoPantalla {
  const ahora = new Date()
  const eventos = [
    { id: 'e1', comienza: aLasHoras(10, 0), titulo: 'Médico — Dr. Ramos' },
    { id: 'e2', comienza: aLasHoras(16, 30), titulo: 'Entrega del pedido' },
    { id: 'e3', comienza: aLasHoras(19, 30), titulo: 'Videollamada con mamá' },
  ]
  const proximo = eventos.find((e) => new Date(e.comienza) > ahora)

  return {
    hogar: { id: 'h1', nombre: 'Hogar principal', activa: true },
    conexion: 'conectado',
    microfono: 'listo',
    clima: {
      temperatura: 19,
      maxima: 23,
      minima: 14,
      condicion: 'Parcialmente nublado',
      esDeNoche: ahora.getHours() < 7 || ahora.getHours() >= 20,
      porHora: [18, 19, 21, 22, 20, 17],
    },
    viaje: { destino: 'el centro', minutos: 24 },
    eventos: eventos.map((e) => ({ ...e, destacado: e.id === proximo?.id })),
    compras: [
      { id: 'c1', nombre: 'Leche', cantidad: null, comprado: false },
      { id: 'c2', nombre: 'Pan', cantidad: null, comprado: false },
      { id: 'c3', nombre: 'Papas', cantidad: '2 kg', comprado: false },
      { id: 'c4', nombre: 'Detergente', cantidad: null, comprado: false },
      { id: 'c5', nombre: 'Café', cantidad: null, comprado: true },
      { id: 'c6', nombre: 'Arroz', cantidad: null, comprado: true },
    ],
    recordatorio: { id: 'r1', momento: aLasHoras(21, 30), titulo: 'Pastilla de la noche' },
    dispositivos: [
      { id: 'd1', nombre: 'Luces del living', clase: 'luz', encendido: true, nivel: null },
      { id: 'd2', nombre: 'Aspiradora', clase: 'aspiradora', encendido: false, nivel: 84 },
      { id: 'd3', nombre: 'Luces del cuarto', clase: 'luz', encendido: false, nivel: null },
      { id: 'd4', nombre: 'Estufa', clase: 'enchufe', encendido: null, nivel: null },
    ],
    musica: {
      titulo: 'De música ligera',
      artista: 'Soda Stereo',
      origen: 'YouTube',
      sonando: true,
    },
  }
}

/**
 * La misma casa en su peor día: sin conexión, sin clima, sin micrófono,
 * la agenda vacía, la lista hecha y un dispositivo que no responde.
 * Existe para que los estados vacíos de F1.6 se puedan mirar, no solo
 * suponer. Se activa con ?datos=vacio
 */
export function estadoVacio(): EstadoPantalla {
  return {
    hogar: { id: 'h1', nombre: 'Hogar principal', activa: false },
    conexion: 'sin-conexion',
    microfono: 'ausente',
    clima: null,
    viaje: null,
    eventos: [],
    compras: [],
    recordatorio: null,
    dispositivos: [
      { id: 'd1', nombre: 'Luces del living', clase: 'luz', encendido: null, nivel: null },
    ],
    musica: null,
  }
}
