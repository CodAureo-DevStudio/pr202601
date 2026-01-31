// Remoção temporária de checkAuth para diagnosticar desaparecimento da página
// import { checkAuth } from '../../../admin/assets/js/auth-guard.js';
import { db } from './firebase-config.js';
import { doc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Visit Tracking
const trackVisit = async () => {
    try {
        const sessionKey = 'site-visit-counted';
        if (!sessionStorage.getItem(sessionKey)) {
            const analyticsRef = doc(db, "config", "analytics");
            try {
                await updateDoc(analyticsRef, {
                    visits: increment(1),
                    lastVisit: new Date().toISOString()
                });
            } catch (e) {
                // If doc doesn't exist, create it
                await setDoc(analyticsRef, { visits: 1, lastVisit: new Date().toISOString() });
            }
            sessionStorage.setItem(sessionKey, 'true');
        }
    } catch (error) {
        console.warn("Analytics error:", error);
    }
};
trackVisit();

document.addEventListener("DOMContentLoaded", function () {
    // Forçar visibilidade do site em caso de bloqueio por scripts anteriores
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';

    // 1. Premium Island Mobile Menu
    const burgerToggle = document.getElementById("burgerToggle");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const closeOverlay = document.getElementById("closeOverlay");
    const overlayLinks = document.querySelectorAll(".overlay-link");

    if (burgerToggle && mobileOverlay) {
        burgerToggle.addEventListener("click", () => {
            mobileOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        });

        const closeMobileMenu = () => {
            mobileOverlay.classList.remove("active");
            document.body.style.overflow = "";
        };

        if (closeOverlay) closeOverlay.addEventListener("click", closeMobileMenu);
        
        overlayLinks.forEach(link => {
            link.addEventListener("click", closeMobileMenu);
        });
    }

    // 2. Island Header Scroll Effect
    const siteHeader = document.getElementById("siteHeader");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }
    });

    // 3. Smooth Scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // 4. Scroll Reveal Observer
    const revealElements = document.querySelectorAll(".reveal, .reveal-text");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                if (!entry.target.classList.contains('reveal-text')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach((el) => revealObserver.observe(el));

    // 5. Floating Socials (Auto-injection)
    const isContactPage = window.location.pathname.includes("fale-conosco");
    if (!isContactPage && !document.querySelector('.floating-socials')) {
        const socialContainer = document.createElement("div");
        socialContainer.className = "floating-socials";
        socialContainer.innerHTML = `
            <a href="https://wa.me/5561981030472" target="_blank" class="social-float-btn btn-whatsapp"><i class="fab fa-whatsapp"></i></a>
            <a href="https://www.instagram.com/institutoeixos/" target="_blank" class="social-float-btn btn-instagram"><i class="fab fa-instagram"></i></a>
        `;
        document.body.appendChild(socialContainer);
    }

    // 6. Magnetic Button Effect for "Doe Aqui"
    const donateBtn = document.querySelector(".donate-button-island");
    if (donateBtn && window.innerWidth > 1024) {
        donateBtn.addEventListener("mousemove", (e) => {
            const rect = donateBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            donateBtn.style.transform = `scale(1.05) translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        donateBtn.addEventListener("mouseleave", () => {
            donateBtn.style.transform = "";
        });
    }
});
