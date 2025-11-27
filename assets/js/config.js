/**
 * Portfolio Configuration Loader
 * Loads and manages portfolio data from JSON config
 */

let portfolioConfig = null;

/**
 * Load portfolio configuration
 */
export async function loadConfig() {
  if (portfolioConfig) return portfolioConfig;
  
  try {
    const response = await fetch('/config/portfolio.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }
    portfolioConfig = await response.json();
    return portfolioConfig;
  } catch (error) {
    // Always log config errors
    console.error('Error loading portfolio config:', error);
    return null;
  }
}

/**
 * Get configuration value by path (e.g., 'personal.name')
 */
export function getConfig(path) {
  if (!portfolioConfig) {
    console.error('Config not loaded. Call loadConfig() first.');
    return null;
  }
  
  return path.split('.').reduce((obj, key) => obj?.[key], portfolioConfig);
}

/**
 * Update DOM element with config value
 */
export function setContent(selector, configPath, formatter = null) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const value = getConfig(configPath);
  if (value === null || value === undefined) return;
  
  element.textContent = formatter ? formatter(value) : value;
}

/**
 * Update DOM element attribute with config value
 */
export function setAttribute(selector, attribute, configPath) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const value = getConfig(configPath);
  if (value === null || value === undefined) return;
  
  element.setAttribute(attribute, value);
}

/**
 * Populate stats counters
 */
export function populateStats() {
  const stats = getConfig('stats');
  if (!stats) return;
  
  Object.entries(stats).forEach(([key, stat]) => {
    const element = document.querySelector(`[data-stat="${key}"]`);
    if (element) {
      const counterEl = element.querySelector('[data-target]');
      if (counterEl) {
        counterEl.setAttribute('data-target', stat.value);
      }
    }
  });
}

/**
 * Populate social links
 */
export function populateSocialLinks() {
  const social = getConfig('contact.social');
  if (!social) return;
  
  Object.entries(social).forEach(([platform, url]) => {
    const links = document.querySelectorAll(`a[data-social="${platform}"]`);
    links.forEach(link => {
      link.setAttribute('href', url);
    });
  });
}

/**
 * Initialize SEO meta tags
 */
export function initializeSEO() {
  const seo = getConfig('seo');
  if (!seo) return;
  
  // Update title
  if (seo.title) {
    document.title = seo.title;
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', seo.ogTitle || seo.title);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', seo.ogTitle || seo.title);
  }
  
  // Update description
  if (seo.description) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', seo.ogDescription || seo.description);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', seo.ogDescription || seo.description);
  }
  
  // Update other meta tags
  if (seo.keywords) {
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', seo.keywords);
  }
  
  if (seo.author) {
    document.querySelector('meta[name="author"]')?.setAttribute('content', seo.author);
  }
  
  if (seo.themeColor) {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', seo.themeColor);
  }
}

/**
 * Initialize all content from config
 */
export async function initializeContent() {
  await loadConfig();
  
  if (!portfolioConfig) {
    console.error('Failed to initialize content: Config not loaded');
    return;
  }
  
  // Initialize SEO
  initializeSEO();
  
  // Populate basic content
  setContent('[data-content="name"]', 'personal.name');
  setContent('[data-content="title"]', 'personal.title');
  setContent('[data-content="email"]', 'contact.email');
  setAttribute('a[data-content="email"]', 'href', 'contact.email');
  
  // Populate stats
  populateStats();
  
  // Populate social links
  populateSocialLinks();
  
  console.log('✅ Portfolio content initialized from config');
}
