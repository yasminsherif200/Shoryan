<?php

require_once __DIR__ . '/../../includes/auth_check.php';

require_admin();

$currentPage = 'dashboard';
$pageTitle = 'Admin Dashboard';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?> - Shoryan</title>
    <link rel="stylesheet" href="/Shoryan/assets/css/navbar.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/footer.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/dashboard.css">

    <style>
        .breakdown-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
            margin-top: 24px;
        }
        .breakdown-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid var(--outline-variant);
            font-size: 14px;
            color: var(--on-surface);
        }
        .breakdown-row:last-child { border-bottom: none; }
        .breakdown-key { color: var(--on-surface-variant); text-transform: capitalize; }
        .breakdown-val { font-weight: 700; }
    </style>
</head>
<body>

<?php include __DIR__ . '/../../includes/navbar.php'; ?>

<main class="page-with-sidebar">

    <div class="dashboard-topbar">
        <div class="topbar-user">
            <div class="topbar-user-info">
                <p class="topbar-user-name"><?= htmlspecialchars($_SESSION['full_name']) ?></p>
                <p class="topbar-user-id">Administrator</p>
            </div>
            <div class="topbar-avatar"><?= htmlspecialchars(strtoupper(substr($_SESSION['full_name'], 0, 1))) ?></div>
        </div>
    </div>

    <div id="statsMessage" class="form-message"></div>

    <!-- ===== Headline stat cards (filled by admin.js -> loadDashboardStats) ===== -->
    <div class="stats-grid">

        <div class="stat-card">
            <div class="stat-card-top">
                <span class="stat-label">Total Users</span>
                <span class="stat-icon stat-icon-red">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statTotalUsers">—</p>
            <p class="stat-caption" id="statAvailableDonorsCaption">Registered accounts</p>
        </div>

        <div class="stat-card">
            <div class="stat-card-top">
                <span class="stat-label">Open Requests</span>
                <span class="stat-icon stat-icon-blue">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20v-16M4 12h16"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statOpenRequests">—</p>
            <p class="stat-caption">Currently open</p>
        </div>

        <div class="stat-card">
            <div class="stat-card-top">
                <span class="stat-label">Total Donations</span>
                <span class="stat-icon stat-icon-green">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statTotalDonations">—</p>
            <p class="stat-caption">Donation offers</p>
        </div>

        <div class="stat-card">
            <div class="stat-card-top">
                <span class="stat-label">Available Donors</span>
                <span class="stat-icon stat-icon-amber">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
            </div>
            <p class="stat-value" id="statAvailableDonors">—</p>
            <p class="stat-caption">Ready to donate</p>
        </div>

    </div>

    <!-- ===== Breakdowns (filled by admin.js) ===== -->
    <div class="breakdown-grid">

        <div class="activity-card">
            <div class="activity-card-header"><h2>Requests by Status</h2></div>
            <div id="requestStatusBreakdown"></div>
        </div>

        <div class="activity-card">
            <div class="activity-card-header"><h2>Donations by Status</h2></div>
            <div id="donationStatusBreakdown"></div>
        </div>

        <div class="activity-card">
            <div class="activity-card-header"><h2>Users by Blood Type</h2></div>
            <div id="bloodTypeBreakdown"></div>
        </div>

    </div>

</main>

<?php include __DIR__ . '/../../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/admin.js"></script>
</body>
</html>
