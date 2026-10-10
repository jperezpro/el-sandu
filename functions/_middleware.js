// Redireccion del dominio viejo. El sitio paso del proyecto de Pages
// `el-sandu` (el-sandu.pages.dev) al proyecto `elsandu` (elsandu.pages.dev)
// el 10/10/2026: el nombre de un proyecto no se cambia. El proyecto viejo
// sigue conectado a este repo y publica este mismo codigo, asi que cada pedido
// a su dominio cae aca y va a la misma pagina en elsandu.pages.dev con un 301.
// En el proyecto nuevo el dominio no coincide y todo pasa. Ver README, "Deploy".
const VIEJOS = new Set(['el-sandu.pages.dev']);
const NUEVO = 'elsandu.pages.dev';

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (!VIEJOS.has(url.hostname)) return next();
  url.protocol = 'https:';
  url.hostname = NUEVO;
  url.port = '';
  return Response.redirect(url.toString(), 301);
}
