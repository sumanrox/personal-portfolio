// Rotating Testimonials with Progress Bar
export function initRotatingTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const progressBar = document.querySelector('.testimonial-progress-bar');
    
    if (!slides.length || !progressBar) return;
    
    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds per slide
    let intervalId;
    let animationFrameId;
    
    function resetProgressBar() {
        progressBar.style.animation = 'none';
        progressBar.offsetHeight; // Trigger reflow
        progressBar.style.animation = null;
        progressBar.classList.remove('animating');
    }
    
    function startProgressBar() {
        resetProgressBar();
        // Use requestAnimationFrame for smoother start
        requestAnimationFrame(() => {
            progressBar.classList.add('animating');
        });
    }
    
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Add active class to current slide
        slides[index].classList.add('active');
        
        // Reinitialize Lucide icons for the new slide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Start progress bar animation
        startProgressBar();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function startRotation() {
        // Clear any existing interval
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        // Start the rotation
        intervalId = setInterval(nextSlide, slideInterval);
        
        // Start initial progress bar
        startProgressBar();
    }
    
    function stopRotation() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        resetProgressBar();
    }
    
    // Pause on hover
    const featuredCard = document.querySelector('.testimonials-featured-card');
    if (featuredCard) {
        featuredCard.addEventListener('mouseenter', stopRotation);
        featuredCard.addEventListener('mouseleave', startRotation);
    }
    
    // Pause when page is hidden (user switches tabs)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopRotation();
        } else {
            startRotation();
        }
    });
    
    // Initialize
    showSlide(0);
    startRotation();
    
    // Cleanup function
    return () => {
        stopRotation();
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}
