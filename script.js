// El Sandú: menú, video del dron, tour 360, galería con lightbox y consulta por WhatsApp.
// Lo pesado (el video y el tour) se carga recién cuando lo piden.
(function () {
    var WHATSAPP = '59899204321';

    // Menú del celular
    var botonMenu = document.getElementById('boton-menu');
    var menu = document.getElementById('menu');
    botonMenu.addEventListener('click', function () {
        var abierto = menu.classList.toggle('hidden') === false;
        botonMenu.setAttribute('aria-expanded', String(abierto));
        header.classList.toggle('abierto', abierto);
    });
    menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { menu.classList.add('hidden'); header.classList.remove('abierto'); });
    });

    // El encabezado es transparente sobre la foto del inicio y se vuelve sólido al bajar.
    var header = document.getElementById('header');
    function encabezado() { header.classList.toggle('solido', window.scrollY > 40); }
    window.addEventListener('scroll', encabezado, { passive: true });
    encabezado();

    // Video del dron, en buena calidad (7-9 MB): se baja solo si lo abren.
    var modal = document.getElementById('video-modal');
    var video = document.getElementById('video-dron');
    document.getElementById('ver-video').addEventListener('click', function () {
        if (!video.src) {
            var vertical = window.matchMedia('(orientation: portrait)').matches;
            video.src = 'assets/inicio/' + (vertical ? 'dron-celu.mp4' : 'dron-pc.mp4');
        }
        modal.classList.add('active');
        var intento = video.play();
        if (intento && intento.catch) intento.catch(function () {});
        if (window.gtag) gtag('event', 'ver_video_dron');
    });
    function cerrarVideo() { modal.classList.remove('active'); video.pause(); }
    document.getElementById('video-cerrar').addEventListener('click', cerrarVideo);
    modal.addEventListener('click', function (e) { if (e.target === modal) cerrarVideo(); });

    // Tour 360: la portada se cambia por el tour al tocarla. El giroscopio y la pantalla completa
    // necesitan permiso explícito en el iframe.
    var abrirTour = document.getElementById('tour-abrir');
    abrirTour.addEventListener('click', function () {
        var iframe = document.createElement('iframe');
        iframe.src = 'https://tours.tourvirtual360.pro/el-sandu/';
        iframe.title = 'Tour virtual 360 de El Sandú';
        iframe.allow = 'fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking';
        iframe.allowFullscreen = true;
        iframe.className = 'absolute inset-0 w-full h-full border-0';
        abrirTour.replaceWith(iframe);
        if (window.gtag) gtag('event', 'abrir_tour');
    });

    // Lightbox: la foto grande se baja al abrirla, más sus dos vecinas.
    var fotos = Array.prototype.slice.call(document.querySelectorAll('#galeria .foto'));
    var lightbox = document.getElementById('lightbox');
    var imagen = document.getElementById('lightbox-imagen');
    var texto = document.getElementById('lightbox-texto');
    var actual = 0;
    function mostrar(i) {
        actual = (i + fotos.length) % fotos.length;
        var f = fotos[actual];
        imagen.src = f.dataset.full;
        imagen.alt = f.querySelector('img').alt;
        texto.textContent = f.dataset.texto;
        [actual - 1, actual + 1].forEach(function (j) { new Image().src = fotos[(j + fotos.length) % fotos.length].dataset.full; });
    }
    function abrir(i) { mostrar(i); lightbox.classList.add('active'); }
    fotos.forEach(function (f, i) { f.addEventListener('click', function () { abrir(i); }); });
    // Las tarjetas de "La casa" abren el mismo ambiente en el lightbox.
    document.querySelectorAll('#espacios .tarjeta').forEach(function (t) {
        var full = t.querySelector('.foto').dataset.full;
        t.addEventListener('click', function () {
            abrir(fotos.findIndex(function (g) { return g.dataset.full === full; }));
        });
    });
    function cerrar() { lightbox.classList.remove('active'); }
    document.getElementById('lightbox-cerrar').addEventListener('click', cerrar);
    document.getElementById('lightbox-anterior').addEventListener('click', function () { mostrar(actual - 1); });
    document.getElementById('lightbox-siguiente').addEventListener('click', function () { mostrar(actual + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) cerrar(); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { cerrar(); cerrarVideo(); }
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') mostrar(actual - 1);
        if (e.key === 'ArrowRight') mostrar(actual + 1);
    });
    var x0 = null;  // deslizar con el dedo
    lightbox.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
        x0 = null;
    });

    // Consulta: arma el mensaje y abre WhatsApp con él escrito.
    var consulta = document.getElementById('consulta');
    var avisoFechas = document.getElementById('aviso-fechas');
    function fecha(iso) { var p = iso.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
    consulta.addEventListener('submit', function (e) {
        e.preventDefault();
        var d = new FormData(consulta);
        if (d.get('salida') <= d.get('llegada')) { avisoFechas.classList.remove('hidden'); return; }
        avisoFechas.classList.add('hidden');
        var personas = d.get('personas') === '1' ? '1 persona' : d.get('personas') + ' personas';
        var texto = 'Hola, quería consultar disponibilidad en El Sandú del ' + fecha(d.get('llegada')) + ' al ' + fecha(d.get('salida')) +
            ', somos ' + personas + (d.get('mascotas') ? ' ' + d.get('mascotas') : '') + '. Mi nombre es ' + d.get('nombre').trim() + '.';
        if (d.get('mensaje').trim()) texto += ' ' + d.get('mensaje').trim();
        if (window.gtag) gtag('event', 'consulta_whatsapp');
        window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    });
    consulta.llegada.addEventListener('change', function () { consulta.salida.min = consulta.llegada.value; });
    consulta.llegada.min = consulta.salida.min = new Date().toISOString().slice(0, 10);

    // La barra de WhatsApp del celular se esconde mientras se ve el formulario (ya tiene su botón).
    var barra = document.getElementById('whatsapp-barra');
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entradas) {
            barra.classList.toggle('oculta', entradas[0].isIntersecting);
        }, { threshold: 0.15 }).observe(document.getElementById('reservar'));
    }
})();
