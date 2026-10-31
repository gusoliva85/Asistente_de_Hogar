# Liquid AI — qué es y qué nos sirve

**Versión:** 1.0
**Fecha:** 29 de octubre de 2026
**Origen:** el usuario propuso evaluar <https://www.liquid.ai/> como fuente de componentes reutilizables.

---

## 1. Primero, una aclaración necesaria

Liquid AI **no es un repositorio de asistente con voz, reconocimiento y funciones listas para reutilizar**. Esa era la expectativa, y conviene corregirla antes de planificar sobre ella.

**Lo que Liquid AI es:** una empresa que desarrolla **modelos de inteligencia artificial** —los Liquid Foundation Models, o LFM— diseñados específicamente para **ejecutarse dentro de un dispositivo**, no en un centro de datos. Su argumento de venta es baja latencia, privacidad y funcionamiento con hardware limitado.

No vas a encontrar ahí un detector de palabra de activación, ni un motor de reconocimiento de voz, ni una interfaz, ni lógica de asistente. **Lo que vas a encontrar es el cerebro, no el cuerpo.**

Ahora bien: **ese cerebro es exactamente lo que nos sirve, y bastante más de lo que esperaba.**

---

## 2. Qué ofrecen concretamente

Según su propio sitio, llevan publicados 65 modelos con más de 5.300 variantes en Hugging Face y más de 55 millones de descargas. Los relevantes para nosotros:

| Modelo | Tamaño | Para qué sirve acá |
|---|---|---|
| **LFM2.5-2.6B** | 2.600 millones de parámetros | **El candidato principal.** Contexto de 128K, **invocación de herramientas**, pesos abiertos, disponible en GGUF, MLX y ONNX. |
| **LFM2.5-230M** | 230 millones | Clasificación de intenciones, muy liviano. Soportado por llama.cpp, MLX, vLLM, SGLang y ONNX. |
| **LFM2.5-24B-A2B** | 24.000 M, ~2.000 M activos | Mezcla de expertos, publicado el 13 de octubre de 2026. Más capaz, más pesado. Para evaluar más adelante. |
| **LFM2.5-VL-3B** | Visión | Relevante recién en la fase de cámara. |
| **d1 / Open d1** | Modelos de decisión | Mencionan texto, visión y audio. **A investigar**, puede tocar la parte de voz. |

**Ejecución:** compatibles con llama.cpp, MLX, ONNX, CoreML, Ollama, SGLang y vLLM. Es decir, **se corren con herramientas estándar**, sin atarse a un SDK propietario.

---

## 3. Lo que esto cambia para JARVIS

### 3.1 El modelo puede correr en nuestro servidor

Un modelo de 2.600 millones de parámetros, cuantizado en formato GGUF, **entra cómodamente en los 8 GB de RAM y 4 núcleos del VPS de Contabo**. Y tiene invocación de herramientas, que es exactamente lo que nuestra arquitectura necesita: el modelo no toca la base de datos, elige una herramienta del catálogo y el servidor la valida y la ejecuta.

**Qué ganamos si funciona bien:**

| | DeepSeek por API | LFM2.5 local |
|---|---|---|
| Costo por consulta | Se paga por token | **Cero** |
| Datos del hogar | Salen a un tercero | **No salen del servidor** |
| Funciona sin Internet hacia afuera | No | **Sí** |
| Latencia | Depende de la red y del proveedor | Predecible |
| Puede desaparecer o cambiar precios | Sí | No |
| Calidad en conversación abierta | Mayor | Menor |

**El punto de privacidad es el más fuerte.** Nuestra regla más dura es el aislamiento entre hogares. Con un modelo local, los datos de cada casa **nunca salen de nuestro servidor**. Deja de ser una promesa de configuración y pasa a ser una propiedad de la arquitectura.

### 3.2 La arquitectura que propongo: tres niveles

Esto encaja perfecto con el diseño que ya teníamos, que separa reglas de modelo. Queda así:

```text
   Orden hablada
        │
        ▼
┌───────────────────┐
│ 1. REGLAS         │  Comandos simples y emergencias.
│    Deterministas  │  Instantáneo, gratis, 100% confiable.
└─────────┬─────────┘
          │ no coincide
          ▼
┌───────────────────┐
│ 2. MODELO LOCAL   │  LFM2.5 en el VPS.
│    LFM2.5-2.6B    │  Interpreta y elige herramientas.
│                   │  Gratis, privado, sin Internet.
└─────────┬─────────┘
          │ no alcanza
          ▼
┌───────────────────┐
│ 3. MODELO REMOTO  │  DeepSeek por API.
│    DeepSeek       │  Solo conversación abierta y
│                   │  preguntas generales. Se paga.
└───────────────────┘
```

