/**
 * DOM Sanitizer Utility
 * Provides safe methods for DOM manipulation to prevent XSS
 */

/**
 * Sanitize HTML string - removes scripts and dangerous attributes
 * @param {string} html - Raw HTML string
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Escape HTML entities in text
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Safe innerHTML setter - sanitizes before setting
 * @param {HTMLElement} element - Target element
 * @param {string} html - HTML content
 */
export function safeSetHTML(element, html) {
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove any script tags
  const scripts = temp.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove dangerous attributes
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(el => {
    // Remove event handler attributes
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
    
    // Sanitize href and src to prevent javascript: protocol
    if (el.hasAttribute('href')) {
      const href = el.getAttribute('href');
      if (href.toLowerCase().startsWith('javascript:')) {
        el.removeAttribute('href');
      }
    }
    if (el.hasAttribute('src')) {
      const src = el.getAttribute('src');
      if (src.toLowerCase().startsWith('javascript:')) {
        el.removeAttribute('src');
      }
    }
  });
  
  element.innerHTML = temp.innerHTML;
}

/**
 * Create element with safe content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string} textContent - Text content (will be escaped)
 * @returns {HTMLElement} - Created element
 */
export function createElement(tag, attributes = {}, textContent = '') {
  const element = document.createElement(tag);
  
  // Set attributes (skip dangerous ones)
  Object.entries(attributes).forEach(([key, value]) => {
    if (!key.startsWith('on') && key !== 'innerHTML') {
      element.setAttribute(key, value);
    }
  });
  
  // Set text content (automatically escaped)
  if (textContent) {
    element.textContent = textContent;
  }
  
  return element;
}

/**
 * Validate and sanitize URL
 * @param {string} url - URL to validate
 * @param {Array<string>} allowedProtocols - Allowed protocols (default: http, https, mailto)
 * @returns {string|null} - Sanitized URL or null if invalid
 */
export function sanitizeURL(url, allowedProtocols = ['http:', 'https:', 'mailto:']) {
  try {
    const parsed = new URL(url, window.location.origin);
    if (allowedProtocols.includes(parsed.protocol)) {
      return parsed.href;
    }
    return null;
  } catch (e) {
    return null;
  }
}
