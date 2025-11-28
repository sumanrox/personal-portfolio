import { loadData } from '../utils/dataLoader.js';

export async function initExperience() {
    const data = await loadData('experience');
    if (!data) return;

    renderExperience(data);

    // Re-initialize icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderExperience(data) {
    const gridContainer = document.getElementById('experience-grid');
    if (!gridContainer || !data.experience) return;

    gridContainer.innerHTML = data.experience.map((item, index) => {
        if (item.current) {
            return renderCurrentRole(item);
        } else if (item.type === 'community') {
            return renderCommunityCard(item);
        } else {
            return renderStandardRole(item, index);
        }
    }).join('');
}

function renderCurrentRole(item) {
    return `
    <div class="group relative bg-white border-2 border-black transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:col-span-2 overflow-hidden">
      <!-- Top accent bar -->
      <div class="absolute top-0 left-0 w-full h-2 bg-black"></div>

      <div class="relative p-6 md:p-10 lg:p-12">
        <!-- Status Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-md mb-6">
          <div class="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          <span class="text-[10px] font-manrope font-bold tracking-widest uppercase">Current Position</span>
        </div>

        <!-- Role Info -->
        <div class="mb-8">
          <h3 class="text-3xl md:text-4xl lg:text-5xl font-black leading-tight font-manrope mb-4 text-black">
            ${item.role}
          </h3>

          <p class="text-black/70 leading-relaxed mb-6 text-sm md:text-base max-w-3xl">
            ${item.description}
          </p>

          <!-- Timeline -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <div class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md">
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
              <span class="text-xs font-manrope font-bold">${item.duration}</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-md">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-black"></i>
              <span class="text-xs font-manrope font-bold text-black">${item.durationLabel}</span>
            </div>
          </div>

          <!-- Key highlights -->
          <div class="grid grid-cols-2 gap-3">
            ${item.tags.map(tag => `
              <div class="flex items-center gap-2 text-xs md:text-sm text-black/70 font-medium">
                <div class="w-1.5 h-1.5 bg-black"></div>
                <span>${tag}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Stats Section -->
        <div class="pt-6 border-t-2 border-black/10">
          <div class="flex items-center justify-between flex-wrap gap-6 md:gap-8">
            ${item.stats.map((stat, i) => `
              <div class="flex-1 min-w-[120px]">
                <div class="text-[10px] md:text-xs uppercase tracking-widest font-bold text-black/50 mb-2">${stat.label}</div>
                <div class="font-manrope font-black text-4xl md:text-5xl text-black">${stat.value}</div>
              </div>
              ${i < item.stats.length - 1 ? '<div class="hidden md:block w-px h-16 bg-black/20"></div>' : ''}
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStandardRole(item, index) {
    // Determine gradient/colors based on index or item properties if needed
    // For now, using the styles from the HTML example
    const isBlue = item.badgeColor === 'blue';
    const gradientClass = isBlue ? 'from-blue-500 to-purple-500' : 'from-orange-500 to-red-500';
    const iconBg = isBlue ? 'bg-blue-500' : 'bg-orange-500';
    const iconColor = isBlue ? 'text-blue-500' : 'text-orange-500';
    const badgeClass = isBlue ? 'bg-black text-white' : 'bg-gray-200 text-black border border-black/20';

    // Highlights or Certifications
    let footerContent = '';
    if (item.highlights) {
        footerContent = `
      <div class="border-t border-black/10 pt-6">
        <div class="space-y-2.5">
          ${item.highlights.map(highlight => `
            <div class="flex items-center gap-2.5 text-sm font-manrope text-gray-700 group/item hover:text-black transition-colors">
              <div class="w-1.5 h-1.5 ${iconBg} rounded-full group-hover/item:scale-125 transition-transform"></div>
              <span>${highlight}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    } else if (item.certifications) {
        footerContent = `
      <div class="border-t border-black/10 pt-6">
        <div class="text-xs font-manrope text-gray-400 uppercase tracking-wider mb-3">Certifications</div>
        <div class="flex flex-wrap gap-2">
          ${item.certifications.map(cert => `
            <span class="px-2.5 py-1.5 bg-gray-50 text-xs font-manrope font-bold uppercase tracking-wider border-2 border-gray-200 hover:border-black hover:bg-gray-100 transition-all rounded-md">${cert}</span>
          `).join('')}
        </div>
      </div>
    `;
    }

    return `
    <div class="group relative bg-white border-2 border-black/10 hover:border-black transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <!-- Top accent bar -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientClass}"></div>

      <div class="p-8 h-full flex flex-col">
        <div class="flex justify-between items-start mb-8">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 ${iconBg} text-white flex items-center justify-center rounded-lg">
              <i data-lucide="${item.icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="inline-block ${badgeClass} text-xs font-manrope font-bold px-2 py-1 uppercase tracking-wider rounded-md">
                ${item.badge}
              </span>
              <div class="text-xs font-manrope text-gray-400 mt-1 uppercase">${item.company.split(' ')[0]}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs font-manrope text-gray-400 mb-1">DURATION</div>
            <div class="font-manrope text-sm font-bold text-black">${item.duration}</div>
          </div>
        </div>

        <div class="mb-auto">
          <h3 class="text-2xl md:text-3xl font-bold leading-tight mb-3 font-manrope group-hover:underline decoration-2 underline-offset-4">
            ${item.role}
          </h3>
          <p class="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
            <i data-lucide="building-2" class="w-3.5 h-3.5 ${iconColor}"></i>
            ${item.company}
          </p>
          <p class="text-gray-600 leading-relaxed mb-6">
            ${item.description}
          </p>
        </div>

        ${footerContent}
      </div>
    </div>
  `;
}

function renderCommunityCard(item) {
    return `
    <div class="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-black/10 hover:border-black transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:col-span-2 overflow-hidden">
      <!-- Decorative corner accent -->
      <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-transparent opacity-50 rounded-full blur-3xl"></div>

      <div class="relative p-8 md:p-10">
        <div class="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-8">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-purple-500 text-white flex items-center justify-center rounded-xl shadow-lg">
              <i data-lucide="${item.icon}" class="w-7 h-7"></i>
            </div>
            <div>
              <h3 class="text-2xl md:text-3xl font-bold leading-tight font-manrope">${item.role}</h3>
              <p class="text-sm text-gray-500 font-manrope mt-1 flex items-center gap-2">
                <i data-lucide="users" class="w-3.5 h-3.5 text-purple-500"></i>
                ${item.subtitle}
              </p>
            </div>
          </div>
          <a href="${item.link.url}" class="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-all rounded-lg group/btn border-2 border-black">
            ${item.link.text}
            <i data-lucide="arrow-right" class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"></i>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t-2 border-black/10">
          ${item.items.map(subItem => `
            <div class="group/item p-5 bg-white border-2 border-black/5 rounded-lg hover:border-purple-200 hover:shadow-md transition-all">
              <div class="flex items-center gap-2 mb-2">
                <i data-lucide="${subItem.icon}" class="w-5 h-5 text-purple-500"></i>
                <div class="font-bold text-black text-lg font-manrope">${subItem.title}</div>
              </div>
              <div class="text-sm text-gray-600 font-manrope leading-relaxed">${subItem.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
