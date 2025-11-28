import { loadData } from '../utils/dataLoader.js';

export async function initServices() {
    const data = await loadData('services');
    if (!data) return;

    renderServices(data);

    // Re-initialize icons since we added new ones
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderServices(data) {
    // Render Description
    const descContainer = document.getElementById('services-description-container');
    if (descContainer && data.description) {
        descContainer.innerHTML = `
      <p class="text-lg leading-relaxed text-black/70">
        ${data.description.main}
      </p>
      <p class="text-sm leading-relaxed text-black/50 md:text-right font-manrope">
        ${data.description.trustedBy.map(line => line + '<br>').join('')}
      </p>
    `;
    }

    // Render Services Grid
    const gridContainer = document.getElementById('services-grid');
    if (gridContainer && data.services) {
        gridContainer.innerHTML = data.services.map((service, index) => {
            const isFeatured = service.featured;

            const classes = isFeatured
                ? "group relative bg-black text-white border-2 border-black transition-all duration-500 hover:shadow-[12px_12px_0px_0px_rgba(34,197,94,0.4)] p-8 md:col-span-2 lg:col-span-1 lg:row-span-2"
                : "group relative bg-white border-2 border-black/10 hover:border-black transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 overflow-hidden";

            const iconClass = isFeatured ? "service-icon-featured" : "service-icon-standard";
            const iconColor = isFeatured ? "text-green-400" : "text-black";
            const idColor = isFeatured ? "text-green-400" : "text-black/40";
            const titleClass = isFeatured ? "text-3xl md:text-4xl font-bold mb-4 font-manrope leading-tight" : "text-2xl font-bold mb-3 font-manrope";
            const descColor = isFeatured ? "text-white/70" : "text-black/60";

            // Tags rendering
            let tagsHtml = '';
            if (isFeatured) {
                tagsHtml = `
          <div class="space-y-3 mb-6">
            ${service.tags.map(tag => `
              <div class="flex items-center gap-2 text-sm">
                <div class="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span class="text-white/80">${tag}</span>
              </div>
            `).join('')}
          </div>
          ${service.certification ? `
            <div class="pt-4 border-t border-white/20">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-green-400"></i>
                <span class="text-xs font-manrope font-bold text-green-400">${service.certification}</span>
              </div>
            </div>
          ` : ''}
        `;
            } else {
                tagsHtml = `
          <div class="flex flex-wrap gap-2">
            ${service.tags.map((tag, i) => {
                    const tagClass = i === 0
                        ? "text-xs font-manrope font-bold px-2 py-1 bg-black text-white rounded-md"
                        : "text-xs font-manrope font-bold px-2 py-1 border border-black/20 rounded-md";
                    return `<span class="${tagClass}">${tag}</span>`;
                }).join('')}
          </div>
        `;
            }

            // Background decoration for non-featured
            const decoration = !isFeatured ? `
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -mr-16 -mt-16 rounded-full"></div>
      ` : `
        <div class="absolute top-0 right-0 px-3 py-1 bg-green-500 text-black text-xs font-bold uppercase tracking-wider">FEATURED</div>
      `;

            return `
        <div class="${classes}">
          ${decoration}
          <div class="${!isFeatured ? 'relative' : 'flex flex-col h-full'}">
            <div class="flex items-start justify-between ${isFeatured ? 'mb-8' : 'mb-6'}">
              <div class="${iconClass}">
                <i data-lucide="${service.icon}" class="${isFeatured ? 'w-10 h-10' : 'w-7 h-7'} ${iconColor}"></i>
              </div>
              <span class="text-xs font-manrope font-bold uppercase tracking-wider ${idColor}">${isFeatured ? '★ ' : ''}${service.id}</span>
            </div>
            <h3 class="${titleClass}">${service.title}</h3>
            <p class="${descColor} leading-relaxed mb-6 ${isFeatured ? 'flex-1' : 'text-sm'}">
              ${service.description}
            </p>
            ${tagsHtml}
          </div>
        </div>
      `;
        }).join('');
    }

    // Render CTA
    const ctaContainer = document.getElementById('services-cta-container');
    if (ctaContainer && data.cta) {
        const cta = data.cta;
        const theme = cta.theme || {};
        const isDark = theme.invertColors;

        // Classes based on theme
        const containerClasses = `mt-16 border-4 ${isDark ? 'border-white bg-black text-white' : 'border-white bg-white'} p-6 md:p-10 relative overflow-hidden`;
        const cornerClasses = `absolute w-4 h-4 md:w-6 md:h-6 ${isDark ? 'bg-white' : 'bg-black'} z-10`;
        const badgeBorder = isDark ? 'border-white' : 'border-black';
        const descColor = isDark ? 'text-white/70' : 'text-black/70';
        const trustColor = isDark ? 'text-white/60' : 'text-black/60';
        const dotColor = isDark ? 'bg-white' : 'bg-black';
        const borderDivColor = isDark ? 'border-white/10' : 'border-black/10';

        // Buttons
        const btn1 = cta.buttons[0];
        const btn2 = cta.buttons[1];

        // Primary button style
        const btn1Class = isDark
            ? "bg-white text-black border-white hover:bg-black hover:text-white"
            : "bg-black text-white border-black hover:bg-white hover:text-white hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";

        // Secondary button style
        const btn2Class = isDark
            ? "bg-black text-white border-white"
            : "bg-white text-black border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";

        ctaContainer.innerHTML = `
      <div class="${containerClasses}">
        <!-- Background Video -->
        <video id="services-cta-video" class="absolute inset-0 w-full h-full object-cover" 
          ${cta.video.autoplay ? 'autoplay' : ''} 
          ${cta.video.muted ? 'muted' : ''} 
          ${cta.video.loop ? 'loop' : ''} 
          playsinline>
          ${cta.video.enabled ? `<source src="${cta.video.src}" type="video/mp4">` : ''}
        </video>

        <!-- Video Overlay -->
        <div id="services-cta-overlay" class="absolute inset-0" 
          style="background-color: ${cta.video.overlay.color}; opacity: ${cta.video.overlay.opacity}; display: ${cta.video.overlay.enabled ? 'block' : 'none'}">
        </div>

        <!-- Brutalist corner accents -->
        <div class="${cornerClasses} top-0 left-0"></div>
        <div class="${cornerClasses} top-0 right-0"></div>
        <div class="${cornerClasses} bottom-0 left-0"></div>
        <div class="${cornerClasses} bottom-0 right-0"></div>

        <div class="text-center max-w-2xl mx-auto relative z-10">
            <!-- Status badge -->
            <div class="inline-block mb-4 md:mb-6">
                <div class="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border-2 ${badgeBorder}">
                    <div class="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-xs md:text-sm font-manrope font-bold uppercase tracking-wider">${cta.badge}</span>
                </div>
            </div>

            <!-- Main heading -->
            <h3 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 font-manrope leading-tight">
                ${cta.title}
            </h3>

            <!-- Description -->
            <p class="text-sm md:text-base lg:text-lg ${descColor} mb-6 md:mb-8 leading-relaxed px-4 md:px-0">
                ${cta.description}
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-6 md:mb-8">
                <a href="${btn1.link}"
                    class="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 border-2 font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 ${btn1Class}">
                    <span>${btn1.text}</span>
                    <i data-lucide="${btn1.icon}"
                        class="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1"></i>
                </a>
                <a href="${btn2.link}"
                    class="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 border-2 font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 ${btn2Class}">
                    <span>${btn2.text}</span>
                    <i data-lucide="${btn2.icon}"
                        class="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"></i>
                </a>
            </div>

            <!-- Trust indicators -->
            <div class="pt-4 md:pt-6 border-t ${borderDivColor}">
                <div
                    class="flex flex-col md:flex-row md:flex-nowrap justify-start md:justify-center gap-2 md:gap-6 text-xs md:text-sm font-manrope font-bold uppercase tracking-wider ${trustColor}">
                    ${cta.trustIndicators.map(indicator => `
                      <div class="flex items-center gap-2 whitespace-nowrap">
                          <div class="w-1.5 h-1.5 md:w-2 md:h-2 ${dotColor} rounded-full"></div>
                          <span>${indicator}</span>
                      </div>
                    `).join('')}
                </div>
            </div>
        </div>
      </div>
    `;
    }
}
