const chatContainer = document.getElementById('chatContainer');
const chatButton = document.querySelector('.chat-button');
const closeChat = document.getElementById('closeChat');
const chatBody = document.querySelector(".chat-body");
const userInput = document.querySelector("#user-input");
const sendBtn = document.querySelector("#send-btn");

// Toggle chat window
chatButton.addEventListener('click', () => {
    chatContainer.style.display = 'block';
});

closeChat.addEventListener('click', () => {
    chatContainer.style.display = 'none';
});

// Enhanced responses including math and creator info
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Check for math expressions
    if (message.includes('+') || message.includes('-') || message.includes('*') || message.includes('/')) {
        try {
            const result = eval(message);
            return `The answer is ${result}. Can I assist you with something else?`;
        } catch (error) {
            return "I couldn't process that calculation. Please try again with a simple math expression.";
        }
    }

    // Check for creator question
    if (message.includes('who created you') || message.includes('who made you') || 
        message.includes('your creator') || message.includes('who built you')) {
        return "I was created by Alvin. How can I assist you today?";
    }

    // Other responses
    const botResponses = {
        "hello": "Hi there! How can I help you today?",
        "hi": "Hello! What can I do for you?",
        "how are you": "I'm doing great! Thanks for asking. How can I assist you?",
        "what is your name": "I'm Claudia, your AI assistant. Nice to meet you!",
        "bye": "Goodbye! Have a great day!",
        "thank you": "You're welcome! Is there anything else I can help you with?",
        "default": "I'm still learning. Could you please rephrase that or ask something else?"
    };

    for (let key in botResponses) {
        if (message.includes(key)) {
            return botResponses[key];
        }
    }
    
    return botResponses["default"];
}

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function handleUserInput() {
    const message = userInput.value.trim();
    if (message === "") return;

    addMessage(message, true);
    userInput.value = "";

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message bot-message";
    loadingDiv.innerHTML = "<p>Typing...</p>";
    chatBody.appendChild(loadingDiv);

    setTimeout(() => {
        chatBody.removeChild(loadingDiv);
        const botResponse = getBotResponse(message);
        addMessage(botResponse);
    }, 1000);
}

sendBtn.addEventListener("click", handleUserInput);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleUserInput();
    }
});

window.onload = () => {
    userInput.focus();
};
