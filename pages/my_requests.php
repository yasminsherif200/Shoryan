<?php
require_once __DIR__ . '/../includes/auth_check.php';
require_login();

$currentPage = 'my-requests';
$pageTitle = 'My Requests';
?>
<!DOCTYPE html>
<html lang="en"><?php
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
    <style>
        .page-with-sidebar {
            padding: 40px 48px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            background: #faf9f7;
            min-height: calc(100vh - 1px);
        }

        .page-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 28px;
            flex-wrap: wrap;
            gap: 12px;
        }

        .page-header h1 {
            font-size: 30px;
            font-weight: 800;
            color: #1a1a1a;
            margin: 0 0 6px 0;
        }

        .page-header p {
            font-size: 14px;
            color: #6b6b6b;
            margin: 0;
        }

        .btn-new-request {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #b3261e;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            padding: 10px 16px;
            border-radius: 10px;
            border: none;
            white-space: nowrap;
            transition: background 0.15s ease;
        }

        .btn-new-request:hover { background: #921e18; }

        .card {
            background: #ffffff;
            border: 1px solid #edeae6;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        #requestsMessage {
            font-size: 13px;
            color: #b3261e;
            background: #fdecea;
            border: 1px solid #f6c8c4;
            border-radius: 10px;
            padding: 10px 14px;
            margin-bottom: 16px;
        }

        #requestsMessage:empty { display: none; }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13.5px;
        }

        .data-table thead th {
            text-align: left;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.04em;
            color: #8a8a8a;
            font-weight: 700;
            padding: 0 12px 12px 12px;
            border-bottom: 1px solid #ececec;
        }

        .data-table tbody td {
            padding: 14px 12px;
            border-bottom: 1px solid #f2f0ee;
            color: #333;
            vertical-align: middle;
        }

        .data-table tbody tr:last-child td { border-bottom: none; }
        .data-table tbody tr:hover { background: #fafafa; }

        .data-table td.patient-cell { font-weight: 700; color: #1a1a1a; }

        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 999px;
            font-size: 11.5px;
            font-weight: 700;
            text-transform: capitalize;
        }

        .badge-open      { background: #e8f0fe; color: #1a56db; }
        .badge-fulfilled { background: #e6f6ed; color: #0f9d58; }
        .badge-cancelled { background: #f1f1f1; color: #757575; }

        .urgency-normal   { color: #6b6b6b; }
        .urgency-urgent   { color: #b26a00; font-weight: 700; }
        .urgency-critical { color: #b3261e; font-weight: 700; }

        .btn-delete {
            background: #fff;
            color: #b3261e;
            border: 1px solid #f0c9c6;
            font-size: 12px;
            font-weight: 700;
            padding: 6px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.15s ease;
        }

        .btn-delete:hover { background: #fdecea; }

        .empty-state {
            text-align: center;
            padding: 40px 0;
            color: #9a9a9a;
            font-size: 13.5px;
        }
    </style>
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-sidebar">

    <div class="page-header">
        <div>
            <h1>My Requests</h1>
            <p>Here are all the blood requests you created.</p>
        </div>
        <a href="request_create.php" class="btn-new-request">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            New Request
        </a>
    </div>

    <div class="card">
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
    </div>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/requests.js"></script>
</body>
</html>

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
