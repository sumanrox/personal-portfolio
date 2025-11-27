/**
 * Back to Top Button Functionality
 */

export function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    // Show/Hide button based on scroll position
    const handleScroll = (scrollY) => {
        if (scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    // Check for Locomotive Scroll
    if (window.locomotiveScroll) {
        window.locomotiveScroll.on('scroll', (args) => {
            handleScroll(args.scroll.y);
        });
    } else {
        window.addEventListener('scroll', () => {
            handleScroll(window.scrollY);
        });
    }

    // Smooth scroll to top on click
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // If using Locomotive Scroll
        const scrollContainer = document.querySelector('[data-scroll-container]');
        if (window.locomotiveScroll) {
            window.locomotiveScroll.scrollTo(0, {
                duration: 1000,
                disableLerp: false
            });
        } else {
            // Fallback to native smooth scroll
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}
