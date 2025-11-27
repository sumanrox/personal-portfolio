import { getConfig } from '../config.js';
import { logger } from '../utils/logger.js';
import { escapeHTML, sanitizeURL } from '../utils/domSanitizer.js';

export function initProjects() {
    const projectsContainer = document.querySelector('#projects-grid');
    if (!projectsContainer) return;

    const projects = getConfig('projects');
    if (!projects || projects.length === 0) {
        renderPlaceholders(projectsContainer);
        return;
    }

    renderProjects(projectsContainer, projects);

    // Initialize Animations
    initEntranceAnimation();
    initTiltEffect();
    initMagneticEffect();
}

function renderProjects(container, projects) {
    // Sanitize project data before rendering
    const sanitizedProjects = projects.map(project => ({
        ...project,
        name: escapeHTML(project.name || ''),
        description: escapeHTML(project.description || ''),
        github: sanitizeURL(project.github) || '#',
        tags: (project.tags || []).map(tag => escapeHTML(tag))
    }));
    
    container.innerHTML = sanitizedProjects.map((project, index) => {
        // Pattern: 8, 4, 6, 6 for visual variety
        let colSpanClass = 'md:col-span-6 lg:col-span-6';
        if (index % 4 === 0) colSpanClass = 'md:col-span-6 lg:col-span-8';
        else if (index % 4 === 1) colSpanClass = 'md:col-span-6 lg:col-span-4';

        const iconName = getIconForTags(project.tags);

        return `
            <div class="project-card col-span-1 ${colSpanClass} group">
                <div class="project-content">
                    <div class="flex justify-between items-start mb-6 w-full">
                        <div class="project-icon-wrapper" data-magnetic-strength="0.3">
                            <i data-lucide="${iconName}" class="w-8 h-8"></i>
                        </div>
                        <a href="${project.github}" target="_blank" class="project-link" aria-label="View Project">
                            <i data-lucide="arrow-up-right" class="w-5 h-5"></i>
                        </a>
                    </div>
                    
                    <div class="mt-auto">
                        <h3 class="project-title">${project.name}</h3>
                        <p class="project-description">
                            ${project.description}
                        </p>
                        
                        <div class="project-meta">
                            <div class="project-tags">
                                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                            <div class="project-stats">
                                <div class="stat" title="Stars">
                                    <i data-lucide="star" class="w-4 h-4"></i>
                                    <span>${Math.floor(Math.random() * 500) + 50}</span>
                                </div>
                                <div class="stat" title="Forks">
                                    <i data-lucide="git-fork" class="w-4 h-4"></i>
                                    <span>${Math.floor(Math.random() * 50) + 5}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="project-bg-hover"></div>
            </div>
        `;
    }).join('');

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function initEntranceAnimation() {
    const cards = document.querySelectorAll('.project-card');

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.from(cards, {
            scrollTrigger: {
                trigger: '#projects-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            autoAlpha: 0, // Handles opacity + visibility
            duration: 1,
            stagger: 0.15,
            ease: 'power4.out',
            clearProps: 'transform', // Clear transform after animation to avoid conflict with hover
            onComplete: () => {
                cards.forEach(c => c.style.opacity = '1');
            }
        });

        // Failsafe: Ensure visibility after 2 seconds even if ScrollTrigger doesn't fire
        setTimeout(() => {
            cards.forEach(card => {
                if (getComputedStyle(card).opacity === '0') {
                    gsap.to(card, { autoAlpha: 1, duration: 0.5 });
                }
            });
        }, 2000);

    } else {
        // Fallback if GSAP is not loaded
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    }
}

function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Subtle tilt
            const rotateX = ((y - centerY) / centerY) * -1.5;
            const rotateY = ((x - centerX) / centerX) * 1.5;

            gsap.to(card, {
                transformPerspective: 1000,
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.01,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.7,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

function initMagneticEffect() {
    const magnets = document.querySelectorAll('.project-icon-wrapper');

    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const strength = parseFloat(magnet.getAttribute('data-magnetic-strength')) || 0.5;

            gsap.to(magnet, {
                x: x * strength,
                y: y * strength,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

function renderPlaceholders(container) {
    logger.warn('No projects found in config');
}

function getIconForTags(tags) {
    const lowerTags = tags.map(t => t.toLowerCase());
    if (lowerTags.includes('python') || lowerTags.includes('bash')) return 'terminal';
    if (lowerTags.includes('react') || lowerTags.includes('javascript') || lowerTags.includes('typescript')) return 'layout';
    if (lowerTags.includes('security') || lowerTags.includes('research') || lowerTags.includes('pentesting')) return 'shield';
    if (lowerTags.includes('cloud') || lowerTags.includes('aws')) return 'cloud';
    if (lowerTags.includes('api') || lowerTags.includes('graphql')) return 'server';
    return 'code';
}
