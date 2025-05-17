/**
 * SafeGuard ChatbotAPI - Integration with Groq-powered backend
 * @param {string} apiUrl - The URL of the chatbot API
 * @returns {Object} - Methods to interact with the chatbot API
 */
function ChatbotAPI(apiUrl = 'http://127.0.0.1:5100') {
    // Generate a unique session ID for this chat session
    const sessionId = generateSessionId();
    
    // Keep track of connection status
    let isConnected = true;
    
    // Check server health on initialization
    checkHealth().then(status => {
        isConnected = status;
        console.log(`ChatbotAPI initialization: Connection ${isConnected ? 'successful' : 'failed'}`);
    });
    
    /**
     * Sends a message to the chatbot API
     * @param {string} message - The message to send
     * @returns {Promise<Object>} - The response from the API
     */
    async function sendMessage(message) {
        try {
            if (!isConnected) {
                await checkHealth();
                if (!isConnected) {
                    return { 
                        error: "Connection to chatbot service unavailable",
                        reply: "I'm having trouble connecting right now. Please try again in a moment."
                    };
                }
            }
            
            // Log to help with debugging
            console.log(`Sending message to ${apiUrl}/api/chat with session ID: ${sessionId}`);
            
            const response = await fetch(`${apiUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: sessionId
                }),
            });

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            const data = await response.json();
            
            // Handle both successful responses and errors returned in JSON format
            if (data.error) {
                console.error("API returned error:", data.error);
                return { 
                    error: data.error,
                    reply: data.reply || "I'm having trouble processing your request. Please try again in a moment."
                };
            }
            
            return data;
        } catch (error) {
            console.error("ChatbotAPI error:", error);
            isConnected = false;
            return { 
                error: error.message,
                reply: "I'm having trouble connecting right now. Please try again in a moment." 
            };
        }
    }
    
    /**
     * Checks if the chatbot API is available
     * @returns {Promise<boolean>} - Whether the API is available
     */
    async function checkHealth() {
        try {
            // First try the health endpoint
            const response = await fetch(`${apiUrl}/api/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add a timeout for the health check
                signal: AbortSignal.timeout(5000)
            });
            
            if (response.ok) {
                const data = await response.json();
                isConnected = data.status === 'ok';
                return isConnected;
            }
            
            // Fallback to root endpoint if health endpoint fails
            const rootResponse = await fetch(`${apiUrl}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add a timeout for the health check
                signal: AbortSignal.timeout(5000)
            });
            
            isConnected = rootResponse.ok;
            return isConnected;
        } catch (error) {
            console.error("Health check failed:", error);
            isConnected = false;
            return false;
        }
    }
    
    /**
     * Generates a random session ID
     * @returns {string} - A unique session ID
     */
    function generateSessionId() {
        return 'safeguard_' + Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15) + 
               '_' + new Date().getTime();
    }

    // Public API
    return {
        sendMessage,
        checkHealth,
        getSessionId: () => sessionId
    };
}

// Make the API available globally
window.ChatbotAPI = ChatbotAPI;

// Add a polyfill for AbortSignal.timeout if not available (for older browsers)
if (!AbortSignal.timeout) {
    AbortSignal.timeout = function timeout(ms) {
        const controller = new AbortController();
        setTimeout(() => controller.abort(new DOMException("TimeoutError", "TimeoutError")), ms);
        return controller.signal;
    };
}