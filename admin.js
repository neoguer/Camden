// Admin Panel JavaScript
// Camden Archambeau Website

// State management
let currentVideos = [];
let currentBio = {};
let currentPerformances = [];
let hasUnsavedChanges = false;

// Initialize Netlify Identity
if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => {
        if (user) {
            showDashboard();
        }
    });

    window.netlifyIdentity.on('login', () => {
        showDashboard();
        window.netlifyIdentity.close();
    });

    window.netlifyIdentity.on('logout', () => {
        window.location.reload();
    });
}

// Check if user is logged in
function checkAuth() {
    const user = netlifyIdentity.currentUser();
    if (user) {
        showDashboard();
    } else {
        // Open login modal automatically
        netlifyIdentity.open();
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadCurrentContent();
}

// Logout
document.getElementById('logout-btn')?.addEventListener('click', () => {
    if (hasUnsavedChanges) {
        if (!confirm('You have unsaved changes. Are you sure you want to logout?')) {
            return;
        }
    }
    netlifyIdentity.logout();
});

// Sidebar navigation
document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;

        // Update active button
        document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show corresponding section
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${section}`).classList.add('active');
    });
});

// Load current content from website files
async function loadCurrentContent() {
    try {
        // Load videos from media.html
        const response = await fetch('media.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract video embeds
        const videoSlides = doc.querySelectorAll('.carousel-slide');
        currentVideos = Array.from(videoSlides).map((slide, index) => {
            const iframe = slide.querySelector('iframe');
            const title = slide.querySelector('h3');
            const src = iframe?.getAttribute('src') || '';
            const videoId = extractYouTubeId(src);

            return {
                id: index,
                videoId: videoId,
                title: title?.textContent || `Performance ${index + 1}`,
                url: `https://www.youtube.com/watch?v=${videoId}`
            };
        });

        renderVideoList();
        showStatus('Content loaded successfully', 'success');
    } catch (error) {
        console.error('Error loading content:', error);
        showStatus('Error loading content', 'error');
    }
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Render video list
function renderVideoList() {
    const container = document.getElementById('video-list');

    if (currentVideos.length === 0) {
        container.innerHTML = '<p style="color: #666;">No videos yet. Add your first video below.</p>';
        return;
    }

    container.innerHTML = currentVideos.map((video, index) => `
        <div class="video-item" data-id="${video.id}">
            <div class="video-info">
                <h4>${video.title}</h4>
                <p>${video.url}</p>
            </div>
            <div class="video-actions">
                ${index > 0 ? '<button class="btn-icon move-up" onclick="moveVideo(' + index + ', -1)">↑</button>' : ''}
                ${index < currentVideos.length - 1 ? '<button class="btn-icon move-down" onclick="moveVideo(' + index + ', 1)">↓</button>' : ''}
                <button class="btn-icon delete" onclick="deleteVideo(${index})">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Add new video
document.getElementById('add-video-btn')?.addEventListener('click', () => {
    const urlInput = document.getElementById('new-video-url');
    const titleInput = document.getElementById('new-video-title');

    const url = urlInput.value.trim();
    const title = titleInput.value.trim() || `Performance ${currentVideos.length + 1}`;

    if (!url) {
        showStatus('Please enter a YouTube URL', 'error');
        return;
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
        showStatus('Invalid YouTube URL', 'error');
        return;
    }

    currentVideos.push({
        id: currentVideos.length,
        videoId: videoId,
        title: title,
        url: `https://www.youtube.com/watch?v=${videoId}`
    });

    renderVideoList();
    urlInput.value = '';
    titleInput.value = '';
    hasUnsavedChanges = true;

    showStatus('Video added! Remember to save changes.', 'success');
});

// Delete video
function deleteVideo(index) {
    if (!confirm('Are you sure you want to remove this video?')) return;

    currentVideos.splice(index, 1);
    renderVideoList();
    hasUnsavedChanges = true;
    showStatus('Video removed! Remember to save changes.', 'success');
}

