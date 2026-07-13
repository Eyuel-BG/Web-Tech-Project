/**
 * MENTOR KNOWLEDGE SOLUTIONS - Main Script
 * File 8 of 8: js/main.js
 */
document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       1. STICKY HEADER SCROLL
       ===================================================== */
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () =>
            header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
    }

    /* =====================================================
       2. HAMBURGER MENU
       ===================================================== */
    const toggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (toggle && navMenu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });
        document.addEventListener('click', (e) => {
            if (header && !header.contains(e.target)) {
                toggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
        navMenu.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', () => {
                toggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            })
        );
    }

    /* =====================================================
       3. MOBILE DROPDOWN ACCORDION
       ===================================================== */
    document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                const dd = link.nextElementSibling;
                if (dd) {
                    dd.classList.toggle('open');
                    link.parentElement.classList.toggle('open');
                }
            }
        });
    });

    /* =====================================================
       4. ACTIVE NAV LINK
       ===================================================== */
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link[href]').forEach(link => {
        if (link.getAttribute('href').split('/').pop().split('#')[0] === page)
            link.classList.add('current');
    });

    /* =====================================================
       5. SCROLL ANIMATIONS (IntersectionObserver)
       ===================================================== */
    const animEls = document.querySelectorAll('.anim');
    if (animEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        animEls.forEach(el => observer.observe(el));
    }

    /* =====================================================
       6. SKEW ON SCROLL (subtle parallax-like skew for hero)
       ===================================================== */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
        }, { passive: true });
    }

    /* =====================================================
       7. COUNTER ANIMATION (stats bar)
       ===================================================== */
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    if (statNums.length) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const el = e.target;
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                let current = 0;
                const step = Math.ceil(target / 60);
                const timer = setInterval(() => {
                    current = Math.min(current + step, target);
                    el.textContent = current.toLocaleString() + suffix;
                    if (current >= target) clearInterval(timer);
                }, 28);
                countObserver.unobserve(el);
            });
        }, { threshold: 0.5 });
        statNums.forEach(n => countObserver.observe(n));
    }

    /* =====================================================
       8. PRODUCT FILTER
       ===================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const prodCards = document.querySelectorAll('.prod-card[data-cat]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.filter;
            prodCards.forEach(card => {
                const show = cat === 'all' || card.dataset.cat === cat;
                card.style.display = show ? 'flex' : 'none';
                if (show) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px) skewY(1deg)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'none';
                    });
                }
            });
        });
    });

    /* =====================================================
       8b. PRODUCTS SLIDER CAROUSEL (Dope Sliding Smooth Animation)
       ===================================================== */
    const track = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.slider-arrow-prev');
    const nextBtn = document.querySelector('.slider-arrow-next');
    const dots = document.querySelectorAll('.slider-dot');

    if (track) {
        const getCardWidth = () => {
            const card = track.querySelector('.slider-card');
            return card ? card.offsetWidth + 28 : 340; /* card width + gap */
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
            });
        }

        /* Update indicator dots active state on scroll */
        track.addEventListener('scroll', () => {
            const scrollPos = track.scrollLeft;
            const cardW = getCardWidth();
            const index = Math.round(scrollPos / cardW);
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });
        }, { passive: true });

        /* Enable dot clicks to scroll to target */
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                track.scrollTo({ left: idx * getCardWidth(), behavior: 'smooth' });
            });
        });

        /* High-fidelity Drag-to-Scroll swipe behavior (Mouse & Touch) */
        let isDown = false;
        let startX;
        let scrollLeft;

        const startDragging = (e) => {
            isDown = true;
            const pageX = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : 0);
            startX = pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            track.style.scrollBehavior = 'auto';
            if (e.type === 'mousedown') {
                track.style.cursor = 'grabbing';
            }
        };

        const stopDragging = () => {
            if (!isDown) return;
            isDown = false;
            track.style.scrollBehavior = 'smooth';
            track.style.cursor = '';
        };

        const drag = (e) => {
            if (!isDown) return;
            const pageX = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : 0);
            const x = pageX - track.offsetLeft;
            const walk = (x - startX) * 1.3; /* scroll speed factor */
            track.scrollLeft = scrollLeft - walk;
        };

        // Mouse Events
        track.addEventListener('mousedown', startDragging);
        track.addEventListener('mouseleave', stopDragging);
        track.addEventListener('mouseup', stopDragging);
        track.addEventListener('mousemove', drag);

        // Touch Events (using passive: true where possible or ignoring e.preventDefault since scroll is custom managed)
        track.addEventListener('touchstart', startDragging, { passive: true });
        track.addEventListener('touchend', stopDragging, { passive: true });
        track.addEventListener('touchcancel', stopDragging, { passive: true });
        track.addEventListener('touchmove', drag, { passive: true });
    }

    /* =====================================================
       9. HOVER SKEW ON SERVICE CARDS
       ===================================================== */
    document.querySelectorAll('.service-card, .prod-card, .training-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
            card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.4s ease';
            card.style.transform = '';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.12s ease';
        });
    });

    /* =====================================================
       10. CONTACT FORM VALIDATION
       ===================================================== */
    const form = document.getElementById('contactForm');
    if (form) {
        const showErr = (el, msg) => { el.closest('.form-group').classList.add('error'); const e = el.closest('.form-group').querySelector('.error-msg'); if (e) e.textContent = msg; };
        const clearErr = (el) => el.closest('.form-group').classList.remove('error');

        form.querySelectorAll('.form-control').forEach(i => i.addEventListener('input', () => clearErr(i)));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            form.querySelectorAll('[required]').forEach(input => {
                clearErr(input);
                if (!input.value.trim()) { showErr(input, 'This field is required.'); valid = false; }
                else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) { showErr(input, 'Please enter a valid email.'); valid = false; }
            });
            if (valid) {
                const btn = form.querySelector('[type=submit]');
                const orig = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
                setTimeout(() => {
                    alert('Thank you! Your message has been submitted. We will get back to you shortly.');
                    form.reset();
                    btn.disabled = false;
                    btn.innerHTML = orig;
                }, 1500);
            }
        });
    }

    /* =====================================================
       11. SMOOTH SCROLL FOR ANCHOR LINKS
       ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
                window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
            }
        });
    });

    /* =====================================================
       12. BACK TO TOP BUTTON
       ===================================================== */
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
