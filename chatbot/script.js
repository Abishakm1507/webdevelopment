const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Replace with your actual API key
const apiKey = 'YOUR_API_KEY';

// Function to send a message and receive a response
async function sendMessage(message) {
  // Replace with your API endpoint
  const response = await fetch('https://your-api-endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      message: message
    })
  });

  const data = await response.json();
  return data.response;
}

sendButton.addEventListener('click', async () => {
  const message = messageInput.value;
  if (message) {
    // Display the user's message
    const userMessage = document.createElement('div');
    userMessage.classList.add('chat-message', 'user');
    userMessage.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(userMessage);

    // Send the message to the API
    const response = await sendMessage(message);

    // Display the bot's response
    const botMessage = document.createElement('div');
    botMessage.classList.add('chat-message', 'bot');
    botMessage.innerHTML = `<p>${response}</p>`;
    chatMessages.appendChild(botMessage);

    // Scroll to the bottom of the chat messages
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Clear the input field
    messageInput.value = '';
  }
});