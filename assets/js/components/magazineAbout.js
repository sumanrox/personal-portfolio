import { loadData } from '../utils/dataLoader.js';

// Magazine About Section Animations & Data Loading
export async function initMagazineAbout() {
  // Load data first
  const data = await loadData('about');
  if (data) {
    renderAboutSection(data);
  }

  // Wait for DOM to be ready and rendered
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
        const suffix = counter.getAttribute('data-suffix') || '';

        // Add each counter animation to master timeline with stagger delay
        statsTimeline.to({ val: 0 }, {
          val: target,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: function () {
            // Handle different suffix types if needed, but data-suffix handles most
            counter.textContent = Math.round(this.targets()[0].val) + suffix;
          }
        }, index * 0.2); // 0.2s delay between each counter
      });
    }

    // Skill bars animation - one by one
    const skillBars = document.querySelectorAll('.skill-bar');

    if (skillBars.length > 0) {
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
          onUpdate: function () {
            percentageElement.textContent = Math.round(this.targets()[0].val) + '%';
          }
        }, index * 0.15); // Same delay as bar
      });
    }
  }, 300);
}

function renderAboutSection(data) {
  // Render Description
  const descriptionContainer = document.getElementById('about-description');
  if (descriptionContainer && data.description) {
    descriptionContainer.innerHTML = data.description
      .map((text, index) => `<p class="${index === 0 ? 'text-lg leading-relaxed text-black/70' : 'text-base leading-relaxed text-black/60'}">${text}</p>`)
      .join('<br>'); // Using <br> for spacing or separate paragraphs if preferred

    // Better approach: separate paragraphs
    descriptionContainer.innerHTML = '';
    data.description.forEach((text, index) => {
      const p = document.createElement('p');
      p.className = index === 0 ? 'text-lg leading-relaxed text-black/70 mb-4' : 'text-base leading-relaxed text-black/60';
      p.textContent = text;
      descriptionContainer.appendChild(p);
    });
  }

  // Render Stats
  const statsContainer = document.getElementById('about-stats');
  if (statsContainer && data.stats) {
    statsContainer.innerHTML = data.stats.map(stat => {
      // Extract number and suffix from value string if needed, or use separate fields
      // Assuming data structure: { value: 50, suffix: "+ Clients", target: 50 }
      const suffix = stat.suffix.replace(stat.target, '');
      // Actually, let's just use the target and suffix from JSON
      // JSON: { "value": 50, "suffix": "+ Clients", "target": 50 }
      // The suffix in JSON includes the + sign.
      // The animation logic expects data-target="50" and we can add data-suffix="+ Clients"
      // But wait, the animation logic above splits it. Let's simplify.

      // Let's parse the suffix to separate the symbol (+ or %) from the label (Clients)
      // Actually, the previous animation logic was:
      // const suffix = counter.parentElement.querySelector('.text-xs').textContent.includes('CVEs') ? '+' : ...
      // I updated the animation logic to use `data-suffix`.

      // Let's split the suffix in the display.
      // Example: "+ Clients" -> symbol: "+", label: "Clients"
      // Or just put it all in the label?
      // The design has number big, label small.
      // "50" big, "+ Clients" small.

      return `
        <div class="flex flex-col items-start gap-1">
          <span class="text-2xl sm:text-3xl md:text-4xl font-bold stat-counter" data-target="${stat.target}" data-suffix="">0</span>
          <span class="text-xs uppercase tracking-wider text-black/60 whitespace-nowrap">${stat.suffix}</span>
        </div>
      `;
    }).join('');
  }

  // Render Skills
  const skillsContainer = document.getElementById('about-skills-container');
  if (skillsContainer && data.skills && data.skills.items) {
    skillsContainer.innerHTML = data.skills.items.map(skill => `
      <div class="skill-bar-item">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-semibold">${skill.name}</span>
          <span class="text-sm text-black/60 skill-percentage">0%</span>
        </div>
        <div class="h-2 bg-black/10 overflow-hidden rounded-full">
          <div class="skill-bar h-full bg-black rounded-full" data-width="${skill.percentage}" style="width: 0%"></div>
        </div>
      </div>
    `).join('');
  }

  // Render Certifications
  const certsContainer = document.getElementById('about-certifications');
  if (certsContainer && data.skills && data.skills.certifications) {
    certsContainer.innerHTML = data.skills.certifications.map(cert => `
      <span class="px-3 py-1 bg-black text-white text-xs font-bold">${cert}</span>
    `).join('');
  }

  // Render Arsenal
  const arsenalContainer = document.getElementById('about-arsenal-list');
  if (arsenalContainer && data.arsenal && data.arsenal.tools) {
    arsenalContainer.innerHTML = data.arsenal.tools.map(tool => `
      <div class="flex items-center gap-2 group cursor-default">
        <span class="w-1.5 h-1.5 bg-black group-hover:w-8 transition-all"></span>
        <span class="text-sm">${tool}</span>
      </div>
    `).join('');
  }

  // Render Specializations
  const specsContainer = document.getElementById('about-specializations');
  if (specsContainer && data.arsenal && data.arsenal.specializations) {
    specsContainer.innerHTML = data.arsenal.specializations.map(spec => `
      <p>• ${spec}</p>
    `).join('');
  }
}
