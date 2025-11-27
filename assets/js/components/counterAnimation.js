/**
 * Counter Animation Component - Ultra Fast
 * Instant number counting animations
 */

export function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  
  if (counters.length === 0) {
    return;
  }

  counters.forEach((counter, index) => {
    const target = parseInt(counter.getAttribute('data-target'));
    
    // Animate immediately with minimal delay
    setTimeout(() => {
      let current = 0;
      const increment = target / 30; // 30 frames for ultra-fast count
      const duration = 800; // 0.8 seconds
      const frameTime = duration / 30;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current);
        }
      }, frameTime);
      
    }, 200 + (index * 80)); // Minimal stagger (200ms + 80ms per counter)
  });
}
