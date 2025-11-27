/**
 * Hero Video Controller - Simplified Version
 * Handles video backgrounds and comprehensive color scheme management
 */

export class HeroVideoController {
    constructor() {
        this.config = null;
        this.currentDevice = null;
        this.videoElement = null;
        this.heroSection = null;
    }

    /**
     * Initialize the hero video system
     */
    async init() {
        try {
            // Load configuration
            await this.loadConfig();

            // Get hero section
            this.heroSection = document.querySelector('#hero-section');
            if (!this.heroSection) {
                console.warn('Hero section not found');
                return;
            }

            // Detect device type
            this.currentDevice = this.detectDevice();

            // Apply comprehensive color scheme to ALL elements
            this.applyColors();

            // Initialize video if enabled
            if (this.config.video.enabled) {
                this.initVideo();
            }

            // Handle window resize for responsive video
            this.setupResizeHandler();

            console.log('✅ Hero video controller initialized');
        } catch (error) {
            console.error('Error initializing hero video controller:', error);
        }
    }

    /**
     * Load configuration from hero-config.json
     */
    async loadConfig() {
        try {
            const response = await fetch('config/hero-config.json');
            if (!response.ok) throw new Error('Failed to load hero config');
            this.config = await response.json();
        } catch (error) {
            console.error('Error loading hero config:', error);
            this.config = this.getDefaultConfig();
        }
    }

    /**
     * Get theme colors based on invert setting
     */
    getColors() {
        const theme = this.config.theme;

        if (theme.invertColors) {
            // Inverted: swap primary and secondary
            return {
                primary: theme.secondary,
                secondary: theme.primary,
                accent: theme.accent
            };
        }

        // Normal colors
        return {
            primary: theme.primary,
            secondary: theme.secondary,
            accent: theme.accent
        };
    }

    /**
     * Apply colors to ALL hero elements comprehensively
     */
    applyColors() {
        const colors = this.getColors();

        // Background
        this.heroSection.style.backgroundColor = colors.secondary;

        // Heading lines (all 3 lines)
        this.applyToElements('.hero-line-1', el => {
            el.style.color = colors.primary;
        });
        this.applyToElements('.hero-line-2', el => {
            el.style.color = this.withOpacity(colors.primary, 0.9);
        });
        this.applyToElements('.hero-line-3', el => {
            el.style.color = this.withOpacity(colors.primary, 0.8);
        });

        // Subheading line and text
        this.applyToElements('.hero-subheading > div', el => {
            el.style.backgroundColor = colors.primary;
        });
        this.applyToElements('.hero-subheading span', el => {
            el.style.color = this.withOpacity(colors.primary, 0.6);
        });

        // Description text
        this.applyToElements('.hero-description', el => {
            el.style.color = this.withOpacity(colors.primary, 0.7);
        });

        // Badge
        this.applyToElements('.hero-badge', el => {
            el.style.backgroundColor = this.withOpacity(colors.primary, 0.05);
            el.style.borderColor = colors.primary;
            el.style.color = colors.primary;
            el.style.setProperty('--badge-hover-bg', colors.primary);
            el.style.setProperty('--badge-hover-text', colors.secondary);
        });

        // Badge dot (keep accent color)
        this.applyToElements('.hero-badge .bg-green-500', el => {
            el.style.backgroundColor = colors.accent;
        });

        // Stat cards
        this.applyToElements('.stat-card', el => {
            el.style.backgroundColor = colors.primary;
            el.style.color = colors.secondary;
        });

        // Stat card labels
        this.applyToElements('.stat-card .text-\\[8px\\]', el => {
            el.style.color = this.withOpacity(colors.secondary, 0.6);
        });

        // Stat card icons (SVG)
        this.applyToElements('.stat-card svg', el => {
            el.style.color = this.withOpacity(colors.secondary, 0.6);
        });

        // Stat card numbers
        this.applyToElements('.stat-card .text-3xl, .stat-card .text-4xl', el => {
            el.style.color = colors.secondary;
        });

        // Primary CTA button
        const primaryCTA = this.heroSection.querySelector('.hero-cta a:first-child');
        if (primaryCTA) {
            primaryCTA.style.backgroundColor = colors.primary;
            primaryCTA.style.color = colors.secondary;

            const gradient = primaryCTA.querySelector('.absolute.inset-0');
            if (gradient) {
                gradient.style.background = `linear-gradient(to right, ${this.withOpacity(colors.primary, 0.9)}, ${colors.primary})`;
            }

            // SVG arrow in primary button
            const svg = primaryCTA.querySelector('svg');
            if (svg) svg.style.color = colors.secondary;
        }

        // Secondary CTA button
        const secondaryCTA = this.heroSection.querySelector('.hero-cta a:last-child');
        if (secondaryCTA) {
            secondaryCTA.style.backgroundColor = colors.secondary;
            secondaryCTA.style.color = colors.primary;
            secondaryCTA.style.borderColor = colors.primary;

            const gradient = secondaryCTA.querySelector('.absolute.inset-0');
            if (gradient) {
                gradient.style.backgroundColor = colors.primary;
            }

            // Get text and SVG elements
            const buttonText = secondaryCTA.querySelector('span');
            const svg = secondaryCTA.querySelector('svg');

            if (buttonText) buttonText.style.color = colors.primary;
            if (svg) svg.style.color = colors.primary;

            // Add hover handlers for both text and icon
            secondaryCTA.addEventListener('mouseenter', () => {
                if (buttonText) buttonText.style.color = colors.secondary;
                if (svg) svg.style.color = colors.secondary;
            });
            secondaryCTA.addEventListener('mouseleave', () => {
                if (buttonText) buttonText.style.color = colors.primary;
                if (svg) svg.style.color = colors.primary;
            });
        }

        console.log(`✅ Applied ${this.config.theme.invertColors ? 'inverted' : 'normal'} colors to ALL elements`);
    }

