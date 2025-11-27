/**
 * Page Loader with Percentage Counter, Progress Bar, and Background Video
 */

export async function initPageLoader() {
  const loader = document.getElementById('page-loader');
  const counterText = document.getElementById('loader-text');
  const progressBar = document.getElementById('loader-progress-bar');
  const video = document.getElementById('page-loader-video');
  const loaderContainer = document.getElementById('loader-container');
  
  if (!loader || !counterText) return;

  // Prevent scrolling during loader - use class for stronger override
  document.body.classList.add('loading');

  // Load configuration
  let config = {
    video: {
      enabled: false,
      src: '',
      opacity: 0.6
    },
    counter: {
      duration: 4000
    },
    progressBar: {
      enabled: true,
      color: '#ffffff',
      height: '4px',
      borderRadius: '9999px'
    }
  };

  try {
    const response = await fetch('config/loader-config.json');
    if (response.ok) {
      config = await response.json();
    }
  } catch (error) {
    console.warn('Could not load loader config, using defaults');
  }

  // Setup video if enabled
  if (video && config.video.enabled && config.video.src) {
    console.log('🎥 Loading video:', config.video.src);
    
    // Set source element instead of video.src
    const source = video.querySelector('source');
    if (source) {
      source.src = config.video.src;
    } else {
      video.src = config.video.src;
    }
    
    video.style.opacity = config.video.opacity;
    video.style.display = 'block';
    video.load(); // Force reload with new source
    
    // Wait for video to be ready before showing UI and starting counter
    const videoReady = new Promise((resolve) => {
      if (video.readyState >= 3) {
        console.log('✅ Video already loaded');
        resolve();
      } else {
        video.addEventListener('canplay', () => {
          console.log('✅ Video can play');
          resolve();
        }, { once: true });
        video.addEventListener('error', (e) => {
          console.error('❌ Video load error:', e);
          console.error('Video error code:', video.error);
          resolve(); // Continue anyway
        }, { once: true });
        // Fallback timeout for slow connections
        setTimeout(() => {
          console.log('⏱️ Video timeout - continuing anyway');
          resolve();
        }, 3000);
      }
    });
    
    // Ensure video plays
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('✅ Video playing');
        })
        .catch(err => {
          console.warn('⚠️ Video autoplay failed:', err);
        });
    }
    
    // Wait for video, then fade in UI and start counter
    videoReady.then(() => {
      setTimeout(() => {
        if (loaderContainer) {
          loaderContainer.style.opacity = '1';
        }
        // Start counter animation after UI fades in
        setTimeout(() => {
          startCounterAnimation();
        }, 500);
      }, 200);
    });
    
    console.log('✅ Loader video enabled:', config.video.src);
  } else {
    console.log('ℹ️ Video disabled or not configured');
    // No video, show UI and start counter immediately
    if (loaderContainer) {
      loaderContainer.style.opacity = '1';
    }
    setTimeout(() => {
      startCounterAnimation();
    }, 300);
  }

  // Apply progress bar config
  if (progressBar && config.progressBar) {
    progressBar.style.background = config.progressBar.color;
    progressBar.style.height = config.progressBar.height;
    progressBar.style.borderRadius = config.progressBar.borderRadius;
  }

  // Counter animation function
  function startCounterAnimation() {
    let progress = 0;
    const duration = config.counter.duration;
    const startTime = performance.now();

    // Use requestAnimationFrame for smoother animation with easing
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Apply easeOutQuart for smooth deceleration
      const t = elapsed / duration;
      const easedProgress = t < 1 ? 100 * (1 - Math.pow(1 - t, 4)) : 100;
      
      progress = Math.min(easedProgress, 100);
      counterText.textContent = Math.floor(progress) + '%';
      
      // Update progress bar
      if (progressBar) {
        progressBar.style.width = progress + '%';
      }

      if (progress < 100) {
        requestAnimationFrame(updateCounter);
      } else {
        // Hide loader after reaching 100%
        setTimeout(hideLoader, 300);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  function hideLoader() {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      if (video) {
        video.pause();
        video.src = '';
      }
      // Re-enable scrolling
      document.body.classList.remove('loading');
    }, 500);
  }
}

// Auto-initialize when module loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageLoader);
} else {
  initPageLoader();
}
