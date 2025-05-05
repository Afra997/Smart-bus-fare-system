
/* buses.js */
// bus fleet management script

document.addEventListener('DOMContentLoaded', () => {
    // Auth check (reuse admin-login logic)
    if (!localStorage.getItem('isAdmin')) {
      window.location.href = 'index.html';
      return;
    }
  
    // Logout
    document.getElementById('adminLogoutBtn').addEventListener('click', () => {
      localStorage.removeItem('isAdmin');
      window.location.href = 'index.html';
    });
  
    // Fetch and render routes into filter
    // fetchRoutes().then(routes => populateRouteFilter(routes));
  
    // Fetch and render bus list
    // fetchBuses().then(renderBusTable);
  
    // Filter application
    document.getElementById('applyBusFilters').addEventListener('click', () => {
      const search = document.getElementById('busSearch').value;
      const route  = document.getElementById('routeFilter').value;
      const status = document.getElementById('statusFilter').value;
      // fetchBuses({ search, route, status }).then(renderBusTable);
    });
  
    // Add Bus button
    document.getElementById('addBusBtn').addEventListener('click', () => {
      // openAddBusModal();
    });
  });
  
  function renderBusTable(buses) {
    const tbody = document.querySelector('#busesTable tbody');
    tbody.innerHTML = '';
    buses.forEach(bus => {
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${bus.id}</td>
          <td>${bus.route}</td>
          <td>${bus.driver}</td>
          <td>${bus.capacity}</td>
          <td>${bus.occupancy}</td>
          <td>${bus.status}</td>
          <td>${bus.lastService}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditBusModal('${bus.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary" onclick="openMaintenanceLog('${bus.id}')">
              <i class="fas fa-tools"></i>
            </button>
          </td>
        </tr>
      `);
    });
  }
  
  // Placeholder functions: implement as needed
  function populateRouteFilter(routes) { /* ... */ }
  function openEditBusModal(busId) { /* ... */ }
  function openMaintenanceLog(busId) { /* ... */ }
  function fetchBuses(filters) { /* returns Promise<Array> */ }
  function fetchRoutes() { /* returns Promise<Array> */ }
  