import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// La tipografía va empaquetada, no traída de internet: la Pi tiene que
// pintar la pantalla aunque la conexión esté caída.
// Solo el subconjunto latino: el español no usa latín extendido, y cada
// archivo de más es una petición de más en el arranque del kiosco.
import '@fontsource/plus-jakarta-sans/latin-400.css'
import '@fontsource/plus-jakarta-sans/latin-500.css'
import '@fontsource/plus-jakarta-sans/latin-600.css'
import '@fontsource/plus-jakarta-sans/latin-700.css'
import '@fontsource/plus-jakarta-sans/latin-800.css'

import './estilos/tokens.css'
import './estilos/base.css'
import './estilos/componentes.css'
import './estilos/pantallas.css'

import { App } from './App'
import {
  aplicarLuz,
  aplicarMovimiento,
  aplicarRendimiento,
  aplicarTema,
  leerModoLuz,
  leerTemaGuardado,
  resolverLuz,
} from './temas/tema'

// Antes de que React monte, para que no haya un parpadeo con el tema
// equivocado en el arranque del kiosco.
aplicarTema(leerTemaGuardado())
aplicarLuz(resolverLuz(leerModoLuz(new Date()), new Date()))
const parametros = new URLSearchParams(location.search)
aplicarRendimiento(parametros.get('rendimiento') === 'reducido')
// Por defecto encendidas: ver aplicarMovimiento. Con ?movimiento=sistema
// se vuelve a obedecer la preferencia del sistema operativo.
aplicarMovimiento(parametros.get('movimiento') !== 'sistema')

const raiz = document.getElementById('raiz')
if (!raiz) throw new Error('Falta el elemento #raiz en index.html')

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
