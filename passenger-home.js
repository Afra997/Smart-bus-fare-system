document.addEventListener('DOMContentLoaded', function() {
    // 1. Check login status
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }
    
    // 2. Get DOM elements
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const journeyStatus = document.getElementById('journeyStatus');
    
    // 3. Initialize with Generate QR button
    setupGenerateButton();
    
    // 4. Generate QR Code function
    function generateQRCode() {
        // Clear container
        qrCodeContainer.innerHTML = '';
        
        // Generate random journey ID
        const journeyId = 'JRN-' + Math.floor(100000 + Math.random() * 900000);
        const userMobile = localStorage.getItem('userMobile') || '12345678';
        
        // Create QR data
        const qrData = JSON.stringify({
            userId: userMobile,
            journeyId: journeyId,
            timestamp: new Date().toISOString()
        });
        
        // Generate QR code
        new QRCode(qrCodeContainer, {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Create End Journey button
        const endJourneyBtn = document.createElement('button');
        endJourneyBtn.id = 'endJourneyBtn';
        endJourneyBtn.className = 'btn btn-danger btn-lg mt-3';
        endJourneyBtn.innerHTML = '<i class="fas fa-stop-circle me-2"></i> End Journey';
        
        // Add to container
        qrCodeContainer.appendChild(endJourneyBtn);
        
        // Update status
        journeyStatus.textContent = 'Journey started. Show this QR code to the driver.';
        journeyStatus.className = 'mt-3 text-success';
        
        // Add click handler
        endJourneyBtn.addEventListener('click', endJourney);
    }
    
    // 5. End Journey function
    function endJourney() {
        // Clear container
        qrCodeContainer.innerHTML = '';
        
        // Update status
        journeyStatus.textContent = 'Journey completed - fare deducted';
        journeyStatus.className = 'mt-3 text-primary';
        
        // Recreate Generate button
        setupGenerateButton();
    }
    
    // 6. Setup Generate Button (reusable function)
    function setupGenerateButton() {
        // Clear container
        qrCodeContainer.innerHTML = '';
        
        // Create new button
        const generateBtn = document.createElement('button');
        generateBtn.id = 'generateQRBtn';
        generateBtn.className = 'btn btn-primary btn-lg';
        generateBtn.innerHTML = '<i class="fas fa-qrcode me-2"></i> Generate QR Code';
        
        // Add to container
        qrCodeContainer.appendChild(generateBtn);
        
        // Add click handler
        generateBtn.addEventListener('click', generateQRCode);
    }
    
    // 7. Chat System (unchanged)
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
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    // 8. Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    });
});