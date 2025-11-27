/**
 * Project Number Pill Animation
 * Same bracket sliding animation as pill headers
 */

export function initProjectPillAnimation() {
    console.log('🎯 Initializing project pill animations...');

    function animateProjectNumber(item) {
        const openBracket = item.querySelector('.project-open-bracket');
        const closeBracket = item.querySelector('.project-close-bracket');
        const number = item.querySelector('.project-number');

        if (!openBracket || !closeBracket || !number) return;

        const tl = gsap.timeline();

        // Step 1: Fade in open bracket
        tl.to(openBracket, {
            opacity: 1,
            duration: 0.15,
            ease: "power2.out"
        });

        // Step 2: Position close bracket at open bracket, then slide right
        const numberWidth = number.offsetWidth;
        tl.set(closeBracket, {
            x: -(numberWidth + 16),
            opacity: 1
        });

        tl.to(closeBracket, {
            x: 0,
            duration: 0.25,
            ease: "power2.inOut"
        });

        // Step 3: Number blinks during slide (exact same as pillHeaders)
        tl.to(number, {
            opacity: 1,
            duration: 0.04,
            repeat: 4,
            yoyo: true,
            ease: "power2.inOut"
        }, "-=0.15");

        // Step 4: Ensure number stays visible
        tl.set(number, {
            opacity: 1
        });
    }

    // Animate on scroll with ScrollTrigger
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach((item, index) => {
        ScrollTrigger.create({
            trigger: item,
            start: "top 80%",
            once: true,
            onEnter: () => {
                setTimeout(() => {
                    animateProjectNumber(item);
                }, index * 100); // Stagger by 100ms
            }
        });
    });

    console.log('✅ Project pill animations initialized');
}
