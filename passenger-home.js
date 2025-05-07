
// passenger-home.js (updated: fetch balance from backend)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Check login status
  if (!localStorage.getItem('isLoggedIn')) {
      window.location.href = 'index.html';
      return;
  }

  const balanceEl = document.getElementById('currentBalance');

  // 1a. Fetch current balance from backend
  fetch('/api/passenger/balance') // expects { balance: number }
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch balance');
      return res.json();
    })
    .then(({ balance }) => {
      balanceEl.textContent = parseFloat(balance).toFixed(2) + ' BDT';
      // also store in localStorage if needed
      localStorage.setItem('walletBalance', balance);
    })
    .catch(err => {
      console.error(err);
      // fallback to localStorage
      const raw = localStorage.getItem('walletBalance');
      const bal = raw ? parseFloat(raw) : 0.00;
      balanceEl.textContent = bal.toFixed(2) + ' BDT';
    });

  // 2. QR Code System
  const qrCodeContainer = document.getElementById('qrCodeContainer');
  const journeyStatus = document.getElementById('journeyStatus');
  let currentQRCode = null;

  function generateQRCode() {
      qrCodeContainer.innerHTML = '';
      const journeyId = 'JRN-' + Math.floor(100000 + Math.random() * 900000);
      const userMobile = localStorage.getItem('userMobile') || '';
      const qrData = JSON.stringify({ userId: userMobile, journeyId, timestamp: new Date().toISOString() });
      currentQRCode = new QRCode(qrCodeContainer, { text: qrData, width: 200, height: 200, correctLevel: QRCode.CorrectLevel.H });
      journeyStatus.textContent = 'Journey started. Show this QR code to the driver.';
      journeyStatus.className = 'mt-3 text-success';
      const endBtn = document.createElement('button');
      endBtn.id = 'endJourneyBtn'; endBtn.className = 'btn btn-danger btn-lg mt-3';
      endBtn.innerHTML = '<i class="fas fa-stop-circle me-2"></i> End Journey';
      endBtn.addEventListener('click', endJourney);
      qrCodeContainer.appendChild(endBtn);
  }

  function endJourney() {
      qrCodeContainer.innerHTML = '';
      const genBtn = document.createElement('button');
      genBtn.id = 'generateQRBtn'; genBtn.className = 'btn btn-primary btn-lg';
      genBtn.innerHTML = '<i class="fas fa-qrcode me-2"></i> Generate New QR';
      genBtn.addEventListener('click', generateQRCode);
      qrCodeContainer.appendChild(genBtn);
      journeyStatus.textContent = 'Journey completed - fare deducted';
      journeyStatus.className = 'mt-3 text-primary';
  }

  document.getElementById('generateQRBtn').addEventListener('click', generateQRCode);

  // 3. Chat System
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const chatMessages = document.getElementById('chatMessages');

  function addMessage(text, type) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message ${type}`;
      msgDiv.innerHTML = `<p>${text}</p>`;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendMessage() {
      const msg = chatInput.value.trim(); if (!msg) return;
      addMessage(msg, 'sent'); chatInput.value = '';
      setTimeout(() => {
          const replies = ["How can I assist you?","Your issue has been noted.","Thank you!","Call 12345 for help."];
          addMessage(replies[Math.floor(Math.random()*replies.length)], 'received');
      }, 1000);
  }

  sendChatBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', e => e.key==='Enter' && sendMessage());

  // 4. Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      window.location.href = 'index.html';
  });

  document.getElementById('reportViolationBtn').addEventListener('click', async () => {
    const type = document.getElementById('violationTypeSelect').value;
    if (!type) {
      alert('Please select a violation type.');
      return;
    }
    
    const success = await reportViolation(type);
    if (success) {
      alert('Violation reported successfully.');
      violationSelect.value = '';
    } else {
      alert('Failed to report violation.');
    }
  });
});
