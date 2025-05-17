// Awareness page functionality for SafeGuard

document.addEventListener('DOMContentLoaded', () => {
  // Setup tab interactions
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  if (tabBtns.length && tabPanes.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show corresponding tab pane
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
  // Video player functionality
  setupVideoPlayers();
  
  // Newsletter submission
  setupNewsletterForm();
  
  // Resource card animations
  setupResourceAnimations();
  
  // Init additional page-specific code
  initAwarenessPage();
});

// Set up video player functionality
function setupVideoPlayers() {
  const videoCards = document.querySelectorAll('.video-card');
  
  videoCards.forEach(card => {
    const thumbnail = card.querySelector('.video-thumbnail');
    const playButton = card.querySelector('.play-button');
    
    if (thumbnail && playButton) {
      // Handle click on video thumbnail
      card.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Replace thumbnail with video player (simulated for this demo)
        simulateVideoPlay(thumbnail);
      });
    }
  });
}

// Simulate video playing (for demo purposes)
function simulateVideoPlay(thumbnailContainer) {
  // Get the thumbnail image
  const thumbnailImg = thumbnailContainer.querySelector('img');
  const imgSrc = thumbnailImg.src;
  
  // Create a placeholder for the video
  const videoPlaceholder = document.createElement('div');
  videoPlaceholder.className = 'video-placeholder';
  videoPlaceholder.innerHTML = `
    <div class="video-controls">
      <button class="video-play-pause">
        <i class="fas fa-pause"></i>
      </button>
      <div class="video-progress">
        <div class="video-progress-bar"></div>
      </div>
      <button class="video-volume">
        <i class="fas fa-volume-up"></i>
      </button>
      <button class="video-fullscreen">
        <i class="fas fa-expand"></i>
      </button>
    </div>
  `;
  
  // Style the placeholder
  Object.assign(videoPlaceholder.style, {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    backgroundImage: `url(${imgSrc})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'flex-end',
    borderRadius: 'var(--border-radius)'
  });
  
  // Style the controls
  const controls = videoPlaceholder.querySelector('.video-controls');
  Object.assign(controls.style, {
    width: '100%',
    padding: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '0 0 var(--border-radius) var(--border-radius)'
  });
  
  // Style the buttons
  const buttons = videoPlaceholder.querySelectorAll('button');
  buttons.forEach(button => {
    Object.assign(button.style, {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    });
  });
  
  // Style the progress bar
  const progressContainer = videoPlaceholder.querySelector('.video-progress');
  Object.assign(progressContainer.style, {
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '2px',
    flex: '1',
    position: 'relative'
  });
  
  const progressBar = videoPlaceholder.querySelector('.video-progress-bar');
  Object.assign(progressBar.style, {
    height: '100%',
    width: '0%',
    backgroundColor: 'var(--primary)',
    borderRadius: '2px',
    position: 'absolute',
    left: '0',
    top: '0',
    transition: 'width 0.1s linear'
  });
  
  // Replace the thumbnail content
  thumbnailContainer.innerHTML = '';
  thumbnailContainer.appendChild(videoPlaceholder);
  
  // Animate progress bar for demo purposes
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 0.5;
    progressBar.style.width = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(progressInterval);
    }
  }, 100);
  
  // Handle play/pause button
  const playPauseBtn = videoPlaceholder.querySelector('.video-play-pause');
  playPauseBtn.addEventListener('click', () => {
    const icon = playPauseBtn.querySelector('i');
    if (icon.classList.contains('fa-pause')) {
      icon.classList.replace('fa-pause', 'fa-play');
      clearInterval(progressInterval);
    } else {
      icon.classList.replace('fa-play', 'fa-pause');
      // Restart progress animation
      const currentProgress = parseFloat(progressBar.style.width);
      progress = currentProgress;
      progressInterval = setInterval(() => {
        progress += 0.5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);
    }
  });
}

// Set up newsletter form submission
function setupNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (!email) {
        // Show error if email is empty
        showNotification('Please enter your email address.', 'error');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }
      
      // Show loading state on button
      const submitBtn = newsletterForm.querySelector('button');
      const originalText = submitBtn.textContent;
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        // Success case
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        
        // Reset form
        newsletterForm.reset();
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    });
  }
}

// Set up resource card animations
function setupResourceAnimations() {
  const resourceCards = document.querySelectorAll('.resource-card');
  
  resourceCards.forEach(card => {
    // Add hover effect with smooth animation
    card.addEventListener('mouseenter', () => {
      const image = card.querySelector('.resource-image img');
      if (image) {
        image.style.transform = 'scale(1.05)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const image = card.querySelector('.resource-image img');
      if (image) {
        image.style.transform = '';
      }
    });
  });
}

// Initialize awareness page specific functionality
function initAwarenessPage() {
  // Handle category navigation
  const categoryLinks = document.querySelectorAll('.category-card a');
  
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Smooth scroll to section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Add highlight animation
        targetSection.classList.add('highlight');
        setTimeout(() => {
          targetSection.classList.remove('highlight');
        }, 1500);
      }
    });
  });
  
  // Add highlight style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes highlightSection {
      0% {
        background-color: transparent;
      }
      30% {
        background-color: rgba(0, 113, 227, 0.1);
      }
      100% {
        background-color: transparent;
      }
    }
    
    .highlight {
      animation: highlightSection 1.5s ease-out;
    }
  `;
  document.head.appendChild(style);
  
  // Handle downloads
  const downloadButtons = document.querySelectorAll('.download-card .btn');
  
  downloadButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Show notification for demo purposes
      showNotification('Download started. The file will be saved to your downloads folder.', 'info');
      
      // Simulate download progress notification
      setTimeout(() => {
        showNotification('Download complete!', 'success');
      }, 3000);
    });
  });
  
  // Make tabs keyboard accessible
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.setAttribute('role', 'tab');
    button.setAttribute('tabindex', '0');
    
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });
}