    /**
     * Helper to apply function to all matching elements
     */
    applyToElements(selector, fn) {
        const elements = this.heroSection.querySelectorAll(selector);
        elements.forEach(fn);
    }

    /**
     * Helper to create color with opacity
     */
    withOpacity(color, opacity) {
        // If it's a hex color
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    }

    /**
     * Detect device type based on viewport width
     */
    detectDevice() {
        const width = window.innerWidth;
        if (width >= 1024) return 'desktop';
        if (width >= 768) return 'tablet';
        return 'mobile';
    }

    /**
     * Initialize video background
     */
    initVideo() {
        let videoPath, enabled;

        if (this.currentDevice === 'desktop') {
            videoPath = this.config.video.desktop;
            enabled = true;
        } else if (this.currentDevice === 'tablet') {
            videoPath = this.config.video.tablet;
            enabled = true;
        } else {
            videoPath = this.config.video.mobile.path;
            enabled = this.config.video.mobile.enabled;
        }

        if (!enabled) {
            console.log(`Video disabled for ${this.currentDevice}`);
            return;
        }

        // Check if video container already exists
        let videoContainer = document.querySelector('.hero-video-container');

        if (!videoContainer) {
            videoContainer = document.createElement('div');
            videoContainer.className = 'hero-video-container';
            this.heroSection.insertBefore(videoContainer, this.heroSection.firstChild);
        } else {
            videoContainer.innerHTML = '';
        }

        // Create video element
        this.videoElement = document.createElement('video');
        this.videoElement.className = 'hero-video';
        this.videoElement.setAttribute('playsinline', '');
        this.videoElement.muted = this.config.video.muted;
        this.videoElement.loop = this.config.video.loop;
        this.videoElement.autoplay = this.config.video.autoplay;

        // Create source
        const source = document.createElement('source');
        source.src = videoPath;
        source.type = 'video/mp4';
        this.videoElement.appendChild(source);

        // Handle errors
        this.videoElement.addEventListener('error', () => {
            console.warn('Video failed to load');
            videoContainer.remove();
        });

        videoContainer.appendChild(this.videoElement);

        // Create overlay if enabled
        if (this.config.video.overlay.enabled) {
            const overlay = document.createElement('div');
            overlay.className = 'hero-video-overlay';

            const colors = this.getColors();
            const overlayColor = this.config.video.overlay.useSecondaryColor
                ? colors.secondary
                : colors.primary;

            overlay.style.backgroundColor = this.withOpacity(overlayColor, this.config.video.overlay.opacity);
            videoContainer.appendChild(overlay);
        }

        // Play video
        this.videoElement.play().catch(err => {
            console.warn('Autoplay prevented:', err);
        });

        console.log(`✅ Video loaded for ${this.currentDevice}: ${videoPath}`);
    }

    /**
     * Setup window resize handler
     */
    setupResizeHandler() {
        let resizeTimeout;
        let previousDevice = this.currentDevice;

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newDevice = this.detectDevice();

                if (newDevice !== previousDevice) {
                    console.log(`Device changed: ${previousDevice} → ${newDevice}`);
                    previousDevice = newDevice;
                    this.currentDevice = newDevice;

                    if (this.config.video.enabled) {
                        this.initVideo();
                    }
                }
            }, 500);
        });
    }

    /**
     * Get default configuration fallback
     */
    getDefaultConfig() {
        return {
            theme: {
                primary: '#000000',
                secondary: '#ffffff',
                accent: '#22c55e',
                invertColors: false
            },
            video: {
                enabled: false,
                desktop: '',
                tablet: '',
                mobile: { enabled: false, path: '' },
                overlay: { enabled: false }
            }
        };
    }
}

/**
 * Initialize hero video controller
 */
export async function initHeroVideo() {
    const controller = new HeroVideoController();
    await controller.init();
    return controller;
}
