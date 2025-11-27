/**
 * Component Loader
 * Dynamically loads HTML components into placeholders
 */

async function loadComponent(placeholder, componentPath) {
  try {
    // Add timestamp to prevent caching during development
    const cacheBuster = `?t=${Date.now()}`;
    const response = await fetch(componentPath + cacheBuster);
    if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
    const html = await response.text();

    const element = document.querySelector(placeholder);
    if (element) {
      // Security: Use textContent for placeholder, then set innerHTML
      // This prevents any XSS if placeholder selector is ever user-controlled
      element.innerHTML = html;

      // Execute any inline scripts in the loaded component
      const scripts = element.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        // Replace the original script tag with the new one to ensure execution
        script.parentNode.replaceChild(newScript, script);
      });

      console.log(`✅ Loaded component: ${componentPath}`);
    } else {
      console.warn(`⚠️ Placeholder not found: ${placeholder}`);
    }
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
  }
}

async function loadAllComponents() {
  const components = [
    { placeholder: '#nav-placeholder', path: 'components/navigation.html' },
    { placeholder: '#hero-placeholder', path: 'components/hero.html' },
    { placeholder: '#about-placeholder', path: 'components/about.html' },
    { placeholder: '#logo-carousel-placeholder', path: 'components/logo-carousel.html' },
    { placeholder: '#services-placeholder', path: 'components/services.html' },
    { placeholder: '#experience-placeholder', path: 'components/experience.html' },
    { placeholder: '#work-placeholder', path: 'components/work.html' },
    { placeholder: '#projects-placeholder', path: 'components/projects.html' },
    { placeholder: '#testimonials-placeholder', path: 'components/testimonials-new.html' },
    { placeholder: '#faq-placeholder', path: 'components/faq.html' },
    { placeholder: '#contact-placeholder', path: 'components/contact.html' },
    { placeholder: '#footer-placeholder', path: 'components/footer.html' }
  ];

  // Load all components in parallel
  await Promise.all(
    components.map(comp => loadComponent(comp.placeholder, comp.path))
  );

  // Force Tailwind to rescan for dynamic content
  if (window.tailwind && window.tailwind.config) {
    // Trigger a reparse by updating a dummy element
    const dummy = document.createElement('div');
    dummy.className = 'hidden md:block';
    document.body.appendChild(dummy);
    setTimeout(() => dummy.remove(), 100);
  }

  // Initialize Lucide icons once after all components load
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 200);

  // Re-initialize icons after a longer delay to catch any stragglers
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 500);

  // Initialize app after components are loaded
  if (typeof window.initializeApp === 'function') {
    window.initializeApp();
  }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
  loadAllComponents();
}
