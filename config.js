// Configuration file for frontend to backend communication

const config = {
    // Base URL for the Flask backend
    API_BASE_URL: 'http://localhost:5173',
    
    // Authentication endpoints
    AUTH: {
      LOGIN: '/login',
      SIGNUP: '/signup',
      LOGOUT: '/logout',
      CHECK_AUTH: '/check-auth'
    }
  };
  
  export default config;