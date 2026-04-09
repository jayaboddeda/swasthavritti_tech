/**
 * Component Loader for Swasthavritti Website
 * 
 * This script allows you to easily include reusable HTML components in your pages.
 * 
 * Usage:
 * 1. Add this script to your HTML page: <script src="components/component-loader.js"></script>
 * 2. Add a placeholder div where you want to load the component:
 *    <div data-component="testimonials"></div>
 *    <div data-component="blog-section"></div>
 * 
 * Available components:
 * - testimonials: Customer testimonials section
 * - blog-section: Latest blog posts section
 */

(function () {
    'use strict';

    function getLoaderRootPath() {
        const loaderScript = document.currentScript
            || Array.from(document.scripts).find(script => /component-loader\.js(?:\?|$)/.test(script.src || ''));

        if (loaderScript && loaderScript.src) {
            return new URL('../', loaderScript.src).toString();
        }

        return new URL('./', window.location.href).toString();
    }

    const loaderRootPath = getLoaderRootPath();

    function getCurrentPageSlug() {
        const segments = window.location.pathname
            .split('/')
            .filter(Boolean);

        if (!segments.length) return '';

        return segments[segments.length - 1]
            .replace(/\.html$/i, '')
            .toLowerCase();
    }

    function isSpecialOrAbsoluteUrl(value) {
        if (!value) return true;

        const trimmed = value.trim();
        if (!trimmed) return true;
        if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;

        return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(trimmed);
    }

    function resolveComponentUrl(value) {
        if (isSpecialOrAbsoluteUrl(value)) {
            return value;
        }

        try {
            return new URL(value, loaderRootPath).toString();
        } catch (e) {
            console.error('Failed to resolve component URL:', value, e);
            return value;
        }
    }

    function normalizeComponentUrls(container) {
        if (!container) return;

        const elements = container.querySelectorAll('[href], [src], [data-bg-image], [data-mask]');
        elements.forEach((el) => {
            ['href', 'src', 'data-bg-image', 'data-mask'].forEach((attr) => {
                if (!el.hasAttribute(attr)) return;

                const originalValue = el.getAttribute(attr);
                const resolvedValue = resolveComponentUrl(originalValue);
                if (resolvedValue !== originalValue) {
                    el.setAttribute(attr, resolvedValue);
                }
            });
        });
    }

    // Component mapping
    const components = {
        'header': 'components/header.html',
        'testimonials': 'components/testimonials.html',
        'blog-section': 'components/blog-section.html',
        'contact': 'components/contact.html',
        'footer': 'components/footer.html',
        'related-services': 'components/related-services.html',
        'sidebar-cta': 'components/sidebar-cta.html'
    };

    /**
     * Re-initialize common JS features (background images, selects, GSAP, etc.)
     */
    function reinitializeJS(container, componentName) {
        if (!container) return;

        // Data BG Image / Mask - transfer from placeholder to inner section if needed
        const bgElements = container.querySelectorAll('[data-bg-image], [data-mask]');
        const applyBg = (el) => {
            const bg = el.getAttribute('data-bg-image');
            if (bg) {
                el.style.backgroundImage = `url(${bg})`;
            }
            const mask = el.getAttribute('data-mask');
            if (mask) {
                el.style.maskImage = `url(${mask})`;
                el.style.webkitMaskImage = `url(${mask})`;
            }
        };

        bgElements.forEach(applyBg);

        // If placeholder itself has background attributes, apply them to its first child (usually a section)
        if (container.hasAttribute('data-bg-image') || container.hasAttribute('data-mask')) {
            const firstChild = container.firstElementChild;
            if (firstChild) {
                const bg = container.getAttribute('data-bg-image');
                if (bg) firstChild.style.backgroundImage = `url(${bg})`;
                const mask = container.getAttribute('data-mask');
                if (mask) {
                    firstChild.style.maskImage = `url(${mask})`;
                    firstChild.style.webkitMaskImage = `url(${mask})`;
                }
            } else {
                applyBg(container);
            }
        }

        // Nice Select
        try {
            if (typeof jQuery !== 'undefined' && jQuery().niceSelect) {
                const selects = jQuery(container).find('select');
                if (selects.length > 0) {
                    selects.niceSelect();
                }
            }
        } catch (e) { console.error("NiceSelect init failed", e); }

        // WOW Animations
        try {
            if (typeof WOW !== 'undefined') {
                new WOW().init();
            }
        } catch (e) { console.error("WOW init failed", e); }

        // GSAP Text Animations
        try {
            if (typeof gsap !== 'undefined' && typeof SplitText !== 'undefined') {
                const animatedTextElements = container.querySelectorAll(".text-anim");
                animatedTextElements.forEach(element => {
                    let animationSplitText = new SplitText(element, { type: "chars, words" });
                    gsap.from(animationSplitText.chars, {
                        duration: 1,
                        delay: 0.1,
                        x: 20,
                        autoAlpha: 0,
                        stagger: 0.03,
                        ease: "power2.out",
                        scrollTrigger: { trigger: element, start: "top 85%" },
                    });
                });
            }
        } catch (e) { console.error("GSAP text-anim failed", e); }

        // Header specific re-initialization
        if (componentName === 'header') {
            try {
                if (typeof jQuery !== 'undefined' && jQuery().meanmenu) {
                    jQuery("#main-menu").meanmenu({
                        meanMenuContainer: ".mobile_menu",
                        meanScreenWidth: "991",
                        meanExpand: ['<i class="tji-angle-down"></i>'],
                    });
                }

                // Re-bind menu buttons which might be in the header
                jQuery(".menu_btn").off("click").on("click", function () {
                    jQuery(".hamburger-area").addClass("opened");
                    jQuery(".body-overlay").addClass("opened");
                });

                jQuery(".hamburgerCloseBtn").off("click").on("click", function () {
                    jQuery(".hamburger-area").removeClass("opened");
                    jQuery(".body-overlay").removeClass("opened");
                });

                jQuery(".body-overlay").off("click").on("click", function () {
                    jQuery(".hamburger-area").removeClass("opened");
                    jQuery(".body-overlay").removeClass("opened");
                });

                // Sticky Header check
                if (typeof jQuery !== 'undefined') {
                    const header = jQuery(".header-sticky");
                    if (header.length > 0) {
                        // The scroll event is already in main.js, but we might need to update lastScrollTop
                        // or trigger a scroll to set initial state
                        jQuery(window).trigger('scroll');
                    }
                }
            } catch (e) { console.error("Header specific init failed", e); }
        }

        // Set active class for related-services links
        if (componentName === 'related-services') {
            const links = container.querySelectorAll('.service-category ul li a');
            const currentPath = getCurrentPageSlug();
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPath) {
                    link.classList.add('active');
                }
            });
        }
    }

    /**
     * Load a component from file and insert it into the target element
     */
    function loadComponent(element) {
        const componentName = element.getAttribute('data-component');
        const componentPath = components[componentName];

        if (!componentPath) {
            console.error(`Component "${componentName}" not found`);
            return;
        }

        const resolvedComponentPath = new URL(componentPath, loaderRootPath).toString();

        // Fetch the component HTML
        fetch(resolvedComponentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${resolvedComponentPath}`);
                }
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
                normalizeComponentUrls(element);

                // Re-initialize JS features for the new content
                reinitializeJS(element, componentName);

                // Re-initialize Swiper if the component contains sliders
                if (typeof Swiper !== 'undefined') {
                    if (componentName === 'testimonials') {
                        initTestimonialSlider();
                    }
                    // Add other slider initializations here if needed
                }
            })
            .catch(error => {
                console.error('Error loading component:', error);
                element.innerHTML = `<p>Error loading component: ${componentName}</p>`;
            });
    }

    /**
     * Initialize testimonial slider (if needed)
     */
    function initTestimonialSlider() {
        const testimonialSlider = document.querySelector('.tj-testimonial-slider');
        if (testimonialSlider && typeof Swiper !== 'undefined') {
            try {
                new Swiper('.tj-testimonial-slider', {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.testimonial-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.testimonial-navigation .slider-next',
                        prevEl: '.testimonial-navigation .slider-prev',
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 2,
                        },
                        1200: {
                            slidesPerView: 3,
                        }
                    }
                });
            } catch (e) { console.error("Swiper init failed", e); }
        }
    }

    /**
     * Initialize all components on page load
     */
    function initComponents() {
        const componentElements = document.querySelectorAll('[data-component]');
        componentElements.forEach(loadComponent);
    }

    /**
     * Ensure recent posts never includes the currently opened blog page.
     * Also rotates suggestions so each page can show a different set.
     */
    function initRecentPosts() {
        const containers = document.querySelectorAll('.sidebar-recent-post');
        if (!containers.length) return;

        const posts = [
            { href: 'student-visa-guide-usa-uk-canada-australia-2026', title: 'Student Visa Guide 2026: USA, UK, Canada, Australia', date: 'Mar 2026', image: '../assets/images/blog/tj-blog-1.webp', alt: 'Student Visa Guide 2026' },
            { href: 'ielts-2026-changes-preparation-guide', title: 'IELTS 2026 Changes and Preparation Guide', date: 'Mar 2026', image: '../assets/images/blog/tj-blog-2.webp', alt: 'IELTS 2026 Changes' },
            { href: 'overseas-blue-collar-jobs-india-2026-work-visa-guide', title: 'Overseas Blue-Collar Jobs India 2026 Guide', date: 'Mar 2026', image: '../assets/images/blog/tj-blog-3.webp', alt: 'Overseas Blue-Collar Jobs Guide' },
            { href: 'study-in-usa-from-hyderabad', title: 'Study in USA from Hyderabad 2026', date: 'Mar 2026', image: '../assets/images/blog/tj-blog-1.webp', alt: 'Study in USA from Hyderabad' },
            { href: 'study-in-uk-from-hyderabad', title: 'Study in UK from Hyderabad 2026', date: 'Mar 2026', image: '../assets/images/blog/tj-blog-2.webp', alt: 'Study in UK from Hyderabad' },
            { href: 'study-in-canada-from-hyderabad', title: 'Study in Canada from Hyderabad 2026', date: 'Mar 2026', image: '../assets/images/blog/tj-blog-3.webp', alt: 'Study in Canada from Hyderabad' },
            { href: 'study-in-australia-from-hyderabad', title: 'Study in Australia from Hyderabad 2026', date: 'Mar 2026', image: '../assets/images/blog/tj-blog-1.webp', alt: 'Study in Australia from Hyderabad' },
            { href: 'study-in-europe-from-hyderabad', title: 'Study in Europe from Hyderabad 2026', date: 'Mar 2026', image: '../assets/images/blog/tj-blog-2.webp', alt: 'Study in Europe from Hyderabad' },
            { href: 'study-in-new-zealand-from-hyderabad', title: 'Study in New Zealand from Hyderabad 2026', date: 'Mar 2026', image: '../assets/images/blog/tj-blog-3.webp', alt: 'Study in New Zealand from Hyderabad' },
            { href: 'study-in-mauritius-from-hyderabad', title: 'Study in Mauritius from Hyderabad 2026', date: 'Mar 2026', image: '../assets/images/blog/tj-blog-1.webp', alt: 'Study in Mauritius from Hyderabad' }
        ];

        const currentPage = getCurrentPageSlug();
        const filtered = posts.filter(post => post.href.toLowerCase() !== currentPage);
        const source = filtered.length ? filtered : posts;

        
        const hash = (value) => {
            let total = 0;
            for (let i = 0; i < value.length; i += 1) total = (total + value.charCodeAt(i)) % 100000;
            return total;
        };
        const start = source.length ? hash(currentPage || 'blog') % source.length : 0;

        const selected = [];
        for (let i = 0; i < Math.min(3, source.length); i += 1) {
            selected.push(source[(start + i) % source.length]);
        }

        const itemHtml = (post) => `
            <div class="single-post d-flex align-items-center">
               <div class="post-image">
                  <a href="${post.href}"><img src="${post.image}" alt="${post.alt}"></a>
               </div>
               <div class="post-header">
                  <h6 class="title-link">
                     <a href="${post.href}">${post.title}</a>
                  </h6>
                  <span class="date">${post.date}</span>
               </div>
            </div>
        `;

        containers.forEach((container) => {
            container.innerHTML = selected.map(itemHtml).join('');
        });
    }

    // Load components when window is fully loaded to ensure all JS/CSS are ready
    if (document.readyState === 'complete') {
        initComponents();
    } else {
        window.addEventListener('load', () => {
            initComponents();
        });
    }
})();
