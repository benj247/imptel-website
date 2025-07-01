// Main JavaScript - IMPTEL Website

// Global configuration
const CONFIG = {
    animationDuration: 300,
    scrollThreshold: 100,
    mobileBreakpoint: 916,
    tabletBreakpoint: 1024,
    animationIntensity: 0.7 // Default animation intensity (0.7 = 70%)
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize number counters
    initNumberCounters();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize theme detection
    initThemeDetection();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize performance optimizations
    initPerformanceOptimizations();
    
    // Initialize accessibility features
    initAccessibilityFeatures();
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize scroll-triggered animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => el.classList.add('in-view'));
    }
}

// Number counter animation
function initNumberCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    } else {
        counters.forEach(counter => countUp(counter));
    }
}

// Lazy loading for images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Theme detection based on page
function initThemeDetection() {
    const body = document.body;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Apply theme class based on current page
    switch(currentPage) {
        case 'informatica.html':
            body.classList.add('theme-informatica');
            break;
        case 'eletronica.html':
            body.classList.add('theme-eletronica');
            break;
        case 'visitante.html':
            body.classList.add('theme-visitante');
            break;
    }
}

// Initialize mobile menu
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileToggle && navMenu) {
        // Toggle menu on button click
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Ensure body overflow is not stuck
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && document.body.style.overflow === 'hidden') {
                document.body.style.overflow = '';
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Initialize back to top button
function initBackToTop() {
    const button = document.querySelector('.back-to-top');
    const heroSection = document.querySelector('.hero-section');
    
    if (button && heroSection) {
        let heroHeight = heroSection.offsetHeight;
        
        // Update hero height on resize
        window.addEventListener('resize', () => {
            heroHeight = heroSection.offsetHeight;
        });
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > heroHeight) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Debounce function for scroll and resize events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimize scroll events
    let ticking = false;
    function updateOnScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Add scroll-based logic here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll);
    
    // Optimize resize events
    const optimizedResize = debounce(() => {
        // Add resize logic here
    }, 250);
    
    window.addEventListener('resize', optimizedResize);
}

// Accessibility features
function initAccessibilityFeatures() {
    // Skip to main content link
    const skipLink = document.querySelector('.skip-to-main');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const main = document.querySelector('main');
            if (main) {
                main.tabIndex = -1;
                main.focus();
            }
        });
    }
    
    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.classList.add('reduce-motion');
    }
    
    // Animation intensity control
    const animationControl = document.querySelector('.animation-intensity-control');
    if (animationControl) {
        animationControl.addEventListener('input', (e) => {
            CONFIG.animationIntensity = parseFloat(e.target.value);
            document.documentElement.style.setProperty('--animation-intensity', CONFIG.animationIntensity);
            
            // Update any running animations
            updateAnimationIntensity();
        });
    }
}

// Update animation intensity globally
function updateAnimationIntensity() {
    // This will be called by individual animation scripts
    const event = new CustomEvent('animationIntensityChanged', {
        detail: { intensity: CONFIG.animationIntensity }
    });
    window.dispatchEvent(event);
}

// Device detection
function getDeviceType() {
    const width = window.innerWidth;
    if (width <= CONFIG.mobileBreakpoint) return 'mobile';
    if (width <= CONFIG.tabletBreakpoint) return 'tablet';
    return 'desktop';
}

// Export for use in other modules
window.IMPTEL = {
    CONFIG,
    getDeviceType,
    updateAnimationIntensity
};