// Show notification (reused from auth.js)
function showNotification(message, type = 'info') {
  // Check if showNotification exists in window (defined in auth.js)
  if (window.showNotification) {
    window.showNotification(message, type);
    return;
  }
  
  // Fallback implementation if not defined in window
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${getIconForType(type)}"></i>
      <p>${message}</p>
    </div>
    <button class="close-notification">×</button>
  `;
  
  // Add styles
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'var(--white)';
  notification.style.borderRadius = 'var(--border-radius)';
  notification.style.boxShadow = 'var(--shadow-lg)';
  notification.style.padding = '12px 16px';
  notification.style.zIndex = 'var(--z-toast)';
  notification.style.display = 'flex';
  notification.style.justifyContent = 'space-between';
  notification.style.alignItems = 'center';
  notification.style.minWidth = '300px';
  notification.style.animation = 'slideInRight 0.3s ease-out forwards';
  
  // Set border color based on type
  if (type === 'success') {
    notification.style.borderLeft = '4px solid var(--success)';
  } else if (type === 'error') {
    notification.style.borderLeft = '4px solid var(--error)';
  } else if (type === 'warning') {
    notification.style.borderLeft = '4px solid var(--warning)';
  } else {
    notification.style.borderLeft = '4px solid var(--primary)';
  }
  
  // Style notification content
  const content = notification.querySelector('.notification-content');
  content.style.display = 'flex';
  content.style.alignItems = 'center';
  content.style.gap = '12px';
  
  // Style icon
  const icon = content.querySelector('i');
  icon.style.fontSize = '20px';
  if (type === 'success') {
    icon.style.color = 'var(--success)';
  } else if (type === 'error') {
    icon.style.color = 'var(--error)';
  } else if (type === 'warning') {
    icon.style.color = 'var(--warning)';
  } else {
    icon.style.color = 'var(--primary)';
  }
  
  // Style close button
  const closeBtn = notification.querySelector('.close-notification');
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '20px';
  closeBtn.style.color = 'var(--gray-600)';
  
  // Add to document
  document.body.appendChild(notification);
  
  // Close button event
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideInRight 0.3s ease-out reverse forwards';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse forwards';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
}

// Helper function to get icon for notification type
function getIconForType(type) {
  switch (type) {
    case 'success':
      return 'fa-check-circle';
    case 'error':
      return 'fa-exclamation-circle';
    case 'warning':
      return 'fa-exclamation-triangle';
    default:
      return 'fa-info-circle';
  }
}