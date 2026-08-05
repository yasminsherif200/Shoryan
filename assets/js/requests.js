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


// ========================================================
// request_create.php - handle the create-request form
// ========================================================
document.addEventListener('DOMContentLoaded', function () {
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.addEventListener('submit', handleCreateRequest);
    }
});

function handleCreateRequest(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const msg = document.getElementById('formMessage');

    submitBtn.disabled = true;
    msg.className = 'form-message';
    msg.textContent = '';

    const formData = new URLSearchParams(new FormData(e.target));

    fetch('/Shoryan/api/requests/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            msg.textContent = data.message;
            msg.classList.add(data.success ? 'message-success' : 'message-error');

            if (data.success) {
                setTimeout(function () {
                    window.location.href = '/Shoryan/pages/request_details.php?id=' + data.data.request_id;
                }, 800);
            } else {
                submitBtn.disabled = false;
            }
        })
        .catch(function (err) {
            console.error(err);
            msg.textContent = 'Something went wrong. Please try again.';
            msg.classList.add('message-error');
            submitBtn.disabled = false;
        });
}


// ========================================================
// request_details.php - load and render a single request
// ========================================================
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('requestDetailContainer');
    if (container) {
        loadRequestDetails(container);
    }
});

function loadRequestDetails(container) {
    const requestId = container.dataset.id;
    const currentUserId = parseInt(container.dataset.currentUserId, 10);
    const messageBox = document.getElementById('detailMessage');
    const content = document.getElementById('detailContent');

    if (!requestId || requestId === '0') {
        messageBox.textContent = 'Invalid request ID.';
        messageBox.classList.add('message-error');
        return;
    }

    fetch('/Shoryan/api/requests/view.php?id=' + requestId, { credentials: 'include' })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                messageBox.textContent = data.message;
                messageBox.classList.add('message-error');
                return;
            }

            renderRequestDetails(data.data, currentUserId, requestId);
            content.style.display = 'block';
        })
        .catch(function (err) {
            console.error(err);
            messageBox.textContent = 'Failed to load this request.';
            messageBox.classList.add('message-error');
        });
}

function renderRequestDetails(request, currentUserId, requestId) {
    document.getElementById('detailPatientName').textContent = request.patient_name;

    const urgencyBadge = document.getElementById('detailUrgencyBadge');
    urgencyBadge.textContent = request.urgency;
    urgencyBadge.classList.add('urgency-' + request.urgency);

    document.getElementById('detailBloodType').textContent = request.blood_type;
    document.getElementById('detailUnitsNeeded').textContent = request.units_needed + ' Bag' + (request.units_needed > 1 ? 's' : '');

    const donations = request.donations || [];
    const completed = donations.filter(function (d) { return d.status === 'completed'; });
    const percent = Math.min(100, Math.round((completed.length / request.units_needed) * 100));
    document.getElementById('detailProgressText').textContent = completed.length + ' / ' + request.units_needed + ' Bags (' + percent + '%)';
    document.getElementById('detailProgressBar').style.width = percent + '%';

    document.getElementById('detailRequesterName').textContent = request.requester_name;
    document.getElementById('detailRequesterInitials').textContent = getInitialsFromName(request.requester_name);
    document.getElementById('detailCreatedAt').textContent = formatDetailDate(request.created_at);
    document.getElementById('detailHospital').textContent = request.hospital_name || '-';
    document.getElementById('detailPhone').textContent = request.requester_phone;

    if (request.notes) {
        document.getElementById('detailNotes').textContent = request.notes;
        document.getElementById('detailNotesBox').style.display = 'block';
    }

    const isOwner = parseInt(request.requester_id, 10) === currentUserId;
    const alreadyVolunteered = donations.some(function (d) {
        return parseInt(d.donor_id, 10) === currentUserId && (d.status === 'pending' || d.status === 'accepted');
    });

    const volunteerBtn = document.getElementById('volunteerBtn');
    if (!isOwner && request.status === 'open' && !alreadyVolunteered) {
        volunteerBtn.style.display = 'flex';
        volunteerBtn.addEventListener('click', function () {
            volunteerBtn.disabled = true;
            volunteerForRequest(requestId, function (result) {
                if (result.success) {
                    loadRequestDetails(document.getElementById('requestDetailContainer'));
                } else {
                    volunteerBtn.disabled = false;
                }
            });
        });
    }

    renderDonationOffers(donations, isOwner, requestId);
}

