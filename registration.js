document.addEventListener('DOMContentLoaded', function() {
    // 1. Password Visibility Toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            input.type = input.type === 'password' ? 'text' : 'password';
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // 2. Password Strength Checker
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const strengthBar = document.querySelector('.password-strength .progress-bar');
    const strengthText = document.getElementById('strengthText');
    const matchText = document.getElementById('passwordMatch');

    passwordInput.addEventListener('input', updatePasswordStrength);
    confirmInput.addEventListener('input', checkPasswordMatch);

    function updatePasswordStrength() {
        const strength = calculatePasswordStrength(this.value);
        strengthBar.style.width = strength.percentage + '%';
        strengthBar.className = 'progress-bar ' + strength.class;
        strengthText.textContent = strength.text;
        strengthText.className = strength.textClass;
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return { percentage: 25, text: 'Weak', class: 'bg-danger', textClass: 'text-danger' };
        if (strength <= 4) return { percentage: 50, text: 'Moderate', class: 'bg-warning', textClass: 'text-warning' };
        if (strength <= 6) return { percentage: 75, text: 'Strong', class: 'bg-info', textClass: 'text-info' };
        return { percentage: 100, text: 'Very Strong', class: 'bg-success', textClass: 'text-success' };
    }

    function checkPasswordMatch() {
        if (!this.value) {
            matchText.innerHTML = '';
            return false;
        }
        const match = this.value === passwordInput.value;
        matchText.innerHTML = match 
            ? '<small class="text-success">Passwords match</small>'
            : '<small class="text-danger">Passwords do not match</small>';
        return match;
    }

    // 3. ID Type Toggle
    document.querySelectorAll('input[name="idType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const isBirthCert = this.id === 'birthCertificate';
            document.getElementById('birthCertificateNo').disabled = !isBirthCert;
            document.getElementById('nidNo').disabled = isBirthCert;
            if (isBirthCert) document.getElementById('nidNo').value = '';
            else document.getElementById('birthCertificateNo').value = '';
        });
    });

    // 4. Half Pass Toggle - NEW: Hide registration box when NO is clicked
    const halfPassDetails = document.getElementById('halfPassDetails');
    document.getElementById('halfPassNo').addEventListener('change', function() {
        halfPassDetails.style.display = 'none';
        document.getElementById('registrationNumber').value = '';
    });

    document.getElementById('halfPassYes').addEventListener('change', function() {
        halfPassDetails.style.display = 'block';
        document.getElementById('registrationNumber').focus();
    });

    // 5. Form Submission - FIXED REDIRECTION
    document.getElementById('nextBtn').addEventListener('click', function(e) {
        e.preventDefault();

        // Validate all fields
        const requiredFields = [
            'fullName', 'email', 'presentAddress',
            'walletNumber', 'password', 'confirmPassword'
        ];

        let isValid = true;
        requiredFields.forEach(id => {
            const field = document.getElementById(id);
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        // Validate ID number
        const idField = document.querySelector('input[name="idType"]:checked').id === 'birthCertificate'
            ? document.getElementById('birthCertificateNo')
            : document.getElementById('nidNo');
        
        if (!idField.value.trim()) {
            idField.classList.add('is-invalid');
            isValid = false;
        }

        // Validate passwords match
        if (!checkPasswordMatch.call(confirmInput)) {
            isValid = false;
        }

        if (!isValid) {
            alert('Please fill all required fields correctly!');
            return;
        }

        // Prepare data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            address: document.getElementById('presentAddress').value,
            idType: document.querySelector('input[name="idType"]:checked').value,
            idNumber: idField.value,
            walletNumber: document.getElementById('walletNumber').value,
            walletProvider: document.querySelector('input[name="walletProvider"]:checked').value,
            isHalfPass: document.getElementById('halfPassYes').checked,
            registrationNumber: document.getElementById('halfPassYes').checked
                ? document.getElementById('registrationNumber').value
                : null
        };

        // Store and redirect - ABSOLUTE PATH FIX
        localStorage.setItem('registrationData', JSON.stringify(formData));
        window.location.href = window.location.pathname.replace('registration.html', '') + 'verification.html';
    });

    // Initialize form
    document.getElementById('birthCertificateNo').disabled = false;
    document.getElementById('nidNo').disabled = true;
});