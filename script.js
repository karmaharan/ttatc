let userId = null;

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;

    // Check if character count exceeds 1200
    if (userInput.length > 1200) {
        alert('Please limit your input to 1200 characters.');
        return;
    }
    
    const messagesDiv = document.getElementById('messages');
    // Add user message to chat
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('message', 'user-message');
    let displayedUserInput = userInput;
    if (userInput.startsWith('q:')) {
        let queryPart = '<span style="background-color: #bf9000; color: white; padding: 2px 2px; border-radius: 3px; font-weight: bold;">query</span>';
        displayedUserInput = queryPart + ' ' + userInput.slice(2).trim();
    }
    userMessageDiv.innerHTML = `<p>${displayedUserInput}</p>`;
    messagesDiv.appendChild(userMessageDiv);
    document.getElementById('user-input').value = '';
  
    // Scroll to the bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    try {
        // Send message to API
        const response = await fetch('https://clean-rodent-stable.ngrok-free.app/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: userInput, user_id: userId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Update userId if it's the first message
        if (!userId) {
            userId = data.user_id;
        }
        
        // Add bot message to chat
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('message', 'bot-message');
        botMessageDiv.innerHTML = `<p>${data.answer}</p>`;
        messagesDiv.appendChild(botMessageDiv);
    } catch (error) {
        console.error('Error:', error);
        // Display error message in chat
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('message', 'error-message');
        errorDiv.innerHTML = `<p>Error: Unable to get response. Please try again.</p>`;
        messagesDiv.appendChild(errorDiv);
    }

    // Scroll to the bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


function displayRandomQuickReply() {
    const quickReplies = document.getElementById('quick-replies');
    if (quickReplies) {
        const buttons = quickReplies.getElementsByTagName('button');
        if (buttons.length > 0) {
            const index = Math.floor(Math.random() * buttons.length);
            document.getElementById('user-input').value = buttons[index].innerHTML;
        }
    }
}

// Clear userId when the page is about to be unloaded (refreshed or closed)
window.addEventListener('beforeunload', () => {
    userId = null;
});
