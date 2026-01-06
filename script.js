// --- SÉLECTION DES ÉLÉMENTS DU DOM ---
const elements = {
    cursor: document.getElementById('cursor'),
    navbar: document.getElementById('navbar'),
    aboutSection: document.getElementById('about'),
    themeTrigger: document.getElementById('theme-trigger'),
    scrollButton: document.querySelector('.scroll-trigger'),
    modal: document.getElementById('projectModal'),
    modalCloseBtn: document.getElementById('closeModal'),
    projectContainer: document.querySelector('.bento-grid'),
    textTargets: document.querySelectorAll('.text-hover-target, h2, h3, p, a, button'),
    safeZones: document.querySelectorAll('.safe-zone, img')
};

// --- CURSEUR PERSONNALISÉ ---
document.addEventListener('mousemove', (e) => {
    elements.cursor.style.left = `${e.clientX}px`;
    elements.cursor.style.top = `${e.clientY}px`;
});

elements.textTargets.forEach(el => {
    el.addEventListener('mouseenter', () => elements.cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => elements.cursor.classList.remove('hovered'));
});

elements.safeZones.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('no-blend'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('no-blend'));
});

// --- SCROLL ET COULEURS ---
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

if(elements.scrollButton){
    elements.scrollButton.addEventListener('click', () => {
        elements.aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// --- MODALE PROJET ---
const openModal = (card) => {
    const data = {
        category: card.dataset.category,
        title: card.dataset.title,
        desc: card.dataset.desc,
        tags: card.dataset.tags ? card.dataset.tags.split(',') : [],
        modalImage: card.dataset.modalImage // Assurez-vous que c'est défini dans le JSON
    };

    const modalContainer = document.getElementById('modalDataContainer');

    // Supprimer l'image précédente si elle existe
    const existingImg = modalContainer.querySelector('.modal-project-image');
    if (existingImg) existingImg.remove();

    // Ajouter l'image du projet
    if (data.modalImage) {
        const img = document.createElement('img');
        img.src = data.modalImage;
        img.alt = data.title;
        img.classList.add('modal-project-image');
        modalContainer.prepend(img); // derrière le contenu grâce au z-index CSS
    }

    // Injection du texte et tags
    document.getElementById('modalCategory').textContent = data.category;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDesc').textContent = data.desc;

    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'modal-tag';
        span.textContent = tag.trim();
        tagsContainer.appendChild(span);
    });

    // Affichage modale
    elements.modal.classList.add('active');
    document.body.classList.add('no-scroll');
};

// Fermeture
const closeModal = () => {
    elements.modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
};
elements.modalCloseBtn.addEventListener('click', closeModal);
elements.modal.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeModal();
});

// --- BACK TO TOP ---
document.querySelector('.back-to-top').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- I18N / MULTI-LANGUES ---
let currentLang = localStorage.getItem('lang') || 'fr';

async function loadLanguage(lang) {
    const res = await fetch(`lang/${lang}.json`);
    const data = await res.json();
    window.i18nData = data;

    // --- CV BUTTON ---
    const cvBtn = document.getElementById('cv-btn');
    if(cvBtn && data.nav.cvFile) {
        cvBtn.href = data.nav.cvFile;
        cvBtn.textContent = data.nav.cv;
        cvBtn.innerHTML += `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`;
    }

    // --- Texte i18n ---
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const keys = el.dataset.i18n.split('.');
        let value = data;
        keys.forEach(k => value = value?.[k]);
        if (value) el.textContent = value;
    });

    // --- Génération des projets ---
    elements.projectContainer.innerHTML = '';
    const projects = data.work.projects;

    for (const key in projects) {
        const project = projects[key];

        const card = document.createElement('a');
        card.href = "#";
        card.classList.add('project-card', 'text-hover-target');
        if (project.highlight) card.classList.add('highlight-card');

        card.dataset.category = project.category;
        card.dataset.title = project.title;
        card.dataset.desc = project.desc;
        card.dataset.tags = project.tags ? project.tags.join(',') : '';
        card.dataset.year = project.year || '';
        card.dataset.icon = project.icon || '';
        card.dataset.modalImage = project.modalImage || '';

        card.innerHTML = `
            ${project.icon ? `<img src="${project.icon}" alt="${project.title} icon" class="project-icon">` : ''}
            <span>${project.category.split(' - ').pop()}</span>
            <h4>${project.title}</h4>
        `;

        card.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(card);
        });

        elements.projectContainer.appendChild(card);
    }

    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
}
const langBtn = document.getElementById('lang-switch');
langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'fr' : 'en';
    langBtn.textContent = currentLang === 'en' ? 'FR' : 'EN';
    loadLanguage(currentLang);
});

loadLanguage(currentLang);
