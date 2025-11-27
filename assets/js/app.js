/**
 * Main Application Entry Point
 * Initializes all components and animations
 */

import { initPageLoader } from './components/pageLoader.js';
import { initializeContent } from './config.js';
import { initNavigation } from './components/navigation.js';
// DISABLED: Locomotive Scroll causing issues
// import { initLocomotiveScroll } from './components/locomotiveScroll.js';
import { initScrollProgress } from './components/scrollProgress.js';
import { initTextHighlight } from './components/textHighlight.js';
import { initLinkAnimations } from './components/linkAnimations.js';
import { initSectionAnimations } from './components/sectionAnimations.js';
import { initCounterAnimation } from './components/counterAnimation.js';
import { initWorkCardHover } from './components/workCardHover.js';
import { initTimelineAnimation } from './components/timelineAnimation.js';
import { initLogoCarousel } from './components/logoCarousel.js';
// DISABLED: Parallax causing stuttering
// import { initParallaxEffect } from './components/parallaxEffect.js';
import { initWorkScrollLock } from './components/workScrollLock.js';
import { initMagazineAbout } from './components/magazineAbout.js';
import { initHorizontalScrollWork } from './components/horizontalScrollWork.js';
import { PillHeadersController } from './components/pillHeaders.js';
import { initFormSecurity } from './components/formSecurity.js';
import { initProjects } from './components/projects.js';
import { initBackToTop } from './components/back-to-top.js';
import { initPullToRefresh } from './components/pull-to-refresh.js';
import { initProjectPillAnimation } from './components/projectPillAnimation.js';
import { initRotatingTestimonials } from './components/rotatingTestimonials.js';
import { initContactEnhancements } from './components/contactEnhancements.js';
import { initWorkThreeBackground } from './components/workThreeBackground.js';
import { initFAQPillHeader } from './components/faqPillHelper.js';
import { initFooterCtaAnimation } from './components/footerCtaAnimation.js';
import { initServicesConfig } from './components/servicesConfig.js';
// FAQ toggle is now inline in the FAQ component
import './components/heroThree.js'; // Hero video initialization happens here

(function () {
  // Initialize page loader first
  initPageLoader();
  
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Define global initialization function for components that need to run after HTML loads
  window.initializeApp = function () {
    console.log('🚀 Initializing app after components loaded');
    // Initialize navigation after DOM is ready
    setTimeout(() => {
      initNavigation();
      console.log('✅ Navigation initialized');
    }, 100);
  };

  // Initialize portfolio content from config
  initializeContent().then(() => {
    // DISABLED: Locomotive Scroll causing issues with hero section
    // const locomotiveScroll = initLocomotiveScroll();
    // window.locomotiveScroll = locomotiveScroll;
    console.log('⚡ Locomotive Scroll disabled - using native scroll');

    // Initialize all components immediately with native scroll
    setTimeout(() => {
      // Navigation will be initialized via window.initializeApp after components load
      initScrollProgress();
      initTextHighlight();
      initLinkAnimations();
      initSectionAnimations();
      initWorkCardHover();
      initTimelineAnimation();
      initLogoCarousel();
      // initParallaxEffect(); // DISABLED - causing stuttering
      initWorkScrollLock();
      initMagazineAbout();
      try { initFormSecurity(); } catch (e) { console.error('Error initializing Form Security:', e); }
      try { initHorizontalScrollWork(); } catch (e) { console.error('Error initializing Work Scroll:', e); }
      try { initProjects(); } catch (e) { console.error('Error initializing Projects:', e); }
      try { initProjectPillAnimation(); } catch (e) { console.error('Error initializing Project Pills:', e); }
      try { initBackToTop(); } catch (e) { console.error('Error initializing Back to Top:', e); }
      try { initPullToRefresh(); } catch (e) { console.error('Error initializing Pull to Refresh:', e); }
      try { initRotatingTestimonials(); } catch (e) { console.error('Error initializing Rotating Testimonials:', e); }
      try { initContactEnhancements(); } catch (e) { console.error('Error initializing Contact Enhancements:', e); }
      try { initWorkThreeBackground(); } catch (e) { console.error('Error initializing Work Three Background:', e); }
      try { initServicesConfig(); } catch (e) { console.error('Error initializing Services Config:', e); }
      // Footer CTA Animation initialized with delay (line ~73)
      // FAQ toggle is now inline in the FAQ component - no initialization needed

      // Initialize counter animation after a delay to ensure DOM is ready
      setTimeout(() => {
        initCounterAnimation();
      }, 100);

      // Initialize pill headers
      setTimeout(() => {
        window.pillHeaders = new PillHeadersController();
        // Initialize FAQ pill header helper
        initFAQPillHeader();
      }, 200);

      // Initialize footer CTA animation after components are loaded
      setTimeout(() => {
        initFooterCtaAnimation();
      }, 800);

      // Refresh ScrollTrigger after everything is initialized
      setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
          console.log('🔄 ScrollTrigger refreshed');
        }
      }, 500);
    }, 100);
  });

  // Auto-refresh on window resize
  let resizeTimeout;
  let initialWidth = window.innerWidth;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Only refresh if width actually changed (not just height on mobile address bar)
      if (Math.abs(window.innerWidth - initialWidth) > 50) {
        console.log('🔄 Window resized significantly - refreshing page');
        window.location.reload();
      }
    }, 500); // Wait 500ms after user stops resizing
  });
})();
