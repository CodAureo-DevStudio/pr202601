document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  // Close menu when clicking a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });

  // Stats Counter Animation
  const stats = document.querySelectorAll(".number");
  let hasAnimated = false;

  const animateStats = () => {
    stats.forEach((stat) => {
      const target = +stat.getAttribute("data-target");
      const speed = 200; // Lower is faster

      const updateCount = () => {
        const count = +stat.innerText.replace(".", "").replace(",", ""); // handle formatting if needed
        const inc = target / speed;

        if (count < target) {
          stat.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 20);
        } else {
          stat.innerText = target;
        }
      };

      updateCount();
    });
  };

  // Trigger animation on scroll
  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    window.addEventListener("scroll", () => {
      const sectionPos = statsSection.getBoundingClientRect().top;
      const screenPos = window.innerHeight / 1.3;

      if (sectionPos < screenPos && !hasAnimated) {
        animateStats();
        hasAnimated = true;
      }
    });
  }

  // Smooth Scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
  // Scroll Reveal Observer
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    },
    {
      root: null,
      threshold: 0.15, // Trigger when 15% visible
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Simple Parallax Effect for Hero
  const heroBg = document.querySelector(".hero-slide-bg");
  if (heroBg) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      // Move background at 50% speed of scroll
      heroBg.style.transform = `translateY(${scrollY * 0.5}px)`;
    });
  }

  // Floating Social Buttons (Exclude Contact Page)
  const isContactPage = window.location.pathname.includes("fale-conosco") || window.location.pathname.includes("contato");
  
  if (!isContactPage) {
      const socialContainer = document.createElement("div");
      socialContainer.className = "floating-socials";
      
      const whatsappLink = "https://wa.me/5561981030472"; // Using number from footer
      const instagramLink = "#"; // Placeholder
      
      socialContainer.innerHTML = `
          <a href="${whatsappLink}" target="_blank" class="social-float-btn btn-whatsapp" aria-label="Fale conosco no WhatsApp">
              <i class="fab fa-whatsapp"></i>
          </a>
          <a href="${instagramLink}" target="_blank" class="social-float-btn btn-instagram" aria-label="Siga-nos no Instagram">
              <i class="fab fa-instagram"></i>
          </a>
      `;
      
      document.body.appendChild(socialContainer);
  }
  // Text Reveal Observer (Cinematic)
  const textReveals = document.querySelectorAll(".reveal-text");
  const textObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add("active");
          }
      });
  }, { threshold: 0.2 });
  
  textReveals.forEach(el => textObserver.observe(el));

  // 3D Tilt Effect for Cards
  const cards = document.querySelectorAll(".article-card");
  
  cards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
          const rotateY = ((x - centerX) / centerX) * 5;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener("mouseleave", () => {
          card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      });
  });

  // Magnetic Buttons (Desktop only)
  if (window.innerWidth > 768) {
      const btns = document.querySelectorAll(".btn");
      
      btns.forEach(btn => {
          btn.addEventListener("mousemove", (e) => {
              const rect = btn.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              
              btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
          });
          
          btn.addEventListener("mouseleave", () => {
              btn.style.transform = "translate(0, 0)";
          });
      });
  }

  // Mobile Interaction Sequence (News -> Subscribe)
  if (window.innerWidth <= 768) {
      // Create Popup HTML Structure
      const createPopup = (id, title, text, btnText, btnLink, imgSrc) => {
          const overlay = document.createElement("div");
          overlay.className = "mobile-popup-overlay";
          overlay.id = id;
          
          overlay.innerHTML = `
              <div class="mobile-popup-card">
                  <button class="popup-close">&times;</button>
                  <img src="${imgSrc}" class="popup-image" alt="${title}">
                  <div class="popup-content">
                      <h3 class="popup-title">${title}</h3>
                      <p class="popup-text">${text}</p>
                      <a href="${btnLink}" class="btn btn-primary" style="width: 100%;">${btnText}</a>
                  </div>
              </div>
          `;
          
          document.body.appendChild(overlay);
          return overlay;
      };

      // 1. News Popup (Delay 2s)
      setTimeout(() => {
          // Check if already subscribed or seen? (Optional logic here)
          const newsPopup = createPopup(
              "popup-news",
              "Novidades Chegando!",
              "Confira as últimas ações e conquistas do Instituto Eixos na nossa página de notícias.",
              "Ler Notícias",
              "noticias.html",
              "assets/img/projeto-brasilia-2025-1.webp" 
          );

          // Show News Popup
          requestAnimationFrame(() => newsPopup.classList.add("active"));

          // Handle Close News -> Trigger Subscribe
          newsPopup.querySelector(".popup-close").addEventListener("click", () => {
              newsPopup.classList.remove("active");
              setTimeout(() => newsPopup.remove(), 300); // Clean up DOM

              // 2. Subscribe Popup (Delay 500ms after close)
              setTimeout(() => {
                  const subPopup = createPopup(
                      "popup-subscribe",
                      "Fique por Dentro",
                      "Inscreva-se para receber atualizações exclusivas e oportunidades de voluntariado.",
                      "Inscrever-se",
                      "#newsletter-footer", // Jump to footer form
                      "assets/img/hero-bg.jpg" // Or another image
                  );
                  
                  requestAnimationFrame(() => subPopup.classList.add("active"));
                  
                  // Handle Close Subscribe
                  subPopup.querySelector(".popup-close").addEventListener("click", () => {
                      subPopup.classList.remove("active");
                      setTimeout(() => subPopup.remove(), 300);
                  });

                  // If they click the CTA, also close
                  subPopup.querySelector(".btn").addEventListener("click", () => {
                      subPopup.classList.remove("active");
                  });

              }, 500);
          });
      }, 3000); // 3 seconds initial delay
  }

