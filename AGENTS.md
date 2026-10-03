## Qué es esto

"Diario de Estudio": una web estática y sin dependencias para registrar sesiones
de estudio y seguir una racha de días. **No hay build, ni gestor de paquetes, ni
servidor, ni tests.**

## Restricciones duras (no romper)

- Exactamente tres archivos: `index.html`, `styles.css` y `app.js`. No añadas un
  cuarto archivo, ni `package.json`, ni un bundler, ni librerías, frameworks o
  scripts por CDN.
- Todo debe seguir funcionando al abrir `index.html` con doble clic (`file://`).
  Nada de `fetch`, ni `import` de módulos, ni rutas que dependan de un servidor.
- Todos los textos de la interfaz están en español.

## Ejecutar y verificar cambios

- Abre `C:\MyStudyDiary\index.html` en el navegador (o `Start-Process index.html`).
  No hay nada que instalar ni compilar.
- No existe ningún test automático. Para probar la lógica pura de `app.js`
  (`calcularRacha`, `formatearFecha`, ...) sin navegador, ejecútala en Node con un
  stub mínimo de `document` y `localStorage` usando el módulo `vm`. Ojo: el código
  de DOM se ejecuta al cargar, así que los stubs deben existir antes de
  `runInContext`.

## Modelo de datos y trampas

- Las sesiones se guardan en `localStorage` bajo la clave `diarioDeEstudio` como
  un array de `{ fecha, tema, minutos }`, donde `fecha` es una fecha local en
  texto `"YYYY-MM-DD"`.
- **Las fechas deben ser siempre locales, nunca UTC.** Construye y descompón las
  fechas con `getFullYear` / `getMonth` / `getDate` (`aClaveFecha`), y parsea las
  claves con `new Date(año, mes - 1, dia)`. Nunca uses `toISOString()` ni
  `new Date("YYYY-MM-DD")`: ambos desplazan el día según la zona horaria.
- Regla de la racha (`calcularRacha`): cuenta los días consecutivos con al menos
  una sesión que terminan hoy; si hoy no hay ninguna pero ayer sí, la racha sigue
  viva y se cuenta desde ayer. Lista vacía => 0.
- Las sesiones se guardan con la más nueva primero (`unshift`) y se muestran con
  un `sort` estable por `fecha` descendente.

## Lint

- Trunk está configurado en `.trunk/trunk.yaml` (prettier + markdownlint,
  `node@22.16.0`). El CLI de Trunk **no** está instalado en el PATH y no hay git
  hooks instalados, así que `trunk check` / `trunk fmt` solo funcionan si se
  instala.
- Se aplican los valores por defecto de prettier (indentación de 2 espacios,
  comillas dobles, punto y coma). Sigue el estilo de los archivos existentes.