function renderDonationOffers(donations, isOwner, requestId) {
    const list = document.getElementById('donationOffersList');
    document.getElementById('detailOffersCount').textContent = donations.length;

    if (donations.length === 0) {
        list.innerHTML = '<p class="donor-offer-type">No volunteers yet.</p>';
        return;
    }

    list.innerHTML = '';
    donations.forEach(function (d) {
        const item = document.createElement('div');
        item.className = 'donation-offer-item';

        let actionsHtml = '<span class="status-badge status-' + d.status + '">' + d.status + '</span>';

        if (isOwner && d.status === 'pending') {
            actionsHtml =
                '<div class="offer-actions">' +
                    '<button class="btn-accept" data-donation-id="' + d.id + '" data-new-status="accepted">Accept</button>' +
                    '<button class="btn-reject" data-donation-id="' + d.id + '" data-new-status="rejected">Reject</button>' +
                '</div>';
        } else if (isOwner && d.status === 'accepted') {
            actionsHtml =
                '<button class="btn-complete" data-donation-id="' + d.id + '" data-new-status="completed">Mark Completed</button>';
        }

        item.innerHTML =
            '<div>' +
                '<p class="donor-offer-name">' + d.donor_name + '</p>' +
                '<p class="donor-offer-type">' + d.donor_phone + '</p>' +
            '</div>' +
            actionsHtml;

        list.appendChild(item);
    });

    list.querySelectorAll('[data-donation-id]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const donationId = btn.dataset.donationId;
            const newStatus = btn.dataset.newStatus;
            btn.disabled = true;
            updateDonationStatus(donationId, newStatus, function () {
                loadRequestDetails(document.getElementById('requestDetailContainer'));
            });
        });
    });
}

function getInitialsFromName(name) {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
}

function formatDetailDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}


// ========================================================
// browse_requests.php - list + filter all open requests
// ========================================================
let browseFilterTimer = null;

document.addEventListener('DOMContentLoaded', function () {
    const browseGrid = document.getElementById('browseGrid');
    if (!browseGrid) return;

    const form = document.getElementById('browseFilterForm');
    form.addEventListener('input', function () {
        clearTimeout(browseFilterTimer);
        browseFilterTimer = setTimeout(function () {
            loadBrowseRequests(getBrowseFilters(form));
        }, 400); // debounce so it doesn't fetch on every keystroke
    });
    form.addEventListener('change', function () {
        loadBrowseRequests(getBrowseFilters(form));
    });

    loadBrowseRequests({});
});

function getBrowseFilters(form) {
    return {
        search: form.search.value.trim(),
        blood_type: form.blood_type.value,
        city: form.city.value.trim()
    };
}

function loadBrowseRequests(filters) {
    const grid = document.getElementById('browseGrid');
    const messageBox = document.getElementById('browseMessage');

    messageBox.textContent = '';
    messageBox.className = 'form-message';

    const params = new URLSearchParams({ scope: 'all' });
    if (filters.search) params.append('search', filters.search);
    if (filters.blood_type) params.append('blood_type', filters.blood_type);
    if (filters.city) params.append('city', filters.city);

    grid.innerHTML = '<p class="browse-empty-state">Loading requests...</p>';

    fetch('/Shoryan/api/requests/list.php?' + params.toString(), { credentials: 'include' })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                grid.innerHTML = '';
                messageBox.textContent = data.message;
                messageBox.classList.add('message-error');
                return;
            }

            renderBrowseCards(data.data);
        })
        .catch(function (err) {
            console.error(err);
            grid.innerHTML = '';
            messageBox.textContent = 'Failed to load requests.';
            messageBox.classList.add('message-error');
        });
}

function renderBrowseCards(requests) {
    const grid = document.getElementById('browseGrid');

    if (requests.length === 0) {
        grid.innerHTML = '<p class="browse-empty-state">No matching requests found.</p>';
        return;
    }

    grid.innerHTML = requests.map(function (r) {
        return (
            '<div class="request-card urgency-' + r.urgency + '">' +
                '<div class="request-card-header">' +
                    '<h3>' + escapeHtmlBrowse(r.patient_name) + '</h3>' +
                    '<span class="blood-type-pill">' + escapeHtmlBrowse(r.blood_type) + '</span>' +
                '</div>' +
                '<p class="request-card-meta">' + escapeHtmlBrowse(r.hospital_name || 'Hospital not specified') + '</p>' +
                '<p class="request-card-meta">' + escapeHtmlBrowse(r.city) + '</p>' +
                '<div class="request-card-footer">' +
                    '<span class="status-badge status-' + r.urgency + '">' + r.urgency + '</span>' +
                    '<a class="btn-view-details" href="/Shoryan/pages/request_details.php?id=' + r.id + '">View Details</a>' +
                '</div>' +
            '</div>'
        );
    }).join('');
}

function escapeHtmlBrowse(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
}