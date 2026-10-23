# El Sandu

Sitio de El Sandu, casa de alquiler en Santa Ana, Uruguay. Estatico, una sola
pagina: inicio con foto del dron, tour 360 incrustado, la casa en fotos, ubicacion,
tarifas y consulta por WhatsApp. Renovado en octubre de 2026 (en produccion desde el
23/10/2026).

## Ojo: hay dos sitios distintos

| URL | Quien la controla | Que sirve |
|---|---|---|
| **elsandu.pages.dev** | Nosotros (Cloudflare Pages) | Lo que hay en este repo. Es la del portfolio. |
| elsandu.com | El cliente, en Hostinger | No anda (ver abajo). **No la actualizamos.** |

Hoy no hay mantenimiento contratado con el cliente: la renovacion se hizo para
proponerselo. `elsandu.com` esta en Hostinger y no tenemos acceso: **los cambios de
este repo no llegan ahi**. El dominio esta pago hasta el 13/10/2028, pero desde octubre
de 2026 sus DNS apuntan a `dns-parking.com` (https no conecta, http da 403); se recupera
apuntandolo a Cloudflare Pages. Mientras tanto el canonical, Open Graph, JSON-LD,
sitemap y robots apuntan a `elsandu.pages.dev`.

## Deploy

Cloudflare Pages, proyecto `elsandu`. **Push a `main` despliega solo.** Cada otra rama
se publica aparte en `<rama>.elsandu.pages.dev`, con `noindex`: sirve de vista previa.
El proyecto no tiene dominios personalizados.

Hasta el 10/10/2026 el proyecto era `el-sandu` (`el-sandu.pages.dev`). El
nombre de un proyecto de Pages no se cambia, por eso se creo `elsandu`. El
proyecto viejo sigue conectado a este repo y publica el mismo codigo:
`functions/_middleware.js` manda con un 301 cada pedido a `el-sandu.pages.dev`
a la misma pagina en `elsandu.pages.dev`. `_routes.json` deja `assets/` fuera
de esa Function.

## Como esta armado

- **Inicio:** foto del dron (`assets/inicio/portada-pc.webp`, y un recorte 4:5 para el
  celular). El video en buena calidad (`dron-pc.mp4` / `dron-celu.mp4`, 7-9 MB) se abre en
  una ventana y se baja solo si tocan "Ver la casa desde el aire".
- **Tour 360:** `tours.tourvirtual360.pro/el-sandu/` (repo `tours-360`). La portada es una franja
  panoramica del jardin (`assets/tour/jardin-360.webp`, 222° de la foto 360, sin el muro del
  vecino) que mira de un lado al otro, con un icono de 360°. El iframe se crea al tocarla, con
  `allow` para giroscopio y pantalla completa.
- **La casa:** tres tarjetas con fotos propias mas gran angular (`assets/espacios/`; el living
  tiene una panoramica para la PC y otra vertical para el celular).
- **Cada rincon:** una foto por ambiente (`assets/ambientes/` y su miniatura en `thumbs/`, mismo
  nombre), sacadas de las fotos 360 del rodaje del 21/10/2026: son las que muestran la casa como
  esta hoy. Estilo camara de accion: gran angular de 135-140° con algo de ojo de pez y la camara
  un poco hacia arriba. La grilla muestra la miniatura y la foto grande se baja recien al abrirla.
  Las fotos viejas de `assets/Fotos/` ya no se usan (la casa cambio): no volver a ponerlas.
- **Ubicacion:** `assets/inicio/costa.webp` es un cuadro del video de dron del Viejo Rancho
  (rodaje del 04/10/2026, clip 0011, segundo 70), a un par de cuadras: el monte llegando a la playa.
- **Reserva:** el formulario arma el mensaje y abre WhatsApp al +598 99 204 321, con el texto
  escrito; la persona lo envia. Se sacaron el Google Calendar (mostraba citas personales del
  dueno) y el Google Form.
- **Diseno:** estilo Apple: fondos blanco, gris #f5f5f7 y negro; titulos en degrade (atardecer
  sobre negro, cielo en Comodidades, madera, bosque y mar, verano), botones de vidrio esmerilado y
  tarjetas de 28 px. Sin emojis. Lora + Inter.
- **Estilos:** Tailwind compilado en `assets/estilos.css` (antes `cdn.tailwindcss.com`).
  Despues de cambiar clases en `index.html` o `script.js`, desde la raiz:
  `npx tailwindcss@3.4.17 -c herramientas/tailwind.config.js -i herramientas/entrada.css -o assets/estilos.css --minify`
- **Analytics:** GA4 (`G-BDHW2TW4R4`) va en el HTML y se carga solo en `elsandu.pages.dev` /
  `elsandu.com`, despues de la carga: las vistas previas no ensucian las metricas. El QA semanal
  de `browser-automation` busca ese ID en el HTML.
- **iPhone:** el campo de fecha de Safari tiene un ancho minimo propio y se salia del
  formulario; `entrada.css` le saca la apariencia nativa.

## Mantenimiento

- Tarifas: seccion `#tarifas` de `index.html` (titulo "Verano 2027").
- Fotos en `.webp`; los `alt` describen la casa, no el nombre del archivo.

Local: servidor `el-sandu` de `.claude/launch.json` (`http://localhost:8364`).
