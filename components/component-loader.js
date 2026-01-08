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
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
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

        // Fetch the component HTML
        fetch(componentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${componentPath}`);
                }
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;

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

    // Load components when window is fully loaded to ensure all JS/CSS are ready
    if (document.readyState === 'complete') {
        initComponents();
    } else {
        window.addEventListener('load', initComponents);
    }
})();
