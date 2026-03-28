document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWidget = document.getElementById('chat-widget');
    const minimizeBtn = document.getElementById('minimize-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBody = document.getElementById('chat-body');

    let sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

    // Toggle Widget
    chatBubble.addEventListener('click', () => {
        chatWidget.style.display = 'flex';
        chatBubble.style.display = 'none';
    });

    minimizeBtn.addEventListener('click', () => {
        chatWidget.style.display = 'none';
        chatBubble.style.display = 'flex';
    });

    // Send Message
    const sendMessage = async () => {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user-message');
        userInput.value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, session_id: sessionId })
            });

            const data = await response.json();
            
            if (data.response) {
                appendMessage(data.response, 'bot-message');
                
                if (data.frustration > 70) {
                    appendMessage("⚠️ Connecting you to human support...", 'bot-message escalation');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            appendMessage("Sorry, I'm having trouble connecting to the server.", 'bot-message');
        }
    };

    const appendMessage = (text, className) => {
        const div = document.createElement('div');
        div.className = `message ${className}`;
        div.innerText = text;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
