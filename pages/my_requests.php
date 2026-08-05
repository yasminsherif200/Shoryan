<?php
require_once __DIR__ . '/../includes/auth_check.php';
require_login();

$currentPage = 'my-requests';
$pageTitle = 'My Requests';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?> - Shoryan</title>
    <link rel="stylesheet" href="/Shoryan/assets/css/navbar.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/footer.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/forms.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/dashboard.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/my_requests.css">
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-sidebar">

    <div class="requests-topbar">
        <div>
            <h1>My Requests</h1>
            <p class="requests-subtitle">Track the status of your active blood requests and connect with matched donors.</p>
        </div>
        <a href="/Shoryan/pages/request_create.php" class="btn-primary btn-create-request">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Create Request
        </a>
    </div>

    <div class="requests-summary-grid">

        <div class="critical-need-card">
            <h3>Critical Need</h3>
            <p>O- Negative shortages reported in your area.</p>
            <a href="/Shoryan/pages/search_donors.php" class="critical-need-link">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"/></svg>
                Act Now
            </a>
        </div>

        <div class="total-requests-card">
            <div class="stat-card-top">
                <span class="stat-label">Total Requests</span>
                <span class="stat-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 12h6"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statTotalRequests">—</p>
            <div class="stat-progress-track">
                <div class="stat-progress-fill" id="statProgressFill"></div>
            </div>
            <p class="stat-caption" id="statFulfilledCaption"></p>
        </div>

    </div>

    <div class="activity-card">
        <div class="activity-card-header">
            <h2>Active &amp; Recent</h2>
        </div>

        <div id="requestsMessage" class="form-message"></div>

        <table id="requestsTable" class="data-table" style="display:none;">
            <thead>
                <tr>
                    <th>Request ID</th>
                    <th>Blood Type</th>
                    <th>Hospital</th>
                    <th>Date Needed</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="requestsTableBody"></tbody>
        </table>
    </div>

</main>

<!-- View request modal -->
<div class="modal-overlay" id="viewModal">
    <div class="modal-box">
        <div class="modal-header">
            <h3>Request Details</h3>
            <button type="button" class="modal-close" onclick="closeModal('viewModal')">&times;</button>
        </div>
        <div class="modal-body" id="viewModalBody"></div>
    </div>
</div>

<!-- Edit request modal -->
<div class="modal-overlay" id="editModal">
    <div class="modal-box">
        <div class="modal-header">
            <h3>Update Request</h3>
            <button type="button" class="modal-close" onclick="closeModal('editModal')">&times;</button>
        </div>
        <div class="modal-body">
            <form id="editRequestForm">
                <input type="hidden" id="editRequestId">

                <div class="form-group">
                    <label for="editPatientName">Patient Name</label>
                    <input type="text" id="editPatientName" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="editBloodType">Blood Type</label>
                        <select id="editBloodType" required>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editUnitsNeeded">Units Needed</label>
                        <input type="text" id="editUnitsNeeded" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="editHospitalName">Hospital</label>
                    <input type="text" id="editHospitalName">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="editCity">City</label>
                        <input type="text" id="editCity" required>
                    </div>
                    <div class="form-group">
                        <label for="editUrgency">Urgency</label>
                        <select id="editUrgency" required>
                            <option value="normal">Normal</option>
                            <option value="urgent">Urgent</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="editStatus">Status</label>
                    <select id="editStatus" required>
                        <option value="open">Open</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div id="editRequestMessage" class="form-message"></div>

                <button type="submit" class="btn-primary btn-full">Save Changes</button>
            </form>
        </div>
    </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/requests.js"></script>
</body>
</html>