// Move video
function moveVideo(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= currentVideos.length) return;

    const temp = currentVideos[index];
    currentVideos[index] = currentVideos[newIndex];
    currentVideos[newIndex] = temp;

    renderVideoList();
    hasUnsavedChanges = true;
}

// Save videos
document.getElementById('save-videos-btn')?.addEventListener('click', async () => {
    if (currentVideos.length === 0) {
        showStatus('Please add at least one video', 'error');
        return;
    }

    const user = netlifyIdentity.currentUser();
    if (!user) {
        showStatus('Please login to save changes', 'error');
        return;
    }

    try {
        showStatus('Saving changes...', 'success');

        // Generate updated HTML for carousel
        const carouselHTML = generateCarouselHTML(currentVideos);

        // Show instructions for now (until GitHub integration is set up)
        showSaveInstructions(carouselHTML);

        hasUnsavedChanges = false;
    } catch (error) {
        console.error('Error saving:', error);
        showStatus('Error saving changes', 'error');
    }
});

// Generate carousel HTML
function generateCarouselHTML(videos) {
    const slides = videos.map((video, index) => `
                            <!-- Video ${index + 1} -->
                            <div class="carousel-slide${index === 0 ? ' active' : ''}">
                                <div class="video-wrapper">
                                    <iframe src="https://www.youtube.com/embed/${video.videoId}"
                                            frameborder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowfullscreen>
                                    </iframe>
                                </div>
                                <h3>${video.title}</h3>
                            </div>`).join('');

    const indicators = videos.map((video, index) =>
        `                    <button class="carousel-dot${index === 0 ? ' active' : ''}" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>`
    ).join('\n');

    return {
        slides,
        indicators,
        count: videos.length
    };
}

// Show save instructions (temporary until GitHub API integration)
function showSaveInstructions(html) {
    const message = `
        <div style="max-width: 600px; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <h3 style="margin-bottom: 1rem;">Changes Ready to Save!</h3>
            <p style="margin-bottom: 1rem;">Your carousel has been updated with ${html.count} video(s).</p>
            <p style="margin-bottom: 1rem; color: #666;">To complete the update:</p>
            <ol style="margin-left: 1.5rem; margin-bottom: 1.5rem; line-height: 1.8;">
                <li>Download the updated HTML code below</li>
                <li>Update your media.html file</li>
                <li>Commit and push to GitHub</li>
            </ol>
            <button onclick="downloadHTMLUpdate()" class="btn-primary" style="margin-right: 0.5rem;">Download Update</button>
            <button onclick="closeModal()" class="btn-cancel">Close</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'save-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    modal.innerHTML = message;
    document.body.appendChild(modal);

    // Store HTML for download
    window.pendingCarouselHTML = html;
}

// Download HTML update
function downloadHTMLUpdate() {
    const html = window.pendingCarouselHTML;
    const instructions = `
<!--
CAROUSEL UPDATE INSTRUCTIONS
============================

Replace the carousel section in media.html (and all theme folders) with this code:

1. Find the "carousel-track" div
2. Replace the carousel-slide divs with the new slides below
3. Update the carousel-dots section with the new indicators

SLIDES:
-->
${html.slides}

<!--
INDICATORS:
-->
${html.indicators}

<!--
After updating, commit and push to GitHub.
The changes will appear on your live site after deployment.
-->
    `;

    const blob = new Blob([instructions], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carousel-update.html';
    a.click();
    URL.revokeObjectURL(url);

    showStatus('Update downloaded! Follow the instructions in the file.', 'success');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('save-modal');
    if (modal) modal.remove();
}

// Cancel changes
document.getElementById('cancel-videos-btn')?.addEventListener('click', () => {
    if (!hasUnsavedChanges || confirm('Discard unsaved changes?')) {
        loadCurrentContent();
        hasUnsavedChanges = false;
    }
});

// Show status message
function showStatus(message, type = 'success') {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = `status-message show ${type}`;

    setTimeout(() => {
        statusEl.classList.remove('show');
    }, 5000);
}

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
