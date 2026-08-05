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

    const createForm = document.getElementById('requestForm');
    if (createForm) {
        createForm.addEventListener('submit', handleCreateRequest);
    }

    const browseGrid = document.getElementById('browseGrid');
    if (browseGrid) {
        initBrowseRequestsPage();
    }

    const detailContainer = document.getElementById('requestDetailContainer');
    if (detailContainer) {
        loadRequestDetails();
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

// ========================================================
// request_create.php: submit the "Broadcast Request" form
// ========================================================
function handleCreateRequest(event) {
    event.preventDefault();

    const form = event.target;
    const msg = document.getElementById('formMessage');
    const submitBtn = form.querySelector('button[type="submit"]');

    // form field names already match the API 1:1 (patient_name, blood_type,
    // units_needed, city, urgency, hospital_name, notes), so FormData can be
    // sent as-is without rebuilding it field by field.
    const formData = new URLSearchParams(new FormData(form));

    msg.className = 'form-message';
    msg.style.display = 'none';
    msg.textContent = '';
    if (submitBtn) submitBtn.disabled = true;

    fetch('/Shoryan/api/requests/create.php', {
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
                if (submitBtn) submitBtn.disabled = false;
                return;
            }

            msg.className = 'form-message message-success';
            msg.style.display = 'block';
            msg.textContent = data.message;

            // Send them straight to the new request's details page
            window.location.href = 'browse_requests.php';
        })
        .catch(function (err) {
            console.error(err);
            msg.className = 'form-message message-error';
            msg.style.display = 'block';
            msg.textContent = 'Something went wrong. Please try again.';
            if (submitBtn) submitBtn.disabled = false;
        });
}

// ========================================================
// browse_requests.php: search/filter open requests from
// everyone else, render as cards linking to request_details.php
// (that's where the actual "Volunteer" action lives)
// ========================================================
function initBrowseRequestsPage() {
    loadBrowseRequests();

    const form = document.getElementById('browseFilterForm');
    if (!form) return;

    let debounceTimer = null;
    form.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(loadBrowseRequests, 350);
    });
    form.addEventListener('change', loadBrowseRequests);
}

function loadBrowseRequests() {
    const messageBox = document.getElementById('browseMessage');
    const grid = document.getElementById('browseGrid');
    const form = document.getElementById('browseFilterForm');

    const params = new URLSearchParams();
    params.append('scope', 'all');

    const search = (form.search || {}).value || '';
    const bloodType = (form.blood_type || {}).value || '';
    const city = (form.city || {}).value || '';

    if (search.trim()) params.append('search', search.trim());
    if (bloodType) params.append('blood_type', bloodType);
    if (city.trim()) params.append('city', city.trim());

    messageBox.style.display = 'none';
    messageBox.className = 'form-message';

    fetch('/Shoryan/api/requests/list.php?' + params.toString())
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                grid.innerHTML = '';
                messageBox.className = 'form-message message-error';
                messageBox.style.display = 'block';
                messageBox.textContent = data.message;
                return;
            }

            if (data.data.length === 0) {
                grid.innerHTML = '<p class="browse-empty-state">No open requests match your filters right now.</p>';
                return;
            }

            grid.innerHTML = data.data.map(buildBrowseCard).join('');
        })
        .catch(function (err) {
            console.error(err);
            grid.innerHTML = '';
            messageBox.className = 'form-message message-error';
            messageBox.style.display = 'block';
            messageBox.textContent = 'Failed to load requests.';
        });
}

function buildBrowseCard(row) {
    const urgencyClass = row.urgency === 'critical' ? 'urgency-critical'
        : row.urgency === 'urgent' ? 'urgency-urgent' : '';
    const urgencyLabel = row.urgency.charAt(0).toUpperCase() + row.urgency.slice(1);

    return (
        '<div class="request-card ' + urgencyClass + '">' +
            '<div class="request-card-header">' +
                '<h3>' + row.patient_name + '</h3>' +
                '<span class="request-card-blood-chip">' + row.blood_type + '</span>' +
            '</div>' +
            '<p class="request-card-meta">' +
                '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>' +
                (row.hospital_name || row.city) +
            '</p>' +
            '<p class="request-card-meta">' +
                '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"/></svg>' +
                row.units_needed + ' bag' + (row.units_needed > 1 ? 's' : '') + ' needed &middot; ' + urgencyLabel +
            '</p>' +
            '<div class="request-card-footer">' +
                '<span class="request-card-meta">' + formatDate(row.created_at) + '</span>' +
                '<a class="btn-view-details" href="request_details.php?id=' + row.id + '">View Details</a>' +
            '</div>' +
        '</div>'
    );
}

