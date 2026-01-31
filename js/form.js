/* ============================================
   FORM JS - Intelite AI
   Navegación, formularios y utilidades de página
   ============================================ */

// Configuración inicial
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
lucide.createIcons();

/* ============================================
   FUNCIONES PÚBLICAS (usadas desde HTML onclick)
   ============================================ */

/**
 * Cambia entre vistas (main, about-extended, privacy, terms)
 * @param {string} viewName - Nombre de la vista a mostrar
 */
window.toggleView = function toggleView(viewName) {
    const views = {
        'main': document.getElementById('main-view'),
        'about-extended': document.getElementById('about-extended-view'),
        'privacy': document.getElementById('privacy-view'),
        'terms': document.getElementById('terms-view')
    };

    let targetId = 'main';
    if (viewName === 'about-extended') targetId = 'about-extended';
    if (viewName === 'privacy-view') targetId = 'privacy';
    if (viewName === 'terms-view') targetId = 'terms';

    const target = views[targetId];

    Object.values(views).forEach(v => {
        if (v && v !== target) {
            v.classList.add('opacity-0');
            setTimeout(() => v.classList.add('hidden'), 500);
        }
    });

    if (target) {
        target.classList.remove('hidden');
        setTimeout(() => target.classList.remove('opacity-0'), 50);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Expande/contrae un elemento del acordeón FAQ
 * @param {HTMLElement} button - Botón del acordeón clickeado
 */
window.toggleAccordion = function toggleAccordion(button) {
    const item = button.closest('.accordion-item');
    const content = item.querySelector('.content');
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        item.classList.remove('accordion-active');
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        item.classList.add('accordion-active');
    }
}

/**
 * Acepta cookies y oculta el banner
 */
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        cookieBanner.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => cookieBanner.remove(), 500);
    }
}

/* ============================================
   FUNCIONES PRIVADAS (inicialización interna)
   ============================================ */

// Menú móvil
(function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileMenu) return;

    const mobileLinks = mobileMenu.querySelectorAll('a');

    function toggleMenu() {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    }

    if (mobileBtn) mobileBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(l => l.addEventListener('click', toggleMenu));
})();

// Botón scroll to top
(function initScrollButton() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
})();

// Scroll Spy para menú desktop
(function initScrollSpy() {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('#desktop-menu .nav-link').forEach(link => {
                    link.classList.remove('nav-active');
                    link.classList.add('text-gray-600');
                });

                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`#desktop-menu .nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.remove('text-gray-600');
                    activeLink.classList.add('nav-active');
                }
            }
        });
    }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });

    document.querySelectorAll('section').forEach(s => navObserver.observe(s));
})();

// Animaciones reveal al scroll
(function initRevealAnimations() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
})();

// Formulario de contacto con sanitización básica
(function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // Webhook URL
    const WEBHOOK_URL = 'https://n8n-n8n.u5h0lw.easypanel.host/webhook/intelite-website-form-client-v1';

    if (!contactForm) return;

    /**
     * Validadores específicos por tipo de dato
     */
    const validators = {
        email: (email) => {
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
            return regex.test(email) && email.length <= 254;
        },

        name: (name) => {
            const trimmed = name.trim();
            return trimmed.length >= 2 && trimmed.length <= 100 &&
                   /^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed);
        },

        company: (company) => {
            const trimmed = company.trim();
            return trimmed.length >= 2 && trimmed.length <= 200 &&
                   /^[a-zA-Z0-9À-ÿ\s.,&'-]+$/.test(trimmed);
        },

        message: (message) => {
            const trimmed = message.trim();
            if (trimmed.length < 10 || trimmed.length > 2000) return false;
            // Rechazar si tiene demasiados caracteres especiales sospechosos
            const specialChars = (trimmed.match(/[<>{}[\]\\]/g) || []).length;
            return specialChars < 5;
        }
    };

    /**
     * Sanitiza input con validaciones avanzadas
     * @param {string} str - String a sanitizar
     * @param {number} maxLength - Longitud máxima
     * @returns {string} - String sanitizado
     */
    function sanitizeInput(str, maxLength = 1000) {
        if (!str) return '';

        let cleaned = str.trim();
        cleaned = cleaned.replace(/\0/g, ''); // Null bytes
        cleaned = cleaned.normalize('NFC');   // Unicode normalizado
        cleaned = cleaned.replace(/<[^>]*>/g, ''); // Tags HTML

        // Patrones SQL injection comunes
        cleaned = cleaned.replace(/(['";]|--|\*\/|\/\*|xp_|exec|select|drop|insert|delete)/gi, '');

        return cleaned.substring(0, maxLength);
    }

    /**
     * Valida datos de formulario completo
     * @param {Object} formData - Datos del formulario
     * @returns {Object} - { valid: boolean, errors: string[] }
     */
    function validateForm(formData) {
        const errors = [];

        if (!validators.email(formData.email)) {
            errors.push('Email inválido');
        }
        if (!validators.name(formData.name)) {
            errors.push('Nombre debe tener 2-100 caracteres, solo letras');
        }
        if (formData.company && !validators.company(formData.company)) {
            errors.push('Nombre de empresa inválido');
        }
        if (!validators.message(formData.message)) {
            errors.push('Mensaje debe tener 10-2000 caracteres');
        }

        return { valid: errors.length === 0, errors };
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const originalBtnText = submitBtn.innerText;

        submitBtn.innerText = 'Enviando...';
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75');
        formStatus.classList.add('hidden');

        // Capturar datos raw
        const rawData = {
            name: document.getElementById('name').value,
            company: document.getElementById('company').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Validar antes de sanitizar
        const validation = validateForm(rawData);
        if (!validation.valid) {
            formStatus.innerText = validation.errors.join('. ');
            formStatus.classList.remove('hidden', 'text-green-600');
            formStatus.classList.add('text-red-500');
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-75');
            return;
        }

        // Sanitizar datos validados
        const formData = {
            name: sanitizeInput(rawData.name, 100),
            company: sanitizeInput(rawData.company, 200),
            email: sanitizeInput(rawData.email, 254),
            message: sanitizeInput(rawData.message, 2000),
            source: 'Website Contact Form'
            // Eliminado userAgent por privacidad
        };

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                contactForm.reset();
                formStatus.innerText = "¡Mensaje enviado con éxito!";
                formStatus.classList.remove('hidden', 'text-red-500');
                formStatus.classList.add('text-green-600');
            } else {
                throw new Error('Error en respuesta');
            }
        } catch (error) {
            formStatus.innerText = "Error al enviar. Intenta de nuevo.";
            formStatus.classList.remove('hidden', 'text-green-600');
            formStatus.classList.add('text-red-500');
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-75');
        }
    });
})();

// Banner de cookies
(function initCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    if (!cookieBanner) return;

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.remove('translate-y-full', 'opacity-0');
        }, 2000);
    }
})();

// Generador de waveforms para widget de voz
(function initWaveforms() {
    function generateWaveform(elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;

        const barCount = 30;
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.classList.add('voice-wave-bar');
            bar.style.height = (Math.floor(Math.random() * 10) + 4) + 'px';
            bar.style.animationDelay = (Math.random() * 1) + 's';
            container.appendChild(bar);
        }
    }

    generateWaveform('wave1');
    generateWaveform('wave2');
})();
