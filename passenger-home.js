document.addEventListener('DOMContentLoaded', function () {
    console.log("JS Loaded");

    // 1. Get DOM elements
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const journeyStatus = document.getElementById('journeyStatus');

    // 2. Store the original Generate QR button HTML
    const originalGenerateBtnHTML = `
        <button id="generateQRBtn" class="btn btn-primary btn-lg">
            <i class="fas fa-qrcode me-2"></i> Generate QR Code
        </button>
    `;

    // 3. Reset to initial state function
    function resetToInitialState() {
        qrCodeContainer.innerHTML = originalGenerateBtnHTML;
        const generateQRBtn = document.getElementById('generateQRBtn');
        if (generateQRBtn) {
            generateQRBtn.addEventListener('click', generateQRCode);
        }
        journeyStatus.textContent = 'Press the button to start your journey';
        journeyStatus.className = 'mt-3 text-muted';
    }

    // 4. Generate QR Code function
    function generateQRCode() {
        // Clear container
        qrCodeContainer.innerHTML = '';

        // Generate random journey ID
        const journeyId = 'JRN-' + Math.floor(100000 + Math.random() * 900000);
        const userMobile = localStorage.getItem('userMobile') || '12345678';

        // QR data
        const qrData = JSON.stringify({
            userId: userMobile,
            journeyId: journeyId,
            timestamp: new Date().toISOString()
        });

        // Create QR code
        new QRCode(qrCodeContainer, {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Add End Journey button
        const endJourneyBtn = document.createElement('button');
        endJourneyBtn.id = 'endJourneyBtn';
        endJourneyBtn.className = 'btn btn-danger btn-lg mt-3';
        endJourneyBtn.innerHTML = '<i class="fas fa-stop-circle me-2"></i> End Journey';
        endJourneyBtn.addEventListener('click', endJourney);

        qrCodeContainer.appendChild(endJourneyBtn);

        // Update journey status
        journeyStatus.textContent = 'Journey started. Show QR to driver.';
        journeyStatus.className = 'mt-3 text-success';
    }

    // 5. End Journey function
    function endJourney() {
        resetToInitialState();
        journeyStatus.textContent = 'Journey completed. Fare deducted.';
        journeyStatus.className = 'mt-3 text-primary';
    }

    // 6. Initialize the page
    resetToInitialState();

    // 7. Chat System
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatMessages = document.getElementById('chatMessages');

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'sent');
            chatInput.value = '';

            setTimeout(() => {
                const replies = [
                    "How can I assist you further?",
                    "Your issue has been noted.",
                    "Thank you for your message!",
                    "For immediate help, call 12345."
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                addMessage(randomReply, 'received');
            }, 1000);
        }
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendChatBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    // 8. Logout
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    });
});
