# Verificación de PRAM

Fecha: 21 de septiembre de 2026.

## Pruebas completadas

| Área | Resultado observado |
|---|---|
| Sintaxis y archivos | JavaScript válido; ocho páginas, 138 identificadores sin duplicados por página, un título principal por página y destinos internos y recursos locales presentes. |
| Escritorio | Portada inspeccionada a 1280 px de ancho. Sin desbordamiento horizontal del documento. |
| Móvil | Vista integrada con un área útil de 374 px. Portada, protocolos, menú y seguimiento inspeccionados; ancho del documento igual al disponible. Las pestañas tienen desplazamiento propio. |
| Navegación | Menú móvil abre y cierra al seleccionar un destino. Pestañas de herramientas responden a flechas del teclado. |
| Ejemplo ficticio | Cinco evaluaciones producen promedio 4,2; dos casos con uno resuelto producen 50%. |
| Evaluaciones | Al añadir una nota 5, el total pasa a seis y el promedio a 4,3. |
| Protocolos | Cambio de protocolo, lista de verificación, responsable y compromiso guardados. Se mantienen tras recargar. |
| Reclamos | Caso creado con folio, responsable y fecha. Búsqueda por responsable devuelve el caso esperado. |
| Cierre de casos | Se impide resolver un caso sin describir una solución. Al registrar la solución se actualizan estado, historial y panel. Dos resueltos de tres muestran 67% redondeado. |
| Persistencia | Evaluaciones, casos y protocolos recuperados al recargar. |
| Ideas | Propuesta agregada, prioridad seleccionada y filtro Organización con dos propuestas base. |
| Experiencias | Comentario agregado; una cadena con etiquetas HTML se muestra como texto y no crea elementos ejecutables. |
| Fotografías | Archivo PNG cargado y mostrado correctamente en el muro local. |
| Galería | Cambio de fotografía y actualización de contador; recurso cargado correctamente. |
| CSV | Archivo descargado y leído: tres registros de prueba, con 12 columnas. |
| Respaldo | JSON descargado y leído, con evaluaciones, casos y experiencias de la prueba. |
| Guía | Protocolo descargado en TXT con título, responsable, compromiso y pasos. |
| Vista móvil | Una evaluación guardada en el marco móvil actualiza el panel de la página principal. |
| Borrado | Cancelar conserva los datos; confirmar borra la demo. Tras recargar, los contadores quedan vacíos. |
| Consola | Sin errores ni advertencias de la aplicación durante los flujos inspeccionados. |
| Páginas independientes | Bienvenida, menú, proyecto, protocolos, herramientas, ideas, caso IsiMiya y carta cargan correctamente. |
| Carta separada | Cuatro categorías y 32 opciones conservadas; navegación propia por categoría. |
| Enlaces entre funciones | Desde registrar un reclamo se abre el protocolo de reclamos seleccionado en su página. |
| Datos entre páginas | Las ideas priorizadas y los protocolos marcados sobreviven al cambio de página y a la recarga. |
| Bienvenida y menú móvil | Portada y menú inspeccionados en el marco móvil de 374 px; el botón de entrada navega al menú independiente. |

Los registros de las pruebas se eliminaron de la vista entregada. El visitante puede cargar nuevos ejemplos con el botón de la feria.

## Rendimiento y mantenimiento

Las cinco fotos pasan de aproximadamente 20 MB a 2,35 MB, una reducción cercana al 88%. Se conserva el contenido visual; se usa WebP y carga diferida fuera de la portada. La web no depende de bibliotecas, servicios de fuentes ni CDNs.

## Alcance de la verificación

Pruebas realizadas en el navegador integrado de Codex. No se ha realizado una auditoría formal de accesibilidad ni una matriz completa de navegadores físicos. El almacenamiento y las descargas pueden tener políticas distintas en cada navegador.

Repositorio público: https://github.com/matias05090-prog/pram-feria-tp

Web pública: https://matias05090-prog.github.io/pram-feria-tp/

El workflow de publicación completó correctamente los trabajos de verificación y despliegue: https://github.com/matias05090-prog/pram-feria-tp/actions/runs/35669716584

GitHub Pages confirmó «Your site is live» y la bienvenida se abrió correctamente desde la dirección pública. La publicación no altera el alcance de los formularios: siguen guardando los datos en el navegador de cada visitante.
