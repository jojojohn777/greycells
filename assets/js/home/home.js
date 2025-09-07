// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }

    // Initialize Bootstrap Tooltips
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Initialize all components
    initCounterAnimation();
    initFloatingActionButton();
    initScrollAnimations();
    initParallaxEffects();
    initHeroAnimations();
    initButtonAnimations();
    initLoadingAnimations();
    initSmoothScrolling();
});

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const speed = 2000; // Animation duration

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed * 16; // 60fps

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(() => animateCounters(), 16);
            } else {
                counter.innerText = target + (target === 100 ? '+' : '');
            }
        });
    };

    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe all stat items
    document.querySelectorAll('.stat-item').forEach(item => {
        counterObserver.observe(item);
    });
}

// Floating Action Button
function initFloatingActionButton() {
    const fabMain = document.getElementById('fabMain');
    const fabOptions = document.getElementById('fabOptions');
    let isOpen = false;

    if (fabMain && fabOptions) {
        fabMain.addEventListener('click', () => {
            isOpen = !isOpen;
            
            if (isOpen) {
                fabMain.classList.add('active');
                fabOptions.classList.add('show');
            } else {
                fabMain.classList.remove('active');
                fabOptions.classList.remove('show');
            }
        });

        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.fab-container') && isOpen) {
                isOpen = false;
                fabMain.classList.remove('active');
                fabOptions.classList.remove('show');
            }
        });

        // FAB options click handlers
        const fabOptionElements = document.querySelectorAll('.fab-option');
        fabOptionElements.forEach((option, index) => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Add click animation
                option.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    option.style.transform = '';
                }, 150);

                // Handle different social media links
                const icon = option.querySelector('i');
                if (icon.classList.contains('fa-youtube')) {
                    window.open('https://www.youtube.com/@GreyCells', '_blank');
                } else if (icon.classList.contains('fa-facebook')) {
                    window.open('https://www.facebook.com/Greycells315/', '_blank');
                } else if (icon.classList.contains('fa-instagram')) {
                    window.open('https://www.instagram.com/greycells_315/', '_blank');
                } else if (icon.classList.contains('fa-whatsapp')) {
                    window.open('https://wa.me/your-whatsapp-number', '_blank');
                }
            });
        });
    }
}

// Advanced Scroll Animations
function initScrollAnimations() {
    // Parallax observer for floating cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll', 'animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for scroll animations
    document.querySelectorAll('.topic-card, .team-card, .vision-item, .stat-item').forEach(el => {
        observer.observe(el);
    });

    // Stagger animation for grid items
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.topic-card, .team-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Observe sections with staggered cards
    document.querySelectorAll('.topics-section .row, .team-section .row').forEach(section => {
        // Initially hide cards
        section.querySelectorAll('.topic-card, .team-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
        });
        staggerObserver.observe(section);
    });
}

// Parallax Effects
function initParallaxEffects() {
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-card');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Only apply parallax on larger screens
    if (window.innerWidth > 991) {
        window.addEventListener('scroll', requestParallaxUpdate);
    }
}

// Hero Animations
function initHeroAnimations() {
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        // Add cursor
        const cursor = '<span class="cursor">|</span>';
        
        let i = 0;
        const typeEffect = () => {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeEffect, 50);
            } else {
                heroTitle.innerHTML += cursor;
                // Blink cursor
                setInterval(() => {
                    const cursorEl = heroTitle.querySelector('.cursor');
                    if (cursorEl) {
                        cursorEl.style.opacity = cursorEl.style.opacity === '0' ? '1' : '0';
                    }
                }, 500);
            }
        };
        
        // Start typing effect after page load
        setTimeout(typeEffect, 1000);
    }

    // Floating animation for hero cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        // Add random floating motion
        setInterval(() => {
            const randomX = Math.random() * 10 - 5;
            const randomY = Math.random() * 10 - 5;
            card.style.transform += ` translate(${randomX}px, ${randomY}px)`;
        }, 3000 + (index * 500));
    });
}

// Button Animations
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Magnetic effect for larger screens
        if (window.innerWidth > 768) {
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        }
    });
}

// Loading Animations
function initLoadingAnimations() {
    // Add loading class to animate elements on load
    const elementsToAnimate = document.querySelectorAll('.hero-content, .hero-visual, .section-title');
    
    elementsToAnimate.forEach((element, index) => {
        element.classList.add('loading');
        element.style.animationDelay = `${index * 0.2}s`;
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.topic-card, .team-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Scale up slightly
            this.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Add glow effect
            this.style.boxShadow = '0 25px 50px -12px rgba(46, 134, 171, 0.25)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
});

// Performance Optimization
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

// Optimized scroll handler
const handleScroll = debounce(() => {
    // Handle scroll-based animations here
    const scrolled = window.pageYOffset;
    
    // Update scroll indicator if exists
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrolled / docHeight) * 100;
        scrollIndicator.style.width = scrollPercent + '%';
    }
}, 16);

window.addEventListener('scroll', handleScroll);

// Resize handler
const handleResize = debounce(() => {
    // Reinitialize animations that depend on screen size
    if (window.innerWidth <= 991) {
        // Disable parallax on mobile
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach(card => {
            card.style.transform = '';
        });
    }
}, 250);

window.addEventListener('resize', handleResize);

// CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .cursor {
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;

document.head.appendChild(rippleStyle);

// Intersection Observer for lazy loading images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

// Observe lazy images
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Error handling for missing dependencies
window.addEventListener('error', function(e) {
    console.warn('Grey Cells: Some features may not work due to missing dependencies:', e.message);
});

// Export functions for potential external use
window.GreyCells = {
    initCounterAnimation,
    initFloatingActionButton,
    initScrollAnimations,
    initParallaxEffects
};
document.addEventListener("mousemove", (e) => {
    const crosses = document.querySelectorAll(".cross");
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    crosses.forEach((cross, i) => {
      cross.style.transform = `translate(${x * (i+1)/5}px, ${y * (i+1)/5}px)`;
    });
  });