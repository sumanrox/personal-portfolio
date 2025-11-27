/**
 * Services Section Configuration Loader
 * Loads and applies settings from services-config.json
 */

export async function initServicesConfig() {
  try {
    const response = await fetch('config/services-config.json');
    if (!response.ok) {
      console.warn('Services config not found, using defaults');
      return;
    }

    const config = await response.json();
    
    // Apply theme/color inversion
    if (config.cta?.theme) {
      applyTheme(config.cta.theme);
    }
    
    // Apply CTA video configuration
    if (config.cta?.video) {
      applyCTAVideo(config.cta.video);
    }

    // Apply CTA text configuration
    if (config.cta?.text) {
      applyCTAText(config.cta.text);
    }

  } catch (error) {
    console.error('Error loading services config:', error);
  }
}

/**
 * Apply theme and color inversion
 */
function applyTheme(themeConfig) {
  const ctaSection = document.querySelector('#services .mt-16.border-4');
  
  if (!ctaSection) return;

  if (themeConfig.invertColors) {
    // Dark theme - white text on dark background
    ctaSection.classList.add('bg-black', 'text-white', 'border-white');
    ctaSection.classList.remove('bg-white', 'text-black', 'border-black');
    
    // Update corner accents
    const corners = ctaSection.querySelectorAll('.absolute.w-4, .absolute.w-6');
    corners.forEach(corner => {
      corner.classList.add('bg-white');
      corner.classList.remove('bg-black');
    });
    
    // Update text colors
    const description = ctaSection.querySelector('p');
    if (description) {
      description.classList.remove('text-black/70');
      description.classList.add('text-white/70');
    }
    
    // Update badge
    const badge = ctaSection.querySelector('.border-2.border-black');
    if (badge) {
      badge.classList.remove('border-black');
      badge.classList.add('border-white');
    }
    
    // Update buttons
    const primaryBtn = ctaSection.querySelector('a[href="#contact"]');
    if (primaryBtn) {
      primaryBtn.classList.remove('bg-black', 'text-white', 'border-black', 'hover:bg-white', 'hover:text-white');
      primaryBtn.classList.add('bg-white', 'text-black', 'border-white', 'hover:bg-black', 'hover:text-white');
    }
    
    const secondaryBtn = ctaSection.querySelector('a[href="#work"]');
    if (secondaryBtn) {
      secondaryBtn.classList.remove('bg-white', 'text-black', 'border-black');
      secondaryBtn.classList.add('bg-black', 'text-white', 'border-white');
    }
    
    // Update trust indicators
    const indicators = ctaSection.querySelectorAll('.text-black\\/60');
    indicators.forEach(ind => {
      ind.classList.remove('text-black/60');
      ind.classList.add('text-white/60');
    });
    
    const dots = ctaSection.querySelectorAll('.bg-black.rounded-full');
    dots.forEach(dot => {
      dot.classList.remove('bg-black');
      dot.classList.add('bg-white');
    });
    
    const borderDiv = ctaSection.querySelector('.border-black\\/10');
    if (borderDiv) {
      borderDiv.classList.remove('border-black/10');
      borderDiv.classList.add('border-white/10');
    }
  } else {
    // Light theme (default) - ensure default classes
    ctaSection.classList.remove('bg-black', 'text-white', 'border-white');
    ctaSection.classList.add('bg-white', 'text-black', 'border-black');
  }
}

/**
 * Apply video background to CTA section
 */
function applyCTAVideo(videoConfig) {
  const video = document.getElementById('services-cta-video');
  const overlay = document.getElementById('services-cta-overlay');

  if (!video) return;

  if (videoConfig.enabled && videoConfig.src) {
    video.src = videoConfig.src;
    video.autoplay = videoConfig.autoplay ?? true;
    video.loop = videoConfig.loop ?? true;
    video.muted = videoConfig.muted ?? true;
    video.load();
    video.style.display = 'block';

    // Apply overlay settings
    if (overlay && videoConfig.overlay) {
      if (videoConfig.overlay.enabled) {
        overlay.style.opacity = videoConfig.overlay.opacity ?? 0.85;
        overlay.style.backgroundColor = videoConfig.overlay.color ?? '#ffffff';
        overlay.style.display = 'block';
      } else {
        overlay.style.display = 'none';
      }
    }
  } else {
    video.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
  }
}

/**
 * Apply text content to CTA section (optional - for dynamic content)
 */
function applyCTAText(textConfig) {
  // This is optional - can be used to dynamically update text from config
  // Currently the text is in the HTML, but this allows for easy CMS integration
  console.log('CTA text config loaded:', textConfig);
}

// Auto-initialize when services component loads
if (typeof window !== 'undefined') {
  // Wait for services component to be loaded
  const observer = new MutationObserver((mutations, obs) => {
    if (document.getElementById('services-cta-video')) {
      initServicesConfig();
      obs.disconnect();
    }
  });

  if (document.getElementById('services-cta-video')) {
    initServicesConfig();
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}
