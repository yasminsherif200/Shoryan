<?php
require_once __DIR__ . '/../includes/auth_check.php';
require_once __DIR__ . '/../config/constants.php';

require_login();

$currentPage = 'browse-requests';
$pageTitle = 'Browse Requests';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?> - Shoryan</title>
    <link rel="stylesheet" href="/Shoryan/assets/css/navbar.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/footer.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/forms.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/browse_requests.css">
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-sidebar">

    <div class="page-header">
        <h1>Browse Requests</h1>
        <p class="page-subtitle">Find patients in need of your blood type. Your donation could save a life today.</p>
    </div>

    <div class="browse-filter-card">
        <form id="browseFilterForm" class="browse-filter-form">
            <div class="form-group">
                <label for="search">Search Patients or Hospitals</label>
                <div class="input-icon-wrap">
                    <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                    <input type="text" id="search" name="search" placeholder="e.g. Al Kasr Al Ainy">
                </div>
            </div>

            <div class="form-group">
                <label for="blood_type">Blood Type</label>
                <select id="blood_type" name="blood_type">
                    <option value="">All Types</option>
                    <?php foreach (BLOOD_TYPES as $bt): ?>
                        <option value="<?= $bt ?>"><?= $bt ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="city">City</label>
                <input type="text" id="city" name="city" placeholder="All Cities">
            </div>
        </form>
    </div>

    <div id="browseMessage" class="form-message"></div>

    <div id="browseGrid" class="browse-grid"></div>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/requests.js"></script>
</body>
</html>