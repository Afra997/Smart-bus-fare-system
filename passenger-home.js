document.addEventListener('DOMContentLoaded', function() {
    // 1. Basic setup
    const qrContainer = document.getElementById('qrCodeContainer');
    const generateBtn = document.getElementById('generateQRBtn');
    
    // 2. QR Generation Function
    function generateQRCode() {
        // Clear previous QR
        qrCodeContainer.innerHTML = '';
        
        // Generate QR code
        const qrData = "JRN-" + Math.floor(100000 + Math.random() * 900000);
        new QRCode(qrCodeContainer, {
            text: qrData,
            width: 200,
            height: 200
        });
    
        // Create container for the button (NEW)
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex justify-content-center mt-3'; // Bootstrap centering
        
        // Create End Journey button
        const endJourneyBtn = document.createElement('button');
        endJourneyBtn.id = 'endJourneyBtn';
        endJourneyBtn.className = 'btn btn-danger btn-lg';
        endJourneyBtn.innerHTML = '<i class="fas fa-stop-circle me-2"></i> End Journey';
        
        // Add button to container
        buttonContainer.appendChild(endJourneyBtn);
        
        // Add both to main container
        qrCodeContainer.appendChild(buttonContainer);
    
        // Update status
        journeyStatus.textContent = 'Journey started - show QR to driver';
        journeyStatus.className = 'mt-3 text-success';
        
        // Event listener for the button
        endJourneyBtn.addEventListener('click', endJourney);
    }

    // 3. Attach event listener PROPERLY
    generateBtn.addEventListener('click', generateQR);
});