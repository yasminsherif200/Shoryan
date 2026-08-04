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
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-content">
    <h1>My Requests</h1>
    <p>Here are all the blood requests you created.</p>

    <div id="requestsMessage"></div>

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
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/requests.js"></script>
</body>
</html>
