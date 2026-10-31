# Interfaz de la pantalla

React + TypeScript sobre Vite. El objetivo de rendimiento es la **Raspberry Pi 3 con 1 GB de RAM**, a **1024 × 600**: todo lo que se agregue acá se paga ahí.

## Correrlo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # estáticos en dist/
npm run typecheck
```

## Cómo está organizado

```text
src/
├── estilos/
│   ├── tokens.css   Las variables de los dos temas. El contrato visual.
│   └── base.css     Puesta a cero, superficies y animaciones ambientales.
├── temas/
│   ├── tema.ts      Leer, guardar y aplicar el tema y el modo de rendimiento.
│   └── usarTema.ts  El hook de React.
├── App.tsx          Banco de pruebas de tokens (se reemplaza en F1.4).
└── main.tsx
```

## Las dos reglas

**1. Ningún color, radio ni sombra escrito a mano en un componente.** Todo sale de `tokens.css`. El tema es una preferencia por hogar —la casa principal puede usar Lavanda y la de la madre Menta—, así que un literal incrustado rompe el cambio de tema. Si hace falta un valor que no existe, se agrega como token a los dos temas.

**2. Todo control es un elemento real.** `<button>`, `<a href>` o `<input>` con su etiqueta, nunca un `div` con manejador de clic. Lo va a usar una persona mayor y tiene que funcionar con lector de pantalla y con teclado.

## Los dos interruptores

| Qué | Cómo | Para qué |
|---|---|---|
| Tema | `data-tema="lavanda" \| "menta"` en `<html>` | Preferencia del hogar |
| Rendimiento | `data-rendimiento="reducido"` en `<html>` | Si la Pi 3 no rinde: cambia el vidrio por color sólido y apaga las animaciones ambientales |

El de rendimiento se puede forzar con `?rendimiento=reducido` en la URL para compararlos sin recompilar. **La decisión se toma con los números de F1.10, no por impresión.**

## Tipografía

Plus Jakarta Sans va empaquetada con `@fontsource`, **solo el subconjunto latino**. No se trae de internet: la pantalla tiene que pintarse aunque la conexión esté caída, y cada archivo de más es una petición más en el arranque del kiosco.
