document.addEventListener('DOMContentLoaded', function () {
    const statTotalDonations = document.getElementById('statTotalDonations');
    if (!statTotalDonations) return; // not on the dashboard page
 
    loadDashboard();
});
 
function loadDashboard() {
    fetch('/Shoryan/api/matching/my_matches.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                showActivityMessage(data.message);
                return;
            }
 
            const donations = data.data || [];
            renderStatCards(donations);
            renderActivityTable(donations.slice(0, 5)); // API already sorts newest-first
        })
        .catch(function (err) {
            console.error(err);
            showActivityMessage('Failed to load your dashboard. Please try again.');
        });
}
 
// ========================================================
// Stat cards - all counted from the same donations array
// ========================================================
function renderStatCards(donations) {
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
 
// ========================================================
// Recent activity table (most recent 5 volunteered donations)
// ========================================================
function renderActivityTable(donations) {
    const table = document.getElementById('activityTable');
    const tbody = document.getElementById('activityTableBody');
 
    if (donations.length === 0) {
        showActivityMessage('No activity yet. Once you volunteer for a request, it will show up here.');
        return;
    }
 
    clearActivityMessage();
 
    tbody.innerHTML = '';
    donations.forEach(function (row) {
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + formatActivityDate(row.created_at) + '</td>' +
            '<td>' + escapeHtml(row.patient_name) + '</td>' +
            '<td>' + escapeHtml(row.blood_type) + '</td>' +
            '<td>' + escapeHtml(row.hospital_name || '-') + '</td>' +
            '<td><span class="status-badge status-' + escapeHtml(row.status) + '">' + escapeHtml(row.status) + '</span></td>';
        tbody.appendChild(tr);
    });
 
    table.style.display = 'table';
}
 
function formatActivityDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return escapeHtml(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
 
// ========================================================
// Small helpers
// ========================================================
function showActivityMessage(message) {
    const box = document.getElementById('activityMessage');
    if (!box) return;
    box.textContent = message;
    box.classList.add('message-error');
}
 
function clearActivityMessage() {
    const box = document.getElementById('activityMessage');
    if (!box) return;
    box.textContent = '';
    box.classList.remove('message-error', 'message-success');
}
 
function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
}