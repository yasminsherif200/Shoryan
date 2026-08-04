<?php
require_once __DIR__ . '/../../includes/auth_check.php';
require_admin();

$currentPage = 'manage-users';
$pageTitle = 'Manage Users';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?> - Shoryan</title>
    <link rel="stylesheet" href="/Shoryan/assets/css/navbar.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/footer.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/dashboard.css">
</head>
<body>

<?php include __DIR__ . '/../../includes/navbar.php'; ?>

<main class="page-content">
    <h1>Manage Users</h1>
    <p>View and manage all registered users.</p>

    <div id="usersMessage"></div>

    <table id="usersTable" class="data-table" style="display:none;">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Blood Type</th>
                <th>City</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody id="usersTableBody"></tbody>
    </table>
</main>

<?php include __DIR__ . '/../../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/admin.js"></script>
</body>
</html>
