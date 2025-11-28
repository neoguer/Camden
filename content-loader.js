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

// Load teaching page content
async function loadTeaching() {
    try {
        const response = await fetch('/_data/teaching.json');
        if (!response.ok) return;

        const data = await response.json();

        // Update lead paragraph
        const leadElement = document.querySelector('.teaching-intro .lead');
        if (leadElement && data.lead) leadElement.textContent = data.lead;

        // Update intro paragraph
        const introElement = document.querySelector('.teaching-intro p:not(.lead)');
        if (introElement && data.intro) introElement.textContent = data.intro;

        // Update feature cards
        if (data.features && data.features.length > 0) {
            const featureCards = document.querySelectorAll('.feature-card');
            data.features.forEach((feature, index) => {
                if (featureCards[index]) {
                    const titleEl = featureCards[index].querySelector('h3');
                    const descEl = featureCards[index].querySelector('p');
                    if (titleEl) titleEl.textContent = feature.title;
                    if (descEl) descEl.textContent = feature.description;
                }
            });
        }

        // Update credentials section
        if (data.credentialsTitle) {
            const credTitleEl = document.querySelector('.teaching-credentials h3');
            if (credTitleEl) credTitleEl.textContent = data.credentialsTitle;
        }
        if (data.credentials) {
            const credEl = document.querySelector('.teaching-credentials p');
            if (credEl) credEl.innerHTML = data.credentials.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }

        // Update CTA button
        if (data.ctaText) {
            const ctaBtn = document.querySelector('.teaching-cta .btn-secondary');
            if (ctaBtn) ctaBtn.textContent = data.ctaText;
        }

    } catch (error) {
        console.error('Error loading teaching content:', error);
    }
}

// Load consulting page content
async function loadConsulting() {
    try {
        const response = await fetch('/_data/consulting.json');
        if (!response.ok) return;

        const data = await response.json();

        // Update lead paragraph
        const leadElement = document.querySelector('.teaching-intro .lead');
        if (leadElement && data.lead) leadElement.textContent = data.lead;

        // Update intro paragraph
        const introElement = document.querySelector('.teaching-intro p:not(.lead)');
        if (introElement && data.intro) introElement.textContent = data.intro;

        // Update feature cards
        if (data.features && data.features.length > 0) {
            const featureCards = document.querySelectorAll('.feature-card');
            data.features.forEach((feature, index) => {
                if (featureCards[index]) {
                    const titleEl = featureCards[index].querySelector('h3');
                    const descEl = featureCards[index].querySelector('p');
                    if (titleEl) titleEl.textContent = feature.title;
                    if (descEl) descEl.textContent = feature.description;
                }
            });
        }

        // Update expertise section
        if (data.expertiseTitle) {
            const expTitleEl = document.querySelector('.teaching-credentials h3');
            if (expTitleEl) expTitleEl.textContent = data.expertiseTitle;
        }
        if (data.expertise) {
            const expEl = document.querySelector('.teaching-credentials p');
            if (expEl) expEl.innerHTML = data.expertise.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }

        // Update CTA button
        if (data.ctaText) {
            const ctaBtn = document.querySelector('.teaching-cta .btn-secondary');
            if (ctaBtn) ctaBtn.textContent = data.ctaText;
        }

    } catch (error) {
        console.error('Error loading consulting content:', error);
    }
}

// Load gallery page content
async function loadGallery() {
    try {
        const response = await fetch('/_data/gallery.json');
        if (!response.ok) return;

        const data = await response.json();

        if (data.images && data.images.length > 0) {
            const galleryGrid = document.querySelector('.gallery-grid');
            if (galleryGrid) {
                galleryGrid.innerHTML = data.images.map(img => `
                    <div class="gallery-item">
                        <img src="${img.src}" alt="${img.alt}">
                        <div class="gallery-overlay">
                            <p>${img.caption}</p>
                        </div>
                    </div>
                `).join('');
            }
        }

    } catch (error) {
        console.error('Error loading gallery content:', error);
    }
}

// Load contact page content
async function loadContact() {
    try {
        const response = await fetch('/_data/contact.json');
        if (!response.ok) return;

        const data = await response.json();

        // Update intro
        if (data.intro) {
            const introEl = document.querySelector('.contact-intro');
            if (introEl) introEl.textContent = data.intro;
        }

        // Update locations
        if (data.locations) {
            const locationsEl = document.querySelector('.contact-item p');
            if (locationsEl) locationsEl.innerHTML = data.locations.replace(/\n/g, '<br>');
        }

        // Update affiliations
        if (data.affiliations) {
            const affiliationsEl = document.querySelectorAll('.contact-item p')[1];
            if (affiliationsEl) affiliationsEl.innerHTML = data.affiliations.replace(/\n/g, '<br>');
        }

        // Update form action
        if (data.formspreeId) {
            const formEl = document.getElementById('contactForm');
            if (formEl) formEl.action = `https://formspree.io/f/${data.formspreeId}`;
        }

    } catch (error) {
        console.error('Error loading contact content:', error);
    }
}

// Initialize content loading based on current page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    console.log('Content loader initialized, path:', path);

    if (path.includes('media')) {
        console.log('Loading media page content');
        loadVideos();
    } else if (path.includes('about')) {
        console.log('Loading about page content');
        loadAbout();
    } else if (path.includes('teaching')) {
        console.log('Loading teaching page content');
        loadTeaching();
    } else if (path.includes('consulting')) {
        console.log('Loading consulting page content');
        loadConsulting();
    } else if (path.includes('gallery')) {
        console.log('Loading gallery page content');
        loadGallery();
    } else if (path.includes('contact')) {
        console.log('Loading contact page content');
        loadContact();
    } else if (path.includes('index') || path === '/' || path.endsWith('/')) {
        console.log('Loading home page content');
        loadHome();
    } else {
        console.log('No content loader for this page');
    }
});
