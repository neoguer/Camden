// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Page transition effect
document.querySelectorAll('a').forEach(link => {
    // Only apply to internal links (not external or anchor-only links)
    const href = link.getAttribute('href');
    if (href && href.endsWith('.html') && !link.getAttribute('target')) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const destination = href;

            // Add transition class
            document.body.classList.add('page-transitioning');

            // Navigate after transition
            setTimeout(() => {
                window.location.href = destination;
            }, 300);
        });
    }
});

// Gallery lightbox effect
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay p');
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
                <p>${overlay ? overlay.textContent : ''}</p>
            </div>
        `;
        document.body.appendChild(lightbox);

        // Add styles for lightbox
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        const lightboxContent = lightbox.querySelector('.lightbox-content');
        lightboxContent.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            text-align: center;
        `;

        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 80vh;
            border-radius: 5px;
        `;

        const lightboxText = lightbox.querySelector('p');
        lightboxText.style.cssText = `
            color: white;
            margin-top: 1rem;
            font-size: 1.2rem;
        `;

        const closeBtn = lightbox.querySelector('.close-lightbox');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 40px;
            cursor: pointer;
            font-weight: 300;
        `;

        closeBtn.addEventListener('click', () => {
            lightbox.remove();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.remove();
            }
        });
    });
});

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .page-transitioning {
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Preload hero image
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showFormStatus('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormStatus('Please enter a valid email address.', 'error');
            return;
        }

        // Disable submit button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // TODO: Replace this URL with your actual form endpoint
            // Options:
            // 1. Formspree: https://formspree.io (create account and get form endpoint)
            // 2. Your own backend API endpoint
            // 3. EmailJS: https://www.emailjs.com

            // Example with Formspree (replace YOUR_FORM_ID):
            // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {

            // For now, we'll simulate a successful submission
            // Replace this with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            showFormStatus('Thank you for your message! I will get back to you soon.', 'success');
            contactForm.reset();

            // Uncomment when you have a real endpoint:
            /*
            const response = await fetch('YOUR_ENDPOINT_HERE', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showFormStatus('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
            */
        } catch (error) {
            showFormStatus('Sorry, there was an error sending your message. Please try again or contact via social media.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

function showFormStatus(message, type) {
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.className = 'form-status';
        }, 5000);
    }
}

console.log('Camden Archambeau - Official Website');
console.log(`© ${new Date().getFullYear()} All Rights Reserved`);

// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const themePanel = document.getElementById('theme-panel');

if (themeToggle && themePanel) {
    // Toggle panel visibility
    themeToggle.addEventListener('click', () => {
        themePanel.classList.toggle('active');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#theme-switcher')) {
            themePanel.classList.remove('active');
        }
    });
}

// Google Calendar Integration for Performances
// Replace these with your actual values
const GOOGLE_CALENDAR_CONFIG = {
    API_KEY: 'YOUR_API_KEY_HERE',
    CALENDAR_ID: 'YOUR_CALENDAR_ID_HERE'
};

// Fetch and display performances from Google Calendar
async function loadCalendarPerformances() {
    const container = document.getElementById('calendar-performances');
    const noEventsMessage = document.getElementById('no-events-message');

    if (!container) return;

    // Check if credentials are configured
    if (GOOGLE_CALENDAR_CONFIG.API_KEY === 'YOUR_API_KEY_HERE' ||
        GOOGLE_CALENDAR_CONFIG.CALENDAR_ID === 'YOUR_CALENDAR_ID_HERE') {
        container.innerHTML = '<p class="calendar-error">Calendar not configured. Please add API credentials.</p>';
        return;
    }

    try {
        const now = new Date().toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_CONFIG.CALENDAR_ID)}/events?` +
            `key=${GOOGLE_CALENDAR_CONFIG.API_KEY}` +
            `&timeMin=${now}` +
            `&maxResults=10` +
            `&singleEvents=true` +
            `&orderBy=startTime`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch calendar events');
        }

        const data = await response.json();
        const events = data.items || [];

        if (events.length === 0) {
            container.innerHTML = '';
            noEventsMessage.style.display = 'block';
            return;
        }

        // Clear loading message
        container.innerHTML = '';

        // Render each event
        events.forEach(event => {
            const card = createPerformanceCard(event);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading calendar:', error);
        container.innerHTML = '<p class="calendar-error">Unable to load performances. Please try again later.</p>';
    }
}

// Create a performance card from a calendar event
function createPerformanceCard(event) {
    const card = document.createElement('div');
    card.className = 'performance-card';

    // Parse date
    const startDate = event.start.dateTime || event.start.date;
    const date = new Date(startDate);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const year = date.getFullYear();
    const time = event.start.dateTime ?
        date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';

    // Parse description for additional info
    const description = event.description || '';
    const { mainText, ticketLink, ensemble } = parseDescription(description);

    // Build card HTML
    card.innerHTML = `
        <div class="performance-date">
            <span class="month">${month} ${day}</span>
            <span class="season">${year}${time ? ' • ' + time : ''}</span>
        </div>
        <div class="performance-details">
            <h3>${event.summary || 'Performance'}</h3>
            ${event.location ? `<p class="ensemble">${event.location}</p>` : ''}
            ${ensemble ? `<p class="ensemble">${ensemble}</p>` : ''}
            ${mainText ? `<p class="description">${mainText}</p>` : ''}
            ${ticketLink ? `<a href="${ticketLink}" target="_blank" class="ticket-link">Get Tickets</a>` : ''}
        </div>
    `;

    return card;
}

// Parse description to extract ticket links and other info
function parseDescription(description) {
    if (!description) return { mainText: '', ticketLink: null, ensemble: null };

    let mainText = description;
    let ticketLink = null;
    let ensemble = null;

    // Extract ticket link (look for URLs)
    const urlRegex = /(https?:\/\/[^\s<]+)/gi;
    const urls = description.match(urlRegex);
    if (urls && urls.length > 0) {
        // Use the first URL as ticket link
        ticketLink = urls[0];
        // Remove URL from main text
        mainText = mainText.replace(urlRegex, '').trim();
    }

    // Look for "Tickets:" or similar labels
    const ticketLabelRegex = /tickets?:\s*/gi;
    mainText = mainText.replace(ticketLabelRegex, '').trim();

    // Look for ensemble/performer info (lines starting with "With:" or "Ensemble:")
    const ensembleRegex = /(?:with|ensemble|performers?):\s*([^\n]+)/gi;
    const ensembleMatch = ensembleRegex.exec(description);
    if (ensembleMatch) {
        ensemble = ensembleMatch[1].trim();
        mainText = mainText.replace(ensembleRegex, '').trim();
    }

    // Clean up extra whitespace and newlines
    mainText = mainText.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

    return { mainText, ticketLink, ensemble };
}

// Load calendar when DOM is ready (only on performances page)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('calendar-performances')) {
        loadCalendarPerformances();
    }
});
