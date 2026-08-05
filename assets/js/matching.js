// نخزن كل التبرعات هنا بعد ما نجيبها من السيرفر، عشان البحث والفلترة
// يشتغلوا على الداتا الموجودة من غير ما نعمل fetch جديد كل مرة
let allDonations = [];

document.addEventListener('DOMContentLoaded', function () {
    const donationsTableBody = document.getElementById('donationsTableBody');
    if (donationsTableBody) {
        loadMyDonations();

        const searchInput = document.getElementById('donationSearch');
        const statusFilter = document.getElementById('statusFilter');
        const exportBtn = document.getElementById('exportBtn');

        if (searchInput) searchInput.addEventListener('input', renderDonationsTable);
        if (statusFilter) statusFilter.addEventListener('change', renderDonationsTable);
        if (exportBtn) exportBtn.addEventListener('click', exportDonationsCsv);
    }
});

// ========================================================
// المتبرع بيدوس زرار "أتبرع" على طلب معين
// ========================================================
function volunteerForRequest(requestId, onDone) {
    const formData = new URLSearchParams();
    formData.append('request_id', requestId);

    fetch('/Shoryan/api/matching/volunteer.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            alert(data.message);
            if (typeof onDone === 'function') onDone(data);
        })
        .catch(function (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}

// ========================================================
// صاحب الطلب بيقبل / يرفض / يأكد تبرع معين
// ========================================================
function updateDonationStatus(donationId, newStatus, onDone) {
    const formData = new URLSearchParams();
    formData.append('donation_id', donationId);
    formData.append('new_status', newStatus);

    fetch('/Shoryan/api/matching/update_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            alert(data.message);
            if (typeof onDone === 'function') onDone(data);
        })
        .catch(function (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}

// ========================================================
// جيب كل تبرعاتي، احسب الإحصائيات، وارسم الجدول
// ========================================================
function loadMyDonations() {
    const messageBox = document.getElementById('donationsMessage');

    fetch('/Shoryan/api/matching/my_matches.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                messageBox.textContent = data.message;
                return;
            }

            allDonations = data.data.donations;
            renderStats(allDonations, data.data.donor);
            renderDonationsTable();
        })
        .catch(function (err) {
            console.error(err);
            messageBox.textContent = 'Failed to load your donations.';
        });
}

// ========================================================
// الكروت التلاتة فوق (Lives Impacted / Completed / Next Eligible)
// ========================================================
function renderStats(donations, donor) {
    const completedCount = donations.filter(function (d) { return d.status === 'completed'; }).length;

    // كل تبرع دم واحد ممكن ينقذ لحد 3 أرواح - رقم تقريبي شائع، مش من الداتابيز
    document.getElementById('statLivesImpacted').textContent = completedCount * 3;
    document.getElementById('statCompleted').textContent = completedCount;

    const nextEligibleEl = document.getElementById('statNextEligible');
    const captionEl = document.getElementById('statNextEligibleCaption');

    // قاعدة التبرع بالدم الكامل: لازم تستنى 56 يوم (8 أسابيع) بين كل تبرع والتاني
    const DONATION_INTERVAL_DAYS = 56;

    if (!donor || !donor.last_donation_date) {
        nextEligibleEl.textContent = 'Eligible now';
        captionEl.textContent = 'No previous donations on record';
        return;
    }

    const lastDate = new Date(donor.last_donation_date);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + DONATION_INTERVAL_DAYS);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (nextDate <= today) {
        nextEligibleEl.textContent = 'Eligible now';
        captionEl.textContent = 'You can donate again';
    } else {
        const daysLeft = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        nextEligibleEl.textContent = nextDate.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        captionEl.textContent = 'In ' + daysLeft + ' day' + (daysLeft === 1 ? '' : 's');
    }
}

// ========================================================
// يرسم صفوف الجدول، مع تطبيق البحث والفلتر الحاليين
// ========================================================
function renderDonationsTable() {
    const messageBox = document.getElementById('donationsMessage');
    const table = document.getElementById('donationsTable');
    const tbody = document.getElementById('donationsTableBody');
    const searchInput = document.getElementById('donationSearch');
    const statusFilter = document.getElementById('statusFilter');

    const searchTerm = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const statusValue = statusFilter ? statusFilter.value : '';

    const filtered = allDonations.filter(function (row) {
        const recordId = ('REQ-' + String(row.request_id).padStart(4, '0')).toLowerCase();
        const hospital = (row.hospital_name || '').toLowerCase();

        const matchesSearch = !searchTerm || recordId.includes(searchTerm) || hospital.includes(searchTerm);
        const matchesStatus = !statusValue || row.status === statusValue;

        return matchesSearch && matchesStatus;
    });

    if (allDonations.length === 0) {
        messageBox.textContent = 'You have not volunteered for any request yet.';
        table.style.display = 'none';
        return;
    }

    if (filtered.length === 0) {
        messageBox.textContent = 'No donations match your search.';
        table.style.display = 'none';
        return;
    }

    messageBox.textContent = '';
    tbody.innerHTML = '';

    filtered.forEach(function (row) {
        const tr = document.createElement('tr');
        const isRejected = row.status === 'rejected';
        const recordId = 'REQ-' + String(row.request_id).padStart(4, '0');
        const dateText = row.donation_date || row.created_at;

        tr.innerHTML =
            '<td><a class="record-id-link" href="/Shoryan/pages/request_details.php?id=' + row.request_id + '">#' + recordId + '</a></td>' +
            '<td><span class="facility-cell' + (isRejected ? ' is-rejected' : '') + '">' + escapeHtml(row.hospital_name || row.city) + '</span></td>' +
            '<td><span class="blood-type-pill">' + escapeHtml(row.blood_type) + '</span></td>' +
            '<td><span class="status-badge status-' + row.status + '">' + row.status + '</span></td>' +
            '<td>' + formatDate(dateText) + '</td>' +
            '<td><a class="action-view-link" href="/Shoryan/pages/request_details.php?id=' + row.request_id + '">View</a></td>';

        tbody.appendChild(tr);
    });

    table.style.display = 'table';
}

// ========================================================
// زرار "Export Record" - بيحمّل نفس البيانات الظاهرة كملف CSV
// ========================================================
function exportDonationsCsv() {
    if (allDonations.length === 0) {
        alert('No donations to export yet.');
        return;
    }

    const header = ['Record ID', 'Hospital', 'City', 'Blood Type', 'Status', 'Date'];
    const rows = allDonations.map(function (row) {
        return [
            'REQ-' + String(row.request_id).padStart(4, '0'),
            row.hospital_name || '',
            row.city || '',
            row.blood_type,
            row.status,
            row.donation_date || row.created_at
        ];
    });

    const csvContent = [header].concat(rows)
        .map(function (line) { return line.map(csvEscape).join(','); })
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my_donations.csv';
    link.click();
    URL.revokeObjectURL(url);
}

// ========================================================
// Helpers صغيرة
// ========================================================
function csvEscape(value) {
    const str = String(value == null ? '' : value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
}

function formatDate(value) {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
