/**
 * Work Card Hover Component
 * Subtle hover effect for work items
 */

export function initWorkCardHover() {
  const workCards = document.querySelectorAll('.work-card');
  
  if (!workCards.length) {
    console.warn('No work cards found');
    return;
  }

  workCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.transform = 'translateY(-4px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  console.log('Work card hover initialized');
}
