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

> **Registro para la carpeta:** cada clase cierra con un registro que el estudiante copia **a mano** en su carpeta física. El formato **varía por clase** para ejercitar distintas operaciones cognitivas: glosario con palabras propias (clase 1), síntesis cloze (clases 2-3 y 7), ficha de caso de prueba (clase 4-5) y tabla de selección de instrumento (clase 6). Todos son interactivos (autochequeo + 💡) pero el entregable es el escrito a mano.

Cada carpeta incluye:

- `index.html` — contenido principal.
- `styles.css` — estilos (sistema de diseño compartido).
- `script.js` — interacción, persistencia y modo pantalla completa.

## Características

**Interactividad con feedback explicativo.** Los ejercicios no devuelven solo "correcto/incorrecto": cada respuesta dispara una explicación pensada para conversar en clase. Patrones validados:

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
