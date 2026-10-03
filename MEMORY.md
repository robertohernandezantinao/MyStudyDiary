# MEMORY.md — Diario de Estudio 
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no 
aporte. 
## Estado actual 
- v1 funcionando: registrar sesiones (fecha, tema, minutos), racha actual, mejor racha y 
lista de sesiones. 
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

## Próximos pasos 
- (vacío por ahora)