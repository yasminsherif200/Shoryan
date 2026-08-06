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
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-sidebar">

    <div class="dashboard-topbar">
        <div class="topbar-user">
            <div class="topbar-user-info">
                <p class="topbar-user-name">My Requests</p>
                <p class="topbar-user-id">Blood requests you have created</p>
            </div>
        </div>
    </div>

    <div class="activity-card">
        <div class="activity-card-header">
            <h2>All My Requests</h2>
            <div class="activity-card-header-actions">
                <a href="request_create.php" class="btn-new-request">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    New Request
                </a>
            </div>
        </div>

        <div id="requestsMessage" class="form-message"></div>

        <table id="requestsTable" class="data-table" style="display:none;">
            <thead>
                <tr>
                    <th>Patient</th>
                    <th>Blood Type</th>
                    <th>Units</th>
                    <th>Hospital</th>
                    <th>City</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="requestsTableBody"></tbody>
        </table>
    </div>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/requests.js"></script>
</body>
</html>
