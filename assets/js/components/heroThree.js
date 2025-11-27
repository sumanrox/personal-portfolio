/**
 * Hero Section Controller
 * Initializes hero video backgrounds and color scheme management
 */

import { initHeroVideo } from './heroVideo.js';

// Initialize hero video system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initHeroVideo();
    });
} else {
    initHeroVideo();
}

console.log('✨ Hero section controller loaded');

