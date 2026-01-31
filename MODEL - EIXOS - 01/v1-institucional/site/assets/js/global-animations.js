/**
 * ============================================
 * GLOBAL ANIMATIONS CONTROLLER
 * Sistema de Ativação Automática de Animações
 * Instituto Eixos
 * ============================================
 */

(function() {
  'use strict';

  // ===== INTERSECTION OBSERVER PARA ANIMAÇÕES =====
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Adicionar classe de animação
          const animationClass = entry.target.dataset.animation || 'animate-fade-in-up';
          entry.target.classList.add(animationClass, 'active');
          
          // Remover observer se não for repetível
          if (!entry.target.dataset.repeat) {
            animationObserver.unobserve(entry.target);
          }
        } else if (entry.target.dataset.repeat) {
          // Remover animação para repetir
          const animationClass = entry.target.dataset.animation || 'animate-fade-in-up';
          entry.target.classList.remove(animationClass, 'active');
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Observar todos os elementos com data-animation
  document.querySelectorAll('[data-animation]').forEach(el => {
    animationObserver.observe(el);
  });

  // ===== AUTO-APLICAR ANIMAÇÕES EM ELEMENTOS COMUNS =====
  function autoApplyAnimations() {
    // Headers de seção
    document.querySelectorAll('section h2, section h3').forEach((heading, index) => {
      if (!heading.dataset.animation) {
        heading.dataset.animation = 'animate-fade-in-down';
        animationObserver.observe(heading);
      }
    });

    // Parágrafos importantes
    document.querySelectorAll('section > .container > p, .hero-subtitle').forEach(p => {
      if (!p.dataset.animation) {
        p.dataset.animation = 'animate-fade-in-up';
        animationObserver.observe(p);
      }
    });

    // Botões
    document.querySelectorAll('.btn, button[class*="btn"]').forEach(btn => {
      if (!btn.dataset.animation) {
        btn.dataset.animation = 'animate-scale-in';
        animationObserver.observe(btn);
      }
    });

    // Cards
    document.querySelectorAll('.card, [class*="card-"]').forEach(card => {
      if (!card.dataset.animation && !card.classList.contains('no-animation')) {
        card.dataset.animation = 'animate-fade-in-up';
        animationObserver.observe(card);
      }
    });

    // Imagens
    document.querySelectorAll('section img:not(.no-animation)').forEach(img => {
      if (!img.dataset.animation) {
        img.dataset.animation = 'animate-scale-in';
        animationObserver.observe(img);
      }
    });
  }

  // ===== APLICAR CORES DE PILARES EM ÍCONES =====
  function applyPillarColors() {
    // Mapeamento de palavras-chave para cores
    const colorMap = {
      'saude': 'red',
      'saúde': 'red',
      'health': 'red',
      'educacao': 'yellow',
      'educação': 'yellow',
      'education': 'yellow',
      'cultura': 'blue',
      'culture': 'blue',
      'sustentabilidade': 'green',
      'esporte': 'green',
      'sport': 'green',
      'social': 'green'
    };

    // Aplicar cores baseado em classes ou texto
    document.querySelectorAll('.icon-wrapper:not([class*="red"]):not([class*="blue"]):not([class*="yellow"]):not([class*="green"])').forEach(icon => {
      const text = icon.textContent.toLowerCase() || 
                   icon.closest('section')?.querySelector('h2, h3')?.textContent.toLowerCase() || '';
      
      for (const [keyword, color] of Object.entries(colorMap)) {
        if (text.includes(keyword)) {
          icon.classList.add(color);
          break;
        }
      }
      
      // Se não encontrou cor, usar azul como padrão
      if (!icon.classList.contains('red') && 
          !icon.classList.contains('blue') && 
          !icon.classList.contains('yellow') && 
          !icon.classList.contains('green')) {
        icon.classList.add('blue');
      }
    });
  }

  // ===== STAGGER EFFECT AUTOMÁTICO =====
  function applyStaggerEffect() {
    document.querySelectorAll('[data-stagger]').forEach(container => {
      const children = container.children;
      Array.from(children).forEach((child, index) => {
        child.style.animationDelay = `${index * 0.1}s`;
        child.classList.add('stagger-item');
      });
    });
  }

  // ===== ANIMAÇÃO DE CONTADORES =====
  function animateCounters() {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.count || counter.textContent);
            const duration = parseInt(counter.dataset.duration || 2000);
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target.toLocaleString('pt-BR');
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current).toLocaleString('pt-BR');
              }
            }, 16);

            counterObserver.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('[data-count]').forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // ===== GRADIENT TEXT AUTOMÁTICO =====
  function applyGradientTexts() {
    document.querySelectorAll('[data-gradient]').forEach(el => {
      const color = el.dataset.gradient;
      if (['red', 'blue', 'yellow', 'green', 'full'].includes(color)) {
        el.classList.add(`text-gradient-${color}`);
      }
    });
  }

  // ===== ICON WRAPPERS CONVERSION =====
  function convertIcons() {
    // Mapear ícones customizados disponíveis
    const iconMap = {
      // Pilares
      'heart': 'saude.svg',
      'heartbeat': 'saude.svg',
      'medical': 'saude.svg',
      'graduation-cap': 'educacao.svg',
      'book': 'educacao.svg',
      'school': 'educacao.svg',
      'palette': 'cultura.svg',
      'theater-masks': 'cultura.svg',
      'music': 'cultura.svg',
      'leaf': 'sustentabilidade.svg',
      'tree': 'sustentabilidade.svg',
      'recycle': 'sustentabilidade.svg',
      
      // Navegação
      'project-diagram': 'projetos.svg',
      'tasks': 'projetos.svg',
      'images': 'galeria.svg',
      'camera': 'galeria.svg',
      'file-alt': 'transparencia.svg',
      'file-contract': 'transparencia.svg',
      'newspaper': 'noticias.svg',
      'rss': 'noticias.svg',
      'hand-holding-heart': 'doacao.svg',
      'donate': 'doacao.svg',
      'envelope': 'contato.svg',
      'message': 'contato.svg',
      
      // Institucional
      'bullseye': 'missao.svg',
      'crosshairs': 'missao.svg',
      'eye': 'visao.svg',
      'star': 'valores.svg',
      'gem': 'valores.svg',
      'target': 'alvo.svg',
      'trophy': 'trofeu.svg',
      'award': 'trofeu.svg',
      
      // Pessoas
      'users': 'usuarios.svg',
      'user-friends': 'usuarios.svg',
      'hands-helping': 'voluntarios.svg',
      'handshake': 'voluntarios.svg',
      'question-circle': 'ajuda.svg',
      'info-circle': 'ajuda.svg',
      
      // Utilidades
      'calendar': 'calendario.svg',
      'clock': 'relogio.svg',
      'map-marker-alt': 'localizacao.svg',
      'location': 'localizacao.svg',
      'phone': 'telefone.svg',
      'at': 'email.svg',
      'mail': 'email.svg',
      'search': 'busca.svg',
      'check': 'check.svg',
      'check-circle': 'check.svg',
      'download': 'download.svg',
      'share': 'compartilhar.svg',
      
      // Documentos
      'file': 'documento.svg',
      'document': 'documento.svg',
      'image': 'imagem.svg',
      'photo': 'imagem.svg',
      'chart-line': 'grafico.svg',
      'analytics': 'grafico.svg',
      'bolt': 'impacto.svg',
      'fire': 'impacto.svg'
    };

    // Converter elementos custom-icon
    document.querySelectorAll('.custom-icon:not(.no-animation)').forEach(icon => {
      if (!icon.classList.contains('animate-float') && !icon.classList.contains('animate-bounce')) {
        icon.classList.add('animate-float');
      }
    });

    // Nota: Font Awesome icons não são mais convertidos automaticamente
    // Use apenas os ícones SVG customizados do sistema
    console.log('📦 Sistema de ícones customizados carregado');
    console.log('💡 Use: <img src="assets/icons/[nome].svg"> ao invés de Font Awesome');
  }

  // ===== SCROLL PROGRESS BAR =====
  function createScrollProgress() {
    // Verificar se já existe
    if (document.querySelector('.scroll-progress')) return;

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, #E42836 0%, #F7AA2C 25%, #3D6446 50%, #005B89 100%);
      width: 0%;
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progress);

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progress.style.width = scrolled + '%';
    }, { passive: true });
  }

  // ===== PARALLAX SUBTLE EM IMAGENS =====
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax || 0.5);
        const offset = scrolled * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }

  // ===== SMOOTH SCROLL PARA LINKS INTERNOS =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ===== CARD HOVER TILT EFFECT =====
  function initCardTilt() {
    document.querySelectorAll('.animated-card, [data-tilt]').forEach(card => {
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
          translateY(-10px)
          scale(1.02)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ===== BADGE ANIMATION ON HOVER =====
  function initBadgeAnimations() {
    document.querySelectorAll('.badge-animated, .tag').forEach(badge => {
      if (!badge.classList.contains('badge-animated')) {
        badge.classList.add('badge-animated');
      }
      
      // Adicionar cor se não tiver
      if (!badge.classList.contains('red') && 
          !badge.classList.contains('blue') && 
          !badge.classList.contains('yellow') && 
          !badge.classList.contains('green')) {
        badge.classList.add('blue');
      }
    });
  }

  // ===== INICIALIZAÇÃO =====
  function init() {
    console.log('🎨 Global Animations: Inicializando...');
    
    // Aplicar todas as funções
    autoApplyAnimations();
    applyPillarColors();
    applyStaggerEffect();
    animateCounters();
    applyGradientTexts();
    convertIcons();
    createScrollProgress();
    initParallax();
    initSmoothScroll();
    initCardTilt();
    initBadgeAnimations();
    
    console.log('✨ Global Animations: Ativado!');
  }

  // Executar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-aplicar em elementos dinâmicos
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Re-aplicar animações em novos elementos
            if (node.dataset && node.dataset.animation) {
              animationObserver.observe(node);
            }
          }
        });
      }
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
