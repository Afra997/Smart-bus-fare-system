// document.addEventListener('DOMContentLoaded', function() {
//     // Toggle password visibility
//     document.querySelector('.toggle-password').addEventListener('click', function() {
//         const input = this.previousElementSibling;
//         const icon = this.querySelector('i');
        
//         if (input.type === 'password') {
//             input.type = 'text';
//             icon.classList.remove('fa-eye');
//             icon.classList.add('fa-eye-slash');
//         } else {
//             input.type = 'password';
//             icon.classList.remove('fa-eye-slash');
//             icon.classList.add('fa-eye');
//         }
//     });

//     // Login form submission
//     document.getElementById('loginForm').addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         const accountType = document.querySelector('input[name="accountType"]:checked').value;
//         const mobileNumber = document.getElementById('loginMobile').value;
//         const password = document.getElementById('loginPassword').value;
        
//         // Simple validation
//         if (!mobileNumber || !password) {
//             alert('Please enter both mobile number and password');
//             return;
//         }
        
//         // Simulate login
//         if (accountType === 'admin') {
//             // Admin login
//             if (mobileNumber === 'admin' && password === 'admin123') {
//                 // In a real app, you would set a proper session here
//                 localStorage.setItem('isAdmin', 'true');
//                 window.location.href = 'admin-dashboard.html';
//             } else {
//                 alert('Invalid admin credentials');
//             }
//         } else {
//             // Passenger login
//             // In a real app, you would verify credentials with server
//             localStorage.setItem('isLoggedIn', 'true');
//             window.location.href = 'passenger-home.html';
//         }
//     });

//     // Check "Remember me" functionality
//     const rememberMe = document.getElementById('rememberMe');
//     if (localStorage.getItem('rememberMe') === 'true') {
//         rememberMe.checked = true;
//         // In a real app, you would populate saved credentials
//     }
    
//     rememberMe.addEventListener('change', function() {
//         localStorage.setItem('rememberMe', this.checked);
//     });


    
// });




document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const accountType = document.querySelector('input[name="accountType"]:checked').value;
            const mobileNumber = document.getElementById('loginMobile').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            // Validate inputs
            if (!mobileNumber || !password) {
                alert('Please enter both mobile number and password');
                return;
            }

            if (accountType === 'admin') {
                // Admin login (strict)
                if (mobileNumber === 'admin' && password === 'admin123') {
                    localStorage.setItem('isAdmin', 'true');
                    window.location.href = 'admin-dashboard.html';
                } else {
                    alert('Invalid admin credentials. Use: admin / admin123');
                }
            } else {
                // Passenger login (hardcoded credentials)
                if (mobileNumber === '12345678' && password === '87654321') {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userMobile', mobileNumber); // Store for display
                    window.location.href = 'passenger-home.html';
                } else {
                    alert('Invalid passenger credentials. Use: 12345678 / 87654321');
                }
            }
        });
    }

    // "Remember me" functionality
    const rememberMe = document.getElementById('rememberMe');
    if (rememberMe) {
        // Load saved preference
        if (localStorage.getItem('rememberMe') === 'true') {
            rememberMe.checked = true;
        }
        // Save preference on change
        rememberMe.addEventListener('change', function() {
            localStorage.setItem('rememberMe', this.checked);
        });
    }
});