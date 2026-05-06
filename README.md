# Evaluación de Proyectos

Material didáctico de la materia **Evaluación de Proyectos** (7.º año, orientación informática). Cada carpeta es una página web estática (HTML + CSS + JS, sin frameworks) pensada para proyectarse en TV de aula y servir de recurso de clase.

## Estructura

### Unidad 1 — Calidad, pruebas y evaluación

| Carpeta | Tema | Slides / secciones |
|---|---|---|
| [clase-2-3-calidad-software/](clase-2-3-calidad-software/) | Calidad del software (QA/QC, V&V, criterios omisión/excedente/incorrecto, atributos, métricas) | 10 slides |
| [clase-4-5-casos-prueba/](clase-4-5-casos-prueba/) | Diseño de casos de prueba (clases de equivalencia, valores límite, conjetura de errores) | 19 slides |
| [clase-6-instrumentos-evaluacion/](clase-6-instrumentos-evaluacion/) | Instrumentos de evaluación (lista de cotejo, escala de valoración, rúbrica analítica) | 34 slides |
| [actividad-integradora/](actividad-integradora/) | Actividad integradora de cierre — escenario único "App de Reservas de Canchas" | 5 pasos |

> La actividad integradora es **viva**: se actualiza cuando se agregan conceptos a las clases de la unidad. Cuando empiece la Unidad 2, va a tener su propia carpeta `actividad-integradora-…`.

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
