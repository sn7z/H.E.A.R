// Chatbot functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.getElementById('chatbot-container');
    const messagesContainer = document.querySelector('.chatbot-messages');
    const messageInput = document.getElementById('chatbot-message-input');
    const sendButton = document.getElementById('chatbot-send');
    const minimizeButton = document.getElementById('chatbot-minimize');
    const chatFab = document.getElementById('chat-fab');
    const chatNowBtn = document.getElementById('chat-now-btn');
    
    // Sample responses to demonstrate the chatbot
    const botResponses = [
      "Hello! I'm your personal security assistant. How can I help you today?",
      "I can help you secure your accounts, check for vulnerabilities, or provide tips on staying safe online.",
      "Strong passwords should be at least 12 characters long, include a mix of uppercase, lowercase, numbers, and symbols.",
      "Two-factor authentication adds an extra layer of security to your accounts. I recommend enabling it for all your important services.",
      "I've detected no unusual activities in your accounts recently. Your security status looks good!",
      "Make sure to keep your software and applications updated. Updates often include security patches for vulnerabilities.",
      "Public Wi-Fi networks can be risky. Consider using a VPN when connecting to public networks to encrypt your data.",
      "Phishing attempts are becoming more sophisticated. Always verify the sender before clicking on links or downloading attachments.",
      "Regular security audits are recommended. Would you like me to perform one for you now?",
      "I'll check your security settings and suggest improvements to enhance your protection. This might take a moment."
    ];
    
    // Track if chatbot has displayed its initial message
    let initialMessageShown = false;
    
    // Minimize/expand chatbot
    minimizeButton.addEventListener('click', () => {
      chatbotContainer.classList.toggle('minimized');
      
      if (!chatbotContainer.classList.contains('minimized')) {
        showInitialMessageIfNeeded();
      }
    });
    
    // Open chatbot when clicking the FAB on mobile
    chatFab.addEventListener('click', () => {
      chatbotContainer.classList.add('active');
      chatbotContainer.classList.remove('minimized');
      showInitialMessageIfNeeded();
    });
    
    // Scroll to chatbot when clicking the chat now button
    chatNowBtn.addEventListener('click', () => {
      const chatbotSection = document.getElementById('chatbot-section');
      chatbotSection.scrollIntoView({ behavior: 'smooth' });
      showInitialMessageIfNeeded();
    });
    
    // Function to add a message to the chat
    function addMessage(text, sender) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.classList.add(sender);
      messageElement.textContent = text;
      
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Announce message for screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.classList.add('sr-only');
      announcement.textContent = `${sender === 'bot' ? 'Assistant' : 'You'}: ${text}`;
      document.body.appendChild(announcement);
      
      // Remove announcement after it's been read
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
      const typingIndicator = document.createElement('div');
      typingIndicator.classList.add('typing-indicator');
      typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      `;
      typingIndicator.setAttribute('aria-label', 'Assistant is typing');
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return typingIndicator;
    }
    
    // Function to get a bot response
    function getBotResponse(userMessage) {
      // In a real application, this would call an API
      // For demo purposes, we'll use simple keyword matching
      const normalizedMessage = userMessage.toLowerCase();
      
      if (normalizedMessage.includes('hello') || normalizedMessage.includes('hi')) {
        return botResponses[0];
      } else if (normalizedMessage.includes('help') || normalizedMessage.includes('what can you do')) {
        return botResponses[1];
      } else if (normalizedMessage.includes('password')) {
        return botResponses[2];
      } else if (normalizedMessage.includes('two-factor') || normalizedMessage.includes('2fa')) {
        return botResponses[3];
      } else if (normalizedMessage.includes('status') || normalizedMessage.includes('activity')) {
        return botResponses[4];
      } else if (normalizedMessage.includes('update') || normalizedMessage.includes('software')) {
        return botResponses[5];
      } else if (normalizedMessage.includes('wifi') || normalizedMessage.includes('public network')) {
        return botResponses[6];
      } else if (normalizedMessage.includes('phishing') || normalizedMessage.includes('email')) {
        return botResponses[7];
      } else if (normalizedMessage.includes('audit') || normalizedMessage.includes('check')) {
        return botResponses[8];
      } else {
        // Get a random response for messages we don't understand
        const randomIndex = Math.floor(Math.random() * botResponses.length);
        return botResponses[randomIndex];
      }
    }
    
    // Function to show initial greeting
    function showInitialMessageIfNeeded() {
      if (!initialMessageShown) {
        setTimeout(() => {
          const indicator = showTypingIndicator();
          
          setTimeout(() => {
            messagesContainer.removeChild(indicator);
            addMessage(botResponses[0], 'bot');
            initialMessageShown = true;
          }, 1500);
        }, 500);
      }
    }
    
    // Handle sending messages
    function sendMessage() {
      const message = messageInput.value.trim();
      if (message) {
        // Add user message
        addMessage(message, 'user');
        messageInput.value = '';
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Get and display bot response after a delay
        setTimeout(() => {
          messagesContainer.removeChild(typingIndicator);
          const botResponse = getBotResponse(message);
          addMessage(botResponse, 'bot');
        }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5s for more realism
      }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Show initial message after a short delay
    setTimeout(showInitialMessageIfNeeded, 1000);
  });