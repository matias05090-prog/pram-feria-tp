# PRAM · Feria TP

**Procesos de Resolución Administrativa y Mejora.** Proyecto educativo para fortalecer la atención al cliente en las pymes, con una propuesta de aplicación futura en Sushi IsiMiya.

## Abrir la web

Abre `index.html` en un navegador moderno. Conserva `styles.css`, `app.js` y la carpeta `assets` junto al archivo. Todo el contenido y las herramientas funcionan sin dependencias externas. Solo los enlaces de contacto requieren Internet.

Para una dirección local estable y un guardado consistente, si tienes Node.js instalado:

```sh
npm start
```

Abre `http://127.0.0.1:4173`. El servidor escucha únicamente en este equipo. No hace falta ejecutar `npm install`.

## Qué incluye

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

Base: `PRAM-atencion-clientes-v5.html` y `PRAM-atencion`, entregados por el equipo. La variante v6 disponible en Descargas era una portada con enlaces a otra página; esta versión integra directamente presentación y herramientas para evitar pasos y destinos faltantes.

Las 15 respuestas y los porcentajes del sondeo son antecedentes declarados en la versión original, sin verificación independiente. Las metas de +20%, −15% y +30% son propuestas pendientes de línea base e implementación. Los precios de IsiMiya se conservan como referencia y requieren confirmación por el negocio. No se presentan como precios vigentes verificados.

Las fotografías originales se han convertido a WebP para reducir el peso sin alterar su contenido. El logo se conserva como fue suministrado. Los nombres y canales de contacto corresponden al material original. Se retiró el enlace de Instagram sin destino.

## Integración con GitHub

La carpeta de trabajo incluye control de versiones local y un workflow en `.github/workflows/pages.yml` para verificar recursos y publicar en GitHub Pages. El ZIP contiene el código y la configuración, sin el historial `.git`. La configuración remota se debe comprobar en la cuenta del titular; incluir este archivo por sí solo no publica la página.

1. Iniciar sesión en [GitHub](https://github.com/login).
2. Crear un repositorio llamado `pram-feria-tp`, o elegir uno existente destinado a este proyecto. Para guardar el código sin publicarlo puede ser privado. GitHub Pages con GitHub Free requiere un repositorio público; en planes compatibles puede usar repositorios privados.
3. Subir el contenido de esta carpeta a la raíz del repositorio, incluida `.github`. No subir el ZIP ni datos exportados de visitantes.
4. Para publicarlo, abrir **Settings → Pages → Build and deployment → Source → GitHub Actions**. El sitio web publicado será accesible según la configuración de Pages. Revisar los contactos y el contenido antes de hacerlo público.
5. Ejecutar el workflow **Verificar y publicar PRAM** desde **Actions**, o subir un cambio a `main`.
6. Esperar el resultado correcto del despliegue; la dirección real aparecerá en **Settings → Pages** y en el workflow. No considerar publicado el sitio hasta confirmar ese resultado.

Si trabajas desde el ZIP y quieres usar Git, inicialízalo primero con `git init -b main`, `git add .` y `git commit -m "Iniciar PRAM"`. Git puede pedirte configurar tu nombre y correo de autor. La carpeta de trabajo ya tiene un commit local identificado como Equipo PRAM.

Si ya tienes Git configurado y un repositorio remoto vacío, desde esta carpeta:

```sh
git remote add origin https://github.com/TU-USUARIO/pram-feria-tp.git
git push -u origin main
```

Reemplaza `TU-USUARIO` por el titular y usa el inicio de sesión normal de GitHub. No pongas contraseñas o tokens en los archivos del proyecto. Si el repositorio remoto ya contiene archivos, integra sus cambios antes de subir; no uses `--force`.

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
