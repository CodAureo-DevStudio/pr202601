document.addEventListener("DOMContentLoaded", function () {
    // 1. Stats Counter
    const stats = document.querySelectorAll(".number");
    const statsSection = document.querySelector(".stats-section");
    let hasAnimated = false;

    const animateStats = () => {
        stats.forEach((stat) => {
            const target = +stat.getAttribute("data-target");
            const updateCount = () => {
                const count = +stat.innerText.replace(".", "").replace(",", "");
                const inc = target / 200;
                if (count < target) {
                    stat.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else stat.innerText = target;
            };
            updateCount();
        });
    };

    if (statsSection) {
        window.addEventListener("scroll", () => {
            const sectionPos = statsSection.getBoundingClientRect().top;
            if (sectionPos < window.innerHeight / 1.3 && !hasAnimated) {
                animateStats();
                hasAnimated = true;
            }
        });
    }

    // 2. Hero Parallax
    const heroBg = document.querySelector(".hero-slide-bg");
    if (heroBg) {
        window.addEventListener("scroll", () => {
            heroBg.style.transform = `translateY(${window.scrollY * 0.5}px)`;
        });
    }

    // 3. Auto-scroll Trajectory
    const container = document.querySelector(".timeline-container");
    const track = document.querySelector(".timeline-track");
    if (container && track) {
        Array.from(track.children).forEach(item => track.appendChild(item.cloneNode(true)));
        let scrollAmount = 0;
        let isPaused = false;
        function scrollStep() {
            if (!isPaused) {
                scrollAmount += 0.5;
                if (scrollAmount >= track.scrollWidth / 2) scrollAmount = 0;
                container.scrollLeft = scrollAmount;
            }
            requestAnimationFrame(scrollStep);
        }
        requestAnimationFrame(scrollStep);
        container.addEventListener("mouseenter", () => isPaused = true);
        container.addEventListener("mouseleave", () => isPaused = false);
    }

    // 4. Mobile Popups Simulation
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            const popup = document.createElement("div");
            popup.className = "mobile-popup-overlay active";
            popup.innerHTML = `
                <div class="mobile-popup-card">
                    <button class="popup-close" onclick="this.closest('.mobile-popup-overlay').remove()">&times;</button>
                    <img src="assets/img/projeto-brasilia-2025-1.webp" class="popup-image">
                    <div class="popup-content">
                        <h3 class="popup-title">Bem-vindo ao Instituto Eixos</h3>
                        <p class="popup-text">Conheça nossos projetos e saiba como você pode ajudar a transformar vidas.</p>
                        <a href="projetos.html" class="btn btn-primary" style="width: 100%;">Ver Projetos</a>
                    </div>
                </div>
            `;
            document.body.appendChild(popup);
        }, 3000);
    }
});
