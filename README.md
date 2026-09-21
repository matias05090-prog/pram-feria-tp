# PRAM · Feria TP

**Procesos de Resolución Administrativa y Mejora.** Proyecto educativo para fortalecer la atención al cliente en las pymes, con una propuesta de aplicación futura en Sushi IsiMiya.

## Abrir la web

Abre `index.html` en un navegador moderno. Conserva las ocho páginas HTML, `styles.css`, `app.js` y la carpeta `assets` juntas. Todo el contenido y las herramientas funcionan sin dependencias externas. Solo los enlaces de contacto requieren Internet.

Para una dirección local estable y un guardado consistente, si tienes Node.js instalado:

```sh
npm start
```

Abre `http://127.0.0.1:4173`. El servidor escucha únicamente en este equipo. No hace falta ejecutar `npm install`.

## Qué incluye

Ocho páginas independientes: `index.html` (bienvenida), `menu.html` (accesos), `proyecto.html`, `protocolos.html`, `gestion.html`, `ideas.html`, `isimiya.html` y `carta.html`. La navegación y los enlaces de regreso permiten pasar de una sección a otra. La carta contiene sus cuatro categorías y las 32 opciones del material original.

- Diseño adaptable a móviles, tabletas y computadores, navegación por teclado y soporte de movimiento reducido.
- Tres protocolos: atención, reclamos y seguimiento. Listas de verificación, responsable, compromiso de primera respuesta y descarga en TXT.
- Evaluaciones de 1 a 5 estrellas con canal y comentario.
- Reclamos independientes de la calificación, con folio, responsable, prioridad y fecha de compromiso.
- Seguimiento con búsqueda, filtros, historial y validación de la solución antes de cerrar un caso.
- Panel calculado con los registros de este navegador. La tasa de resolución es casos resueltos / total de casos; no se inventan indicadores de tiempo de respuesta.
- Exportación de casos en CSV compatible con Excel y respaldo completo en JSON.
- Seis propuestas de mejora con primer paso e indicador sugerido, filtros, priorización y nuevas propuestas.
- Muro local de experiencias con fotografía opcional (JPG/PNG/WebP, máximo 1 MB).
- Ejemplo ficticio de feria, activado por el visitante: cinco evaluaciones, dos casos y una experiencia.
- Galería, carta de referencia, logo y equipo conservados del material facilitado.

## Alcance de los datos

Esta versión es una **demostración local**, no un sistema de atención en producción. Usa `localStorage` con la clave `pram-feria-tp-v1`. No tiene cuentas, base de datos compartida, envío de reclamos, correo automático ni moderación remota. GitHub Pages publica archivos estáticos y no convierte estos formularios en un servicio compartido.

Los registros pertenecen al navegador, perfil y dirección usados. Un archivo abierto con `file://`, la vista de localhost y la web publicada pueden tener almacenamientos distintos. Un navegador puede restringir el guardado de archivos locales. Si falla el almacenamiento, se muestra un aviso y se permite descargar los datos de la sesión. Borrar datos del navegador también borra la demo. El respaldo JSON se entrega como archivo legible; esta versión no incorpora restauración por importación.

Usa datos ficticios durante la feria. El botón de borrado solicita confirmación y elimina únicamente los registros locales de PRAM. Los archivos exportados no se suben al repositorio.

## Contenido y fuentes

Base: `PRAM-atencion-clientes-v5.html` y `PRAM-atencion`, entregados por el equipo. La variante v6 disponible en Descargas era una portada con enlaces a otra página; esta versión separa bienvenida, menú, proyecto, protocolos, herramientas, ideas, caso IsiMiya y carta en páginas conectadas entre sí.

Las 15 respuestas y los porcentajes del sondeo son antecedentes declarados en la versión original, sin verificación independiente. Las metas de +20%, −15% y +30% son propuestas pendientes de línea base e implementación. Los precios de IsiMiya se conservan como referencia y requieren confirmación por el negocio. No se presentan como precios vigentes verificados.

Las fotografías originales se han convertido a WebP para reducir el peso sin alterar su contenido. El logo se conserva como fue suministrado. Los nombres y canales de contacto corresponden al material original. Se retiró el enlace de Instagram sin destino.

## Integración con GitHub

**Web publicada:** https://matias05090-prog.github.io/pram-feria-tp/

**Repositorio público:** https://github.com/matias05090-prog/pram-feria-tp

GitHub Pages utiliza **GitHub Actions** como origen de publicación. El workflow `.github/workflows/pages.yml` verifica la sintaxis y los enlaces, prepara las ocho páginas con sus recursos y publica al actualizar `main`. Las pull requests ejecutan la verificación sin publicar. El primer despliegue terminó correctamente.

Para editar, puedes abrir el repositorio y modificar un archivo con el lápiz de GitHub, o clonar el proyecto en un equipo con Git:

```sh
git clone https://github.com/matias05090-prog/pram-feria-tp.git
cd pram-feria-tp
npm run check
```

Después de tus cambios, verifica, crea un commit y sube a `main` con tu sesión habitual de GitHub. Consulta **Actions → Verificar y publicar PRAM** para ver el resultado. No uses `--force` ni subas los respaldos de visitantes. No incluyas contraseñas ni tokens en los archivos.

El ZIP contiene todos los archivos para abrir o editar la web, sin el historial `.git`. La carpeta de trabajo está vinculada al repositorio mediante el remoto `origin`.

Documentación oficial consultada: [workflows de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) y [qué es GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Validación y mantenimiento

```sh
npm run check
```

Comprueba sintaxis de JavaScript, identificadores, enlaces internos y recursos locales. No requiere instalar paquetes. Las pruebas visuales e interactivas realizadas para la entrega están descritas en `VERIFICACION.md`.

No se han instalado bibliotecas nuevas ni se necesitan CDNs, fuentes externas, claves o servicios pagados.

## Equipo

Matías Bustamante · Víctor Sanabria · Ian Arenas · Sabina Huechucoy.

## Próximo paso para un piloto real

Validar el protocolo y los contactos con la pyme; acordar responsables y mediciones; después conectar una base de datos con acceso para el equipo, permisos, respaldo, moderación de experiencias y un canal real de respuesta. La prioridad es probar el proceso con pocos casos y medirlo antes de ampliar las funciones.

