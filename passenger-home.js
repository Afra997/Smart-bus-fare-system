// passenger-home.js (updated: handle violation submit)

document.addEventListener('DOMContentLoaded', () => {
    // Login check & balance fetch omitted for brevity...

    // Violation submit
    const violationSelect = document.getElementById('violationTypeSelect');
    document.getElementById('reportViolationBtn').addEventListener('click', () => {
        const type = violationSelect.value;
        if (!type) {
            alert('Please select a violation type.');
            return;
        }
        // Send violation report to backend
        fetch('/api/passenger/report-violation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ violationType: type })
        })
        .then(res => {
            if (!res.ok) throw new Error('Report failed');
            alert('Violation reported successfully.');
            violationSelect.value = '';
        })
        .catch(err => {
            console.error(err);
            alert('Failed to report violation.');
        });
    });

    // Other passenger-home.js logic remains... (QR & chat & logout)
});
