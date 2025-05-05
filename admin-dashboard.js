
<!-- admin-dashboard.js -->
// Dashboard control script

document.addEventListener('DOMContentLoaded', function() {
  // Authentication check
  if (!localStorage.getItem('isAdmin')) {
    window.location.href = 'index.html';
    return;
  }

  // Logout button
  document.getElementById('adminLogoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
  });

  // Initialize empty chart
  initDashboardChart([]);

  // Fetch filter options (e.g., routes)
  // fetchRoutes().then(populateRouteOptions);

  // Generate report button
  document.getElementById('generateReportBtn').addEventListener('click', () => {
    const type = document.getElementById('reportTypeSelect').value;
    // Backend dev: trigger report generation API and update lastReportRun
  });

  // Apply filters button
  document.getElementById('applyFiltersBtn').addEventListener('click', () => {
    const start = document.getElementById('filterDateStart').value;
    const end   = document.getElementById('filterDateEnd').value;
    const route = document.getElementById('filterRoute').value;
    // Example: fetchDashboardData({ start, end, route }).then(updateDashboard);
  });
});

/**
 * Initializes the Chart.js line chart in the #dashboardChart canvas.
 * @param {Array<{label: string, value: number}>} data
 */
function initDashboardChart(data) {
  const ctx = document.getElementById('dashboardChart').getContext('2d');
  window.dashboardChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        label: 'Revenue (BDT)',
        data: data.map(d => d.value),
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { display: true },
        y: { display: true, beginAtZero: true }
      }
    }
  });
}

/**
 * Update all parts of the dashboard with fetched data
 * @param {Object} payload
 * @param {Object} payload.kpis
 * @param {Array}  payload.chartData
 * @param {Array}  payload.violations
 * @param {Array}  payload.complaints
 * @param {Object} payload.occupancy {loaded, capacity}
 * @param {Array}  payload.transactions
 */
function updateDashboard({ kpis, chartData, violations, complaints, occupancy, transactions }) {
  // KPIs
  document.getElementById('kpiPassengers').textContent = kpis.passengers;
  document.getElementById('kpiJourneys').textContent   = kpis.journeys;
  document.getElementById('kpiRevenue').textContent    = kpis.revenue;
  document.getElementById('kpiViolations').textContent = kpis.violations;
  document.getElementById('kpiComplaints').textContent = kpis.complaints;
  document.getElementById('kpiScore').textContent      = kpis.compliance + '%';

  // Occupancy
  const { loaded, capacity } = occupancy;
  const pct = capacity > 0 ? Math.round((loaded / capacity) * 100) : 0;
  document.getElementById('occupancyText').textContent = `${loaded}/${capacity}`;
  const bar = document.getElementById('occupancyBar');
  bar.style.width = pct + '%';
  bar.setAttribute('aria-valuenow', pct);

  // Chart
  window.dashboardChart.data.labels = chartData.map(d => d.label);
  window.dashboardChart.data.datasets[0].data = chartData.map(d => d.value);
  window.dashboardChart.update();

  // Transactions table
  const ttBody = document.querySelector('#transactionsTable tbody');
  ttBody.innerHTML = '';
  transactions.forEach(t => {
    ttBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${t.tripId}</td>
        <td>${t.passenger}</td>
        <td>${t.distance}</td>
        <td>${t.fare}</td>
        <td>${t.timestamp}</td>
      </tr>
    `);
  });

  // Violations table
  const vtBody = document.querySelector('#violationsTable tbody');
  vtBody.innerHTML = '';
  violations.forEach(v => {
    vtBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${v.timestamp}</td>
        <td>${v.busId}</td>
        <td>${v.location}</td>
        <td>${v.type}</td>
      </tr>
    `);
  });

  // Complaints table
  const ctBody = document.querySelector('#complaintsTable tbody');
  ctBody.innerHTML = '';
  complaints.forEach(c => {
    ctBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${c.id}</td>
        <td>${c.category}</td>
        <td>${c.status}</td>
        <td>${c.date}</td>
      </tr>
    `);
  });
}
