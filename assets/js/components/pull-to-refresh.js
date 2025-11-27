/**
 * Pull to Refresh Functionality
 */

export function initPullToRefresh() {
    const ptrElement = document.getElementById('pull-to-refresh');
    const ptrIcon = ptrElement.querySelector('.ptr-icon');

    if (!ptrElement || !ptrIcon) return;

    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    const threshold = 150; // Pull distance required to trigger refresh

    // Helper to get scroll Y
    const getScrollY = () => {
        if (window.locomotiveScroll) {
            return window.locomotiveScroll.scroll.instance.scroll.y;
        }
        return window.scrollY;
    };

    const handleStart = (e) => {
        // Get Y coordinate from touch or mouse event
        const y = e.touches ? e.touches[0].clientY : e.clientY;

        // Ignore if touching navigation or mobile menu button
        // This prevents accidental refreshes when trying to open the menu
        if (e.target.closest('.nav-container') || e.target.closest('#mobile-menu-btn')) {
            return;
        }

        if (getScrollY() <= 0) {
            startY = y;
            isPulling = true;
        }
    };

    const handleMove = (y) => {
        if (!isPulling) return;

        currentY = y;
        const diff = currentY - startY;

        if (diff > 0 && getScrollY() <= 0) {
            // Resistance effect
            const translateY = Math.min(diff * 0.4, 80);
            ptrElement.style.transform = `translateY(${translateY - 60}px)`;
            ptrIcon.style.transform = `rotate(${diff * 2}deg)`;

            if (diff > threshold) {
                ptrIcon.style.borderColor = '#fff';
            }
        } else {
            isPulling = false;
            ptrElement.style.transform = '';
        }
    };

    const handleEnd = () => {
        if (!isPulling) return;

        const diff = currentY - startY;

        if (diff > threshold && getScrollY() <= 0) {
            // Trigger refresh
            ptrElement.style.transform = 'translateY(0)';
            ptrIcon.classList.add('loading');

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            // Reset
            ptrElement.style.transform = '';
        }

        isPulling = false;
    };

    // Touch Events
    window.addEventListener('touchstart', handleStart, { passive: true });
    window.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientY), { passive: true });
    window.addEventListener('touchend', handleEnd);

    // Mouse Events (for testing)
    window.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', (e) => {
        if (isPulling) handleMove(e.clientY);
    });
    window.addEventListener('mouseup', handleEnd);
}
