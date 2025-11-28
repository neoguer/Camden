// Content Loader for Camden Archambeau Website
// Loads content from JSON data files managed by Netlify CMS

// Load videos for media page
async function loadVideos() {
    try {
        console.log('Loading videos from JSON...');

        // Load videos from JSON file
        const response = await fetch('/_data/videos.json');
        if (!response.ok) {
            console.error('Failed to load videos, status:', response.status);
            return;
        }

        const data = await response.json();
        console.log('Videos data loaded:', data);

        const videos = data.videos || [];
        console.log('Number of videos:', videos.length);

        // Sort by order
        videos.sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));

        // Update carousel
        const carouselTrack = document.querySelector('.carousel-track');
        const carouselDots = document.querySelector('.carousel-dots');

        if (carouselTrack && videos.length > 0) {
            console.log('Updating carousel with', videos.length, 'videos');
            carouselTrack.innerHTML = videos.map((video, index) => `
                <div class="carousel-slide${index === 0 ? ' active' : ''}">
                    <div class="video-wrapper">
                        <iframe src="https://www.youtube.com/embed/${video.videoId}"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                        </iframe>
                    </div>
                    <h3>${video.title}</h3>
                </div>
            `).join('');
            console.log('Carousel updated successfully');
        } else {
            console.error('Carousel track not found or no videos');
        }

        if (carouselDots && videos.length > 0) {
            carouselDots.innerHTML = videos.map((video, index) =>
                `<button class="carousel-dot${index === 0 ? ' active' : ''}" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>`
            ).join('');
        }

        // Reinitialize the carousel navigation after updating content
        initializeCarousel();

    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Initialize carousel navigation
function initializeCarousel() {
    const videoCarousel = document.querySelector('.video-carousel');

    if (!videoCarousel) return;

    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;

    console.log('Initializing carousel with', slides.length, 'slides');

    // Hide navigation if only one slide
    if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        const dotsContainer = document.querySelector('.carousel-dots');
        if (dotsContainer) dotsContainer.style.display = 'none';
        return;
    }

    function showSlide(index) {
        // Handle wrapping
        if (index < 0) {
            currentSlide = slides.length - 1;
        } else if (index >= slides.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        // Calculate the offset and apply transform for smooth sliding
        const track = document.querySelector('.carousel-track');
        if (track) {
            const offset = -currentSlide * 100;
            track.style.transform = `translateX(${offset}%)`;
        }

        // Update active states
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    // Remove old event listeners by cloning buttons
    const newPrevBtn = prevBtn?.cloneNode(true);
    const newNextBtn = nextBtn?.cloneNode(true);

    if (prevBtn && newPrevBtn) {
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        newPrevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }

    if (nextBtn && newNextBtn) {
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        newNextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Initialize carousel position
    showSlide(0);
    console.log('Carousel initialized successfully');
}

// Load about page content
async function loadAbout() {
    try {
        const response = await fetch('/_data/about.json');
        if (!response.ok) return;

        const data = await response.json();

        // Update lead paragraph
        const leadElement = document.querySelector('.about-text .lead');
        if (leadElement && data.lead) {
            leadElement.textContent = data.lead;
        }

        // Update bio - convert markdown to paragraphs
        const bioContainer = document.querySelector('.about-text');
        if (bioContainer && data.bio) {
            const paragraphs = data.bio.split('\n\n').filter(p => p.trim());
            const bioHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');

            // Keep the lead paragraph, replace the rest
            if (leadElement) {
                const existingParagraphs = bioContainer.querySelectorAll('p:not(.lead)');
                existingParagraphs.forEach(p => p.remove());
                leadElement.insertAdjacentHTML('afterend', bioHTML);
            }
        }

        // Update headshot
        const imgElement = document.querySelector('.about-image img');
        if (imgElement && data.headshot) {
            imgElement.src = data.headshot;
        }

    } catch (error) {
        console.error('Error loading about content:', error);
    }
}

// Load home page content
async function loadHome() {
    try {
        const response = await fetch('/_data/home.json');
        if (!response.ok) return;

        const data = await response.json();

        if (data.title) {
            const titleElement = document.querySelector('.hero-title');
            if (titleElement) titleElement.textContent = data.title;
        }

        if (data.subtitle) {
            const subtitleElement = document.querySelector('.hero-subtitle');
            if (subtitleElement) subtitleElement.textContent = data.subtitle;
        }

        if (data.location) {
            const locationElement = document.querySelector('.hero-location');
            if (locationElement) locationElement.textContent = data.location;
        }

    } catch (error) {
        console.error('Error loading home content:', error);
    }
}

// Initialize content loading based on current page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    console.log('Content loader initialized, path:', path);

    if (path.includes('media.html')) {
        console.log('Loading media page content');
        loadVideos();
    } else if (path.includes('about.html')) {
        console.log('Loading about page content');
        loadAbout();
    } else if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        console.log('Loading home page content');
        loadHome();
    } else {
        console.log('No content loader for this page');
    }
});
