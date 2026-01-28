// projects.js
console.log("Projects.js loaded");

// 1. Project Modal System
let currentProjectSlide = 0;
let totalProjectSlides = 0;

window.openProjectModal = function(card) {
    console.log("Opening Project Modal...", card);
    const modal = document.getElementById("project-modal");
    if (!modal) {
        console.error("Modal element #project-modal not found!");
        return;
    }

    const title = card.getAttribute("data-title");
    const stats = card.getAttribute("data-stats");
    const desc = card.getAttribute("data-full-description") || card.getAttribute("data-description");
    const imagesStr = card.getAttribute("data-images") || "[]";
    let images = [];
    try {
        images = JSON.parse(imagesStr);
    } catch(e) {
        images = imagesStr ? [imagesStr] : [];
    }
    
    const titleEl = document.getElementById("modal-title");
    if (titleEl) titleEl.innerText = title;
    
    const statsEl = document.getElementById("modal-stats");
    if (statsEl) statsEl.innerText = stats || "";
    
    const accordion = document.getElementById("modal-accordion");
    if (accordion) {
        accordion.innerHTML = `<div class="accordion-item active">
            <div class="accordion-header"><h4>Descrição do Projeto</h4></div>
            <div class="accordion-body">${desc}</div>
        </div>`;
    }

    const track = document.getElementById("modal-carousel-track");
    if (track) {
        if (images.length > 0) {
            track.innerHTML = images.map(src => `<img src="${src}" class="carousel-slide">`).join('');
            totalProjectSlides = images.length;
            currentProjectSlide = 0;
            updateProjectCarousel();
        } else {
            track.innerHTML = '';
            totalProjectSlides = 0;
        }
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    console.log("Modal is now active");
};

window.closeProjectModal = function() {
    const modal = document.getElementById("project-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "auto";
};

window.moveCarousel = function(direction) {
    if (totalProjectSlides <= 1) return;
    currentProjectSlide = (currentProjectSlide + direction + totalProjectSlides) % totalProjectSlides;
    updateProjectCarousel();
};

function updateProjectCarousel() {
    const track = document.getElementById("modal-carousel-track");
    if (track) track.style.transform = `translateX(-${currentProjectSlide * 100}%)`;
}

document.addEventListener("DOMContentLoaded", function () {
    // 1. 3D Tilt Effect - Using Delegation for dynamic cards
    document.addEventListener("mousemove", (e) => {
        const card = e.target.closest(".article-card");
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3; 
        const rotateY = ((x - centerX) / centerX) * 3;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    document.addEventListener("mouseout", (e) => {
        const card = e.target.closest(".article-card");
        if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
        }
    });

    // 2. Project Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.textContent.trim();
                const cards = document.querySelectorAll(".article-card");
                cards.forEach(card => {
                    const category = card.getAttribute('data-category') || card.querySelector('.tag')?.innerText || '';
                    if (filterValue === 'Todos' || (category && category.toLowerCase().includes(filterValue.toLowerCase()))) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});
