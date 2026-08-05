// لما صفحة manage_users.php تفتح، حمّل المستخدمين على طول
document.addEventListener('DOMContentLoaded', function () {
    const usersTableBody = document.getElementById('usersTableBody');
    if (usersTableBody) {
        loadUsers();
    }
});

// ========================================================
// جيب كل المستخدمين واعرضهم في جدول manage_users.php
// ========================================================
function loadUsers() {
    const messageBox = document.getElementById('usersMessage');
    const table = document.getElementById('usersTable');
    const tbody = document.getElementById('usersTableBody');

    fetch('/Shoryan/api/admin/users.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                messageBox.textContent = data.message;
                return;
            }

            if (data.data.length === 0) {
                messageBox.textContent = 'No users found.';
                return;
            }

            tbody.innerHTML = '';
            data.data.forEach(function (row) {
                const tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + row.full_name + '</td>' +
                    '<td>' + row.email + '</td>' +
                    '<td>' + row.phone + '</td>' +
                    '<td>' + row.blood_type + '</td>' +
                    '<td>' + row.city + '</td>' +
                    '<td>' + row.role + '</td>' +
                    '<td>' + row.created_at + '</td>' +
                    '<td><button onclick="deleteUser(' + row.id + ')">Delete</button></td>';
                tbody.appendChild(tr);
            });

            table.style.display = 'table';
        })
        .catch(function (err) {
            console.error(err);
            messageBox.textContent = 'Failed to load users.';
        });
}

// ========================================================
// مسح مستخدم معين بعد تأكيد من الأدمن
// ========================================================
function deleteUser(userId) {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    const formData = new URLSearchParams();
    formData.append('user_id', userId);

    fetch('/Shoryan/api/admin/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            alert(data.message);
            if (data.success) {
                loadUsers();
            }
        })
        .catch(function (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}


// ========================================================
// ===== Person 5: Admin Dashboard Stats =====
// Powers pages/admin/dashboard.php from api/admin/stats.php.
// Runs only on the dashboard page (guarded by #statTotalUsers).
// ========================================================
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('statTotalUsers')) {
        loadDashboardStats();
    }
});

function loadDashboardStats() {
    const messageBox = document.getElementById('statsMessage');

    fetch('/Shoryan/api/admin/stats.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                if (messageBox) {
                    messageBox.textContent = data.message;
                    messageBox.classList.add('message-error');
                }
                return;
            }

            const stats = data.data;
            const totals = stats.totals || {};

            // Headline stat cards
            setStatText('statTotalUsers', totals.users);
            setStatText('statOpenRequests', totals.open_requests);
            setStatText('statTotalDonations', totals.donations);
            setStatText('statAvailableDonors', totals.available_donors);

            // Breakdown lists
            renderBreakdown('requestStatusBreakdown', stats.requests_by_status);
            renderBreakdown('donationStatusBreakdown', stats.donations_by_status);
            renderBreakdown('bloodTypeBreakdown', stats.users_by_blood_type);
        })
        .catch(function (err) {
            console.error(err);
            if (messageBox) {
                messageBox.textContent = 'Failed to load dashboard stats.';
                messageBox.classList.add('message-error');
            }
        });
}

function setStatText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = (value === undefined || value === null) ? 0 : value;
}

