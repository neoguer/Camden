// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

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
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scroll animation for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Gallery lightbox effect (simple version)
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
                <p>${item.querySelector('.gallery-overlay p').textContent}</p>
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
`;
document.head.appendChild(style);

// Preload hero image
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    hero.style.opacity = '1';
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
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        formStatus.className = 'form-status';
    }, 5000);
}

console.log('Camden Archambeau - Official Website');
console.log('© 2024 All Rights Reserved');
