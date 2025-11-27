// Contact Section Enhancements
// Calendly modal and character counter

export function initContactEnhancements() {
  // Character counter for textarea
  const textarea = document.querySelector('#contact-message');
  const charCount = document.getElementById('charCount');
  
  if (textarea && charCount) {
    textarea.addEventListener('input', function() {
      const count = this.value.length;
      charCount.textContent = count;
      if (count > 500) {
        charCount.classList.add('text-red-500');
      } else {
        charCount.classList.remove('text-red-500');
      }
    });
  }
  
  // Calendly - Open in new tab
  window.openCalendly = function() {
    window.open('YOUR_CALENDLY_LINK', '_blank');
  };
}
