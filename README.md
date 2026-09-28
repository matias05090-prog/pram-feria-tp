# PRAM

Sitio web estático del proyecto **Procesos de Resolución Administrativa y Mejora**. La versión activa parte del archivo `PRAM-atencion-clientes-v5.html` y se publica como una sola página para que sea sencilla de mantener.

## Ver la página

- Producción en Vercel: se completa en este documento después del primer despliegue.
- Respaldo en GitHub Pages: <https://matias05090-prog.github.io/pram-feria-tp/>
- Repositorio: <https://github.com/matias05090-prog/pram-feria-tp>

Para verla localmente, abre `index.html` o ejecuta:

```sh
npm start
```

Luego visita `http://127.0.0.1:4173`.

## Estructura

```text
index.html          Página completa de PRAM (HTML, estilos y JavaScript)
assets/             Imágenes y favicon
scripts/check.mjs   Verificación de enlaces, recursos y JavaScript
CHANGELOG.md        Resumen legible de versiones
vercel.json         Configuración mínima de Vercel
```

## Forma de trabajo

1. Editar `index.html` y, si corresponde, los archivos de `assets/`.
2. Ejecutar `npm run check`.
3. Crear un commit con un mensaje breve que explique el cambio.
4. Subirlo a `main`. GitHub conserva todo el historial y Vercel publica la versión conectada.

Las versiones multipágina anteriores no se perdieron: siguen disponibles en el historial de Git, hasta el commit `61373ff`.

## Datos

Esta es una demostración estática. Los formularios usan el almacenamiento del navegador; no envían datos a un servidor ni comparten registros entre dispositivos. No guardes contraseñas, datos sensibles ni respaldos de visitantes en el repositorio.

