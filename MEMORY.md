# MEMORY.md — Diario de Estudio 
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no 
aporte. 
## Estado actual 
- v1 funcionando: registrar sesiones (fecha, tema, minutos), racha actual, mejor racha,
resumen (minutos de la semana y días estudiados del mes) y lista de sesiones. 
- Datos en localStorage (clave `diarioDeEstudio`). 

## Aprendizajes y errores a evitar 
- AGENTS.md describía una clave y unos campos (`diario-estudio-sesiones`, `{date, topic,
minutes}`) que no coincidían con el código real (`diarioDeEstudio`, `{fecha, tema,
minutos}`). Comprobar el código antes de fiarse de la documentación.

## Decisiones (y por qué) 
- Sin backend ni dependencias: cualquiera debe poder abrirlo con doble clic. 
- Fecha editable en el formulario: permite registrar días pasados y ver la racha crecer.
- Mejor racha = máximo histórico de días consecutivos, incluyendo la actual; puede mostrar 
el mismo número que la racha actual. Se excluyen las fechas futuras.
- Se corrigió AGENTS.md al formato de datos real en vez de migrar lo guardado, para no 
arriesgar las sesiones existentes.
- Minutos de la semana: la semana empieza en lunes y se suma desde el lunes hasta hoy. El 
total se muestra como "X min" y añade "(X h Y min)" cuando pasa de 60.
- Días del mes: se cuentan días distintos (varias sesiones el mismo día suman 1) desde el 
día 1 hasta hoy. Se muestra en una segunda fila dentro de la tarjeta de resumen.

## Próximos pasos 
- (vacío por ahora)