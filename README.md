# Exámenes de residencia

Sitio único para los exámenes en línea de la residencia de Psiquiatría (CMN "20 de Noviembre", ISSSTE).
Publicado con GitHub Pages: https://moymaa.github.io/examenes-residencia/

## Estructura

Una carpeta por examen; cada carpeta es autocontenida y conserva su propio backend de Apps Script y su propia hoja de cálculo.

| Carpeta | Examen | Estado |
|---|---|---|
| `genetica/` | Genética en Psiquiatría, Bloque B (sep-2026) | cerrado |
| `tcc/` | Psicoterapia, Módulo 1: Terapia Cognitivo-Conductual (sep-2026) | abierto del 24 al 27 de septiembre |

El proyecto completo de cada examen (banco de reactivos, generadores, backend) vive fuera de este repositorio:

- Genética: `~/Documents/Profesor/Examen Genetica Psiquiatrica 2026/`
- TCC: `~/Documents/Profesor/Examen Psicoterapia TCC 2026/`

## Reglas

- El repositorio es **público** porque GitHub Pages no sirve repositorios privados con el plan actual: las preguntas van como imágenes y, de preferencia, cifradas por caso (llave que solo entrega el backend dentro de la ventana de aplicación, como en `genetica/`).
- La clave de respuestas vive **solo** en el backend de Apps Script, nunca aquí.
- Un examen = su propio proyecto de Apps Script y su propia hoja. El backend es append-only: nunca se borran respuestas de residentes.
- El repositorio original `moymaa/examen-genetica` se conserva como archivo; la aplicación de septiembre sigue resolviendo en su URL antigua.
