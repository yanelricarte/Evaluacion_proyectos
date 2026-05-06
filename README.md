# Evaluación de Proyectos

Repositorio con materiales y presentaciones web de la materia **Evaluación de Proyectos**, organizados por clase. Cada carpeta contiene una página estática (HTML + CSS + JS) que sirve como recurso visual para el dictado de la unidad correspondiente.

## Estructura

| Carpeta | Tema | Unidad |
|---|---|---|
| [clase-2-3-calidad-software/](clase-2-3-calidad-software/) | Calidad del Software · Presentación | Unidad 1 |
| [clase-4-5-casos-prueba/](clase-4-5-casos-prueba/) | Diseño de Casos de Prueba | Unidad 1 |
| [clase-6-instrumentos-evaluacion/](clase-6-instrumentos-evaluacion/) | Instrumentos de evaluación en proyectos tecnológicos | Unidad 1 |
| [actividad-integradora/](actividad-integradora/) | Actividad integradora · cierre de unidad | Unidad 1 |

Cada carpeta de clase incluye:

- `index.html` — contenido principal de la presentación.
- `styles.css` — estilos.
- `script.js` — interacción y navegación.

## Cómo visualizar

Abrir el `index.html` de la clase deseada directamente en el navegador, o servir la carpeta con un servidor estático local:

```bash
# desde la raíz del repo
python3 -m http.server 8000
# luego abrir http://localhost:8000/
```

## Publicación

El sitio se publica con **GitHub Pages** desde la rama `main` (carpeta raíz). La página principal (`index.html`) funciona como landing con links a cada clase.
