<?php
require_once __DIR__ . '/../../includes/auth_check.php';
require_admin();

$currentPage = 'donations';
$pageTitle = 'Manage Donations';
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

<?php include __DIR__ . '/../../includes/navbar.php'; ?>

<main class="page-with-sidebar">

    <div class="dashboard-topbar">
        <div class="topbar-user">
            <div class="topbar-user-info">
                <p class="topbar-user-name">Admin Portal</p>
                <p class="topbar-user-id">Manage Donation Offers</p>
            </div>
        </div>
    </div>

    <div class="activity-card">
        <div class="activity-card-header">
            <h2>All Donation Offers</h2>
            <form id="donations-filter-form" class="filter-bar">
                <select name="status" class="filter-select">
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button type="submit" class="btn-new-request">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                    Filter
                </button>
            </form>
        </div>

        <div id="donationsMessage" class="form-message"></div>

        <table id="donationsTable" class="data-table">
            <thead>
                <tr>
                    <th>Donor</th>
                    <th>Donor Phone</th>
                    <th>Request</th>
                    <th>Patient</th>
                    <th>Blood Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="donations-table-body">
                <tr><td colspan="7">Loading...</td></tr>
            </tbody>
        </table>
    </div>

</main>

<?php include __DIR__ . '/../../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/admin.js"></script>
<script>
  AdminAPI.renderDonationsTable();

  document.getElementById('donations-filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    AdminAPI.renderDonationsTable(data);
  });
</script>
</body>
</html>
