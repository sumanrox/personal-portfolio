/**
 * Logo Carousel Component
 * Handles infinite scrolling logo carousel with interactive controls
 */

export function initLogoCarousel() {
  class LogoCarousel {
    constructor() {
      this.container = document.getElementById('logo-carousel');
      this.track = document.getElementById('logo-track');
      this.isPaused = false;
      this.init();
    }

    init() {
      if (!this.container || !this.track) {
        console.warn('Logo carousel elements not found');
        return;
      }

      this.setupInfiniteScroll();
      console.log('🎠 Logo carousel initialized with CSS-based infinite scroll');
    }

    setupInfiniteScroll() {
      // Clone all logo items for seamless infinite scroll
      const items = Array.from(this.track.children);
      const clone = items.map(item => item.cloneNode(true));
      
      // Append clones to create seamless loop
      clone.forEach(item => this.track.appendChild(item));
      
      // Calculate total width of original items
      const firstItem = items[0];
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth;
        const gap = parseFloat(getComputedStyle(this.track).gap) || 48;
        const totalWidth = (itemWidth + gap) * items.length;
        
        // Set CSS variable for animation duration (based on width for consistent speed)
        const duration = totalWidth / 50; // ~50px per second
        this.track.style.setProperty('--scroll-duration', `${duration}s`);
      }
      
      // Start animation
      this.track.classList.add('scrolling');
    }

    pause() {
      this.track.style.animationPlayState = 'paused';
    }

    resume() {
      this.track.style.animationPlayState = 'running';
    }

    destroy() {
      this.track.classList.remove('scrolling');
    }
  }

  // Initialize logo carousel
  return new LogoCarousel();
}