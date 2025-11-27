/**
 * Navigation Component
 * Handles mobile menu toggle, smooth scrolling, active states, and scroll behavior
 */

export function initNavigation() {
  const nav = document.getElementById('main-nav');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const navContainer = nav?.querySelector('.nav-container');

  if (!nav || !mobileMenuToggle || !mobileMenu) {
    console.warn('Navigation: Required elements not found');
    return;
  }

  // Mobile Blog Dropdown
  const mobileBlogTrigger = document.querySelector('.mobile-blog-trigger');
  const mobileBlogContent = document.querySelector('.mobile-blog-content');

  if (mobileBlogTrigger && mobileBlogContent) {
    mobileBlogTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = mobileBlogContent.style.display === 'block';
      
      mobileBlogContent.style.display = isOpen ? 'none' : 'block';
      mobileBlogTrigger.classList.toggle('open', !isOpen);
    });
  }

  // Mobile Tools Dropdown
  const mobileToolsTrigger = document.querySelector('.mobile-tools-trigger');
  const mobileToolsContent = document.querySelector('.mobile-tools-content');

  if (mobileToolsTrigger && mobileToolsContent) {
    mobileToolsTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = mobileToolsContent.style.display === 'block';
      
      mobileToolsContent.style.display = isOpen ? 'none' : 'block';
      mobileToolsTrigger.classList.toggle('open', !isOpen);
    });
  }

  // Mobile Menu Toggle
  let isMenuOpen = false;

  mobileMenuToggle.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    
    mobileMenu.classList.toggle('open', isMenuOpen);
    mobileMenuToggle.classList.toggle('open', isMenuOpen);
    mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);

    // Update icon
    const icon = mobileMenuToggle.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', isMenuOpen ? 'x' : 'menu');
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !nav.contains(e.target)) {
      isMenuOpen = false;
      mobileMenu.classList.remove('open');
      mobileMenuToggle.classList.remove('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      
      const icon = mobileMenuToggle.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', 'menu');
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    }
  });

  // Smooth Scroll with offset for fixed nav
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Close mobile menu if open
          if (isMenuOpen) {
            isMenuOpen = false;
            mobileMenu.classList.remove('open');
            mobileMenuToggle.classList.remove('open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
              icon.setAttribute('data-lucide', 'menu');
              if (typeof lucide !== 'undefined') {
                lucide.createIcons();
              }
            }
          }

          // Calculate offset (navbar height + some padding)
          const navHeight = nav.offsetHeight;
          const offset = navHeight + 40;
          
          // Use Locomotive Scroll (ScrollSmoother) scrollTo
          if (window.locomotiveScroll) {
            window.locomotiveScroll.scrollTo(targetElement, {
              offset: -offset,
              duration: 1000
            });
          } else {
            // Fallback to native smooth scroll
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }

          // Update active state
          updateActiveNavLink(href);
        }
      }
    });
  });

  // Update active nav link based on scroll position
  function updateActiveNavLink(activeHref = null) {
    if (activeHref) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === activeHref);
      });
    } else {
      // Auto-detect based on scroll position
      const sections = ['hero-section', 'about', 'services', 'experience', 'work', 'projects', 'testimonials', 'faq', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let currentSection = '';
      
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = `#${sectionId}`;
          }
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentSection);
      });
    }
  }

  // Scroll behavior - add scrolled class for styling
  let scrollTimeout;

  function handleScroll() {
    // Get scroll position from Locomotive if available, otherwise use window
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class for visual feedback
    if (scrollTop > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Update active link on scroll (debounced)
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateActiveNavLink();
    }, 100);
  }

  // Listen to both native scroll and Locomotive scroll events
  window.addEventListener('scroll', handleScroll);
  
  if (window.locomotiveScroll) {
    window.locomotiveScroll.on('scroll', handleScroll);
  }

  // Initial active state
  updateActiveNavLink();

  // GSAP Animation Enhancement (if available)
  if (typeof gsap !== 'undefined') {
    // Animate nav links on hover
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          scale: 1.05,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
    });

    // Animate CTA button
    const ctaButton = document.querySelector('.nav-cta');
    if (ctaButton) {
      ctaButton.addEventListener('mouseenter', () => {
        gsap.to(ctaButton, {
          scale: 1.05,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      ctaButton.addEventListener('mouseleave', () => {
        gsap.to(ctaButton, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
    }
  }

  console.log('✅ Navigation initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}
