// Pill Headers Animation Controller
export class PillHeadersController {
  constructor() {
    this.pills = [];
    this.initializePills();
  }

  initializePills() {
    const pillContainers = [
      'about-pill-container',
      'services-pill-container',
      'experience-pill-container',
      'projects-pill-container',
      'skills-pill-container',
      'work-pill-container',
      'testimonials-pill-container',
      'faq-pill-container',
      'contact-pill-container',
      'footer-pill-container'
    ];

    pillContainers.forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        const pillData = this.createPillData(containerId);
        this.pills.push(pillData);
        this.setupScrollTrigger(pillData);
      }
    });

    // Don't check visible pills on initialization - let ScrollTrigger handle it
    console.log('🏷️ Pill headers configured with ScrollTrigger');
  }

  createPillData(containerId) {
    const sectionName = containerId.replace('-pill-container', '');
    const triangleId = `${sectionName}-triangle`;
    const openBracketId = `${sectionName}-open-bracket`;
    const closeBracketId = `${sectionName}-close-bracket`;
    const textId = `${sectionName}-pill-text`;

    return {
      container: document.getElementById(containerId),
      triangle: document.getElementById(triangleId),
      openBracket: document.getElementById(openBracketId),
      closeBracket: document.getElementById(closeBracketId),
      text: document.getElementById(textId),
      sectionName: sectionName,
      animated: false,
      isAnimating: false,
      timeline: null
    };
  }

  animatePill(pillData) {
    // Skip if already animated
    if (pillData.animated || pillData.isAnimating) return;

    pillData.isAnimating = true;

    // Kill any existing timeline
    if (pillData.timeline) pillData.timeline.kill();

    pillData.timeline = gsap.timeline({
      onComplete: () => {
        pillData.isAnimating = false;
        pillData.animated = true;
      }
    });

    const pillHeader = pillData.container.querySelector('.pill-section-header');

    // Step 0: Diagonal fill animation of the polygon - smoother easing
    pillData.timeline.fromTo(pillHeader,
      {
        opacity: 0,
        clipPath: 'polygon(0 35%, 0 0, 0 0, 0 65%, 0 100%, 0 100%)'
      },
      {
        opacity: 1,
        clipPath: 'polygon(0 35%, 10.7% 0, 100% 0, 100% 65%, 89.3% 100%, 0% 100%)',
        duration: 0.35,
        ease: "power3.out"
      }
    );

    // Step 1: Fade in triangle and open bracket - smoother
    pillData.timeline.to([pillData.triangle, pillData.openBracket], {
      opacity: 1,
      duration: 0.18,
      stagger: 0.06,
      ease: "power3.out"
    });

    // Step 2: Close bracket slides from left to right, revealing text
    const textWidth = this.getElementWidth(pillData.text);

    // Position close bracket at open bracket position initially
    pillData.timeline.set(pillData.closeBracket, {
      x: -(textWidth + 8),
      opacity: 1
    });

    // Animate close bracket sliding to final position - smoother ease
    pillData.timeline.to(pillData.closeBracket, {
      x: 0,
      duration: 0.3,
      ease: "power3.inOut"
    });

    // Step 3: Text appears with blinking animation during bracket slide
    pillData.timeline.to(pillData.text, {
      opacity: 1,
      duration: 0.06,
      repeat: 3,
      yoyo: true,
      ease: "power2.inOut"
    }, "-=0.2");

    // Step 4: Ensure text stays visible
    pillData.timeline.set(pillData.text, {
      opacity: 1
    });
  }

  getElementWidth(element) {
    if (!element) return 0;

    const clone = element.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.opacity = '1';
    document.body.appendChild(clone);
    const width = clone.offsetWidth;
    document.body.removeChild(clone);
    return width;
  }

  resetPill(pillData) {
    if (pillData.timeline) pillData.timeline.kill();

    const pillHeader = pillData.container.querySelector('.pill-section-header');

    gsap.set(pillHeader, {
      opacity: 0,
      clipPath: 'polygon(0 35%, 0 0, 0 0, 0 65%, 0 100%, 0 100%)'
    });

    gsap.set([pillData.triangle, pillData.openBracket, pillData.closeBracket, pillData.text], {
      opacity: 0,
      x: 0
    });

    pillData.animated = false;
    pillData.isAnimating = false;
  }

  checkVisiblePills() {
    this.pills.forEach(pillData => {
      if (this.isPillInViewport(pillData) && !pillData.animated && !pillData.isAnimating) {
        this.animatePill(pillData);
      }
    });
  }

  isPillInViewport(pillData) {
    if (!pillData.container) return false;

    const rect = pillData.container.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Check if pill is in the "trigger zone" (same as ScrollTrigger settings)
    const triggerStart = windowHeight * 0.8; // 80% from top
    const triggerEnd = windowHeight * 0.2; // 20% from bottom

    return (
      rect.top < triggerStart &&
      rect.bottom > triggerEnd
    );
  }

  setupScrollTrigger(pillData) {
    const section = pillData.container.closest('section') || pillData.container.closest('footer');

    if (!section) {
      console.warn('No section found for pill:', pillData.sectionName);
      return;
    }

    // Reset pill to initial state
    const pillHeader = pillData.container.querySelector('.pill-section-header');
    if (pillHeader) {
      gsap.set(pillHeader, {
        opacity: 0,
        clipPath: 'polygon(0 35%, 0 0, 0 0, 0 65%, 0 100%, 0 100%)'
      });
    }
    gsap.set([pillData.triangle, pillData.openBracket, pillData.closeBracket, pillData.text], {
      opacity: 0,
      x: 0
    });

    // Use IntersectionObserver for all pills (works with native scroll)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !pillData.animated && !pillData.isAnimating) {
          this.animatePill(pillData);
        } else if (!entry.isIntersecting && pillData.animated) {
          // Reset pill when it goes out of view
          this.resetPill(pillData);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20% 0px'
    });

    observer.observe(section);
    
    // Store observer for cleanup if needed
    pillData.observer = observer;
  }

  // Method to manually trigger all animations (useful for testing)
  animateAllPills() {
    this.pills.forEach(pill => {
      this.animatePill(pill);
    });
  }

  // Reset all pills (useful for debugging)
  resetAllPills() {
    this.pills.forEach(pillData => {
      gsap.set([pillData.triangle, pillData.openBracket, pillData.closeBracket, pillData.text], {
        opacity: 0,
        x: 0
      });
      pillData.animated = false;
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other components to load
    setTimeout(() => {
      window.pillHeaders = new PillHeadersController();
      console.log('🏷️ Pill headers initialized');
    }, 100);
  });
} else {
  // DOM already loaded
  setTimeout(() => {
    window.pillHeaders = new PillHeadersController();
    console.log('🏷️ Pill headers initialized');
  }, 100);
}