// Renders a { key: count } object as rows inside the given container
function renderBreakdown(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const entries = Object.keys(data || {});
    if (entries.length === 0) {
        container.innerHTML = '<p class="breakdown-key">No data yet.</p>';
        return;
    }

    container.innerHTML = '';
    entries.forEach(function (key) {
        const row = document.createElement('div');
        row.className = 'breakdown-row';

        const keyEl = document.createElement('span');
        keyEl.className = 'breakdown-key';
        keyEl.textContent = key;

        const valEl = document.createElement('span');
        valEl.className = 'breakdown-val';
        valEl.textContent = data[key];

        row.appendChild(keyEl);
        row.appendChild(valEl);
        container.appendChild(row);
    });
}
// Admin dashboard helpers (fetch wrappers + table rendering)
const AdminAPI = {

  async listRequests(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/list.php${params ? '?' + params : ''}`);
    return res.json();
  },

  async verifyRequest(requestId) {
    const res = await fetch('/api/update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: requestId, verified_by_hospital: true })
    });
    return res.json();
  },

  async updateRequestStatus(requestId, status) {
    const res = await fetch('/api/update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: requestId, status })
    });
    return res.json();
  },

  async deleteRequest(requestId) {
    const res = await fetch('/api/delete.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: requestId })
    });
    return res.json();
  },

  async listDonations(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/donations_list.php${params ? '?' + params : ''}`);
    return res.json();
  },

  async updateDonationStatus(donationId, status) {
    const res = await fetch('/api/donations_update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donation_id: donationId, status })
    });
    return res.json();
  },

  async renderRequestsTable(filters = {}) {
    const tbody = document.getElementById('requests-table-body');
    tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

    const result = await this.listRequests(filters);
    if (!result.success) {
      tbody.innerHTML = `<tr><td colspan="6">${result.message}</td></tr>`;
      return;
    }
    if (result.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No requests found.</td></tr>';
      return;
    }

    tbody.innerHTML = result.data.map((r) => `
      <tr>
        <td>${r.id}</td>
        <td>${r.patient_name}</td>
        <td>${r.blood_type}</td>
        <td>${r.hospital_name}</td>
        <td>
          <select data-id="${r.id}" class="status-select">
            <option value="open" ${r.status === 'open' ? 'selected' : ''}>Open</option>
            <option value="fulfilled" ${r.status === 'fulfilled' ? 'selected' : ''}>Fulfilled</option>
            <option value="cancelled" ${r.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
          ${Number(r.verified_by_hospital) ? '<span class="badge-verified">Verified</span>' : `<button data-id="${r.id}" class="verify-btn">Verify</button>`}
        </td>
        <td>
          <button data-id="${r.id}" class="delete-btn">Delete</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.status-select').forEach((sel) => {
      sel.addEventListener('change', async (e) => {
        const result = await this.updateRequestStatus(e.target.dataset.id, e.target.value);
        if (!result.success) alert(result.message);
      });
    });
    tbody.querySelectorAll('.verify-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const result = await this.verifyRequest(e.target.dataset.id);
        if (result.success) this.renderRequestsTable(filters);
        else alert(result.message);
      });
    });
    tbody.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        if (!confirm('Are you sure you want to permanently delete this request?')) return;
        const result = await this.deleteRequest(e.target.dataset.id);
        if (result.success) this.renderRequestsTable(filters);
        else alert(result.message);
      });
    });
  },

  async renderDonationsTable(filters = {}) {
    const tbody = document.getElementById('donations-table-body');
    tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';

    const result = await this.listDonations(filters);
    if (!result.success) {
      tbody.innerHTML = `<tr><td colspan="7">${result.message}</td></tr>`;
      return;
    }
    if (result.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No donation offers found.</td></tr>';
      return;
    }

    tbody.innerHTML = result.data.map((d) => `
      <tr>
        <td>${d.donor_name}</td>
        <td>${d.donor_phone}</td>
        <td>${d.request_code}</td>
        <td>${d.patient_name}</td>
        <td>${d.blood_type}</td>
        <td>
          <select data-id="${d.id}" class="donation-status-select">
            <option value="pending" ${d.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="accepted" ${d.status === 'accepted' ? 'selected' : ''}>Accepted</option>
            <option value="completed" ${d.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${d.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td><button data-id="${d.id}" class="save-donation-btn">Save</button></td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.save-donation-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const status = tbody.querySelector(`.donation-status-select[data-id="${id}"]`).value;
        const result = await this.updateDonationStatus(id, status);
        alert(result.message);
      });
    });
  },
};