// === PROJECT MODAL LOGIC ===
let currentSlide = 0;
let totalSlides = 0;

window.openProjectModal = function(card) {
    const modal = document.getElementById("project-modal");
    
    // Get Data
    const title = card.getAttribute("data-title");
    const category = card.getAttribute("data-category");
    const desc = card.getAttribute("data-full-description") || card.getAttribute("data-description");
    const stats = card.getAttribute("data-stats");
    const images = JSON.parse(card.getAttribute("data-images"));
    
    // Populate Info
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-category").innerText = category;
    document.getElementById("modal-stats").innerText = stats;

    // --- ACCORDION GENERATION ---
    const accordionContainer = document.getElementById("modal-accordion");
    accordionContainer.innerHTML = ""; // Clear existing

    // Define Sections
    const sections = [
        {
            title: "Sumário do Projeto",
            content: desc // From data attribute
        },
        {
            title: "Dados do Instrumento da Parceria",
            content: "<p>Informações detalhadas sobre a parceria e vigência.</p><p><strong>Vigência:</strong> 2025 - 2026</p><p><strong>Órgão:</strong> Governo do Distrito Federal</p>"
        },
        {
            title: "Termo de Fomento",
            content: "<p>Acesse o documento oficial do Termo de Fomento deste projeto.</p>",
            pdf: "Termo de Fomento.pdf"
        },
        {
            title: "Equipe Técnica e Recursos Humanos",
            content: "<p><strong>Coordenação Geral:</strong> Dra. Ana Sophia</p><p><strong>Assistência Social:</strong> Equipe Multidisciplinar Eixos</p>"
        },
        {
            title: "Relatório Final de Execução",
            content: "<p>Resultados alcançados e prestação de contas final.</p>",
            pdf: "Relatório Final.pdf"
        }
    ];

    sections.forEach((section, index) => {
        const item = document.createElement("div");
        item.className = "accordion-item";

        // Open first item by default
        const isActive = index === 0 ? "active" : "";
        const contentStyle = index === 0 ? "max-height: 500px;" : ""; 

        let pdfHtml = "";
        if (section.pdf) {
            pdfHtml = `<br><a href="#" class="accordion-pdf-link"><i class="fas fa-file-pdf"></i> Baixar ${section.pdf}</a>`;
        }

        item.innerHTML = `
            <button class="accordion-header ${isActive}">
                ${section.title}
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="accordion-content" style="${contentStyle}">
                <div class="accordion-body">
                    ${section.content}
                    ${pdfHtml}
                </div>
            </div>
        `;

        accordionContainer.appendChild(item);

        // Add Click Event
        const header = item.querySelector(".accordion-header");
        const content = item.querySelector(".accordion-content");

        header.addEventListener("click", () => {
            // Toggle current
            header.classList.toggle("active");
            if (header.classList.contains("active")) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    
    // Setup Carousel
    const track = document.getElementById("modal-carousel-track");
    const dotsContainer = document.getElementById("carousel-dots");
    
    track.innerHTML = "";
    dotsContainer.innerHTML = "";
    currentSlide = 0;
    totalSlides = images.length;
    
    images.forEach((imgSrc, index) => {
        // Create Slide
        const img = document.createElement("img");
        img.src = imgSrc;
        img.className = "carousel-slide";
        track.appendChild(img);
        
        // Create Dot
        const dot = document.createElement("div");
        dot.className = index === 0 ? "carousel-dot active" : "carousel-dot";
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    // Show Modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
}

window.closeProjectModal = function() {
    const modal = document.getElementById("project-modal");
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
}

window.moveCarousel = function(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
}

window.goToSlide = function(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById("modal-carousel-track");
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    const dots = document.querySelectorAll(".carousel-dot");
    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentSlide);
    });
}

// Close on outside click
document.getElementById("project-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "project-modal") {
        closeProjectModal();
    }
});
});

// === AUTO-SCROLL TRAJECTORY CAROUSEL ===
document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector(".timeline-container");
    const track = document.querySelector(".timeline-track");

    if (container && track) {
        // Clone items for infinite effect
        const items = Array.from(track.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        // Auto Scroll Logic
        let scrollAmount = 0;
        let speed = 0.5; // Adjust speed (pixels per frame)
        let isPaused = false;
        let animationId;

        function scrollStep() {
            if (!isPaused) {
                scrollAmount += speed;
                
                // Reset when half is reached (since we duplicated contents)
                if (scrollAmount >= track.scrollWidth / 2) {
                    scrollAmount = 0;
                }
                
                container.scrollLeft = scrollAmount;
            }
            animationId = requestAnimationFrame(scrollStep);
        }

        // Start
        animationId = requestAnimationFrame(scrollStep);

        // Pause on Hover
        container.addEventListener("mouseenter", () => isPaused = true);
        container.addEventListener("mouseleave", () => isPaused = false);
        
        // Mobile Touch Support (Optional: Allow manual scroll overrides or pause)
        container.addEventListener("touchstart", () => isPaused = true);
        container.addEventListener("touchend", () => {
             // Resume after a delay? Or keep running? 
             // For simple behavior, just resume.
             setTimeout(() => isPaused = false, 1000);
        });
    }
});

