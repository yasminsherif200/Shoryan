// ========================================================
// Powers pages/dashboard.php using data we already have:
// - api/matching/my_matches.php  (this user's donation history, as a donor)
// - api/requests/list.php        (this user's own blood requests, as a requester)
// - api/requests/delete.php      (delete one of their own requests, right from here)
// No separate dashboard/stats endpoint - everything below is derived
// client-side from those existing calls.
// ========================================================

document.addEventListener('DOMContentLoaded', function () {
    const statTotalDonations = document.getElementById('statTotalDonations');
    if (!statTotalDonations) return; // not on the dashboard page

    loadDonationStats();
    loadMyRequestsPanel();
});

// ========================================================
// Donation-side stats + recent activity
// (api/matching/my_matches.php)
// ========================================================
function loadDonationStats() {
    fetch('/Shoryan/api/matching/my_matches.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                showMessage('activityMessage', data.message);
                return;
            }

            const donations = data.data.donations || [];
            renderDonationStatCards(donations);
            renderActivityTable(donations.slice(0, 5));
        })
        .catch(function (err) {
            console.error(err);
            showMessage('activityMessage', 'Failed to load your dashboard. Please try again.');
        });
}

function renderDonationStatCards(donations) {
    const currentYear = new Date().getFullYear();

    const completed = donations.filter(function (d) { return d.status === 'completed'; });
    const completedThisYear = completed.filter(function (d) {
        return d.donation_date && new Date(d.donation_date).getFullYear() === currentYear;
    });
    const pending = donations.filter(function (d) { return d.status === 'pending'; });
    const accepted = donations.filter(function (d) { return d.status === 'accepted'; });

    document.getElementById('statTotalDonations').textContent = completed.length;
    document.getElementById('statPendingOffers').textContent = pending.length;
    document.getElementById('statAccepted').textContent = accepted.length;

    const deltaEl = document.getElementById('statDonationsDelta');
    deltaEl.textContent = completedThisYear.length > 0
        ? '+' + completedThisYear.length + ' this year'
        : 'No donations yet this year';

    const badge = document.getElementById('notifBadge');
    if (badge) {
        if (pending.length > 0) {
            badge.textContent = pending.length;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function renderActivityTable(donations) {
    const table = document.getElementById('activityTable');
    const tbody = document.getElementById('activityTableBody');

    if (donations.length === 0) {
        showMessage('activityMessage', 'No activity yet. Once you volunteer for a request, it will show up here.');
        return;
    }

    clearMessage('activityMessage');

    tbody.innerHTML = '';
    donations.forEach(function (row) {
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + formatDashboardDate(row.created_at) + '</td>' +
            '<td>' + escapeHtmlDashboard(row.patient_name) + '</td>' +
            '<td>' + escapeHtmlDashboard(row.blood_type) + '</td>' +
            '<td>' + escapeHtmlDashboard(row.hospital_name || '-') + '</td>' +
            '<td><span class="status-badge status-' + escapeHtmlDashboard(row.status) + '">' + escapeHtmlDashboard(row.status) + '</span></td>' +
            '<td><a class="table-action-link" href="request_details.php?id=' + row.request_id + '">View</a></td>';
        tbody.appendChild(tr);
    });

    table.style.display = 'table';
}

// ========================================================
// Requester-side stats + "My Requests" panel
// (api/requests/list.php, api/requests/delete.php)
// ========================================================
function loadMyRequestsPanel() {
    fetch('/Shoryan/api/requests/list.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                showMessage('requestsMessage', data.message);
                return;
            }

            const requests = data.data || [];
            const openCount = requests.filter(function (r) { return r.status === 'open'; }).length;
            document.getElementById('statActiveRequests').textContent = openCount;

            renderMyRequestsTable(requests.slice(0, 5)); // API already sorts newest-first
        })
        .catch(function (err) {
            console.error(err);
            showMessage('requestsMessage', 'Failed to load your requests. Please try again.');
        });
}

function renderMyRequestsTable(requests) {
    const table = document.getElementById('myRequestsTable');
    const tbody = document.getElementById('myRequestsTableBody');

    if (requests.length === 0) {
        showMessage('requestsMessage', "You haven't created any requests yet.");
        return;
    }

    clearMessage('requestsMessage');

    tbody.innerHTML = '';
    requests.forEach(function (row) {
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + escapeHtmlDashboard(row.patient_name) + '</td>' +
            '<td>' + escapeHtmlDashboard(row.blood_type) + '</td>' +
            '<td><span class="status-badge status-' + escapeHtmlDashboard(row.status) + '">' + escapeHtmlDashboard(row.status) + '</span></td>' +
            '<td>' + formatDashboardDate(row.created_at) + '</td>' +
            '<td class="table-actions-cell">' +
                '<a class="table-action-link" href="request_details.php?id=' + row.id + '">View</a>' +
                '<button type="button" class="table-action-link table-action-danger" data-delete-request="' + row.id + '">Delete</button>' +
            '</td>';
        tbody.appendChild(tr);
    });

    table.style.display = 'table';

    tbody.querySelectorAll('[data-delete-request]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            deleteRequestFromDashboard(btn.getAttribute('data-delete-request'));
        });
    });
}

function deleteRequestFromDashboard(requestId) {
    const confirmed = confirm('Are you sure you want to delete this request?');
    if (!confirmed) return;

    const formData = new URLSearchParams();
    formData.append('request_id', requestId);

    fetch('/Shoryan/api/requests/delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                alert(data.message);
                return;
            }
            loadMyRequestsPanel(); // refresh the panel + the Active Requests stat
        })
        .catch(function (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}

// ========================================================
// Small shared helpers
// ========================================================
function formatDashboardDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return escapeHtmlDashboard(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function showMessage(boxId, message) {
    const box = document.getElementById(boxId);
    if (!box) return;
    box.textContent = message;
    box.classList.add('message-error');
}

function clearMessage(boxId) {
    const box = document.getElementById(boxId);
    if (!box) return;
    box.textContent = '';
    box.classList.remove('message-error', 'message-success');
}

function escapeHtmlDashboard(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
}