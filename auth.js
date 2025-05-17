// Authentication utility for SafeGuard frontend
const API_BASE_URL = 'http://localhost:5000';

/**
 * Handle login form submission via API
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Response from API
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Important for cookies/session
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Handle signup form submission via API
 * @param {Object} userData - User registration data
 * @returns {Promise} - Response from API
 */
export async function signup(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise} - Authentication status
 */
export async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/check-auth`, {
      credentials: 'include'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Auth check error:', error);
    return { authenticated: false };
  }
}

/**
 * Log out the current user
 * @returns {Promise} - Logout result
 */
export async function logout() {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      credentials: 'include'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}