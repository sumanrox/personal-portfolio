/**
 * GSAP ScrollSmoother Integration
 * Smooth scrolling with GSAP - more stable and better integrated
 */

export function initLocomotiveScroll() {
  console.log('Initializing GSAP ScrollSmoother...');

  // Wait for GSAP and ScrollSmoother to be available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof ScrollSmoother === 'undefined') {
    console.warn('GSAP ScrollSmoother not loaded yet, retrying...');
    setTimeout(initLocomotiveScroll, 100);
    return null;
  }

  const scrollContainer = document.querySelector('[data-scroll-container]');
  if (!scrollContainer) {
    console.error('Scroll container not found. Add data-scroll-container to your main wrapper.');
    return null;
  }

  // Add required wrapper structure for ScrollSmoother
  const wrapper = document.querySelector('#smooth-wrapper');
  const content = document.querySelector('#smooth-content');
  
  if (!wrapper || !content) {
    console.error('ScrollSmoother requires #smooth-wrapper and #smooth-content elements');
    return null;
  }

  // Detect if mobile/tablet
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

  // Register ScrollSmoother plugin
  gsap.registerPlugin(ScrollSmoother);

  // On mobile: disable ScrollSmoother completely for native scrolling
  if (isMobile) {
    console.log('⚡ Mobile detected - using native scroll for best performance');
    
    // Create compatibility layer without actual ScrollSmoother
    window.locomotiveScroll = {
      scrollTo: (target, options = {}) => {
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        } else {
          const element = typeof target === 'string' ? document.querySelector(target) : target;
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      },
      scroll: {
        instance: {
          scroll: {
            get y() {
              return window.pageYOffset || window.scrollY;
            }
          }
        }
      },
      on: (event, callback) => {
        if (event === 'scroll') {
          window.addEventListener('scroll', () => callback({ scroll: { y: window.pageYOffset } }));
        }
      },
      update: () => {
        ScrollTrigger.refresh();
      }
    };
    
    return null;
  }

  // Desktop only: Initialize ScrollSmoother with minimal settings
  const smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.2, // Lighter smooth for desktop
    effects: false, // Disable all parallax effects
    smoothTouch: false, // Never smooth on touch
    normalizeScroll: false, // Don't normalize
    ignoreMobileResize: true,
  });

  // Store globally for compatibility with existing code
  window.locomotiveScroll = {
    scrollTo: (target, options = {}) => {
      if (typeof target === 'number') {
        smoother.scrollTo(target, options.duration !== undefined ? options.duration / 1000 : true);
      } else {
        smoother.scrollTo(target, true, options.offset ? `top ${options.offset}px` : 'top top');
      }
    },
    scroll: {
      instance: {
        scroll: {
          get y() {
            return smoother.scrollTop();
          }
        }
      }
    },
    on: (event, callback) => {
      if (event === 'scroll') {
        ScrollTrigger.addEventListener('scrollEnd', () => callback({ scroll: { y: smoother.scrollTop() } }));
      }
    },
    update: () => {
      ScrollTrigger.refresh();
    }
  };

  // Update ScrollTrigger on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

  console.log('✅ GSAP ScrollSmoother initialized');
  return smoother;
}

export function destroyLocomotiveScroll(smoother) {
  if (smoother && smoother.kill) {
    smoother.kill();
    console.log('ScrollSmoother destroyed');
  }
}
