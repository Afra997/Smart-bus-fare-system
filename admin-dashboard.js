document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    if (!localStorage.getItem('isAdmin')) {
        window.location.href = 'index.html';
        return;
    }

    // Logout button
    document.getElementById('adminLogoutBtn').addEventListener('click', function() {
        localStorage.removeItem('isAdmin');
        window.location.href = 'index.html';
    });
});