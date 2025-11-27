// Horizontal Scroll for Work Section (Desktop Only)
export function initHorizontalScrollWork() {
    const horizontalSection = document.querySelector('.horizontal-scroll-container');
    const horizontalWrapper = document.querySelector('.horizontal-scroll-wrapper');
    let scrollTween;

    function initScroll() {
        // Kill existing tween if it exists
        if (scrollTween) {
            scrollTween.kill();
            scrollTween = null;
            // Reset transform
            gsap.set(horizontalWrapper, { x: 0 });
        }

        if (horizontalSection && horizontalWrapper) {
            // Only enable on desktop (width > 768px)
            if (window.innerWidth > 768) {
                // Calculate scroll distance: total width of wrapper - visible container width
                const scrollDistance = horizontalWrapper.scrollWidth - horizontalSection.offsetWidth;

                // Only enable if there's content to scroll
                if (scrollDistance > 0) {
                    scrollTween = gsap.to(horizontalWrapper, {
                        x: -scrollDistance,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: horizontalSection,
                            start: 'top top',
                            end: `+=${scrollDistance + 2000}`,
                            scrub: 1,
                            pin: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                            markers: false
                        }
                    });
                }
            }
        }
    }

    // Initialize on load
    initScroll();

    // Re-initialize on resize with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initScroll();
            ScrollTrigger.refresh();
        }, 200);
    });
}
