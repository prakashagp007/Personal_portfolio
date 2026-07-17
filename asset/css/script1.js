document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.getElementById('year').textContent = new Date().getFullYear();

    /* Sticky nav shrink shadow */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    /* Mobile menu */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    menuToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

    /* Active nav link tracking (top nav + mobile app tab bar) */
    const links = Array.from(navLinks.querySelectorAll('a'));
    const tabLinks = Array.from(document.querySelectorAll('.app-tab[data-tab]'));
    const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window) {
        const navObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = '#' + entry.target.id;
                    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
                    tabLinks.forEach(t => t.classList.toggle('active', t.dataset.tab === id));
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(s => navObs.observe(s));
    }

    /* Reveal on scroll */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('in-view'); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.12 });
        reveals.forEach(el => revObs.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('in-view'));
    }

    /* Stat counters */
    const counters = document.querySelectorAll('[data-count]');
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        if (reduceMotion) { el.textContent = target; return; }
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 26));
        const tick = () => {
            cur += step;
            if (cur >= target) { el.textContent = target; return; }
            el.textContent = cur;
            requestAnimationFrame(tick);
        };
        tick();
    };
    if ('IntersectionObserver' in window) {
        const statObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { animateCounter(entry.target); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.6 });
        counters.forEach(el => statObs.observe(el));
    }

    /* Skill bar fill on view */
    const skillRows = document.querySelectorAll('.skill-row');
    if ('IntersectionObserver' in window) {
        const skillObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target.querySelector('.skill-fill');
                    fill.style.width = entry.target.dataset.pct + '%';
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        skillRows.forEach(el => skillObs.observe(el));
    }

    /* Project thumbnail switching */
    document.querySelectorAll('.project-card').forEach(card => {
        const main = card.querySelector('.project-main-img');
        const thumbs = card.querySelectorAll('.project-thumbs img');
        thumbs.forEach(t => t.addEventListener('click', () => {
            thumbs.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            main.src = t.src;
            main.alt = t.alt.replace(' thumbnail', '');
        }));
    });

    /* Toast */
    const toast = document.getElementById('toast');
    let toastTimer;
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
    }

    /* Copy email */
    const emailCopy = document.getElementById('emailCopy');
    if (emailCopy) {
        emailCopy.addEventListener('click', () => {
            const text = emailCopy.dataset.copy;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => showToast('Email copied — ' + text));
            }
        });
    }

    /* Contact form -> mailto */
    const form = document.getElementById('contactForm');
    const formNote = document.getElementById('formNote');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const subject = form.subject.value.trim() || 'Portfolio inquiry';
        const message = form.message.value.trim();
        if (!name || !email || !message) {
            formNote.textContent = 'Please fill in all required fields.';
            formNote.style.color = '#e0454f';
            return;
        }
        const mailSubject = encodeURIComponent(subject + ' — from ' + name);
        const mailBody = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
        window.location.href = `mailto:prakashagp007@gmail.com?subject=${mailSubject}&body=${mailBody}`;
        formNote.textContent = 'Opening your mail client...';
        formNote.style.color = '#1FAE6A';
        form.reset();
    });

    /* Back to top */
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 700);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
});