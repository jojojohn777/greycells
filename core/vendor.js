// Enhanced Dynamic Navigation Content Loader
document.addEventListener('DOMContentLoaded', function () {
  // Create a main content container if it doesn't exist
  let mainContent = document.getElementById('main-content');
  if (!mainContent) {
    mainContent = document.createElement('main');
    mainContent.id = 'main-content';
    mainContent.className = 'main-content';

    const footer = document.querySelector('.footer-section');
    footer.parentNode.insertBefore(mainContent, footer);
  }

  // Detect if running on GitHub Pages
// Detect if running on GitHub Pages or local
const repoName = "greycells";
const isGithub = window.location.hostname.includes("github.io");

// Base path
const basePath = isGithub ? `/${repoName}` : "";

// Path prefix configuration for different file types
const pathPrefix = {
  css: {
    MainPath: `${basePath}/assets/pagestyles`,
    BLOG: [""],
    CONTACT: ["contact.css"],
    HOME: ["home.css"],
    PORTFOLIO: ["portfolio.css"],
    "HOW IT WORKS": ["how-it-works.css"],
    "LOG IN": ["login.css"]
  },
  html: {
    MainPath: `${basePath}/`,
    BLOG: ["blog.html"],
    CONTACT: ["contact.html"],
    HOME: ["home.html"],
    PORTFOLIO: ["portfolio.html"],
    "HOW IT WORKS": ["how-it-works.html"],
    "LOG IN": ["login.html"]
  },
  js: {
    MainPath: `${basePath}/assets/scripts`,
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
    CONTACT: { html: "contact.html", page: "CONTACT" },
    "HOW IT WORKS": { html: "how-it-works.html", page: "HOW IT WORKS" },
    PORTFOLIO: { html: "portfolio.html", page: "PORTFOLIO" },
    BLOG: { html: "blog.html", page: "BLOG" },
    "LOG IN": { html: "login.html", page: "LOG IN" },
    HOME: { html: "home.html", page: "HOME" }
  };

  // Track loaded assets
  const loadedCSS = new Set();
  const loadedJS = new Set();

  // ===== Asset loaders =====
  function loadPageCSS(pageName) {
    const cssConfig = pathPrefix.css;
    const cssFiles = cssConfig[pageName];
    if (!cssFiles || !Array.isArray(cssFiles)) return Promise.resolve();

    return Promise.all(cssFiles.map(cssFile => new Promise(resolve => {
      const cssPath = `${cssConfig.MainPath}/${cssFile}`;
      if (loadedCSS.has(cssPath) || document.querySelector(`link[href="${cssPath}"]`)) {
        loadedCSS.add(cssPath);
        return resolve();
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      link.onload = () => { loadedCSS.add(cssPath); resolve(); };
      link.onerror = () => { console.warn(`Failed CSS: ${cssPath}`); resolve(); };
      document.head.appendChild(link);
    })));
  }

  function loadPageJS(pageName) {
    const jsConfig = pathPrefix.js;
    const jsFiles = jsConfig[pageName];
    if (!jsFiles || !Array.isArray(jsFiles)) return Promise.resolve();

    return Promise.all(jsFiles.map(jsFile => new Promise(resolve => {
      const jsPath = `${jsConfig.MainPath}/${jsFile}`;
      if (loadedJS.has(jsPath) || document.querySelector(`script[src="${jsPath}"]`)) {
        loadedJS.add(jsPath);
        return resolve();
      }
      const script = document.createElement('script');
      script.src = jsPath;
      script.onload = () => { loadedJS.add(jsPath); resolve(); };
      script.onerror = () => { console.warn(`Failed JS: ${jsPath}`); resolve(); };
      document.head.appendChild(script);
    })));
  }

  // ===== Page loader =====
  async function loadPageContent(pageConfig) {
    try {
      const { html: filename, page: pageName } = pageConfig;

      mainContent.innerHTML = `
        <div class="loading-container text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading content...</p>
        </div>`;

      await Promise.all([loadPageCSS(pageName), loadPageJS(pageName)]);

      const htmlPath = `${pathPrefix.html.MainPath}${filename}`;
      const response = await fetch(htmlPath);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const html = await response.text();

      const doc = new DOMParser().parseFromString(html, 'text/html');
      doc.querySelector('nav')?.remove();
      doc.querySelector('footer')?.remove();
      const bodyContent = doc.body.innerHTML;

      mainContent.style.opacity = '0';
      setTimeout(() => {
        mainContent.innerHTML = bodyContent;
        mainContent.style.opacity = '1';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        initializePageScripts();
        document.dispatchEvent(new CustomEvent('pageLoaded', { detail: { pageName, filename } }));
      }, 300);

    } catch (error) {
      console.error('Error loading page:', error);
      mainContent.innerHTML = `
        <div class="error-container text-center py-5">
          <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Error Loading Page</h4>
            <p>Sorry, we couldn't load the requested page.</p>
            <hr><p class="mb-0">Error: ${error.message}</p>
          </div>
        </div>`;
    }
  }

  // ===== Script re-initializer =====
  function initializePageScripts() {
    if (typeof bootstrap !== 'undefined') {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
      document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));
      document.querySelectorAll('.carousel').forEach(el => new bootstrap.Carousel(el));
    }
    if (window.initPageSpecificScripts) window.initPageSpecificScripts();
  }

  // ===== Navigation click handling =====
  document.addEventListener('click', function (e) {
    const navLink = e.target.closest('.nav-link');
    if (!navLink) return;
    const linkText = navLink.textContent.trim().toUpperCase();
    if (!navigationMap[linkText]) return;

    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    navLink.classList.add('active');
    loadPageContent(navigationMap[linkText]);
    const newUrl = navigationMap[linkText].html.replace('.html', '');
    history.pushState({ config: navigationMap[linkText] }, '', `#${newUrl}`);
  });

  window.addEventListener('popstate', function (e) {
    if (e.state?.config) {
      loadPageContent(e.state.config);
      const pageName = e.state.config.page;
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.textContent.trim().toUpperCase() === pageName);
      });
    }
  });

  // Default load
  if (mainContent.innerHTML.trim() === '') {
    loadPageContent(navigationMap['HOME']);
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.textContent.trim().toUpperCase() === 'HOME') link.classList.add('active');
    });
  }

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .main-content { transition: opacity 0.3s ease-in-out; min-height: 60vh; }
    .loading-container, .error-container {
      min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center;
    }
    .nav-link.active { font-weight: 600; }
    @keyframes pulse { 0%{opacity:0.6;}50%{opacity:1;}100%{opacity:0.6;} }
    .loading-container p { animation: pulse 1.5s infinite; }
  `;
  document.head.appendChild(style);

  // ===== Expose helpers globally =====
  window.navigateToPage = function (pageName) {
    const pageConfig = navigationMap[pageName.toUpperCase()];
    if (!pageConfig) return false;
    loadPageContent(pageConfig);
    return true;
  };

  window.preloadPageAssets = function (pageName) {
    const pageConfig = navigationMap[pageName.toUpperCase()];
    if (!pageConfig) return Promise.reject(new Error('Page not found'));
    return Promise.all([loadPageCSS(pageConfig.page), loadPageJS(pageConfig.page)]);
  };
});
``