// Magazine About Section Animations
export function initMagazineAbout() {
  // Wait for DOM to be ready
  setTimeout(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Stats counter animation
    const statCounters = document.querySelectorAll('.stat-counter');
    
    statCounters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const suffix = counter.parentElement.querySelector('.text-xs').textContent.includes('CVEs') ? '+' : 
                     counter.parentElement.querySelector('.text-xs').textContent.includes('Bounties') ? 'K+' : '%';
      
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 95%',
          toggleActions: 'play none none reset'
        },
        onUpdate: function() {
          if (suffix === '%') {
            counter.textContent = Math.round(this.targets()[0].val) + suffix;
          } else if (suffix === 'K+') {
            counter.textContent = '$' + Math.round(this.targets()[0].val) + suffix;
          } else {
            counter.textContent = Math.round(this.targets()[0].val) + suffix;
          }
        }
      });
    });
    
    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach((bar) => {
      const targetWidth = bar.getAttribute('data-width');
      const percentageElement = bar.closest('.skill-bar-item').querySelector('.skill-percentage');
      
      // Create a timeline for synchronized animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bar,
          start: 'top 95%',
          once: true
        }
      });
      
      // Animate both width and counter together
      tl.to(bar, {
        width: targetWidth + '%',
        duration: 1,
        ease: 'power2.out'
      }, 0);
      
      tl.to({ val: 0 }, {
        val: targetWidth,
        duration: 1,
        ease: 'power2.out',
        onUpdate: function() {
          percentageElement.textContent = Math.round(this.targets()[0].val) + '%';
        }
      }, 0);
    });
  }, 300);
}
