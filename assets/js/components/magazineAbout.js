// Magazine About Section Animations
export function initMagazineAbout() {
  // Wait for DOM to be ready
  setTimeout(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Stats counter animation - one by one
    const statCounters = document.querySelectorAll('.stat-counter');
    
    if (statCounters.length > 0) {
      // Create a master timeline that triggers when first counter is in view
      const statsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: statCounters[0],
          start: 'top 95%',
          toggleActions: 'play none none reset'
        }
      });
      
      statCounters.forEach((counter, index) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.parentElement.querySelector('.text-xs').textContent.includes('CVEs') ? '+' : 
                       counter.parentElement.querySelector('.text-xs').textContent.includes('Bounties') ? 'K+' : '%';
        
        // Add each counter animation to master timeline with stagger delay
        statsTimeline.to({ val: 0 }, {
          val: target,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: function() {
            if (suffix === '%') {
              counter.textContent = Math.round(this.targets()[0].val) + suffix;
            } else if (suffix === 'K+') {
              counter.textContent = '$' + Math.round(this.targets()[0].val) + suffix;
            } else {
              counter.textContent = Math.round(this.targets()[0].val) + suffix;
            }
          }
        }, index * 0.2); // 0.2s delay between each counter
      });
    }
    
    // Skill bars animation - one by one
    const skillBars = document.querySelectorAll('.skill-bar');
    
    // Create a master timeline that triggers when first bar is in view
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: skillBars[0],
        start: 'top 80%', // Changed from 95% to 80% for better mobile visibility
        once: true
      }
    });
    
    skillBars.forEach((bar, index) => {
      const targetWidth = bar.getAttribute('data-width');
      const percentageElement = bar.closest('.skill-bar-item').querySelector('.skill-percentage');
      
      // Add each bar animation to master timeline with stagger delay
      masterTimeline.to(bar, {
        width: targetWidth + '%',
        duration: 0.8,
        ease: 'power2.out'
      }, index * 0.15); // 0.15s delay between each bar
      
      // Animate counter at the same time as bar
      masterTimeline.to({ val: 0 }, {
        val: targetWidth,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: function() {
          percentageElement.textContent = Math.round(this.targets()[0].val) + '%';
        }
      }, index * 0.15); // Same delay as bar
    });
  }, 300);
}
