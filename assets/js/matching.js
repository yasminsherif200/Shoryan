// لما الصفحة تفتح، لو فيها جدول تبرعات (يعني احنا في my_donations.php)، حمّل البيانات على طول
document.addEventListener('DOMContentLoaded', function () {
    const donationsTableBody = document.getElementById('donationsTableBody');
    if (donationsTableBody) {
        loadMyDonations();
    }
});

// ========================================================
// المتبرع بيدوس زرار "أتبرع" على طلب معين
// بتتنادى من صفحة زي request_details.php
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
// بتتنادى من صفحة زي request_details.php أو my_requests.php
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
// جيب كل تبرعاتي واعرضها في جدول my_donations.php
// ========================================================
function loadMyDonations() {
    const messageBox = document.getElementById('donationsMessage');
    const table = document.getElementById('donationsTable');
    const tbody = document.getElementById('donationsTableBody');

    fetch('/Shoryan/api/matching/my_matches.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                messageBox.textContent = data.message;
                return;
            }

            if (data.data.length === 0) {
                messageBox.textContent = 'You have not volunteered for any request yet.';
                return;
            }

            tbody.innerHTML = '';
            data.data.forEach(function (row) {
                const tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + row.patient_name + '</td>' +
                    '<td>' + row.blood_type + '</td>' +
                    '<td>' + (row.hospital_name || '-') + '</td>' +
                    '<td>' + row.city + '</td>' +
                    '<td>' + row.urgency + '</td>' +
                    '<td><span class="status-badge status-' + row.status + '">' + row.status + '</span></td>' +
                    '<td>' + row.created_at + '</td>';
                tbody.appendChild(tr);
            });

            table.style.display = 'table';
        })
        .catch(function (err) {
            console.error(err);
            messageBox.textContent = 'Failed to load your donations.';
        });
}
