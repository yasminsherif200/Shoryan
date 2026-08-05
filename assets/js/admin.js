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
