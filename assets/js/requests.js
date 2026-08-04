// لما صفحة my_requests.php تفتح، حمّل طلباتي على طول
document.addEventListener('DOMContentLoaded', function () {
    const requestsTableBody = document.getElementById('requestsTableBody');
    if (requestsTableBody) {
        loadMyRequests();
    }
});

// ========================================================
// جيب كل طلباتي واعرضها في جدول my_requests.php
// ========================================================
function loadMyRequests() {
    const messageBox = document.getElementById('requestsMessage');
    const table = document.getElementById('requestsTable');
    const tbody = document.getElementById('requestsTableBody');

    fetch('/Shoryan/api/requests/list.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                messageBox.textContent = data.message;
                return;
            }

            if (data.data.length === 0) {
                messageBox.textContent = 'You have not created any request yet.';
                return;
            }

            tbody.innerHTML = '';
            data.data.forEach(function (row) {
                const tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + row.patient_name + '</td>' +
                    '<td>' + row.blood_type + '</td>' +
                    '<td>' + row.units_needed + '</td>' +
                    '<td>' + (row.hospital_name || '-') + '</td>' +
                    '<td>' + row.city + '</td>' +
                    '<td>' + row.urgency + '</td>' +
                    '<td><span class="status-badge status-' + row.status + '">' + row.status + '</span></td>' +
                    '<td>' + row.created_at + '</td>' +
                    '<td><button onclick="deleteRequest(' + row.id + ')">Delete</button></td>';
                tbody.appendChild(tr);
            });

            table.style.display = 'table';
        })
        .catch(function (err) {
            console.error(err);
            messageBox.textContent = 'Failed to load your requests.';
        });
}

// ========================================================
// مسح طلب معين بعد تأكيد من المستخدم
// ========================================================
function deleteRequest(requestId) {
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
            alert(data.message);
            if (data.success) {
                loadMyRequests();
            }
        })
        .catch(function (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}