// ========================================================
// request_details.php: load one request (api/requests/view.php),
// fill in the page, and wire the Volunteer / Accept / Reject /
// Complete actions (the actual mutations live in matching.js's
// volunteerForRequest() and updateDonationStatus() - this just
// calls them and re-renders afterwards).
// ========================================================
function loadRequestDetails() {
    const container = document.getElementById('requestDetailContainer');
    const requestId = container.getAttribute('data-id');
    const currentUserId = Number(container.getAttribute('data-current-user-id'));

    const messageBox = document.getElementById('detailMessage');
    const content = document.getElementById('detailContent');

    messageBox.style.display = 'none';
    messageBox.className = 'form-message';

    fetch('/Shoryan/api/requests/view.php?id=' + requestId)
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                content.style.display = 'none';
                messageBox.className = 'form-message message-error';
                messageBox.style.display = 'block';
                messageBox.textContent = data.message;
                return;
            }

            renderRequestDetail(data.data, currentUserId);
            content.style.display = 'block';
        })
        .catch(function (err) {
            console.error(err);
            content.style.display = 'none';
            messageBox.className = 'form-message message-error';
            messageBox.style.display = 'block';
            messageBox.textContent = 'Failed to load this request.';
        });
}

function renderRequestDetail(request, currentUserId) {
    document.getElementById('detailPatientName').textContent = request.patient_name;

    const urgencyBadge = document.getElementById('detailUrgencyBadge');
    urgencyBadge.textContent = request.urgency;
    urgencyBadge.className = 'urgency-badge urgency-' + request.urgency;

    document.getElementById('detailBloodType').textContent = request.blood_type;
    document.getElementById('detailUnitsNeeded').textContent =
        request.units_needed + ' Bag' + (request.units_needed > 1 ? 's' : '');

    const donations = request.donations || [];
    const completedCount = donations.filter(function (d) { return d.status === 'completed'; }).length;
    const percent = Math.min(100, Math.round((completedCount / request.units_needed) * 100));
    document.getElementById('detailProgressText').textContent =
        completedCount + ' / ' + request.units_needed + ' Bags (' + percent + '%)';
    document.getElementById('detailProgressBar').style.width = percent + '%';

    document.getElementById('detailRequesterName').textContent = request.requester_name;
    document.getElementById('detailRequesterInitials').textContent = getInitialsFromName(request.requester_name);
    document.getElementById('detailCreatedAt').textContent = formatDate(request.created_at);
    document.getElementById('detailHospital').textContent = request.hospital_name || request.city;
    document.getElementById('detailPhone').textContent = request.requester_phone;

    const notesBox = document.getElementById('detailNotesBox');
    if (request.notes) {
        document.getElementById('detailNotes').textContent = request.notes;
        notesBox.style.display = 'block';
    } else {
        notesBox.style.display = 'none';
    }

    document.getElementById('detailOffersCount').textContent = donations.length;
    renderDonationOffers(donations, request.requester_id, currentUserId, request.id);

    // Only show "Volunteer to Donate" when it would actually be allowed server-side:
    // not your own request, still open, and you don't already have an active offer on it
    const isOwner = currentUserId === Number(request.requester_id);
    const alreadyVolunteered = donations.some(function (d) {
        return Number(d.donor_id) === currentUserId && (d.status === 'pending' || d.status === 'accepted');
    });

    const volunteerBtn = document.getElementById('volunteerBtn');
    if (!isOwner && request.status === 'open' && !alreadyVolunteered) {
        volunteerBtn.style.display = 'flex';
        volunteerBtn.onclick = function () {
            volunteerBtn.disabled = true;
            volunteerForRequest(request.id, function (data) {
                volunteerBtn.disabled = false;
                if (data.success) loadRequestDetails();
            });
        };
    } else {
        volunteerBtn.style.display = 'none';
    }
}

function renderDonationOffers(donations, requesterId, currentUserId, requestId) {
    const list = document.getElementById('donationOffersList');
    const isOwner = currentUserId === Number(requesterId);

    if (donations.length === 0) {
        list.innerHTML = '<p class="donor-offer-type">No one has volunteered for this request yet.</p>';
        return;
    }

    list.innerHTML = donations.map(function (d) {
        let rightSide;
        if (isOwner && d.status === 'pending') {
            rightSide =
                '<div class="offer-actions">' +
                    '<button type="button" class="btn-accept" onclick="handleOfferStatusChange(' + d.id + ', \'accepted\')">Accept</button>' +
                    '<button type="button" class="btn-reject" onclick="handleOfferStatusChange(' + d.id + ', \'rejected\')">Reject</button>' +
                '</div>';
        } else if (isOwner && d.status === 'accepted') {
            rightSide =
                '<div class="offer-actions">' +
                    '<button type="button" class="btn-complete" onclick="handleOfferStatusChange(' + d.id + ', \'completed\')">Mark Completed</button>' +
                '</div>';
        } else {
            rightSide = '<span class="donor-offer-type">' + d.status + '</span>';
        }

        return (
            '<div class="donation-offer-item">' +
                '<div>' +
                    '<p class="donor-offer-name">' + d.donor_name + '</p>' +
                    '<p class="donor-offer-type">' + d.donor_phone + '</p>' +
                '</div>' +
                rightSide +
            '</div>'
        );
    }).join('');
}

function handleOfferStatusChange(donationId, newStatus) {
    updateDonationStatus(donationId, newStatus, function (data) {
        if (data.success) loadRequestDetails();
    });
}

function getInitialsFromName(name) {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
}