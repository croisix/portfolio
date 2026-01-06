// --- SÉLECTION DES ÉLÉMENTS DU DOM ---
const elements = {
    cursor: document.getElementById('cursor'),
    navbar: document.getElementById('navbar'),
    aboutSection: document.getElementById('about'),
    themeTrigger: document.getElementById('theme-trigger'),
    scrollButton: document.querySelector('.scroll-trigger'),
    modal: document.getElementById('projectModal'),
    modalCloseBtn: document.getElementById('closeModal'),
    projectCards: document.querySelectorAll('.project-card'),
    textTargets: document.querySelectorAll('.text-hover-target, h2, h3, p, a, button'),
    safeZones: document.querySelectorAll('.safe-zone, img')
};

// --- GESTION DU CURSEUR PERSONNALISÉ ---
document.addEventListener('mousemove', (e) => {
    // Suit la souris
    elements.cursor.style.left = `${e.clientX}px`;
    elements.cursor.style.top = `${e.clientY}px`;
});

// Effet de grossissement sur les textes
elements.textTargets.forEach(el => {
    el.addEventListener('mouseenter', () => elements.cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => elements.cursor.classList.remove('hovered'));
});

// Effet de couleur inversée
elements.safeZones.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('no-blend'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('no-blend'));
});

// --- GESTION DU SCROLL & COULEURS ---
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const aboutTop = elements.aboutSection.offsetTop;
    const triggerRect = elements.themeTrigger.getBoundingClientRect();
    if (triggerRect.top < window.innerHeight / 2) {
        document.body.classList.add('inverted');
        elements.navbar.classList.remove('nav-dark');
    } else {
        document.body.classList.remove('inverted');
        if (scrollY >= aboutTop - 100) {
            elements.navbar.classList.add('nav-dark');
        } else {
            elements.navbar.classList.remove('nav-dark');
        }
    }
});

// Scroll fluide vers About
elements.scrollButton.addEventListener('click', () => {
    elements.aboutSection.scrollIntoView({ behavior: 'smooth' });
});

// --- GESTION DE LA MODALE PROJET ---
const openModal = (card) => {
    // Récupération des données HTML
    const data = {
        category: card.dataset.category,
        title: card.dataset.title,
        desc: card.dataset.desc,
        tags: card.dataset.tags ? card.dataset.tags.split(',') : []
    };

    // Injection des données
    document.getElementById('modalCategory').textContent = data.category;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDesc').textContent = data.desc;

    // Création des tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'modal-tag';
        span.textContent = tag.trim();
        tagsContainer.appendChild(span);
    });

    // Affichage
    elements.modal.classList.add('active');
    document.body.classList.add('no-scroll');
};

const closeModal = () => {
    elements.modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
};

// Écouteurs d'événements Modale
elements.projectCards.forEach(card => card.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(card);
}));

elements.modalCloseBtn.addEventListener('click', closeModal);

// Fermer en cliquant en dehors
elements.modal.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeModal();
});

// Bouton Retour en haut
document.querySelector('.back-to-top').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- I18N / MULTI-LANGUES ---
let currentLang = localStorage.getItem('lang') || 'en';

async function loadLanguage(lang) {
    const res = await fetch(`lang/${lang}.json`);
    const data = await res.json();

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const keys = el.dataset.i18n.split('.');
        let value = data;
        keys.forEach(k => value = value?.[k]);
        if (value) el.textContent = value;
    });

    // Projets (dataset)
    const projects = data.work.projects;
    document.querySelectorAll('.project-card').forEach(card => {
        const key = card.querySelector('h4')?.textContent.toLowerCase().includes('flower')
            ? 'flower'
            : 'portfolio';

        card.dataset.category = projects[key].category;
        card.dataset.title = projects[key].title;
        card.dataset.desc = projects[key].desc;
    });

    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
}

// Bouton langue
const langBtn = document.getElementById('lang-switch');
if (langBtn) {
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        langBtn.textContent = currentLang === 'en' ? 'FR' : 'EN';
        loadLanguage(currentLang);
    });
}

loadLanguage(currentLang);
