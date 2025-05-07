document.addEventListener('DOMContentLoaded', function() {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById('fullVerificationCode').value = verificationCode;
    console.log('Verification code:', verificationCode); 

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

    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'registration.html';
    });

    document.getElementById('verifyBtn').addEventListener('click', function() {
        let enteredCode = '';
        verificationCodes.forEach(code => {
            enteredCode += code.value;
        });
        
        if (enteredCode === document.getElementById('fullVerificationCode').value) {
            alert('Registration successful! You can now login.');
            
            const formData = JSON.parse(localStorage.getItem('tempRegistrationData'));
            console.log('Registration data:', formData);
            
            localStorage.removeItem('tempRegistrationData');
            
            window.location.href = 'index.html';
        } else {
            alert('Invalid verification code. Please try again.');
        }
    });

    document.getElementById('resendCode').addEventListener('click', function(e) {
        e.preventDefault();
        
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        document.getElementById('fullVerificationCode').value = newCode;
        console.log('New verification code:', newCode);
        
        verificationCodes.forEach(code => {
            code.value = '';
        });
        verificationCodes[0].focus();
        
        alert('A new verification code has been sent to your mobile number.');
    });
});