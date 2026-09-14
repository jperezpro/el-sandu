document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    const navLinks = document.querySelectorAll('#mobile-menu a, #header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                 mobileMenu.classList.add('hidden');
            }
        });
    });

    // La grilla muestra siempre las miniaturas (src). La foto grande (data-src)
    // se descarga recien al abrir el lightbox, no al scrollear: asi la galeria
    // pesa ~1 MB en vez de ~11 MB.


    // Lightbox Gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentIndex = 0;
    // Use data-src for lazy-loaded images, fallback to src
    const imageSources = Array.from(galleryItems).map(item => item.dataset.src || item.src);

    // Precarga la foto vecina para que las flechas no muestren un salto en blanco
    function preloadNeighbors(index) {
        [index - 1, index + 1].forEach(i => {
            const src = imageSources[(i + imageSources.length) % imageSources.length];
            if (src) new Image().src = src;
        });
    }

    function showLightbox(index) {
        currentIndex = index;
        lightboxImage.src = imageSources[currentIndex];
        lightbox.classList.add('active');
        preloadNeighbors(currentIndex);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showLightbox(index);
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    lightboxPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
        lightboxImage.src = imageSources[currentIndex];
        preloadNeighbors(currentIndex);
    });

    lightboxNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % imageSources.length;
        lightboxImage.src = imageSources[currentIndex];
        preloadNeighbors(currentIndex);
    });

    // Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = header.querySelector('span:last-child');

        header.addEventListener('click', () => {
            const isOpen = content.style.maxHeight;

            // Close all other accordions
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                    otherItem.querySelector('.accordion-header span:last-child').style.transform = 'rotate(0deg)';
                }
            });

            // Toggle the current one
            if (isOpen) {
                content.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.style.transform = 'rotate(45deg)';
            }
        });
    });
});
