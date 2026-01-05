// =====================
// CURSEUR PERSONNALISÉ
// =====================
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('.text-hover-target, .btn-cv, .btn-contact, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// =====================
// NAVBAR SCROLL COLOR & FOND INVERTI
// =====================
const nav = document.getElementById('navbar');
const aboutSection = document.getElementById('about');
const themeTrigger = document.getElementById('theme-trigger');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Changement couleur navbar selon section
    const aboutTop = aboutSection.offsetTop;
    const aboutHeight = aboutSection.offsetHeight;

    if (scrollY >= aboutTop - 50 && scrollY < aboutTop + aboutHeight - 50) {
        nav.classList.add('nav-dark');
    } else {
        nav.classList.remove('nav-dark');
    }

    // Inversion du fond quand le séparateur est au milieu de l'écran
    const triggerTop = themeTrigger.getBoundingClientRect().top;
    if (triggerTop < window.innerHeight / 2) {
        document.body.classList.add('inverted');
    } else {
        document.body.classList.remove('inverted');
    }
});

// =====================
// MODAL DES PROJETS
// =====================
const modal = document.getElementById('projectModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalCategory = document.getElementById('modalCategory');
const modalTags = document.getElementById('modalTags');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', e => {
        e.preventDefault(); // ✅ Bloque le jump en haut
        modal.classList.add('active');
        document.body.classList.add('no-scroll');

        modalTitle.textContent = card.dataset.title || "Titre du projet";
        modalDesc.textContent = card.dataset.desc || "Description du projet";
        modalCategory.textContent = card.dataset.category || "Catégorie";

        modalTags.innerHTML = '';
        if(card.dataset.tags){
            card.dataset.tags.split(',').forEach(tag => {
                const span = document.createElement('span');
                span.className = 'modal-tag';
                span.textContent = tag.trim();
                modalTags.appendChild(span);
            });
        }
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
});
modal.addEventListener('click', e => {
    if(e.target === modal){
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// =====================
// SCROLL VERS TOP
// =====================
document.querySelectorAll('a.back-to-top').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// =====================
// SCROLL VERS ABOUT AU CLICK DU SEPARATEUR
// =====================
const scrollTrigger = document.querySelector('.scroll-trigger');
if(scrollTrigger){
    scrollTrigger.addEventListener('click', () => {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
}
