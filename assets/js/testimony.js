// Testimonial and Portfolio Section JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // Before/After Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const portfolioImages = document.querySelectorAll('.portfolio-img');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all images
            portfolioImages.forEach(img => img.classList.remove('active'));
            // Show target image
            const targetImage = document.querySelector(`.portfolio-img[data-type="${targetTab}"]`);
            if (targetImage) {
                targetImage.classList.add('active');
            }
        });
    });

    // Portfolio Slider Navigation
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = dots.length;

    // Sample portfolio data (you can replace with real data)
    const portfolioData = [
        {
            title: "MODERN COASTAL LIVING ROOM AND BEDROOM MAKEOVER",
            beforeImg: "https://images.unsplash.com/photo-1631679706909-faf1c835cd42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            afterImg: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            challenge: "We would like a more minimal look with Feng Shui and natural elements that highlight our beautiful green view.",
            result: "We got the relaxing dream home we always wanted. Wenna was fun to work with and paid attention to every single detail."
        },
        {
            title: "CONTEMPORARY URBAN APARTMENT RENOVATION",
            beforeImg: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            afterImg: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            challenge: "Transform this small urban space into a functional and stylish home for a young professional.",
            result: "The space now feels twice as large and perfectly reflects my personality. Amazing transformation!"
        },
        {
            title: "RUSTIC FARMHOUSE KITCHEN REDESIGN",
            beforeImg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            afterImg: "https://images.unsplash.com/photo-1556909114-f8b290bc3a50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            challenge: "Create a warm, family-friendly kitchen that maintains rustic charm while adding modern functionality.",
            result: "Our kitchen is now the heart of our home. The design perfectly balances old and new elements."
        }
    ];

    function updateSlide(slideIndex) {
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[slideIndex]) {
            dots[slideIndex].classList.add('active');
        }

        // Update content (if you have multiple portfolio items)
        if (portfolioData[slideIndex]) {
            const data = portfolioData[slideIndex];

            // Update title
            const titleElement = document.querySelector('.portfolio-title');
            if (titleElement) {
                titleElement.textContent = data.title;
            }

            // Update images
            const beforeImg = document.querySelector('.portfolio-img[data-type="before"]');
            const afterImg = document.querySelector('.portfolio-img[data-type="after"]');

            if (beforeImg) beforeImg.src = data.beforeImg;
            if (afterImg) afterImg.src = data.afterImg;

            // Update challenge text
            const challengeText = document.querySelector('.detail-item:first-child .detail-text');
            if (challengeText) {
                challengeText.textContent = data.challenge;
            }

            // Update result text
            const resultText = document.querySelector('.detail-item:last-of-type .detail-text');
            if (resultText) {
                resultText.textContent = data.result;
            }
        }

        currentSlide = slideIndex;
    }

    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            const newSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
            updateSlide(newSlide);
        });
    }

    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            const newSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
            updateSlide(newSlide);
        });
    }

    // Dot click functionality
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            updateSlide(index);
        });
    });

    // Auto-advance slider (optional)
    let autoSlideInterval;

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const newSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
            updateSlide(newSlide);
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // Start auto-slide
    startAutoSlide();

    // Pause auto-slide on hover
    const portfolioSection = document.querySelector('.portfolio-showcase');
    if (portfolioSection) {
        portfolioSection.addEventListener('mouseenter', stopAutoSlide);
        portfolioSection.addEventListener('mouseleave', startAutoSlide);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' && prevBtn) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && nextBtn) {
            nextBtn.click();
        }
    });

    // Touch/swipe functionality for mobile
    let startX = null;
    let startY = null;

    const portfolioMain = document.querySelector('.portfolio-main');
    if (portfolioMain) {
        portfolioMain.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        portfolioMain.addEventListener('touchend', function (e) {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) { // Minimum swipe distance
                    if (diffX > 0 && nextBtn) {
                        // Swipe left - next slide
                        nextBtn.click();
                    } else if (diffX < 0 && prevBtn) {
                        // Swipe right - previous slide
                        prevBtn.click();
                    }
                }
            }

            startX = null;
            startY = null;
        });
    }

    // Smooth scroll behavior for view details button
    const viewDetailsBtn = document.querySelector('.view-details-btn');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Add smooth scroll or modal functionality here
            console.log('View more details clicked');
        });
    }
});