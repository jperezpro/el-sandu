# El Sandu

Sitio de El Sandu, casa de alquiler en Santa Ana, Uruguay. Estatico, una sola
pagina con galeria y lightbox.

## Ojo: hay dos sitios distintos

| URL | Quien la controla | Que sirve |
|---|---|---|
| **elsandu.pages.dev** | Nosotros (Cloudflare Pages) | Lo que hay en este repo. Es la del portfolio. |
| elsandu.com | El cliente, en Hostinger | Una version vieja. **No la actualizamos.** |

Ya no trabajamos con este cliente. `elsandu.com` corre en Hostinger y no
tenemos acceso: **los cambios de este repo no llegan ahi**. Desde octubre de
2026 ese dominio no anda (el certificado falla y apunta a servidores de
parking), asi que el canonical, Open Graph, JSON-LD, sitemap y robots apuntan
a `elsandu.pages.dev`. El sitio se mantiene ahi para el portfolio de la web
personal (jperez.pages.dev) y como direccion que se le puede ofrecer al
cliente, sin costo de dominio.

## Deploy

Cloudflare Pages, proyecto `elsandu`. **Push a `main` despliega solo.**
El proyecto no tiene dominios personalizados.

Hasta el 10/10/2026 el proyecto era `el-sandu` (`el-sandu.pages.dev`). El
nombre de un proyecto de Pages no se cambia, por eso se creo `elsandu`. El
proyecto viejo sigue conectado a este repo y publica el mismo codigo:
`functions/_middleware.js` manda con un 301 cada pedido a `el-sandu.pages.dev`
a la misma pagina en `elsandu.pages.dev`. `_routes.json` deja `assets/` fuera
de esa Function.

## Renovacion (rama `renovacion`, octubre 2026)

Vista previa para proponerle a Elkis volver al mantenimiento mensual: Cloudflare Pages
publica cada rama aparte en `renovacion.elsandu.pages.dev` (con `noindex`), sin tocar el
sitio publicado.

- **Inicio:** foto del dron (`assets/inicio/portada-pc.webp`, y un recorte 4:5 para el
  celular). El video en buena calidad (`dron-pc.mp4` / `dron-celu.mp4`, 7-9 MB) se abre en
  una ventana y se baja solo si tocan "Ver la casa desde el aire".
- **Tour 360:** `tours.tourvirtual360.pro/el-sandu/` (repo `tours-360`). La portada es una franja
  panoramica del jardin (`assets/tour/jardin-360.webp`, 222° de la foto 360, sin el muro del
  vecino) que mira de un lado al otro, con un icono de 360°. El iframe se crea al tocarla, con
  `allow` para giroscopio y pantalla completa.
- **Ubicacion:** `assets/inicio/costa.webp` es un cuadro del video de dron del Viejo Rancho
  (rodaje del 04/10/2026, clip 0011, segundo 70), a un par de cuadras: el monte llegando a la playa.
- **Fotos:** solo las del rodaje 360 del 21/10/2026 (`assets/ambientes/`, una por ambiente):
  son las que muestran la casa como esta hoy. Estilo camara de accion: gran angular de 135-140°
  con algo de ojo de pez y la camara un poco hacia arriba. Las de `assets/Fotos/` ya no se usan.
- **Reserva:** el formulario arma el mensaje y abre WhatsApp al +598 99 204 321. Se sacaron
  el Google Calendar (mostraba citas personales) y el Google Form.
- **Diseno:** estilo Apple: fondos blanco, gris #f5f5f7 y negro; titulos con degrade de
  atardecer sobre negro, botones de vidrio esmerilado y tarjetas de 28 px. Sin emojis. Lora + Inter.
- **Estilos:** Tailwind compilado en `assets/estilos.css` (antes `cdn.tailwindcss.com`).
  Despues de cambiar clases en `index.html` o `script.js`, desde la raiz:
  `npx tailwindcss@3.4.17 -c herramientas/tailwind.config.js -i herramientas/entrada.css -o assets/estilos.css --minify`
- **Analytics:** GA4 se carga solo en `elsandu.pages.dev` / `elsandu.com` y despues de la
  carga; las vistas previas no ensucian las metricas.
- Antes de pasar a `main`: sacar el aviso "Vista previa" de Tarifas y cargar las tarifas
  2026-2027.

## Galeria: como funciona (version publicada)

Es la parte delicada del sitio. La grilla muestra **miniaturas**
(`assets/Fotos/thumbs/`, ~1 MB en total) y la foto grande
(`assets/Fotos/`, ~11 MB) se descarga **solo al abrir el lightbox**, mas las
dos vecinas que se precargan para navegar sin saltos.

**No reintroducir un IntersectionObserver que reemplace `src` por `data-src`
al scrollear.** Es lo que habia antes: se llamaba lazy-load, pero bajaba las
34 fotos completas apenas el usuario scrolleaba, aunque nunca abriera una.

`loading="lazy"` y `decoding="async"` estan como respaldo del navegador.

## Mantenimiento

- Al agregar una foto: va la grande en `assets/Fotos/` **y** su miniatura en
  `assets/Fotos/thumbs/`, con el mismo nombre.
- Formato `.webp`. No dejar el `.jpeg` original al lado: se borraron 11
  duplicados que no se usaban (-4,7 MB).
- Los `alt` describen la casa, no el nombre del archivo.

Local: `python -m http.server 8080`
