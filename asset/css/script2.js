document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasIO = 'IntersectionObserver' in window;

    document.getElementById('year').textContent = new Date().getFullYear();

    /* Sticky nav shadow */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

    /* Mobile menu */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    menuToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

    /* Active link tracking (top nav + mobile tab bar) */
    const links = Array.from(navLinks.querySelectorAll('a'));
    const tabLinks = Array.from(document.querySelectorAll('.app-tab[data-tab]'));
    const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    if (hasIO) {
        const navObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = '#' + entry.target.id;
                links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
                tabLinks.forEach(t => t.classList.toggle('active', t.dataset.tab === id));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(s => navObs.observe(s));
    }

    /* Reveal on scroll (also used by service cards + experience items) */
    document.querySelectorAll('.service-card, .experience-item').forEach(el => el.classList.add('reveal'));
    const reveals = document.querySelectorAll('.reveal');
    if (hasIO) {
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
    const animateCounter = el => {
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
    if (hasIO) {
        const statObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { animateCounter(entry.target); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.6 });
        document.querySelectorAll('[data-count]').forEach(el => statObs.observe(el));
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

    /* Toast + copy email */
    const toast = document.getElementById('toast');
    let toastTimer;
    const showToast = msg => {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
    };
    const emailCopy = document.getElementById('emailCopy');
    if (emailCopy && navigator.clipboard) {
        emailCopy.addEventListener('click', () => {
            const text = emailCopy.dataset.copy;
            navigator.clipboard.writeText(text).then(() => showToast('Email copied — ' + text));
        });
    }

    /* Contact form -> mailto */
    const form = document.getElementById('contactForm');
    const formNote = document.getElementById('formNote');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const subject = form.subject.value.trim() || 'Portfolio inquiry';
        const message = form.message.value.trim();
        if (!name || !email || !message) {
            formNote.textContent = 'Please fill in all required fields.';
            formNote.style.color = '#EC5B38';
            return;
        }
        const mailSubject = encodeURIComponent(subject + ' — from ' + name);
        const mailBody = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
        window.location.href = `mailto:prakashagp007@gmail.com?subject=${mailSubject}&body=${mailBody}`;
        formNote.textContent = 'Opening your mail client...';
        formNote.style.color = '#524646';
        form.reset();
    });

    /* Back to top */
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 700), { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
});

/* ============ SKILLS NETWORK CANVAS ============ */
const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');
const BOUNDS = { width: 0, height: 0 };

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    BOUNDS.width = canvas.width;
    BOUNDS.height = canvas.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let isDragging = false;
let draggedNode = null;

window.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    nodes.forEach(node => {
        if (Math.hypot(x - node.x, y - node.y) < node.radius + 10) { isDragging = true; draggedNode = node; }
    });
});
window.addEventListener('mouseup', () => { isDragging = false; draggedNode = null; });
window.addEventListener('mousemove', e => {
    if (!isDragging || !draggedNode) return;
    const rect = canvas.getBoundingClientRect();
    draggedNode.targetX = Math.min(Math.max(e.clientX - rect.left, draggedNode.radius), BOUNDS.width - draggedNode.radius);
    draggedNode.targetY = Math.min(Math.max(e.clientY - rect.top, draggedNode.radius), BOUNDS.height - draggedNode.radius);
});

const lerp = (a, b, t) => a + (b - a) * t;

class Node {
    constructor(x, y, radius, color, text, logoUrl) {
        Object.assign(this, { x, y, targetX: x, targetY: y, radius, color, text });
        this.logo = new Image();
        this.logo.src = logoUrl;
        this.dx = (Math.random() - 0.5) * 1.1;
        this.dy = (Math.random() - 0.5) * 1.1;
        this.textX = x + radius + 14;
        this.textY = y;
        this.opacity = 0;
        this.delay = Math.random() * 60;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = 'rgba(82,70,70,.55)';
        ctx.shadowBlur = 15;
        ctx.fill();
        if (this.logo.complete) {
            const size = this.radius * 1.1;
            ctx.drawImage(this.logo, this.x - size / 2.2, this.y - size / 2.2, size * 0.8, size * 0.8);
        }
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FCF2E5';
        ctx.font = '15px Poppins';
        ctx.textAlign = 'left';
        ctx.fillText(this.text, this.textX, this.textY + 5);
        ctx.restore();
    }

