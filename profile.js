// User authentication display handler - Updated for existing CSS
document.addEventListener('DOMContentLoaded', function() {
  const authButtons = document.querySelector('.auth-buttons');
  const API_BASE_URL = 'http://localhost:5000';
  
  // Check if user is logged in
  async function checkAuthStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-auth`, {
        credentials: 'include' // Important for cookies/session
      });
      
      if (!response.ok) {
        throw new Error('Failed to check authentication status');
      }
      
      const data = await response.json();
      
      if (data.authenticated) {
        displayLoggedInUser(data.username);
      } else {
        // No need to do anything - default login buttons are already in HTML
        console.log('User is not logged in');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // If error, leave default login buttons
    }
  }
  
  // Display user profile when logged in
  function displayLoggedInUser(username) {
    // Clear existing content
    authButtons.innerHTML = '';
    
    // Add logged-in class for mobile responsiveness
    authButtons.classList.add('logged-in');
    
    // Create user profile container
    const userProfileContainer = document.createElement('div');
    userProfileContainer.className = 'user-profile';
    
    // Create user avatar
    const userAvatar = document.createElement('div');
    userAvatar.className = 'user-avatar';
    userAvatar.textContent = username.charAt(0).toUpperCase();
    
    // Create username display
    const usernameDisplay = document.createElement('span');
    usernameDisplay.className = 'username';
    usernameDisplay.textContent = username;
    
    // Create dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu';
    
    // Add menu items
    dropdownMenu.innerHTML = `
      <a href="${API_BASE_URL}/dashboard">Dashboard</a>
      <a href="#" id="logout-btn">Logout</a>
    `;
    
    // Assemble components
    userProfileContainer.appendChild(userAvatar);
    userProfileContainer.appendChild(usernameDisplay);
    userProfileContainer.appendChild(dropdownMenu);
    authButtons.appendChild(userProfileContainer);
    
    // Toggle dropdown on click
    userProfileContainer.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });
    
    // Add logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        logout();
      });
    }
  }
  
  // Handle logout
  async function logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the page or redirect
        window.location.reload();
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu && dropdownMenu.classList.contains('show')) {
      dropdownMenu.classList.remove('show');
    }
  });
  
  // Initialize authentication check
  checkAuthStatus();
});