**La mayoría del tráfico real de un asistente doméstico son los dos primeros niveles.** Agregar a la lista, consultar la agenda, prender una luz, poner música: nada de eso necesita un modelo grande. El tercer nivel queda para «contame un cuento» o «¿por qué el cielo es azul?».

**Esto reduce el costo recurrente a casi cero** y hace que el sistema siga siendo útil aunque DeepSeek no exista más.

### 3.3 La capa de proveedor ya estaba prevista

No hay que rehacer nada. La especificación ya pedía un adaptador de proveedor de modelo. **Liquid AI entra como una implementación más de ese adaptador.** Fue una buena decisión de diseño que ahora se cobra sola.

---

## 4. Lo que NO nos sirve

Para que quede claro y no se planifique sobre aire:

- **No reemplaza a Whisper.** El reconocimiento de voz sigue siendo necesario y separado. (Salvo que los modelos de audio de «Open d1» resulten aplicables — a investigar.)
- **No reemplaza a Piper.** La síntesis de voz sigue aparte.
- **No trae palabra de activación.**
- **No trae interfaz, ni lógica de asistente, ni integraciones.**
- **No corre en la Raspberry Pi 3.** Con 1 GB de RAM, ni el modelo de 230M es cómodo. El lugar de estos modelos es el servidor — o un teléfono, ver más abajo.

---

## 5. Licencia — hay que verificarla

Los modelos se publican bajo una licencia propia llamada **lfm1.0**, basada en Apache 2.0. Lo que se reporta:

- Uso académico y de investigación: libre.
- **Uso comercial: permitido para empresas con facturación menor a 10 millones de dólares.** Por encima de eso, hay que contactar a Liquid AI.

**Un proyecto doméstico personal entra sin problema.** Pero las condiciones varían por modelo y los resúmenes que encontré son de terceros, no del texto legal. **Antes de integrarlo hay que leer la ficha del modelo concreto en Hugging Face y la página de licencias de Liquid AI.** Está anotado como pendiente.

---

## 6. Plan de acción

| Cuándo | Qué |
|---|---|
| **Fase 5** | Montar LFM2.5-2.6B en el VPS con llama.cpp y medir: latencia por consulta, calidad en español rioplatense, acierto al elegir herramientas, y consumo de RAM conviviendo con Whisper. |
| **Fase 5** | Comparar contra DeepSeek con las mismas 50 órdenes reales. Decidir con datos, no con entusiasmo. |
| **Fase 5** | Implementar la derivación de tres niveles. |
| Antes de integrar | Leer la licencia del modelo exacto en Hugging Face. |
| A investigar | Qué son los modelos de audio de «Open d1» y si tocan STT o TTS. |
| Más adelante | Evaluar el modelo corriendo en el propio dispositivo, si alguna vez hay hardware que lo aguante. En una Pi 3 con 1 GB no entra. |

**Riesgo principal:** que Whisper y el modelo de lenguaje compitiendo por los mismos 8 GB y 4 núcleos del VPS se estorben. Hay que medir los dos juntos, no por separado. Si no entran, la salida es dejar el modelo local para intenciones simples —con el de 230M, que es minúsculo— y mantener DeepSeek para lo demás.

---

## Fuentes

- [Liquid AI — sitio oficial](https://www.liquid.ai/)
- [Introducing LFM2.5: The Next Generation of On-Device AI](https://www.liquid.ai/blog/introducing-lfm2-5-the-next-generation-of-on-device-ai)
- [LFM2.5-24B-A2B: Built for Fast On-Device Agents](https://www.liquid.ai/blog/lfm2-5-24b-a2b)
- [LFM2.5-2.6B: modelo agéntico on-device con 128K de contexto y pesos abiertos — MarkTechPost](https://www.marktechpost.com/2026/08/06/liquid-ai-lfm2-5-2-6b-on-device-agentic-model/amp/)
- [LFM2.5-230M con soporte llama.cpp, MLX, vLLM, SGLang y ONNX — MarkTechPost](https://www.marktechpost.com/2026/06/27/liquid-ai-ships-lfm2-5-230m-with-llama-cpp-mlx-vllm-sglang-and-onnx-support-for-on-device-inference/)
- [Liquid AI releases on-device foundation model LFM2 — The Robot Report](https://www.therobotreport.com/liquid-ai-releases-on-device-foundation-model-lfm2/)
