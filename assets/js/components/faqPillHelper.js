// Manual FAQ Pill Header Animation Trigger
// This ensures the FAQ pill header animates when the section comes into view

export function initFAQPillHeader() {
    const faqPillContainer = document.getElementById('faq-pill-container');
    if (!faqPillContainer) {
        console.warn('FAQ pill container not found');
        return;
    }

    // Wait for the main pill headers controller to initialize
    setTimeout(() => {
        if (window.pillHeaders) {
            // Find the FAQ pill in the pills array
            const faqPill = window.pillHeaders.pills.find(p => p.sectionName === 'faq');

            if (faqPill) {
                console.log('✅ FAQ pill found, checking visibility...');

                // Check if it's in viewport and animate if needed
                if (window.pillHeaders.isPillInViewport(faqPill) && !faqPill.animated) {
                    console.log('🎬 Manually animating FAQ pill header');
                    window.pillHeaders.animatePill(faqPill);
                }
            } else {
                console.warn('⚠️ FAQ pill not found in pills array');
            }
        } else {
            console.warn('⚠️ Pill headers controller not initialized');
        }
    }, 1000);
}
