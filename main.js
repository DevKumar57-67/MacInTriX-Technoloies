
function toggleMenu() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar.style.left === '-250px') {
                sidebar.style.left = '0';
            } else {
                sidebar.style.left = '-250px';
            }
        }

        function toggleSendButton() {
            const messageInput = document.getElementById('messageInput');
            const sendButton = document.getElementById('sendButton');
            const sendIcon = document.getElementById('sendIcon');

            if (messageInput.value.trim() !== "") {
                sendButton.disabled = false;
                sendIcon.src = "https://img.icons8.com/?size=100&id=124436&format=png&color=ffffff";
            } else {
                sendButton.disabled = true;
                sendIcon.src = "https://img.icons8.com/?size=100&id=124436&format=png&color=000000";
            }
        }

        function getCurrentTimestamp() {
            const now = new Date();
            return now.toLocaleString();
        }

        async function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const messagesContainer = document.getElementById('messages');
            const userMessage = messageInput.value.trim();

            if (userMessage === "") return;

            // Hide logo and quick actions after first message
            document.getElementById('logo-container').style.display = 'none';
            document.getElementById('quick-actions').style.display = 'none';

            // Display user message
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'message user-message';
            userMessageElement.innerHTML = `${userMessage}<span class="timestamp">${getCurrentTimestamp()}</span>`;
            messagesContainer.appendChild(userMessageElement);

            // Clear the input
            messageInput.value = '';
            toggleSendButton();

            // Display loading animation
            const loadingElement = document.createElement('div');
            loadingElement.className = 'message loading';
            loadingElement.textContent = 'Loading...';
            messagesContainer.appendChild(loadingElement);

            // Scroll to the latest message
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Use a CORS proxy to make the API request
            const proxyUrl = 'https://api.allorigins.win/get?url=';
            const apiUrl = `https://api.kastg.xyz/api/ai/chatgptV4?prompt=${encodeURIComponent(userMessage)}`;
            const requestUrl = `${proxyUrl}${encodeURIComponent(apiUrl)}`;

            try {
                const response = await fetch(requestUrl);
                const data = await response.json();
                const apiResponse = JSON.parse(data.contents);

                // Extract AI message
                const aiMessage = apiResponse.result[0].response;

                // Remove loading animation
                messagesContainer.removeChild(loadingElement);

                // Display AI response
                const aiMessageElement = document.createElement('div');
                aiMessageElement.className = 'message ai-message';
                aiMessageElement.innerHTML = `${aiMessage}<span class="timestamp">${getCurrentTimestamp()}</span>`;
                messagesContainer.appendChild(aiMessageElement);
                
                // Scroll to the latest message
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error:', error);

                // Remove loading animation
                messagesContainer.removeChild(loadingElement);

                // Display error message
                const errorMessageElement = document.createElement('div');
                errorMessageElement.className = 'message error-message';
                errorMessageElement.innerHTML = `Error: Unable to get response from AI.<span class="timestamp">${getCurrentTimestamp()}</span>`;
                messagesContainer.appendChild(errorMessageElement);
                
                // Scroll to the latest message
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }

        function sendQuickAction(message) {
            const messageInput = document.getElementById('messageInput');
            messageInput.value = message;
            toggleSendButton();
            sendMessage();
        }
