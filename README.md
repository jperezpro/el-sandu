# El Sandu

Sitio de El Sandu, casa de alquiler en Santa Ana, Uruguay. Estatico, una sola
pagina con galeria y lightbox.

## Ojo: hay dos sitios distintos

| URL | Quien la controla | Que sirve |
|---|---|---|
| **el-sandu.pages.dev** | Nosotros (Cloudflare Pages) | Lo que hay en este repo. Es la del portfolio. |
| elsandu.com | El cliente, en Hostinger | Una version vieja. **No la actualizamos.** |

Ya no trabajamos con este cliente. `elsandu.com` corre en Hostinger y no
tenemos acceso: **los cambios de este repo no llegan ahi**. El sitio se
mantiene en el subdominio de Pages para el portfolio de la web personal
(web-personal-jperezpro.pages.dev).

## Deploy

Cloudflare Pages, proyecto `el-sandu`. **Push a `main` despliega solo.**
El proyecto no tiene dominios personalizados.

## Galeria: como funciona

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
