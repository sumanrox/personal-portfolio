/**
 * Section Animations Component - Disabled
 * All section transitions have been removed
 */

export function initSectionAnimations() {
  console.log('Section animations disabled');

  // All animations removed for cleaner, faster experience

  // Refresh ScrollTrigger on window resize (throttled for mobile performance)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

  // Refresh on orientation change (mobile/tablet)
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  });

  console.log('✨ Premium section animations initialized');
}
