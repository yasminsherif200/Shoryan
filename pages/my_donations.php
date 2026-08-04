<?php
require_once __DIR__ . '/../includes/auth_check.php';
require_login();

$currentPage = 'my-donations';
$pageTitle = 'My Donations';
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
    <h1>My Donations</h1>
    <p>Here are all the blood requests you volunteered for.</p>

    <div id="donationsMessage"></div>

    <table id="donationsTable" class="data-table" style="display:none;">
        <thead>
            <tr>
                <th>Patient</th>
                <th>Blood Type</th>
                <th>Hospital</th>
                <th>City</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Volunteered On</th>
            </tr>
        </thead>
        <tbody id="donationsTableBody"></tbody>
    </table>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/matching.js"></script>
</body>
</html>
