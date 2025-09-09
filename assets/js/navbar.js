function toggleNavbar() {
    const navbarCollapse = document.getElementById('navbarNav');
    const toggleButton = document.querySelector('.navbar-toggler');
    
    if (navbarCollapse.style.display === 'block') {
        navbarCollapse.style.display = 'none';
        toggleButton.setAttribute('aria-expanded', 'false');
    } else {
        navbarCollapse.style.display = 'block';
        toggleButton.setAttribute('aria-expanded', 'true');
    }
}

// Initialize navbar in collapsed state on page load
document.addEventListener('DOMContentLoaded', function() {
    const navbarCollapse = document.getElementById('navbarNav');
    const toggleButton = document.querySelector('.navbar-toggler');
    
    // Set initial state
    navbarCollapse.style.display = 'none';
    toggleButton.setAttribute('aria-expanded', 'false');
    
    // Handle window resize to show/hide navbar properly
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navbarCollapse.style.display = 'block';
        } else {
            navbarCollapse.style.display = 'none';
            toggleButton.setAttribute('aria-expanded', 'false');
        }
    });
});
