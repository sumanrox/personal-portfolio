import { loadData } from '../utils/dataLoader.js';

export async function initWork() {
    const data = await loadData('work');
    if (!data) return;

    renderWork(data);

    // Re-initialize icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderWork(data) {
    const gridContainer = document.getElementById('work-grid');
    if (!gridContainer || !data.research) return;

    gridContainer.innerHTML = data.research.map((item, index) => {
        const severityColors = {
            'CRITICAL': 'bg-red-500',
            'HIGH': 'bg-orange-500',
            'CHAIN': 'bg-purple-500',
            'PAPER': 'bg-blue-500'
        };

        const severityColor = severityColors[item.severity] || 'bg-gray-500';

        return `
      <div class="group relative bg-white border-2 border-black/10 hover:border-black transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <!-- Top accent bar -->
        <div class="absolute top-0 left-0 w-full h-1 ${severityColor}"></div>

        <div class="p-8 h-full flex flex-col">
          <div class="flex justify-between items-start mb-6">
            <div>
              <span class="inline-block ${severityColor} text-white text-xs font-manrope font-bold px-2 py-1 uppercase tracking-wider rounded-md">
                ${item.severity}
              </span>
              <div class="text-xs font-manrope text-gray-400 mt-2">${item.cve}</div>
            </div>
            <div class="text-right">
              <div class="text-xs font-manrope text-gray-400 mb-1">YEAR</div>
              <div class="font-manrope text-sm font-bold text-black">${item.year}</div>
            </div>
          </div>

          <div class="mb-auto">
            <h3 class="text-2xl md:text-3xl font-bold leading-tight mb-3 font-manrope group-hover:underline decoration-2 underline-offset-4">
              ${item.title}
            </h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              ${item.description}
            </p>
          </div>

          <div class="border-t border-black/10 pt-6">
            <div class="flex items-center justify-between flex-wrap gap-4 mb-4">
              ${item.stats.map((stat, i) => `
                <div class="flex-1 min-w-[80px]">
                  <div class="text-[10px] uppercase tracking-widest font-bold text-black/50 mb-1">${stat.label}</div>
                  <div class="font-manrope font-black text-2xl ${stat.color ? `text-${stat.color}-500` : 'text-black'}">${stat.value}</div>
                </div>
                ${i < item.stats.length - 1 ? '<div class="hidden md:block w-px h-12 bg-black/20"></div>' : ''}
              `).join('')}
            </div>
            ${item.link ? `
              <a href="${item.link.url}" class="inline-flex items-center gap-2 text-sm font-manrope font-bold text-black hover:underline group/link">
                <i data-lucide="${item.link.icon || 'external-link'}" class="w-4 h-4"></i>
                ${item.link.text}
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    }).join('');
}
