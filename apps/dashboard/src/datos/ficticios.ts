import type { Emergencia, EstadoEscucha, EstadoMusica, EstadoPantalla } from './tipos'

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
    hogar: { id: 'h1', nombre: 'Hogar principal', acompanamiento: false, activa: true },
    conexion: 'conectado',
    microfono: 'listo',
    clima: {
      temperatura: 19,
      maxima: 23,
      minima: 14,
      condicion: 'Parcialmente nublado',
      esDeNoche: ahora.getHours() < 7 || ahora.getHours() >= 20,
      pronostico: [
        { hora: '09:00', temperatura: 16, condicion: 'Despejado', esDeNoche: false },
        { hora: '14:00', temperatura: 23, condicion: 'Parcialmente nublado', esDeNoche: false },
        { hora: '19:00', temperatura: 18, condicion: 'Nublado', esDeNoche: true },
      ],
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
    hogar: { id: 'h1', nombre: 'Hogar principal', acompanamiento: false, activa: false },
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

/* ── Las otras tres pantallas (F1.7) ────────────────────────────────────── */

export function escuchaFicticia(): EstadoEscucha {
  return {
    transcripcion: 'Agregá dos kilos de papa, leche y detergente a las compras',
    escuchando: false,
    origen: 'modelo-local',
    accion: {
      resumen: 'Agregué 3 productos a la lista',
      verificadoA: new Date().toISOString(),
      detalles: ['Papa · 2 kg', 'Leche', 'Detergente'],
    },
    sincronizado: true,
  }
}

export function emergenciaFicticia(): Emergencia {
  const hace = (segundos: number) => new Date(Date.now() - segundos * 1000).toISOString()
  return {
    origen: 'Activada con el botón',
    comenzo: hace(74),
    alarmaSonando: true,
    servidorEnLinea: true,
    escalando: true,
    avisos: [
      {
        id: 'a1',
        nombre: 'María',
        vinculo: 'hija',
        canal: 'notificacion',
        estado: 'confirmado',
        detalle: 'Notificación · confirmó a las 18:43',
        etiqueta: 'VA EN CAMINO',
        escalaEn: null,
      },
      {
        id: 'a2',
        nombre: 'Jorge',
        vinculo: 'hijo',
        canal: 'notificacion',
        estado: 'entregado',
        detalle: 'Notificación entregada 18:42 · todavía no respondió',
        etiqueta: null,
        escalaEn: 48,
      },
      {
        id: 'a3',
        nombre: 'Ana',
        vinculo: 'vecina',
        canal: 'sms',
        estado: 'fallido',
        detalle: 'No se pudo entregar · teléfono sin conexión',
        etiqueta: 'SMS ENVIADO',
        escalaEn: null,
      },
      {
        id: 'a4',
        nombre: 'Carlos',
        vinculo: 'hermano',
        canal: 'llamada',
        estado: 'llamando',
        detalle: 'Llamada telefónica en curso',
        etiqueta: null,
        escalaEn: null,
      },
    ],
  }
}

export function musicaFicticia(): EstadoMusica {
  return {
    pista: {
      titulo: 'De música ligera',
      artista: 'Soda Stereo',
      origen: 'YouTube',
      sonando: true,
      album: 'Canción Animal · 1990',
      duracion: 212,
      posicion: 88,
    },
    cola: [
      { titulo: 'Un millón de años luz', artista: 'Soda Stereo', origen: 'YouTube', sonando: false },
      { titulo: 'Té para tres', artista: 'Soda Stereo', origen: 'YouTube', sonando: false },
      { titulo: 'En el séptimo día', artista: 'Soda Stereo', origen: 'YouTube', sonando: false },
    ],
  }
}
