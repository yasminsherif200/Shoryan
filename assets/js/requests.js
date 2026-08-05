// كل الطلبات اللي جبناها من السيرفر بنخزنها هنا عشان نستخدمها
// تاني في الـ View والـ Update من غير ما نطلب السيرفر تاني
let myRequestsCache = [];

document.addEventListener('DOMContentLoaded', function () {
    const requestsTableBody = document.getElementById('requestsTableBody');
    if (requestsTableBody) {
        loadMyRequests();
    }

    const editForm = document.getElementById('editRequestForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }
});

// ========================================================
// جيب كل طلباتي، اعرضها في الجدول، واحسب الإحصائيات فوق
// ========================================================
function loadMyRequests() {
    const messageBox = document.getElementById('requestsMessage');
    const table = document.getElementById('requestsTable');
    const tbody = document.getElementById('requestsTableBody');

    fetch('/Shoryan/api/requests/list.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                messageBox.className = 'form-message message-error';
                messageBox.style.display = 'block';
                messageBox.textContent = data.message;
                return;
            }

            myRequestsCache = data.data;
            renderStats(myRequestsCache);

            if (myRequestsCache.length === 0) {
                messageBox.style.display = 'block';
                messageBox.textContent = 'You have not created any request yet.';
                return;
            }

            messageBox.style.display = 'none';
            tbody.innerHTML = '';
            myRequestsCache.forEach(function (row) {
                tbody.appendChild(buildRequestRow(row));
            });

            table.style.display = 'table';
        })
        .catch(function (err) {
            console.error(err);
            messageBox.style.display = 'block';
            messageBox.className = 'form-message message-error';
            messageBox.textContent = 'Failed to load your requests.';
        });
}

// ========================================================
// حساب "Total Requests" و نسبة "Fulfilled" فوق الجدول
// ========================================================
function renderStats(requests) {
    const total = requests.length;
    const fulfilled = requests.filter(function (r) { return r.status === 'fulfilled'; }).length;
    const percent = total === 0 ? 0 : Math.round((fulfilled / total) * 100);

    document.getElementById('statTotalRequests').textContent = total;
    document.getElementById('statProgressFill').style.width = percent + '%';
    document.getElementById('statFulfilledCaption').textContent =
        fulfilled + ' of ' + total + ' Fulfilled';
}

// ========================================================
// بناء صف واحد في الجدول (Request ID, Blood Type, Hospital...)
// ========================================================
function buildRequestRow(row) {
    const tr = document.createElement('tr');

    const requestCode = 'REQ-' + String(row.id).padStart(4, '0');
    const dateNeeded = formatDate(row.created_at);
    const statusLabel = row.status.charAt(0).toUpperCase() + row.status.slice(1);

    tr.innerHTML =
        '<td>' + requestCode + '</td>' +
        '<td><span class="blood-type-badge">' + row.blood_type + '</span></td>' +
        '<td><div class="hospital-cell">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>' +
            (row.hospital_name || row.city) +
        '</div></td>' +
        '<td>' + dateNeeded + '</td>' +
        '<td><span class="status-pill status-' + row.status + '">' + statusLabel + '</span></td>' +
        '<td><div class="actions-cell">' +
            '<button type="button" class="action-btn" title="View" onclick="viewRequest(' + row.id + ')">' +
                '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>' +
            '</button>' +
            '<button type="button" class="action-btn" title="Update" onclick="openEditModal(' + row.id + ')">' +
                '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>' +
            '</button>' +
            '<button type="button" class="action-btn action-btn-delete" title="Delete" onclick="deleteRequest(' + row.id + ')">' +
                '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>' +
            '</button>' +
        '</div></td>';

    return tr;
}

function formatDate(isoDate) {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ========================================================
// عرض تفاصيل الطلب (زرار العين - View)
// ========================================================
function viewRequest(requestId) {
    const row = myRequestsCache.find(function (r) { return Number(r.id) === Number(requestId); });
    if (!row) return;

    const body = document.getElementById('viewModalBody');
    body.innerHTML =
        viewRow('Patient Name', row.patient_name) +
        viewRow('Blood Type', row.blood_type) +
        viewRow('Units Needed', row.units_needed) +
        viewRow('Hospital', row.hospital_name || '-') +
        viewRow('City', row.city) +
        viewRow('Urgency', row.urgency) +
        viewRow('Status', row.status) +
        viewRow('Created On', formatDate(row.created_at));

    openModal('viewModal');
}

function viewRow(label, value) {
    return '<div class="view-row"><span class="view-row-label">' + label + '</span>' +
        '<span class="view-row-value">' + value + '</span></div>';
}

// ========================================================
// فتح فورم التعديل ومليه ببيانات الطلب الحالية (زرار القلم - Update)
// ========================================================
function openEditModal(requestId) {
    const row = myRequestsCache.find(function (r) { return Number(r.id) === Number(requestId); });
    if (!row) return;

    document.getElementById('editRequestId').value = row.id;
    document.getElementById('editPatientName').value = row.patient_name;
    document.getElementById('editBloodType').value = row.blood_type;
    document.getElementById('editUnitsNeeded').value = row.units_needed;
    document.getElementById('editHospitalName').value = row.hospital_name || '';
    document.getElementById('editCity').value = row.city;
    document.getElementById('editUrgency').value = row.urgency;
    document.getElementById('editStatus').value = row.status;

    const msg = document.getElementById('editRequestMessage');
    msg.style.display = 'none';
    msg.textContent = '';

    openModal('editModal');
}

// ========================================================
// إرسال التعديل للسيرفر بعد ما المستخدم يضغط Save Changes
// ========================================================
function handleEditSubmit(event) {
    event.preventDefault();

    const msg = document.getElementById('editRequestMessage');
    const formData = new URLSearchParams();
    formData.append('request_id', document.getElementById('editRequestId').value);
    formData.append('patient_name', document.getElementById('editPatientName').value);
    formData.append('blood_type', document.getElementById('editBloodType').value);
    formData.append('units_needed', document.getElementById('editUnitsNeeded').value);
    formData.append('hospital_name', document.getElementById('editHospitalName').value);
    formData.append('city', document.getElementById('editCity').value);
    formData.append('urgency', document.getElementById('editUrgency').value);
    formData.append('status', document.getElementById('editStatus').value);

    fetch('/Shoryan/api/requests/update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                msg.className = 'form-message message-error';
                msg.style.display = 'block';
                msg.textContent = data.message;
                return;
            }
            closeModal('editModal');
            loadMyRequests();
        })
        .catch(function (err) {
            console.error(err);
            msg.className = 'form-message message-error';
            msg.style.display = 'block';
            msg.textContent = 'Something went wrong. Please try again.';
        });
}

// ========================================================
// مسح طلب معين بعد تأكيد من المستخدم (زرار سلة المهملات - Delete)
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
            if (!data.success) {
                alert(data.message);
                return;
            }
            loadMyRequests();
        })
        .catch(function (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}

// ========================================================
// فتح وقفل الـ modals (View / Update)
// ========================================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
}
