document.addEventListener('DOMContentLoaded', () => {
    // 0. Auto-apply animations and premium styling to text globally
    const headings = document.querySelectorAll('h1, h2, h3, h4');
    headings.forEach((el, index) => {
        if (!el.hasAttribute('data-aos') && !el.closest('header') && !el.closest('footer')) {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', Math.min((index % 5) * 50, 200));
            
            // If the heading is meant to be dark/on-surface, upgrade it to the premium gradient
            if (el.classList.contains('text-on-surface') || (!el.classList.contains('text-white') && !el.classList.contains('text-primary') && !el.classList.contains('text-tertiary'))) {
                el.classList.add('text-gradient-premium');
                el.classList.remove('text-on-surface');
            } else if (el.classList.contains('text-white')) {
                // For white text (especially over images), apply the spinning glowing animation for maximum visibility and modern style
                el.classList.add('text-animated-glow');
                el.classList.remove('text-white');
            }
        }
    });

    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
        if (!p.hasAttribute('data-aos') && !p.closest('header') && !p.closest('footer')) {
            p.setAttribute('data-aos', 'fade-up');
            p.setAttribute('data-aos-delay', Math.min((index % 3) * 50, 150));
        }
    });

    // 1. Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // 2. Load Header and Footer dynamically
    async function loadComponent(url, elementId) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;
            
            if (elementId === 'header-placeholder') {
                setActiveNavLink();
            }
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    function setActiveNavLink() {
        let currentPath = window.location.pathname;
        let currentPage = currentPath.split('/').pop();
        if (currentPage === '' || currentPage === '/') {
            currentPage = 'index.html';
        }

        const navLinks = document.querySelectorAll('#header-placeholder .nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('text-primary', 'border-bottom', 'border-primary', 'border-2');
                link.classList.remove('text-on-surface-variant');
            } else {
                link.classList.add('text-on-surface-variant');
                link.classList.remove('text-primary', 'border-bottom', 'border-primary', 'border-2');
            }
        });
    }

    // Load header and footer if placeholders exist
    if (document.getElementById('header-placeholder')) {
        loadComponent('header.html', 'header-placeholder');
    }
    if (document.getElementById('footer-placeholder')) {
        loadComponent('footer.html', 'footer-placeholder');
    }

    // 3. Micro-interactions for Fee Calculator
    const slider = document.getElementById('volume-slider');
    const display = document.getElementById('volume-display');
    const bankFee = document.getElementById('bank-fee');
    const stacklyFee = document.getElementById('stackly-fee');

    if (slider && display && bankFee && stacklyFee) {
        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            display.textContent = val.toLocaleString();
            bankFee.textContent = '$' + Math.floor(val * 0.03).toLocaleString();
            // Stackly fee logic: Free for high volume, small for low, but let's keep it $0 for the promo
            stacklyFee.textContent = '$0';
        });
    }

    // 4. Header shadow on scroll (if dynamically loaded, we might need a MutationObserver or just wait a bit, 
    //    but since it's global let's just listen to scroll and find header)
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md');
                header.classList.remove('shadow-sm');
                header.classList.add('bg-white');
                header.classList.remove('bg-opacity-75');
            } else {
                header.classList.remove('shadow-md');
                header.classList.add('shadow-sm');
                header.classList.remove('bg-white');
                header.classList.add('bg-opacity-75');
            }
        }
    });

    // 5. Metal Card 3D effect
    const card = document.querySelector('.metal-card-3d');
    if(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }

    // 6. Micro-interaction for contact form submission
    const multiStepForm = document.getElementById('multi-step-form');
    if (multiStepForm) {
        multiStepForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerHTML = '<span class="material-symbols-outlined spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
                setTimeout(() => {
                    btn.innerHTML = 'Sent Successfully!';
                    btn.classList.replace('indigo-gradient', 'bg-tertiary');
                    btn.classList.add('text-white');
                }, 2000);
            }
        });
    }

    // 7. Initialize Swiper for Hero Section
    if (typeof Swiper !== 'undefined') {
        const heroSwiper = new Swiper('.hero-swiper', {
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        // Testimonial Continuous Marquee Swiper
        const testimonialSwiper = new Swiper('.testimonial-swiper', {
            loop: true,
            speed: 5000,
            freeMode: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            slidesPerView: 1.2,
            spaceBetween: 20,
            breakpoints: {
                768: {
                    slidesPerView: 2.2,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 3.2,
                    spaceBetween: 40,
                }
            }
        });
    }

    // 8. Number Counter Animation on Scroll
    const counters = document.querySelectorAll('.counter-num');
    if (counters.length > 0) {
        const animateCounter = (counter) => {
            const target = +counter.getAttribute('data-target');
            const speed = 50; // frames
            const inc = target / speed;
            let current = 0;

            const updateCount = () => {
                current += inc;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionCounters = entry.target.querySelectorAll('.counter-num');
                    sectionCounters.forEach(counter => animateCounter(counter));
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

        const statsSection = document.getElementById('stats-section');
        if (statsSection) {
            counterObserver.observe(statsSection);
        }
    }
});
// Global functions for Contact Multi-step form
window.nextStep = function() {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step1Dot = document.getElementById('step-1-dot');
    const step2Dot = document.getElementById('step-2-dot');
    
    if(step1 && step2 && step1Dot && step2Dot) {
        step1.classList.add('d-none');
        step2.classList.remove('d-none');
        step1Dot.classList.remove('bg-primary');
        step1Dot.style.backgroundColor = 'var(--outline-variant)';
        step2Dot.style.backgroundColor = '';
        step2Dot.classList.add('bg-primary');
    }
}

window.prevStep = function() {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step1Dot = document.getElementById('step-1-dot');
    const step2Dot = document.getElementById('step-2-dot');
    
    if(step1 && step2 && step1Dot && step2Dot) {
        step2.classList.add('d-none');
        step1.classList.remove('d-none');
        step2Dot.classList.remove('bg-primary');
        step2Dot.style.backgroundColor = 'var(--outline-variant)';
        step1Dot.style.backgroundColor = '';
        step1Dot.classList.add('bg-primary');
    }
}

