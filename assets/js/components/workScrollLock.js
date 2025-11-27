/**
 * Work Section Scroll Lock Component
 * Locks scrolling to work section until all findings are viewed
 */

export function initWorkScrollLock() {
  console.log('Work section scroll lock - DISABLED for better UX');
  
  // This feature has been disabled to prevent scroll interference
  // The work section now scrolls naturally without pinning
  
  const workSection = document.getElementById('work');
  if (!workSection) {
    return;
  }

  // Simple intersection observer for sidebar highlighting only
  const findings = workSection.querySelectorAll('[id^="finding"]');
  const navLinks = workSection.querySelectorAll('.work-nav-link');
  
  if (findings.length === 0 || navLinks.length === 0) {
    return;
  }

  // Intersection observer to track which card is visible
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const findingId = entry.target.id;
        const index = Array.from(findings).findIndex(f => f.id === findingId);
        
        if (index !== -1) {
          updateSidebarActive(navLinks, index);
        }
      }
    });
  }, observerOptions);

  // Observe all findings
  findings.forEach(finding => observer.observe(finding));

  // Smooth scroll on nav click
  navLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      findings[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  function updateSidebarActive(navLinks, activeIndex) {
    navLinks.forEach((link, i) => {
      if (i === activeIndex) {
        link.classList.remove('border-gray-300');
        link.classList.add('border-black', 'bg-gray-50');
      } else {
        link.classList.remove('border-black', 'bg-gray-50');
        link.classList.add('border-gray-300');
      }
    });
  }

  console.log('Work section natural scroll with sidebar highlighting enabled');
}
