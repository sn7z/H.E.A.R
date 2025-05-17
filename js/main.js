// Main JavaScript file for SafeGuard website

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');
const header = document.querySelector('header');

// Navigation and Header
function setupNavigation() {
  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      authButtons.classList.toggle('active');
    });
  }

  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      hamburger && 
      hamburger.classList.contains('active') && 
      !e.target.closest('.hamburger') && 
      !e.target.closest('.nav-links') && 
      !e.target.closest('.auth-buttons')
    ) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      authButtons.classList.remove('active');
    }
  });
}

// Help Modal
function setupHelpModal() {
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const ctaChat = document.getElementById('cta-chat');
  
  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      helpModal.style.display = 'block';
      helpModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (ctaChat && helpModal) {
    ctaChat.addEventListener('click', (e) => {
      e.preventDefault();
      helpModal.style.display = 'block';
      helpModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
}

// Testimonial Slider
function setupTestimonialSlider() {
  const testimonialContainer = document.querySelector('.testimonial-container');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (testimonialContainer && prevBtn && nextBtn) {
    const scrollAmount = 350; // Width of one testimonial + gap
    
    prevBtn.addEventListener('click', () => {
      testimonialContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
      testimonialContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }
}

// Modal Functions
function setupModals() {
  const modals = document.querySelectorAll('.modal');
  const closeModalButtons = document.querySelectorAll('.close-modal');
  
  // Close modal when clicking the X button
  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Close modal when clicking outside the modal content
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.style.display === 'block') {
          closeModal(modal);
        }
      });
    }
  });
}

function closeModal(modal) {
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 300);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
  }
}

// Scroll animations - FIXED
function setupScrollAnimations() {
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  
  const elementInView = (el, scrollOffset = 150) => { // Increased offset for better detection
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= window.innerHeight - scrollOffset;
  };
  
  const displayScrollElement = (element) => {
    element.classList.add('visible');
  };
  
  // IMPORTANT: Add initial visibility class to critical sections
  const criticalSections = ['.about', '.testimonials'];
  criticalSections.forEach(selector => {
    const section = document.querySelector(selector);
    if (section) {
      section.classList.add('always-visible');
    }
  });
  
  // Modified to handle scroll animation
  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      // Skip elements in critical sections that should always be visible
      if (el.closest('.always-visible')) {
        displayScrollElement(el);
        return;
      }
      
      if (elementInView(el)) {
        displayScrollElement(el);
      }
      // We're no longer hiding elements once they've been shown
      // This prevents content from disappearing
    });
  };
  
  // Add scroll-reveal class to elements that should animate on scroll
  const elementsToAnimate = [
    '.service-card',
    '.about-content',
    '.about-image',
    '.testimonial-card',
    '.resource-card',
    '.category-card',
    '.step',
    '.help-card',
  ];
  
  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('scroll-reveal')) {
        el.classList.add('scroll-reveal');
      }
    });
  });
  
  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });
  
  // Ensure initial check runs after a slight delay to allow page to render properly
  setTimeout(() => {
    handleScrollAnimation();
  }, 200);
}

// Tab functionality for Awareness page
function setupTabs() {
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
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.getAttribute('href').length > 1) { // Skip empty "#" links
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    }
  });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupHelpModal();
  setupTestimonialSlider();
  setupModals();
  setupScrollAnimations();
  setupTabs();
  setupSmoothScrolling();
  
  // Make sure critical sections are visible
  document.querySelectorAll('.about, .testimonials').forEach(section => {
    section.style.opacity = '1';
    section.style.visibility = 'visible';
  });
  
  // Add the scroll-reveal class to elements with delay for animation
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.classList.add('scroll-reveal');
    card.style.transitionDelay = `${index * 0.1}s`;
  });
});

// Export modal functions for use in other files
window.openModal = openModal;
window.closeModal = closeModal;




/* New code */

