// Brands and Portfolio Section JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // Portfolio filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Sample portfolio data with categories
    const portfolioData = [
        { category: 'living', title: 'Modern Coastal Living', subtitle: 'Living Room Transformation', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        { category: 'living', title: 'Contemporary Urban', subtitle: 'City Apartment Redesign', image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        { category: 'bedroom', title: 'Luxury Master Suite', subtitle: 'Bedroom Makeover', image: 'https://images.unsplash.com/photo-1631679706909-faf1c835cd42?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        { category: 'dining', title: 'Elegant Dining Space', subtitle: 'Formal Dining Room', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        { category: 'kitchen', title: 'Modern Kitchen Design', subtitle: 'Complete Kitchen Renovation', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        { category: 'office', title: 'Home Office Space', subtitle: 'Productive Work Environment', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
    ];

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter portfolio items
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filter === 'all' || itemCategory === filter) {
                    item.classList.remove('hidden');
                    // Reset animation
                    item.style.animation = 'none';
                    setTimeout(() => {
                        item.style.animation = 'fadeInUp 0.6s ease-out';
                    }, 10);
                } else {
                    item.classList.add('hidden');
                }
            });

            // Update pagination dots visibility based on filtered results
            updatePaginationVisibility();
        });
    });

    // Gallery pagination functionality
    const galleryDots = document.querySelectorAll('.gallery-dot');
    let currentPage = 0;
    const itemsPerPage = 6;

    function updatePaginationVisibility() {
        const visibleItems = document.querySelectorAll('.portfolio-item:not(.hidden)');
        const totalPages = Math.ceil(visibleItems.length / itemsPerPage);

        galleryDots.forEach((dot, index) => {
            if (index < totalPages) {
                dot.style.display = 'block';
            } else {
                dot.style.display = 'none';
            }
        });

        // Reset to first page if current page doesn't exist
        if (currentPage >= totalPages) {
            currentPage = 0;
        }

        updatePaginationDisplay();
    }

    function updatePaginationDisplay() {
        const visibleItems = document.querySelectorAll('.portfolio-item:not(.hidden)');

        // Hide all visible items first
        visibleItems.forEach(item => {
            item.style.display = 'none';
        });

        // Show items for current page
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        for (let i = startIndex; i < endIndex && i < visibleItems.length; i++) {
            if (visibleItems[i]) {
                visibleItems[i].style.display = 'block';
            }
        }

        // Update dot states
        galleryDots.forEach(dot => dot.classList.remove('active'));
        if (galleryDots[currentPage]) {
            galleryDots[currentPage].classList.add('active');
        }
    }

    // Gallery dot click functionality
    galleryDots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            currentPage = index;
            updatePaginationDisplay();
        });
    });

    // Initialize pagination
    updatePaginationVisibility();

    // Auto-advance gallery (optional)
    let autoAdvanceInterval;

    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(() => {
            const visibleDots = document.querySelectorAll('.gallery-dot[style*="block"], .gallery-dot:not([style*="none"])');
            const totalVisiblePages = visibleDots.length;

            if (totalVisiblePages > 1) {
                currentPage = (currentPage + 1) % totalVisiblePages;
                updatePaginationDisplay();
            }
        }, 4000); // Change page every 4 seconds
    }

    function stopAutoAdvance() {
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
        }
    }

    // Start auto-advance
    startAutoAdvance();

    // Pause auto-advance on hover
    const portfolioSection = document.querySelector('.portfolio-gallery-section');
    if (portfolioSection) {
        portfolioSection.addEventListener('mouseenter', stopAutoAdvance);
        portfolioSection.addEventListener('mouseleave', startAutoAdvance);
    }

    // Portfolio item click functionality
    portfolioItems.forEach(item => {
        item.addEventListener('click', function () {
            const title = this.querySelector('.portfolio-info h4')?.textContent || 'Portfolio Item';
            const subtitle = this.querySelector('.portfolio-info p')?.textContent || 'View Details';

            // You can implement modal or navigation here
            console.log(`Clicked on: ${title} - ${subtitle}`);

            // Example: Open modal or navigate to detail page
            // openPortfolioModal(item);
        });
    });

    // Brand logo hover effects
    const brandLogos = document.querySelectorAll('.brand-logo');
    brandLogos.forEach(logo => {
        logo.addEventListener('mouseenter', function () {
            // Add subtle animation or effect
            this.style.transform = 'scale(1.05)';
        });

        logo.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Smooth scroll for portfolio button
    const portfolioBtn = document.querySelector('.portfolio-cta .btn');
    if (portfolioBtn) {
        portfolioBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = document.querySelector('#portfolio');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Initial rendering of portfolio items if you're dynamically injecting them
    // This part is optional if items are already present in HTML
    if (portfolioItems.length === 0) {
        const container = document.querySelector('.portfolio-items-container');
        if (container) {
            portfolioData.forEach(data => {
                const item = document.createElement('div');
                item.classList.add('portfolio-item');
                item.setAttribute('data-category', data.category);

                item.innerHTML = `
                    <div class="portfolio-image">
                        <img src="${data.image}" alt="${data.title}">
                    </div>
                    <div class="portfolio-info">
                        <h4>${data.title}</h4>
                        <p>${data.subtitle}</p>
                    </div>
                `;

                container.appendChild(item);
            });
        }
    }
});
