import { generateReport, getReports } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
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
  document.getElementById('generateReportBtn').addEventListener('click', async () => {
    const type = document.getElementById('reportTypeSelect').value;
    const report = await generateReport(type);
    
    if (report) {
      alert(`Report generated successfully!`);
      updateLastRun(report.generated_at);
      fetchReportsList();
    } else {
      alert('Failed to generate report.');
    }
  });

  // Initial load
  await fetchReportsList();
});

function updateLastRun(timestamp) {
  const el = document.getElementById('lastReportRun');
  el.textContent = new Date(timestamp).toLocaleString();
}

async function fetchReportsList() {
  const reports = await getReports();
  populateReportsTable(reports);
  
  if (reports.length) {
    updateLastRun(reports[0].generated_at);
  }
}

function populateReportsTable(reports) {
  const tbody = document.querySelector('#reportsTable tbody');
  tbody.innerHTML = '';
  
  reports.forEach(report => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${report.id}</td>
        <td>${report.type}</td>
        <td>${new Date(report.generated_at).toLocaleString()}</td>
        <td><a href="${report.download_url}" class="btn btn-sm btn-primary" download>Download</a></td>
      </tr>
    `);
  });
}