document.addEventListener('DOMContentLoaded', function() {
    // 1. Main container and status elements
    const qrContainer = document.getElementById('qrCodeContainer');
    const journeyStatus = document.getElementById('journeyStatus');
    
    // 2. Initialize with Generate QR Code button
    setupGenerateButton();
    
    // 3. Generate QR Code function
    function generateQRCode() {
        // Clear container
        qrContainer.innerHTML = '';
        
        // Create journey ID
        const journeyId = "JRN-" + Math.floor(100000 + Math.random() * 900000);
        
        // Generate QR Code
        new QRCode(qrContainer, {
            text: journeyId,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff"
        });
        
        // Create End Journey button
        const endBtn = document.createElement('button');
        endBtn.id = 'endJourneyBtn';
        endBtn.className = 'btn btn-danger btn-lg mt-3';
        endBtn.textContent = 'End Journey';
        
        // Add icon using innerHTML if needed
        endBtn.innerHTML = '<i class="fas fa-stop-circle me-2"></i> End Journey';
        
        // Add to container
        qrContainer.appendChild(endBtn);
        
        // Update status
        journeyStatus.textContent = 'Journey started - show QR to driver';
        journeyStatus.className = 'mt-3 text-success';
        
        // Add click handler
        endBtn.onclick = endJourney; // Using onclick for direct assignment
    }
    
    // 4. End Journey function
    function endJourney() {
        // Clear container
        qrContainer.innerHTML = '';
        
        // Update status
        journeyStatus.textContent = 'Journey completed - fare deducted';
        journeyStatus.className = 'mt-3 text-primary';
        
        // Re-create Generate button
        setupGenerateButton();
    }
    
    // 5. Setup Generate Button (reusable function)
    function setupGenerateButton() {
        // Clear container (just in case)
        qrContainer.innerHTML = '';
        
        // Create new button
        const genBtn = document.createElement('button');
        genBtn.id = 'generateQRBtn';
        genBtn.className = 'btn btn-primary btn-lg';
        genBtn.innerHTML = '<i class="fas fa-qrcode me-2"></i> Generate QR Code';
        
        // Add to container
        qrContainer.appendChild(genBtn);
        
        // Add click handler - using onclick for direct assignment
        genBtn.onclick = generateQRCode;
    }
});