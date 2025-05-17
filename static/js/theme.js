// Theme toggling functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const pageContainer = document.getElementById('page-container');
    
    // Check for user preference in localStorage
    const savedTheme = localStorage.getItem('safeguard-theme');
    if (savedTheme === 'dark') {
      pageContainer.classList.remove('light-mode');
      pageContainer.classList.add('dark-mode');
    } else {
      pageContainer.classList.add('light-mode');
      pageContainer.classList.remove('dark-mode');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
      if (pageContainer.classList.contains('dark-mode')) {
        pageContainer.classList.remove('dark-mode');
        pageContainer.classList.add('light-mode');
        localStorage.setItem('safeguard-theme', 'light');
      } else {
        pageContainer.classList.remove('light-mode');
        pageContainer.classList.add('dark-mode');
        localStorage.setItem('safeguard-theme', 'dark');
      }
    });
  });