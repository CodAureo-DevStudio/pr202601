/**
 * ============================================
 * FLUIDITY ENHANCEMENTS SCRIPT
 * Optimized Scroll Reveal & Smooth Interactions
 * ============================================
 */

(function() {
  'use strict';

  // ===== INTERSECTION OBSERVER FOR REVEAL ANIMATIONS =====
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Unobserve after revealing for performance
          if (!entry.target.dataset.keepObserving) {
            revealObserver.unobserve(entry.target);
          }
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ===== SMOOTH PARALLAX EFFECT FOR HERO =====
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-slide-bg');
    
    if (heroBackground && scrolled < window.innerHeight) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
    }
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // ===== COUNTER ANIMATION FOR STATISTICS =====
  function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString('pt-BR');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString('pt-BR');
      }
    }, 16);
  }

  // Observe statistics for counter animation
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach(num => {
            if (!num.dataset.animated) {
              animateCounter(num);
              num.dataset.animated = 'true';
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.stats-hero-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ===== 3D TILT EFFECT FOR CARDS =====
  document.querySelectorAll('.pillar-card-3d, .stat-card-premium').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-20px)
        scale(1.03)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===== TESTIMONIALS CAROUSEL =====
  const carousel = {
    track: document.querySelector('.testimonials-track'),
    slides: document.querySelectorAll('.testimonial-slide'),
    dots: document.querySelector('.carousel-dots'),
    prevBtn: document.querySelector('.carousel-prev'),
    nextBtn: document.querySelector('.carousel-next'),
    currentIndex: 0,
    autoplayInterval: null,

    init() {
      if (!this.track || this.slides.length === 0) return;

      this.createDots();
      this.attachEvents();
      this.startAutoplay();
    },

    createDots() {
      this.slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => this.goToSlide(index));
        this.dots.appendChild(dot);
      });
    },

    attachEvents() {
      this.prevBtn?.addEventListener('click', () => this.prev());
      this.nextBtn?.addEventListener('click', () => this.next());
      
      // Touch support
      let startX = 0;
      this.track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });
      
      this.track.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
          diff > 0 ? this.next() : this.prev();
        }
      });
    },

    goToSlide(index) {
      this.currentIndex = index;
      const offset = -index * 100;
      this.track.style.transform = `translateX(${offset}%)`;
      
      // Update dots
      document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      
      this.resetAutoplay();
    },

    next() {
      const nextIndex = (this.currentIndex + 1) % this.slides.length;
      this.goToSlide(nextIndex);
    },

    prev() {
      const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.goToSlide(prevIndex);
    },

    startAutoplay() {
      this.autoplayInterval = setInterval(() => this.next(), 6000);
    },

    resetAutoplay() {
      clearInterval(this.autoplayInterval);
      this.startAutoplay();
    }
  };

  carousel.init();

  // ===== INFINITE GALLERY SCROLL =====
  const fluidTrack = document.querySelector('.fluid-track');
  if (fluidTrack) {
    // Clone images for seamless loop
    const images = fluidTrack.innerHTML;
    fluidTrack.innerHTML += images;
  }

  // ===== SMOOTH ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== PRELOAD CRITICAL IMAGES =====
  const criticalImages = document.querySelectorAll('img[loading="eager"], .hero-slide-bg');
  criticalImages.forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  });

  // ===== LAZY LOAD OPTIMIZATION =====
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback for browsers that don't support native lazy loading
    const lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          lazyLoadObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      lazyLoadObserver.observe(img);
    });
  }

  // ===== PERFORMANCE MONITORING =====
  if (window.performance && window.performance.getEntriesByType) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.getEntriesByType('navigation')[0];
        console.log(`⚡ Page Load Performance:
          DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)}ms
          Total Load Time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms
        `);
      }, 0);
    });
  }

  // ===== REVEAL TEXT ANIMATION =====
  document.querySelectorAll('.reveal-text span').forEach((span, index) => {
    span.style.animationDelay = `${index * 0.1}s`;
  });

  // ===== HEADER SHRINK ON SCROLL =====
  let lastScroll = 0;
  const header = document.getElementById('siteHeader');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  // ===== NEWSLETTER FORM HANDLING =====
  const newsletterForms = document.querySelectorAll('.newsletter-form-premium, form.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Visual feedback
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Inscrito!';
      submitBtn.style.background = 'linear-gradient(135deg, var(--accent-green), var(--primary))';
      submitBtn.disabled = true;
      
      // Reset after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        form.reset();
      }, 3000);
    });
  });

  // ===== GSAP-LIKE STAGGER ANIMATION =====
  function staggerReveal(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('active');
      }, index * delay);
    });
  }

  // Apply to news items when they enter viewport
  const newsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        staggerReveal('.news-item-compact', 150);
        newsObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const newsContainer = document.querySelector('.news-item-compact')?.parentElement;
  if (newsContainer) {
    newsObserver.observe(newsContainer);
  }

  console.log('✨ Fluidity Enhancements Loaded Successfully');
})();