    update() {
        if (this.delay > 0) this.delay -= 1;
        else this.opacity = Math.min(this.opacity + 0.02, 1);

        if (!isDragging || draggedNode !== this) {
            this.targetX += this.dx;
            this.targetY += this.dy;
            if (this.targetX + this.radius > BOUNDS.width || this.targetX - this.radius < 0) this.dx = -this.dx;
            if (this.targetY + this.radius > BOUNDS.height || this.targetY - this.radius < 0) this.dy = -this.dy;
            this.targetX = Math.min(Math.max(this.targetX, this.radius), BOUNDS.width - this.radius);
            this.targetY = Math.min(Math.max(this.targetY, this.radius), BOUNDS.height - this.radius);
        }
        this.x = lerp(this.x, this.targetX, 0.1);
        this.y = lerp(this.y, this.targetY, 0.1);
        this.textX = lerp(this.textX, this.x + this.radius + 14, 0.05);
        this.textY = lerp(this.textY, this.y, 0.05);
        this.draw();
    }
}

const logoBase = 'https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/';
const skills = [
    { color: '#FCF2E5', text: 'HTML5', logo: 'html5.svg' },
    { color: '#A8A492', text: 'CSS3', logo: 'css3.svg' },
    { color: '#FCF2E5', text: 'JavaScript', logo: 'javascript.svg' },
    { color: '#A8A492', text: 'PHP', logo: 'php.svg' },
    { color: '#FCF2E5', text: 'MySQL', logo: 'mysql.svg' },
    { color: '#A8A492', text: 'WordPress', logo: 'wordpress.svg' },
    { color: '#FCF2E5', text: 'Laravel', logo: 'laravel.svg' },
    { color: '#A8A492', text: 'Git', logo: 'git.svg' },
    { color: '#FCF2E5', text: 'GitHub', logo: 'github.svg' }
];

const centerX = BOUNDS.width / 2;
const centerY = BOUNDS.height / 2;
const spread = 250;

const nodes = skills.map((s, i) => {
    const angle = (i / skills.length) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * spread * (0.7 + Math.random() * 0.6);
    const y = centerY + Math.sin(angle) * spread * (0.7 + Math.random() * 0.6);
    return new Node(x, y, 28, s.color, s.text, logoBase + s.logo);
});

const groups = [
    { nodes: ['HTML5', 'CSS3', 'JavaScript'], lineStyle: { width: 2, dash: [], color: 'rgba(252,242,229,0.45)' } },
    { nodes: ['PHP', 'MySQL', 'WordPress', 'Laravel'], lineStyle: { width: 1.5, dash: [5, 5], color: 'rgba(82,70,70,0.5)' } },
    { nodes: ['Git', 'GitHub'], lineStyle: { width: 3, dash: [], color: 'rgba(168,164,146,0.7)' } }
];
const getGroup = node => groups.find(g => g.nodes.includes(node.text));

function connectNodes() {
    for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
            const groupA = getGroup(nodes[a]);
            const dx = nodes[a].x - nodes[b].x;
            const dy = nodes[a].y - nodes[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (groupA === getGroup(nodes[b]) && distance < 280) {
                ctx.beginPath();
                ctx.strokeStyle = groupA.lineStyle.color;
                ctx.lineWidth = groupA.lineStyle.width;
                ctx.setLineDash(groupA.lineStyle.dash);
                ctx.lineCap = 'round';
                ctx.moveTo(nodes[a].x, nodes[a].y);
                ctx.lineTo(nodes[b].x, nodes[b].y);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            const minDist = nodes[a].radius + nodes[b].radius;
            if (distance < minDist) {
                const angle = Math.atan2(dy, dx);
                const force = (minDist - distance) * 0.15;
                const fx = Math.cos(angle) * force;
                const fy = Math.sin(angle) * force;
                if (nodes[a] !== draggedNode) { nodes[a].targetX += fx; nodes[a].targetY += fy; }
                if (nodes[b] !== draggedNode) { nodes[b].targetX -= fx; nodes[b].targetY -= fy; }
            }
        }
    }
}

function drawBackgroundText() {
    ctx.save();
    ctx.strokeStyle = 'rgba(252,242,229,0.22)';
    ctx.lineWidth = 3;
    ctx.font = `${BOUNDS.width / 6}px "Poller One", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText('My Skills', BOUNDS.width / 2, BOUNDS.height / 2);
    ctx.restore();
}

function animate() {
    ctx.clearRect(0, 0, BOUNDS.width, BOUNDS.height);
    drawBackgroundText();
    connectNodes();
    nodes.forEach(node => node.update());
    requestAnimationFrame(animate);
}
animate();
