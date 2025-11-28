import { loadData } from '../utils/dataLoader.js';

export async function initContact() {
  // Contact section keeps its original HTML structure
  // Just re-initialize icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
