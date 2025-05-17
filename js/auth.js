// Main JavaScript file for SafeGuard website

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');
const header = document.querySelector('header');

// Navigation and Header
function setupNavigation() {
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks?.classList.toggle('active');
      authButtons?.classList.toggle('active');
    });
  }

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 50);
  });

  document.addEventListener('click', (e) => {
    if (
      hamburger?.classList.contains('active') &&
      !e.target.closest('.hamburger') &&
      !e.target.closest('.nav-links') &&
      !e.target.closest('.auth-buttons')
    ) {
      hamburger.classList.remove('active');
      navLinks?.classList.remove('active');
      authButtons?.classList.remove('active');
    }
  });
}

// Help Modal
function setupHelpModal() {
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const ctaChat = document.getElementById('cta-chat');

  const openHelpModal = (e) => {
    e.preventDefault();
    helpModal.style.display = 'block';
    helpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  helpBtn?.addEventListener('click', openHelpModal);
  ctaChat?.addEventListener('click', openHelpModal);
}

// Testimonial Slider
function setupTestimonialSlider() {
  const container = document.querySelector('.testimonial-container');
  const prev = document.querySelector('.testimonial-prev');
  const next = document.querySelector('.testimonial-next');
  const scrollAmount = 350;

  if (container && prev && next) {
    prev.addEventListener('click', () => {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }
}

// Modal Functions
function setupModals() {
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal');

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      closeModal(modal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

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
  if (!modal) return;
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

// Scroll Animations
function setupScrollAnimations() {
  const scrollElements = document.querySelectorAll('.scroll-reveal');

  const elementInView = (el, offset = 100) =>
    el.getBoundingClientRect().top <= window.innerHeight - offset;

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      el.classList.toggle('visible', elementInView(el));
    });
  };

  const animateSelectors = [
    '.service-card', '.about-content', '.about-image',
    '.testimonial-card', '.resource-card', '.category-card',
    '.step', '.help-card',
  ];

  animateSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('scroll-reveal')) {
        el.classList.add('scroll-reveal');
      }
    });
  });

  window.addEventListener('scroll', handleScrollAnimation);
  handleScrollAnimation();
}

// Awareness Page Tabs
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (tabBtns.length && tabPanes.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId)?.classList.add('active');
      });
    });
  }
}

// Smooth Scroll for Anchor Links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId.length > 1) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
}

// Initialize all on DOM load
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupHelpModal();
  setupTestimonialSlider();
  setupModals();
  setupScrollAnimations();
  setupTabs();
  setupSmoothScrolling();

  // Staggered scroll-reveal on service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.classList.add('scroll-reveal');
    card.style.transitionDelay = `${index * 0.1}s`;
  });
});

// Expose modal control globally
window.openModal = openModal;
window.closeModal = closeModal;
