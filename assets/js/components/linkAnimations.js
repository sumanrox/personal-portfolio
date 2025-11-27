/**
 * Link Animations Component
 * Handles hover effects and smooth transitions for links
 */

export function initLinkAnimations() {
  // Simple link hover effects
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, { x: 3, duration: 0.2, ease: 'power2.out' });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(link, { x: 0, duration: 0.2, ease: 'power2.out' });
    });
  });
}
