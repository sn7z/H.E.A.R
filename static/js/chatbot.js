// SafeGuard Chatbot UI - Integrated with Groq LLM API
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the API with the backend URL
    const api = window.ChatbotAPI('http://127.0.0.1:5100');
    
    // DOM elements
    const chatFab = document.getElementById('chat-fab');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotSection = document.getElementById('chatbot-section');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-message-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMinimize = document.getElementById('chatbot-minimize');
    const chatNowBtn = document.getElementById('chat-now-btn');
    const chatTrigger = document.getElementById('chat-trigger');
    
    // Chat state
    let isChatVisible = false;
    let isFirstMessage = true;
    let isWaitingForResponse = false;
    
    // Function to toggle chat visibility
    function toggleChat() {
        isChatVisible = !isChatVisible;
        
        if (isChatVisible) {
            chatbotContainer.classList.add('active');
            chatFab.classList.add('hidden');
            
            // Add welcome message if it's the first open
            if (isFirstMessage) {
                addBotMessage("Welcome to SafeGuard. I'm here to offer support and guidance. How can I help you today?");
                isFirstMessage = false;
            }
            
            // Focus on input
            setTimeout(() => {
                chatbotInput.focus();
            }, 300);
        } else {
            chatbotContainer.classList.remove('active');
            chatFab.classList.remove('hidden');
        }
    }
    
    // Add event listeners
    if (chatFab) {
        chatFab.addEventListener('click', toggleChat);
    }
    
    if (chatbotMinimize) {
        chatbotMinimize.addEventListener('click', toggleChat);
    }
    
    if (chatNowBtn) {
        chatNowBtn.addEventListener('click', function() {
            if (!isChatVisible) {
                toggleChat();
            }
            // Scroll to chatbot section
            chatbotSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (chatTrigger) {
        chatTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            if (!isChatVisible) {
                toggleChat();
            }
            chatbotSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Function to add a user message to the chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.innerHTML = `
            <div class="message-content">
                ${escapeHTML(message)}
            </div>
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
        `;
        chatbotMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Function to add a bot message to the chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        
        // Process message to add formatting
        const formattedMessage = formatMessage(message);
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                </svg>
            </div>
            <div class="message-content">
                ${formattedMessage}
            </div>
        `;
        chatbotMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Function to format message text with light processing for links and emphasis
    function formatMessage(text) {
        // Escape HTML first for security
        let formattedText = escapeHTML(text);
        
        // Add basic formatting
        
        // Replace **bold** with <strong>
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Replace *italic* with <em>
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Replace URLs with clickable links
        formattedText = formattedText.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        // Replace line breaks with <br>
        formattedText = formattedText.replace(/\n/g, '<br>');
        
        return formattedText;
    }
    
    // Function to show a typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'bot-message', 'typing-indicator');
        typingElement.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                </svg>
            </div>
            <div class="message-content">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        chatbotMessages.appendChild(typingElement);
        scrollToBottom();
        return typingElement;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
    
    // Function to scroll to bottom of messages
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Function to disable input during processing
    function setInputState(disabled) {
        chatbotInput.disabled = disabled;
        chatbotSend.disabled = disabled;
        
        if (disabled) {
            chatbotSend.classList.add('disabled');
        } else {
            chatbotSend.classList.remove('disabled');
        }
    }
    
    // Function to send message to backend
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        
        if (!message || isWaitingForResponse) return;
        
        // Clear input field and disable input
        chatbotInput.value = '';
        isWaitingForResponse = true;
        setInputState(true);
        
        // Add user message to chat
        addUserMessage(message);
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        try {
            // Simulate natural response delay (LLM API might be fast sometimes)
            const minDelay = 600;
            const apiStartTime = Date.now();
            
            // Send message to backend
            const response = await api.sendMessage(message);
            
            // Calculate actual API response time
            const apiResponseTime = Date.now() - apiStartTime;
            
            // Add additional delay if API responded too quickly
            if (apiResponseTime < minDelay) {
                await new Promise(resolve => setTimeout(resolve, minDelay - apiResponseTime));
            }
            
            // Remove typing indicator
            removeTypingIndicator(typingIndicator);
            
            if (response.error && !response.reply) {
                addBotMessage("I'm sorry, I'm having trouble connecting right now. Please try again in a moment.");
            } else {
                // Add bot response to chat
                addBotMessage(response.reply);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            removeTypingIndicator(typingIndicator);
            addBotMessage("I'm sorry, something went wrong. Please try again later.");
        } finally {
            // Re-enable input
            isWaitingForResponse = false;
            setInputState(false);
        }
    }
    
    // Event listener for send button
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }
    
    // Event listener for Enter key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Utility function to escape HTML and prevent XSS
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});