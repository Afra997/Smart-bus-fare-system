import { getDashboardData } from './supabase.js';

let revenueChart;

document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem('isAdmin')) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('adminLogoutBtn').addEventListener('click', () => {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
  });

  try {
    document.getElementById('kpiPassengers').textContent = '...';
    document.getElementById('kpiViolations').textContent = '...';
    document.getElementById('transactionsTableBody').innerHTML = '<tr><td colspan="3" class="text-center">Loading...</td></tr>';
    document.getElementById('violationsTableBody').innerHTML = '<tr><td colspan="3" class="text-center">Loading...</td></tr>';

    const data = await getDashboardData();
    updateDashboard(data);
  } catch (error) {
    console.error('Dashboard initialization failed:', error);
    document.getElementById('transactionsTableBody').innerHTML = '<tr><td colspan="3" class="text-center text-danger">Failed to load data</td></tr>';
    document.getElementById('violationsTableBody').innerHTML = '<tr><td colspan="3" class="text-center text-danger">Failed to load data</td></tr>';
  }
});

function updateDashboard(data) {
  console.log('Dashboard data:', data);

  document.getElementById('kpiPassengers').textContent = data.kpis.passengers;
  document.getElementById('kpiJourneys').textContent = data.kpis.journeys;
  document.getElementById('kpiRevenue').textContent = data.kpis.revenue;
  document.getElementById('kpiViolations').textContent = data.kpis.violations;

  updateRevenueChart(data.chartData);

  const transactionsBody = document.getElementById('transactionsTableBody');
  if (data.recentTransactions.length > 0) {
    transactionsBody.innerHTML = data.recentTransactions.map(t => `
      <tr>
        <td>${t.passengers?.name || 'Unknown'}</td>
        <td>${parseFloat(t.amount).toFixed(2)} BDT</td>
        <td>${new Date(t.created_at).toLocaleString()}</td>
      </tr>
    `).join('');
  } else {
    transactionsBody.innerHTML = '<tr><td colspan="3" class="text-center">No transactions found</td></tr>';
  }

  const violationsBody = document.getElementById('violationsTableBody');
  if (data.recentViolations.length > 0) {
    violationsBody.innerHTML = data.recentViolations.map(v => {
      const busRoute = v.buses?.route || 'Unknown route';
      
      return `
        <tr>
          <td>${new Date(v.created_at).toLocaleString()}</td>
          <td>${busRoute}</td>
          <td>
            <span class="badge ${getViolationBadgeClass(v.type)}">
              ${v.type}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  } else {
    violationsBody.innerHTML = '<tr><td colspan="3" class="text-center">No violations found</td></tr>';
  }
}

function getViolationBadgeClass(type) {
  const classes = {
    noScan: 'bg-danger',
    fakeScan: 'bg-warning text-dark',
    incorrectCode: 'bg-info text-dark',
    multipleAttempts: 'bg-secondary'
  };
  return classes[type] || 'bg-primary';
}

function updateRevenueChart(chartData) {
  const ctx = document.getElementById('revenueChart').getContext('2d');
    if (revenueChart) {
    revenueChart.destroy();
  }

  if (chartData.length > 0) {
    revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(item => item.date),
        datasets: [{
          label: 'Daily Revenue (BDT)',
          data: chartData.map(item => item.amount),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad'
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Revenue (BDT)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Revenue: ${context.parsed.y.toFixed(2)} BDT`;
              }
            }
          }
        }
      }
    });
  } else {
    document.getElementById('revenueChart').style.display = 'none';
    document.querySelector('.card-header').insertAdjacentHTML('afterend', 
      '<div class="alert alert-warning m-3">No revenue data available</div>'
    );
  }
}