/**
 * Scroll Progress Bar Component
 * Displays an animated rainbow gradient progress bar in the navbar
 */

export function initScrollProgress() {
  // Get the progress bar element in the navbar
  const progressBar = document.getElementById('scroll-progress-bar');
  
  if (!progressBar) {
    console.warn('Scroll progress bar element not found');
    return;
  }

  // Update progress on scroll
  const updateProgress = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    let scrollTop = 0;
    if (window.locomotiveScroll && window.locomotiveScroll.scroll) {
      scrollTop = window.locomotiveScroll.scroll.instance.scroll.y || 0;
    } else {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    }
    
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    const percentage = Math.min(scrollPercent, 100);
    
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(percentage));
  };

  // Update on scroll with throttling for performance
  let ticking = false;
  
  // Listen to Locomotive Scroll if available
  if (window.locomotiveScroll) {
    window.locomotiveScroll.on('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });
  } else {
    // Fallback to window scroll
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Initial update
  updateProgress();
  
  console.log('✅ Scroll progress bar initialized');
}
