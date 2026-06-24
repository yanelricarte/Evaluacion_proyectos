# Evaluación de Proyectos

Material didáctico de la materia **Evaluación de Proyectos** (7.º año, orientación informática). Cada carpeta es una página web estática (HTML + CSS + JS, sin frameworks) pensada para proyectarse en TV de aula y servir de recurso de clase.

## Estructura

### Unidad 1 — Calidad, pruebas y evaluación

| Carpeta | Tema | Slides / secciones |
|---|---|---|
| [clase-1/](clase-1/) | Presentación de la materia e introducción a la calidad: atributos, matriz de evaluación ponderada en vivo, mapa anual y registro para la carpeta (glosario "definí con tus palabras") | 26 slides |
| [clase-2-3-calidad-software/](clase-2-3-calidad-software/) | Calidad del software (QA/QC, V&V, criterios omisión/excedente/incorrecto, atributos, métricas) y registro para la carpeta (síntesis cloze) | 21 slides (19 base + 2 del TP2 en modo `?presencial`) |
| [clase-4-5-casos-prueba/](clase-4-5-casos-prueba/) | Diseño de casos de prueba (clases de equivalencia, valores límite, conjetura de errores) y registro para la carpeta (ficha de caso de prueba) | 20 slides |
| [clase-6-instrumentos-evaluacion/](clase-6-instrumentos-evaluacion/) | Instrumentos de evaluación (lista de cotejo, escala de valoración, rúbrica analítica) y registro para la carpeta (tabla "¿qué instrumento uso?") | 35 slides |
| [clase-7-cierre-unidad/](clase-7-cierre-unidad/) | Cierre integrador de la unidad: repaso, mapa conceptual, esquema de 7 pasos, auto-test, registro para la carpeta, metacognición y lanzamiento de la actividad integradora | 22 slides |
| [actividad-integradora/](actividad-integradora/) | Actividad integradora de cierre — escenario único "App de Reservas de Canchas" | 5 pasos |

> La actividad integradora es **viva**: se actualiza cuando se agregan conceptos a las clases de la unidad. Cuando empiece la Unidad 2, va a tener su propia carpeta `actividad-integradora-…`.

### Unidad 2 — Evaluaciones integrales: top-down y benchmarking

| Carpeta | Tema | Slides / secciones |
|---|---|---|
| [clase-8-sistemas-integrales/](clase-8-sistemas-integrales/) | Apertura de la Unidad 2: el sistema como pila de capas (hardware, firmware, software), distintos grados de integración (baja/media/alta) y por qué importan para evaluar. Checkpoint "ubicá la capa" y registro para la carpeta en formato **diagrama de capas** (dibujo a mano) | 11 slides |
| [actividad-clase-8-capas/](actividad-clase-8-capas/) | Trabajo en clase autocorregible "Diagnóstico por capas": diagnosticar en qué capa se origina cada problema y clasificar grados de integración. Cierra con un registro para la carpeta (ejemplo resuelto revelable). No se entrega | 3 partes |
| [clase-9-metodologia-top-down/](clase-9-metodologia-top-down/) | Metodología top-down: evaluar de lo general a lo particular (del propósito del todo a los componentes, sin perder la mirada del conjunto). Cuatro pasos, contraste con bottom-up, caso aplicado, checkpoint "pensá en top-down", registro para la carpeta y lanzamiento del **Trabajo Práctico N°4** (evaluación comparativa, en Drive) | 12 slides |
| [actividad-clase-9-top-down/](actividad-clase-9-top-down/) | Trabajo en clase autocorregible "Evaluar con top-down": ubicar cada acción en su paso del top-down y reconocer en qué capa aterriza el diagnóstico (repaso de la clase 8). Cierra con un registro para la carpeta (ejemplo resuelto revelable). No se entrega | 3 partes |
| Material teórico (Google Doc) | Documento teórico de lectura de la unidad (registro formal): capas HW/FW/SW, grados de integración, metodología top-down, benchmarking e informe comparativo de integración. Vive en Drive y se enlaza desde la clase 8 y el inicio | [Doc](https://docs.google.com/document/d/1NsyrpHWfdMPt8uk5dMQejW4oBFA1zizWS-5RNiPhC7M/edit) |

> Próximas clases de la unidad (en preparación): benchmarking (qué mide, herramientas, protocolo reproducible); informe comparativo de integración HW/FW/SW.

Cada carpeta incluye:

- `index.html` — contenido principal.
- `styles.css` — estilos (sistema de diseño compartido).
- `script.js` — interacción, persistencia y modo pantalla completa.

## Características

**Interactividad con feedback explicativo.** Cada respuesta dispara una explicación pensada para conversar en clase.

- Checkpoints de opción múltiple (Clase 2-3 y 4-5).
- Tarjetas Verdadero/Falso validadoras (Clase 6).
- Clasificación de problemas en doble eje (actividad integradora).
- Producción libre con feedback heurístico que detecta verbos observables vs. palabras vagas.

**Modo "Pantalla completa".** Un botón con SVG en la esquina (o tecla `F`) oculta la navegación y maximiza el navegador para proyección limpia. Salida con `Esc`.

**Persistencia.** Cada clase recuerda en `localStorage` la última slide vista y las respuestas de los ejercicios. Refrescar no pierde progreso.

**Diseño común.** Paleta fucsia + grises, tipografías **Inter** (cuerpo) y **Manrope** (títulos). Tamaños calibrados con `clamp()` para que se lean bien tanto en notebook como proyectados en TV de 50–65".

## Cómo visualizar

Abrir cualquier `index.html` directamente, o servir la raíz del repo con cualquier servidor estático:

```bash
python3 -m http.server 8000
# luego abrir http://localhost:8000/
```

La página de inicio (`index.html` raíz) funciona como landing y enlaza a cada clase.

## Atajos de teclado (en las presentaciones)

| Tecla | Acción |
|---|---|
| `←` / `PageUp` | Slide anterior |
| `→` / `PageDown` / `Espacio` | Slide siguiente |
| `F` | Pantalla completa (entrar/salir) |
| `Esc` | Salir de pantalla completa |

## Publicación

El sitio se publica con **GitHub Pages** desde la rama `main` (carpeta raíz). Las carpetas usan kebab-case sin espacios ni dos puntos para que las URLs queden limpias.
