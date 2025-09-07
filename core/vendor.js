// Enhanced Dynamic Navigation Content Loader
document.addEventListener('DOMContentLoaded', function () {
  // Create a main content container if it doesn't exist
  let mainContent = document.getElementById('main-content');
  if (!mainContent) {
    mainContent = document.createElement('main');
    mainContent.id = 'main-content';
    mainContent.className = 'main-content';

    // Insert between navbar and footer
    const footer = document.querySelector('.footer-section');
    footer.parentNode.insertBefore(mainContent, footer);
  }

 // Detect if running on GitHub Pages
const repoName = "greycells"; // <-- change to your repo name
const isGitHubPages = window.location.hostname.includes("github.io");

// Function to build paths correctly
function makePath(base, file) {
  if (isGitHubPages) {
    // Serve from https://username.github.io/repoName/...
    return `/${repoName}/${base}/${file}`;
  } else {
    // Local relative path (./assets/...)
    return `.${base}/${file}`;
  }
}

// Path prefix configuration for different file types
const pathPrefix = {
  css: {
    MainPath: isGitHubPages ? `/${repoName}/assets/pagestyles` : "./assets/pagestyles",
    BLOG: [""],
    CONTACT: ["contact.css"],
    HOME: ["home.css"],
    PORTFOLIO: ["portfolio.css"],
    "HOW IT WORKS": ["how-it-works.css"],
    "LOG IN": ["login.css"]
  },
  html: {
    MainPath: isGitHubPages ? `/${repoName}/` : "./",
    BLOG: ["blog.html"],
    CONTACT: ["contact.html"],
    HOME: ["home.html"],
    PORTFOLIO: ["portfolio.html"],
    "HOW IT WORKS": ["how-it-works.html"],
    "LOG IN": ["login.html"]
  },
  js: {
    MainPath: isGitHubPages ? `/${repoName}/assets/scripts` : "./assets/scripts",
    BLOG: ["blog.js"],
    CONTACT: ["contact.js"],
    HOME: ["home.js"],
    PORTFOLIO: ["portfolio.js"],
    "HOW IT WORKS": ["how-it-works.js"],
    "LOG IN": ["login.js"]
  }
};

// Navigation mapping - maps nav text to page configurations
const navigationMap = {
  CONTACT: {
    html: "contact.html",
    page: "CONTACT"
  },
  "HOW IT WORKS": {
    html: "how-it-works.html",
    page: "HOW IT WORKS"
  },
  PORTFOLIO: {
    html: "portfolio.html",
    page: "PORTFOLIO"
  },
  BLOG: {
    html: "blog.html",
    page: "BLOG"
  },
  "LOG IN": {
    html: "login.html",
    page: "LOG IN"
  },
  HOME: {
    html: "home.html",
    page: "HOME"
  }
};


  // Track loaded CSS files to avoid duplicates
  const loadedCSS = new Set();
  const loadedJS = new Set();

  // Function to load CSS files for a specific page
  function loadPageCSS(pageName) {
    const cssConfig = pathPrefix.css;
    const cssFiles = cssConfig[pageName];
    
    if (!cssFiles || !Array.isArray(cssFiles)) {
      return Promise.resolve();
    }

    const loadPromises = cssFiles.map(cssFile => {
      return new Promise((resolve, reject) => {
        const cssPath = `${cssConfig.MainPath}/${cssFile}`;
        
        // Skip if already loaded
        if (loadedCSS.has(cssPath)) {
          resolve();
          return;
        }

        // Check if CSS link already exists
        const existingLink = document.querySelector(`link[href="${cssPath}"]`);
        if (existingLink) {
          loadedCSS.add(cssPath);
          resolve();
          return;
        }

        // Create and append CSS link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssPath;
        
        link.onload = () => {
          loadedCSS.add(cssPath);
          resolve();
        };
        
        link.onerror = () => {
          console.warn(`Failed to load CSS: ${cssPath}`);
          resolve(); // Don't reject, continue loading
        };

        document.head.appendChild(link);
      });
    });

    return Promise.all(loadPromises);
  }

  // Function to load JavaScript files for a specific page
  function loadPageJS(pageName) {
    const jsConfig = pathPrefix.js;
    const jsFiles = jsConfig[pageName];
    
    if (!jsFiles || !Array.isArray(jsFiles)) {
      return Promise.resolve();
    }

    const loadPromises = jsFiles.map(jsFile => {
      return new Promise((resolve, reject) => {
        const jsPath = `${jsConfig.MainPath}/${jsFile}`;
        
        // Skip if already loaded
        if (loadedJS.has(jsPath)) {
          resolve();
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${jsPath}"]`);
        if (existingScript) {
          loadedJS.add(jsPath);
          resolve();
          return;
        }

        // Create and append script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = jsPath;
        
        script.onload = () => {
          loadedJS.add(jsPath);
          resolve();
        };
        
        script.onerror = () => {
          console.warn(`Failed to load JS: ${jsPath}`);
          resolve(); // Don't reject, continue loading
        };

        document.head.appendChild(script);
      });
    });

    return Promise.all(loadPromises);
  }

  // Function to remove page-specific CSS (optional, for cleanup)
  function removePageCSS(pageName) {
    const cssConfig = pathPrefix.css;
    const cssFiles = cssConfig[pageName];
    
    if (!cssFiles || !Array.isArray(cssFiles)) {
      return;
    }

    cssFiles.forEach(cssFile => {
      const cssPath = `${cssConfig.MainPath}/${cssFile}`;
      const link = document.querySelector(`link[href="${cssPath}"]`);
      if (link) {
        link.remove();
        loadedCSS.delete(cssPath);
      }
    });
  }

  // Enhanced function to load page content with assets
  async function loadPageContent(pageConfig) {
    try {
      const { html: filename, page: pageName } = pageConfig;
      
      // Show loading state
      mainContent.innerHTML = `
        <div class="loading-container text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading content...</p>
        </div>
      `;

      // Load CSS and JS files for the page
      await Promise.all([
        loadPageCSS(pageName),
        loadPageJS(pageName)
      ]);

      // Load HTML content
      const htmlPath = pathPrefix.html?.MainPath ? 
        `${pathPrefix.html.MainPath}${filename}` : filename;
      
      const response = await fetch(htmlPath);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // Parse the HTML to extract content between nav and footer
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Remove nav and footer from the loaded content
      const nav = doc.querySelector('nav');
      const footer = doc.querySelector('footer');
      if (nav) nav.remove();
      if (footer) footer.remove();

      // Get the body content (everything except nav and footer)
      const bodyContent = doc.body.innerHTML;

      // Update main content with fade effect
      mainContent.style.opacity = '0';

      setTimeout(() => {
        mainContent.innerHTML = bodyContent;
        mainContent.style.opacity = '1';

        // Scroll to top after content load
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Re-initialize any scripts that might be needed for the new content
        initializePageScripts();

        // Dispatch custom event for page loaded
        document.dispatchEvent(new CustomEvent('pageLoaded', {
          detail: { pageName, filename }
        }));
      }, 300);

    } catch (error) {
      console.error('Error loading page:', error);
      mainContent.innerHTML = `
        <div class="error-container text-center py-5">
          <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Error Loading Page</h4>
            <p>Sorry, we couldn't load the requested page. Please try again later.</p>
            <hr>
            <p class="mb-0">Error: ${error.message}</p>
          </div>
        </div>
      `;
    }
  }

  // Function to initialize scripts for dynamically loaded content
  function initializePageScripts() {
    // Re-initialize any JavaScript that might be needed for the loaded content
    
    // Example: Re-initialize Bootstrap components
    if (typeof bootstrap !== 'undefined') {
      // Re-initialize tooltips
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });

      // Re-initialize popovers
      const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
      popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
      });

      // Re-initialize carousels
      const carouselElements = document.querySelectorAll('.carousel');
      carouselElements.forEach(carousel => {
        new bootstrap.Carousel(carousel);
      });
    }

    // Initialize any other page-specific JavaScript
    if (window.initPageSpecificScripts) {
      window.initPageSpecificScripts();
    }
  }

  // Add click event listeners to navigation links
  document.addEventListener('click', function (e) {
    const target = e.target;

    // Check if clicked element is a nav link
    if (target.classList.contains('nav-link') || target.closest('.nav-link')) {
      const navLink = target.classList.contains('nav-link') ? target : target.closest('.nav-link');
      const linkText = navLink.textContent.trim().toUpperCase();

      // Check if this nav item should load content dynamically
      if (navigationMap[linkText]) {
        e.preventDefault(); // Prevent default link behavior

        // Update active state
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        navLink.classList.add('active');

        // Load the corresponding page content with assets
        loadPageContent(navigationMap[linkText]);

        // Update browser URL without page reload
        const newUrl = navigationMap[linkText].html.replace('.html', '');
        history.pushState({ 
          page: newUrl, 
          config: navigationMap[linkText] 
        }, '', `#${newUrl}`);
      }
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.config) {
      loadPageContent(e.state.config);
      
      // Update active nav link
      const pageName = e.state.config.page;
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.trim().toUpperCase() === pageName) {
          link.classList.add('active');
        }
      });
    }
  });

  // Load home content by default if no content exists
  if (mainContent.innerHTML.trim() === '') {
    loadPageContent(navigationMap['HOME']);
    
    // Set home as active
    const homeLink = Array.from(document.querySelectorAll('.nav-link'))
      .find(link => link.textContent.trim().toUpperCase() === 'HOME');
    if (homeLink) {
      homeLink.classList.add('active');
    }
  }

  // Add CSS for smooth transitions and loading states
  const style = document.createElement('style');
  style.textContent = `
    .main-content {
      transition: opacity 0.3s ease-in-out;
      min-height: 60vh;
    }
    
    .loading-container {
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .error-container {
      min-height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .nav-link.active {
      font-weight: 600;
    }
    
    /* Loading animation */
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
    
    .loading-container p {
      animation: pulse 1.5s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
});

// Enhanced function to programmatically navigate to a page
function navigateToPage(pageName) {
  const upperPageName = pageName.toUpperCase();
  const pageConfig = navigationMap[upperPageName];
  
  if (!pageConfig) {
    console.warn(`Page configuration for "${pageName}" not found`);
    return false;
  }

  const navLink = Array.from(document.querySelectorAll('.nav-link'))
    .find(link => link.textContent.trim().toUpperCase() === upperPageName);

  if (navLink) {
    // Simulate click on the nav link
    const event = new Event('click', { bubbles: true });
    navLink.dispatchEvent(event);
    return true;
  } else {
    console.warn(`Navigation link for "${pageName}" not found`);
    return false;
  }
}

// Utility function to preload page assets
function preloadPageAssets(pageName) {
  const upperPageName = pageName.toUpperCase();
  const pageConfig = navigationMap[upperPageName];
  
  if (!pageConfig) {
    console.warn(`Page configuration for "${pageName}" not found`);
    return Promise.reject(new Error('Page not found'));
  }

  return Promise.all([
    loadPageCSS(upperPageName),
    loadPageJS(upperPageName)
  ]);
}

// Export functions for external use
window.navigateToPage = navigateToPage;
window.preloadPageAssets = preloadPageAssets;