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
    <link rel="stylesheet" href="/Shoryan/assets/css/forms.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/dashboard.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/my_donations.css">
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-sidebar">

    <!--
        Note: same as dashboard.php — the design also shows an "Active Shortage" banner
        at the top. There's no shortage-detection logic in the backend, so it's left out.
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

    <div class="page-header-row">
        <div>
            <h1>Donation History</h1>
            <p class="page-subtitle">Track your clinical impact and review past contributions to the community.</p>
        </div>
        <button type="button" class="btn-export" id="exportBtn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>
            Export Record
        </button>
    </div>

    <div class="stats-grid">

        <div class="stat-card">
            <div class="stat-card-top">
                <span class="stat-label">Lives Impacted</span>
                <span class="stat-icon stat-icon-red">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 21s-6.7-4.35-9.3-8.1C1 10 1.7 6.6 4.4 5.1 6.6 3.9 9.3 4.6 12 7.5c2.7-2.9 5.4-3.6 7.6-2.4 2.7 1.5 3.4 4.9 1.7 7.8C18.7 16.65 12 21 12 21z"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statLivesImpacted">—</p>
            <p class="stat-caption">estimated</p>
        </div>

        <div class="stat-card">
            <div class="stat-card-top">
                <span class="stat-label">Completed</span>
                <span class="stat-icon stat-icon-green">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statCompleted">—</p>
            <p class="stat-caption">donations</p>
        </div>

        <div class="stat-card stat-card-highlight">
            <div class="stat-card-top">
                <span class="stat-label">Next Eligible</span>
                <span class="stat-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statNextEligible" style="font-size:20px;">—</p>
            <p class="stat-caption" id="statNextEligibleCaption"></p>
        </div>

    </div>

    <div class="activity-card">
        <div class="activity-card-header">
            <h2>Donation Ledger</h2>
        </div>

        <div class="ledger-toolbar">
            <div class="input-icon-wrap">
                <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input type="text" id="donationSearch" placeholder="Search ID or Hospital">
            </div>
            <select id="statusFilter">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>

        <div id="donationsMessage" class="form-message"></div>

        <table id="donationsTable" class="data-table" style="display:none;">
            <thead>
                <tr>
                    <th>Record ID</th>
                    <th>Clinical Facility</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="donationsTableBody"></tbody>
        </table>
    </div>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/matching.js"></script>
</body>
</html>
