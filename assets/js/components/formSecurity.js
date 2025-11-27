/**
 * Form Security Module
 * Implements client-side validation, rate limiting, and XSS prevention
 */

export function initFormSecurity() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  // Rate limiting storage
  const RATE_LIMIT_KEY = 'form_submission_time';
  const RATE_LIMIT_MS = 60000; // 1 minute between submissions

  // XSS Prevention: Sanitize input
  const sanitizeInput = (input) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  // Email validation regex (RFC 5322 simplified)
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 254;
  };

  // Check rate limiting
  const isRateLimited = () => {
    const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
    if (!lastSubmission) return false;

    const timeSince = Date.now() - parseInt(lastSubmission, 10);
    return timeSince < RATE_LIMIT_MS;
  };

  // Helper to update button state
  const updateButtonState = (type, message) => {
    const submitBtn = document.getElementById('contact-submit-btn');
    const submitText = document.getElementById('submit-text');

    if (!submitBtn || !submitText) return;

    // Reset classes
    submitBtn.classList.remove('btn-loading', 'btn-success', 'btn-error');

    if (type === 'loading') {
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');
      submitText.textContent = 'TRANSMITTING...';
    } else if (type === 'success') {
      submitBtn.classList.add('btn-success');
      submitText.textContent = 'MESSAGE SENT';

      // Reset after delay
      setTimeout(() => {
        resetButton();
      }, 3000);
    } else if (type === 'error') {
      submitBtn.classList.add('btn-error');
      submitBtn.classList.add('shake-error');
      submitText.textContent = message ? message.toUpperCase() : 'TRANSMISSION FAILED';

      // Remove shake animation
      setTimeout(() => {
        submitBtn.classList.remove('shake-error');
      }, 500);

      // Reset after delay
      setTimeout(() => {
        resetButton();
      }, 3000);
    }
  };

  const resetButton = () => {
    const submitBtn = document.getElementById('contact-submit-btn');
    const submitText = document.getElementById('submit-text');

    if (!submitBtn) return;

    submitBtn.disabled = false;
    submitBtn.classList.remove('btn-loading', 'btn-success', 'btn-error');
    submitText.textContent = 'Send Message';
  };

  // Form submission handler
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot (bot detection)
    const honeypot = contactForm.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
      console.warn('Honeypot triggered - potential bot submission');
      return;
    }

    // Rate limiting check
    if (isRateLimited()) {
      updateButtonState('error', 'Please wait a moment');
      return;
    }

    // Get form values
    const name = contactForm.querySelector('#contact-name').value.trim();
    const email = contactForm.querySelector('#contact-email').value.trim();
    const company = contactForm.querySelector('#contact-company').value.trim();
    const message = contactForm.querySelector('#contact-message').value.trim();

    // Validation
    if (!name || name.length < 2) {
      updateButtonState('error', 'Invalid Name');
      return;
    }

    if (!isValidEmail(email)) {
      updateButtonState('error', 'Invalid Email');
      return;
    }

    if (!message || message.length < 10) {
      updateButtonState('error', 'Message too short');
      return;
    }

    // Sanitize all inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      company: sanitizeInput(company),
      message: sanitizeInput(message),
      timestamp: new Date().toISOString()
    };

    // Show loading state
    updateButtonState('loading');

    // Simulate API call
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Form submitted with sanitized data:', sanitizedData);

      // Update rate limit timestamp
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());

      // Show success state
      updateButtonState('success');

      // Reset form
      contactForm.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      updateButtonState('error', 'Transmission Failed');
    }
  });

  // Real-time email validation
  const emailInput = contactForm.querySelector('#contact-email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const email = emailInput.value.trim();
      if (email && !isValidEmail(email)) {
        emailInput.classList.add('border-red-500');
      } else {
        emailInput.classList.remove('border-red-500');
      }
    });
  }

  // Text Scramble Effect
  const scrambleText = (element, finalText) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let iterations = 0;

    // Clear any existing interval to prevent conflicts
    if (element.dataset.interval) {
      clearInterval(parseInt(element.dataset.interval));
    }

    const interval = setInterval(() => {
      element.innerText = finalText
        .split('')
        .map((letter, index) => {
          if (index < iterations) {
            return finalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iterations >= finalText.length) {
        clearInterval(interval);
        element.dataset.interval = '';
      }

      iterations += 1 / 2; // Speed of reveal
    }, 30);

    element.dataset.interval = interval.toString();
  };

  // Add hover listener to button
  const submitBtn = document.getElementById('contact-submit-btn');
  const submitText = document.getElementById('submit-text');

  if (submitBtn && submitText) {
    submitBtn.addEventListener('mouseenter', () => {
      // Only scramble if not loading/success/error
      if (!submitBtn.disabled && !submitBtn.classList.contains('btn-success') && !submitBtn.classList.contains('btn-error')) {
        scrambleText(submitText, 'Send Message');
      }
    });
  }

  console.log('✅ Form security initialized with button feedback and animations');
}
