// El Sandú: menú, video del inicio, tour 360, galería con lightbox, calendario y consulta por WhatsApp.
// Todo lo pesado (video, tour, calendario, fotos viejas) se carga recién cuando hace falta.
(function () {
    var WHATSAPP = '59899204321';
    var PRODUCCION = ['elsandu.pages.dev', 'elsandu.com', 'www.elsandu.com'];

    // Menú del celular
    var botonMenu = document.getElementById('boton-menu');
    var menu = document.getElementById('menu');
    botonMenu.addEventListener('click', function () {
        var abierto = menu.classList.toggle('hidden') === false;
        botonMenu.setAttribute('aria-expanded', String(abierto));
    });
    menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { menu.classList.add('hidden'); });
    });

    // El encabezado es transparente sobre el video y se pone blanco al bajar.
    var header = document.getElementById('header');
    function encabezado() { header.classList.toggle('solido', window.scrollY > 40); }
    window.addEventListener('scroll', encabezado, { passive: true });
    encabezado();

    // Video del dron: el vertical en el celular parado, el horizontal en la PC. Arranca después de
    // que cargó la página, para no competir con la portada; con "ahorro de datos" no se baja.
    window.addEventListener('load', function () {
        var video = document.getElementById('video-inicio');
        var ahorro = navigator.connection && navigator.connection.saveData;
        if (!video || ahorro) return;
        var vertical = window.matchMedia('(orientation: portrait)').matches;
        video.src = 'assets/inicio/' + (vertical ? 'dron-celu.mp4' : 'dron-pc.mp4');
        video.addEventListener('playing', function () { video.classList.remove('opacity-0'); }, { once: true });
        var intento = video.play();
        if (intento && intento.catch) intento.catch(function () {});
    });

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

    // Fotos viejas: se bajan recién al tocar "Ver más fotos".
    var verMas = document.getElementById('ver-mas');
    var masFotos = document.getElementById('mas-fotos');
    verMas.addEventListener('click', function () {
        masFotos.querySelectorAll('img[data-src]').forEach(function (img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
        masFotos.classList.remove('hidden');
        verMas.remove();
    });

    // Lightbox para las dos galerías: la foto grande se baja al abrirla, más sus dos vecinas.
    var fotos = Array.prototype.slice.call(document.querySelectorAll('.foto'));
    var lightbox = document.getElementById('lightbox');
    var imagen = document.getElementById('lightbox-imagen');
    var texto = document.getElementById('lightbox-texto');
    var actual = 0;
    function visibles() { return fotos.filter(function (f) { return f.offsetParent !== null; }); }
    function mostrar(i) {
        var lista = visibles();
        actual = (i + lista.length) % lista.length;
        var f = lista[actual];
        imagen.src = f.dataset.full;
        imagen.alt = (f.querySelector('img') || f).alt || '';
        texto.textContent = f.dataset.texto || '';
        [actual - 1, actual + 1].forEach(function (j) { new Image().src = lista[(j + lista.length) % lista.length].dataset.full; });
    }
    fotos.forEach(function (f) {
        f.addEventListener('click', function () {
            mostrar(visibles().indexOf(f));
            lightbox.classList.add('active');
        });
    });
    function cerrar() { lightbox.classList.remove('active'); }
    document.getElementById('lightbox-cerrar').addEventListener('click', cerrar);
    document.getElementById('lightbox-anterior').addEventListener('click', function () { mostrar(actual - 1); });
    document.getElementById('lightbox-siguiente').addEventListener('click', function () { mostrar(actual + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) cerrar(); });
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') cerrar();
        if (e.key === 'ArrowLeft') mostrar(actual - 1);
        if (e.key === 'ArrowRight') mostrar(actual + 1);
    });
    // Deslizar con el dedo en el celular
    var x0 = null;
    lightbox.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
        x0 = null;
    });

    // Calendario de disponibilidad (Google Calendar público de la casa), al tocarlo.
    document.getElementById('ver-calendario').addEventListener('click', function () {
        var iframe = document.createElement('iframe');
        iframe.src = 'https://calendar.google.com/calendar/embed?height=420&wkst=2&hl=es&ctz=America%2FMontevideo&showPrint=0&showCalendars=0&title=Disponibilidad&showTitle=0&showTabs=0&src=ZWxzYW5kdXNhbnRhYW5hQGdtYWlsLmNvbQ&src=ZXMtNDE5LnV5I2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039be5&color=%230b8043';
        iframe.title = 'Calendario de disponibilidad de El Sandú';
        iframe.className = 'w-full border-0';
        iframe.height = 420;
        document.getElementById('calendario').replaceChildren(iframe);
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
    // La salida no puede ser antes de la llegada.
    consulta.llegada.addEventListener('change', function () { consulta.salida.min = consulta.llegada.value; });
    consulta.llegada.min = consulta.salida.min = new Date().toISOString().slice(0, 10);

    // Google Analytics solo en el sitio publicado (no en las vistas previas), y después de cargar.
    if (PRODUCCION.indexOf(location.hostname) >= 0) {
        window.addEventListener('load', function () {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () { dataLayer.push(arguments); };
            gtag('js', new Date());
            gtag('config', 'G-BDHW2TW4R4');
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.googletagmanager.com/gtag/js?id=G-BDHW2TW4R4';
            document.head.appendChild(s);
        });
    }
})();
