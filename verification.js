document.addEventListener('DOMContentLoaded', function() {
    // Generate and display verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById('fullVerificationCode').value = verificationCode;
    console.log('Verification code:', verificationCode); // For testing

    // Verification code input handling
    const verificationCodes = document.querySelectorAll('.verification-code');
    
    verificationCodes.forEach((code, index) => {
        code.addEventListener('input', function() {
            if (this.value.length === 1) {
                if (index < verificationCodes.length - 1) {
                    verificationCodes[index + 1].focus();
                }
            }
        });
        
        code.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                verificationCodes[index - 1].focus();
            }
        });
    });

    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'registration.html';
    });

    // Verify button
    document.getElementById('verifyBtn').addEventListener('click', function() {
        let enteredCode = '';
        verificationCodes.forEach(code => {
            enteredCode += code.value;
        });
        
        if (enteredCode === document.getElementById('fullVerificationCode').value) {
            // Registration successful
            alert('Registration successful! You can now login.');
            
            // In a real app, you would send the data to your server here
            const formData = JSON.parse(localStorage.getItem('tempRegistrationData'));
            console.log('Registration data:', formData); // For testing
            
            // Clear temporary data
            localStorage.removeItem('tempRegistrationData');
            
            // Redirect to login page
            window.location.href = 'index.html';
        } else {
            alert('Invalid verification code. Please try again.');
        }
    });

    // Resend code
    document.getElementById('resendCode').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Generate new code
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        document.getElementById('fullVerificationCode').value = newCode;
        console.log('New verification code:', newCode); // For testing
        
        // Clear input fields
        verificationCodes.forEach(code => {
            code.value = '';
        });
        verificationCodes[0].focus();
        
        alert('A new verification code has been sent to your mobile number.');
    });
});