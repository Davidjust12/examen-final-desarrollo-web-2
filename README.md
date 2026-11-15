# Rickflix

Aplicación Angular con TypeScript, componentes standalone, HttpClient y rutas protegidas. Catálogos paginados de episodios y personajes, detalle de personajes y reparto completo de cada episodio. Diseño oscuro adaptable a móviles.

## Ejecutar en Windows PowerShell

```powershell
npm.cmd install
npm.cmd start
```

Abre http://127.0.0.1:4200. Usuario: **admin**. Contraseña: **admin123**.

```powershell
npm.cmd run build
npm.cmd run test:e2e
```

Para las pruebas, deja el servidor iniciado y prepara Chromium con `npx.cmd playwright install chromium` si no está instalado.

El login es una demostración local: guarda la sesión en sessionStorage, persiste al recargar la pestaña y se elimina al cerrar sesión. No representa autenticación de producción. El guard redirige al login y conserva la ruta de destino.

En desarrollo, `proxy.conf.json` reenvía `/api` a la API real para evitar problemas de CORS. La compilación de producción consulta directamente `https://rickandmortyapi.com/api`. Si tu red utiliza certificados de Windows, ejecuta `$env:NODE_USE_SYSTEM_CA='1'` antes de iniciar o compilar.

Los datos y retratos provienen de https://rickandmortyapi.com/api. La API necesita conexión a Internet. Los catálogos usan el parámetro `page` y los metadatos de paginación de la API. Los repartos se consultan por todos sus IDs, independientemente de la paginación del catálogo. Las ilustraciones de portales se dibujan con CSS. No incluye reproducción de video.

Estructura: `src/app/auth.service.ts` (sesión y guard), `api.service.ts` (REST), `routes.ts`, componentes de login, catálogo, detalle y tarjeta de personaje; `src/styles.css` contiene el diseño responsivo.
