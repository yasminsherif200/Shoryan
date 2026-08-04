<?php
require_once __DIR__ . '/../includes/auth_check.php';
 
require_login();
 
$currentPage = 'dashboard';
$pageTitle = 'Dashboard';
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
 
    <!--
        Note: the Stitch design also had an "Active Shortage: O- Negative in Cairo"
        banner here. There's no shortage-detection logic in the backend (would need
        real supply-vs-demand modeling), so it's left out rather than hardcoded.
    -->
    <div class="dashboard-topbar">
        <button type="button" class="notif-bell" id="notifBell" aria-label="Notifications">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
            <span id="notifBadge" class="notif-badge" style="display:none;"></span>
        </button>
 
        <div class="topbar-user">
            <div class="topbar-user-info">
                <p class="topbar-user-name"><?= htmlspecialchars($_SESSION['full_name']) ?></p>
                <p class="topbar-user-id">Donor ID #<?= str_pad((string) $_SESSION['user_id'], 4, '0', STR_PAD_LEFT) ?></p>
            </div>
            <div class="topbar-avatar"><?= htmlspecialchars(strtoupper(substr($_SESSION['full_name'], 0, 1))) ?></div>
        </div>
    </div>
 
    <div class="stats-grid">
 
        <div class="stat-card">
            <div class="stat-card-top">
                <span class="stat-label">Total Donations</span>
                <span class="stat-icon stat-icon-red">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statTotalDonations">—</p>
            <p class="stat-delta" id="statDonationsDelta"></p>
        </div>
 
        <div class="stat-card">
            <div class="stat-card-top">
                <span class="stat-label">Pending Offers</span>
                <span class="stat-icon stat-icon-amber">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statPendingOffers">—</p>
            <p class="stat-caption">Awaiting response</p>
        </div>
 
        <div class="stat-card">
            <div class="stat-card-top">
                <span class="stat-label">Accepted</span>
                <span class="stat-icon stat-icon-green">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statAccepted">—</p>
            <p class="stat-caption">Scheduled to donate</p>
        </div>
 
    </div>
 
    <div class="activity-card">
        <div class="activity-card-header">
            <h2>Recent Activity</h2>
            <a href="my_donations.php" class="view-all-link">
                View All
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
        </div>
 
        <div id="activityMessage" class="form-message"></div>
 
        <table id="activityTable" class="data-table" style="display:none;">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Blood Type</th>
                    <th>Hospital</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="activityTableBody"></tbody>
        </table>
    </div>
 
</main>
 
<?php include __DIR__ . '/../includes/footer.php'; ?>
 
<script src="/Shoryan/assets/js/dashboard.js"></script>
</body>
</html>
 