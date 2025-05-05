// reports.js

/**
 * Reports page logic: stub-free, ready for backend integration
 */
document.addEventListener('DOMContentLoaded', () => {
    // Authentication check
    if (!localStorage.getItem('isAdmin')) {
      window.location.href = 'index.html';
      return;
    }
  
    // Logout button
    document.getElementById('adminLogoutBtn').addEventListener('click', () => {
      localStorage.removeItem('isAdmin');
      window.location.href = 'index.html';
    });
  
    // Generate report button
    document.getElementById('generateReportBtn').addEventListener('click', () => {
      const type = document.getElementById('reportTypeSelect').value;
      // Trigger backend report generation
      fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
      .then(response => {
        if (!response.ok) throw new Error('Report generation failed');
        return response.json();  // expects { timestamp: 'ISO_DATE' }
      })
      .then(({ timestamp }) => {
        updateLastRun(timestamp);
        fetchReportsList();
      })
      .catch(err => console.error(err));
    });
  
    // Initial load: fetch list of existing reports
    fetchReportsList();
  });
  
  /**
   * Updates the displayed timestamp of the last report run
   * @param {string} timestamp - ISO date string
   */
  function updateLastRun(timestamp) {
    const el = document.getElementById('lastReportRun');
    el.textContent = new Date(timestamp).toLocaleString();
  }
  
  /**
   * Fetches report metadata from backend and renders the table
   */
  function fetchReportsList() {
    fetch('/api/reports/list')    // expects GET returning array of { id, type, generatedOn, url }
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch reports list');
        return response.json();
      })
      .then(populateReportsTable)
      .catch(err => console.error(err));
  }
  
  /**
   * Renders report rows into the #reportsTable tbody
   * @param {Array} reports - list of report objects
   */
  function populateReportsTable(reports) {
    const tbody = document.querySelector('#reportsTable tbody');
    tbody.innerHTML = '';
    reports.forEach(({ id, type, generatedOn, url }) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${id}</td>
        <td>${type}</td>
        <td>${new Date(generatedOn).toLocaleString()}</td>
        <td><a href="${url}" class="btn btn-sm btn-primary" download>Download</a></td>
      `;
      tbody.appendChild(row);
    });
  
    // If list is non-empty, update last run to the most recent
    if (reports.length) {
      const latest = reports[0].generatedOn;
      updateLastRun(latest);
    }
  }
  