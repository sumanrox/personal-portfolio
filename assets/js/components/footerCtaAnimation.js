/**
 * Footer CTA Animation Component
 * Handles smooth expansion animation with text reveal and word hover effects
 * Uses Locomotive Scroll integration for proper scroll detection
 */

import { logger } from '../utils/logger.js';
import { escapeHTML } from '../utils/domSanitizer.js';

export function initFooterCtaAnimation() {
  logger.debug('Footer CTA Animation: Starting initialization...');
  
  // Wait for DOM and Locomotive to be fully loaded
  setTimeout(() => {
    const footerBox = document.querySelector('.footer-cta-box');
    const footerText = document.querySelector('.footer-cta-text');
    const locomotiveScroll = window.locomotiveScroll;

    logger.debug('Footer elements check:', {
      footerBox: !!footerBox,
      footerText: !!footerText,
      locomotiveScroll: !!locomotiveScroll,
      locomotiveScrollReady: locomotiveScroll && locomotiveScroll.scroll
    });

    if (!footerBox || !footerText) {
      logger.error('Footer CTA elements not found!');
      return;
    }

    // Set initial state
    footerBox.style.width = '1px';
    footerText.style.opacity = '0';

    // Split text into words for individual animation (safely)
    const originalText = footerText.textContent || '';
    const words = originalText.trim().split(/\s+/);
    // Use textContent to set, then wrap in spans
    const wordSpans = words.map(word => {
      const span = document.createElement('span');
      span.className = 'footer-cta-word';
      span.textContent = word; // Safe from XSS
      return span.outerHTML;
    }).join(' ');
    footerText.innerHTML = wordSpans;

    let hasAnimated = false;
    let checkCount = 0;

    // Function to check if element is in view and trigger animation
    function checkAndAnimate(locoScrollObj) {
      if (hasAnimated) return;
      
      checkCount++;
      
      // Get scroll position - handle both Locomotive and native scroll
      let scrollY = 0;
      if (locoScrollObj && locoScrollObj.scroll && locoScrollObj.scroll.instance) {
        scrollY = locoScrollObj.scroll.instance.scroll.y;
      } else if (locomotiveScroll && locomotiveScroll.scroll && locomotiveScroll.scroll.instance) {
        scrollY = locomotiveScroll.scroll.instance.scroll.y;
      } else {
        scrollY = window.scrollY || window.pageYOffset;
      }
      
      const rect = footerBox.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate actual position considering Locomotive's scroll offset
      const elementTop = rect.top + scrollY;
      const viewportBottom = scrollY + windowHeight;
      const threshold = windowHeight * 0.8;
      const inView = rect.top < threshold && rect.bottom > 0;
      
      if (checkCount <= 5 || inView) {
        logger.debug(`Footer check #${checkCount}:`, {
          scrollY: Math.round(scrollY),
          rectTop: Math.round(rect.top),
          elementTop: Math.round(elementTop),
          viewportBottom: Math.round(viewportBottom),
          threshold: Math.round(threshold),
          inView: inView
        });
      }
      
      if (inView) {
        logger.debug('Triggering footer animation');
        
        footerBox.classList.add('animate');
        footerText.classList.add('animate');
        hasAnimated = true;

        // Remove listener after animation
        if (locomotiveScroll && typeof locomotiveScroll.off === 'function') {
          locomotiveScroll.off('scroll', checkAndAnimate);
        } else {
          window.removeEventListener('scroll', checkAndAnimate);
        }
      }
    }

    // Use Locomotive Scroll events if available
    if (locomotiveScroll && locomotiveScroll.scroll) {
      logger.debug('Using Locomotive Scroll for footer animation');
      
      // Locomotive passes scroll data to the callback
      locomotiveScroll.on('scroll', (args) => {
        checkAndAnimate(locomotiveScroll);
      });
      
      // Update Locomotive and check immediately
      setTimeout(() => {
        if (locomotiveScroll.update) {
          locomotiveScroll.update();
        }
        checkAndAnimate(locomotiveScroll);
      }, 200);
    } else {
      logger.debug('Locomotive not ready, using native scroll');
      window.addEventListener('scroll', () => checkAndAnimate(), { passive: true });
      checkAndAnimate();
    }

    logger.debug('Footer CTA animation initialized');
  }, 1200); // Increased wait time for Locomotive to be ready
}

/**
 * Reset animation (useful for testing)
 */
export function resetFooterCtaAnimation() {
  const footerBox = document.querySelector('.footer-cta-box');
  const footerText = document.querySelector('.footer-cta-text');

  if (!footerBox || !footerText) return;

  // Remove animation classes
  footerBox.classList.remove('animate');
  footerText.classList.remove('animate');

  // Reset to initial state
  footerBox.style.width = '1px';
  footerText.style.opacity = '0';
  footerText.style.clipPath = 'inset(0 50% 0 50%)';

  logger.debug('Footer CTA animation reset');

  // Reinitialize
  setTimeout(() => {
    footerBox.style.width = '';
    footerText.style.opacity = '';
    footerText.style.clipPath = '';
    initFooterCtaAnimation();
  }, 100);
}
