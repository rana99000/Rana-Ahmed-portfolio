

document.addEventListener('DOMContentLoaded', () => {

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    const navbar = document.querySelector('.navbar');

    if (navbar) {
        const onScrollNav = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    };
    onScrollNav();
    window.addEventListener('scroll', onScrollNav, { passive: true });
    }
    const navContainer = document.querySelector('.nav-container');
    const navLinksEl = document.querySelector('.nav-links');
    const navButton = document.querySelector('.nav-button');

    if (navContainer && navLinksEl) {
        const toggle = document.createElement('button');
        toggle.className = 'nav-toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Toggle navigation menu');
        toggle.innerHTML = '<span></span><span></span><span></span>';
        navContainer.insertBefore(toggle, navButton);

        toggle.addEventListener('click', () => {
            const open = navLinksEl.classList.toggle('open');
            toggle.classList.toggle('active', open);
        });

        navLinksEl.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinksEl.classList.remove('open');
                toggle.classList.remove('active');
            });
        });
    }

    const sections = document.querySelectorAll('main section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navAnchors.forEach((a) => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach((section) => navObserver.observe(section));
    }

    /* ---------- SCROLL REVEAL ---------- */

    const revealSelectors = [
    '.section-label', '.about-heading', '.about-content',
    '.skill-card', '.project', '.timeline-item', '.education-card',
    '.philosophy-section blockquote', '.contact-card'
   ];
    const revealTargets = document.querySelectorAll(revealSelectors.join(','));

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealTargets.forEach((el) => el.classList.add('reveal', 'in-view'));
    } else {
        revealTargets.forEach((el) => el.classList.add('reveal'));

        const groups = new Map();
        revealTargets.forEach((el) => {
            const parent = el.parentElement;
            if (!groups.has(parent)) groups.set(parent, 0);
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const parent = el.parentElement;
                const index = groups.get(parent) || 0;
                el.style.transitionDelay = `${Math.min(index, 4) * 70}ms`;
                groups.set(parent, index + 1);
                el.classList.add('in-view');
                revealObserver.unobserve(el);
            });
        }, { threshold: 0.15 });

        revealTargets.forEach((el) => revealObserver.observe(el));
    }

    /* ---------- MAGNETIC BUTTONS ---------- */

    if (!reduceMotion && isFinePointer) {
        document.querySelectorAll('.primary-button, .secondary-button, .nav-button, .project-link-live')
            .forEach((btn) => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = `translate(${x * 0.16}px, ${y * 0.28}px)`;
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                });
            });
    }

    /* ---------- PROJECT VISUAL TILT ---------- */

    if (!reduceMotion && isFinePointer) {
        document.querySelectorAll('.project-visual').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform =
                    `perspective(1000px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) scale3d(1.015, 1.015, 1.015)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ---------- HERO PARALLAX ---------- */

    const heroVisual = document.querySelector('.hero-visual');
    const hero = document.querySelector('.hero');

    if (!reduceMotion && isFinePointer && heroVisual && hero) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 16;
            const y = (e.clientY / window.innerHeight - 0.5) * 16;
            heroVisual.style.transform = `translate(${x}px, ${y}px)`;
        });
        hero.addEventListener('mouseleave', () => {
            heroVisual.style.transform = '';
        });
    }

    /* ---------- CURSOR GLOW ---------- */

    const glow = document.querySelector('.cursor-glow');

    if (!reduceMotion && isFinePointer && glow) {
        let raf = null;
        window.addEventListener('mousemove', (e) => {
            glow.classList.add('active');
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            });
        }, { passive: true });

        document.addEventListener('mouseleave', () => glow.classList.remove('active'));
    } else if (glow) {
        glow.remove();
    }


    /* ---------- COPY EMAIL ---------- */

    const copyEmailButton = document.querySelector('.copy-email');
    const copyStatus = document.querySelector('.copy-status');

    if (copyEmailButton) {
        copyEmailButton.addEventListener('click', async () => {
            const email = copyEmailButton.dataset.email;

            try {
                await navigator.clipboard.writeText(email);
                if (copyStatus) copyStatus.textContent = 'Email copied.';
                copyEmailButton.textContent = 'Copied ✓';
            } catch {
                if (copyStatus) {
                    copyStatus.textContent = `Copy failed. Email: ${email}`;
                }
            }

            setTimeout(() => {
                copyEmailButton.textContent = 'Copy Email';
                if (copyStatus) copyStatus.textContent = '';
            }, 2200);
        });
    }

    /* ---------- LIVE FOOTER YEAR ---------- */

    const footerCopy = document.querySelector('.footer-copy');
    if (footerCopy) {
        footerCopy.textContent = `© ${new Date().getFullYear()} Rana Ahmed Abdellatif`;
    }

});