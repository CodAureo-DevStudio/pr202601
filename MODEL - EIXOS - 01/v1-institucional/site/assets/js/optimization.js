/**
 * SITE FLUIDITY & PERFORMANCE OPTIMIZATION
 */

(function() {
    // 1. Throttling helper for scroll events
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    // 2. Intelligent Reveal with Staggering
    const staggerReveals = () => {
        const reveals = document.querySelectorAll('.reveal:not(.active)');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add slight delay based on index if multiple items appear at once
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(el => observer.observe(el));
    };

    // 3. Optimize Heavy Animations (SVG Lines)
    const toggleHeavyAnimations = () => {
        const lines = document.querySelector('.animated-lines-bg');
        if (!lines) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const paths = entry.target.querySelectorAll('path');
                if (entry.isIntersecting) {
                    paths.forEach(p => p.style.animationPlayState = 'running');
                } else {
                    paths.forEach(p => p.style.animationPlayState = 'paused');
                }
            });
        }, { threshold: 0 });

        observer.observe(lines);
    };

    // 4. Fluid Track Cloning (for infinite loop)
    const initInfiniteScroll = () => {
        const track = document.querySelector('.fluid-track');
        if (!track) return;
        
        const clone = track.innerHTML;
        track.innerHTML += clone; // Double the content for seamless loop
    };

    // Initialize all optimizations
    document.addEventListener('DOMContentLoaded', () => {
        staggerReveals();
        toggleHeavyAnimations();
        initInfiniteScroll();
        
        console.log('🚀 Fluidity optimizations engaged.');
    });

    // Handle resize with throttle
    window.addEventListener('resize', throttle(() => {
        // Refresh any layout-dependent calcs here if needed
    }, 250));

})();
