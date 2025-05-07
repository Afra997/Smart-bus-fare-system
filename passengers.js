
/* passengers.js */
// passenger management script

document.addEventListener('DOMContentLoaded', () => {
    // Auth check
    if (!localStorage.getItem('isAdmin')) {
      window.location.href = 'index.html';
      return;
    }
  
    // Logout
    document.getElementById('adminLogoutBtn').addEventListener('click', () => {
      localStorage.removeItem('isAdmin');
      window.location.href = 'index.html';
    });
  
    // Initial fetch and render
    // fetchPassengers().then(renderPassengerTable);
  
    // Filters
    document.getElementById('applyPassengerFilters').addEventListener('click', () => {
      const search = document.getElementById('passengerSearch').value;
      const status = document.getElementById('statusFilter').value;
      const regDate = document.getElementById('registrationDateFilter').value;
      // fetchPassengers({ search, status, regDate }).then(renderPassengerTable);
    });
  
    // New Passenger
    document.getElementById('addPassengerBtn').addEventListener('click', () => {
      // openAddPassengerModal();
    });
  });
  
  function renderPassengerTable(passengers) {
    const tbody = document.querySelector('#passengersTable tbody');
    tbody.innerHTML = '';
    passengers.forEach(p => {
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.email}</td>
          <td>${p.phone}</td>
          <td>${p.nidVerified ? 'Yes' : 'No'}</td>
          <td>${p.status}</td>
          <td>${p.registeredOn}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditPassengerModal('${p.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-info" onclick="viewTripHistory('${p.id}')">
              <i class="fas fa-history"></i>
            </button>
          </td>
        </tr>
      `);
    });
  }
  
  // Placeholder functions
  function fetchPassengers(filters) { /* returns Promise<Array> */ }
  function openEditPassengerModal(id) { /* ... */ }
  function viewTripHistory(id) { /* ... */ }
  