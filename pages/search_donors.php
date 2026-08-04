<?php
require_once __DIR__ . '/../includes/auth_check.php';
require_once __DIR__ . '/../config/constants.php';

require_login();

$currentPage = 'find-donors';
$pageTitle = 'Find Donors';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?> - Shoryan</title>
    <link rel="stylesheet" href="/Shoryan/assets/css/navbar.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/footer.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/forms.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/donors.css">
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-sidebar">

    <div class="page-header">
        <h1>Find Matching Donors</h1>
        <p class="page-subtitle">Search our network of verified donors. Filter by blood type and location to find the exact match for your urgent needs.</p>
    </div>

    <div class="donor-filter-card">
        <form id="donorSearchForm" class="donor-filter-form">

            <div class="form-group">
                <label for="city">Filter by Location</label>
                <div class="input-icon-wrap">
                    <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                    <input type="text" id="city" name="city" placeholder="e.g. Cairo, Alexandria">
                </div>
            </div>

            <div class="form-group">
                <label for="blood_type">Blood Type</label>
                <div class="input-icon-wrap">
                    <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2s7 8.5 7 13a7 7 0 0 1-14 0c0-4.5 7-13 7-13z"/></svg>
                    <select id="blood_type" name="blood_type">
                        <option value="">Any Type</option>
                        <?php foreach (BLOOD_TYPES as $bt): ?>
                            <option value="<?= $bt ?>"><?= $bt ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <button type="submit" class="btn-primary btn-search-donors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                Search Donors
            </button>

        </form>
    </div>

    <div class="donor-results-meta">
        <span id="resultsCount" class="results-count"></span>
        <div id="activeFilters" class="active-filters"></div>
        <a href="#" id="clearFiltersLink" class="clear-filters-link" style="display:none;">Clear All</a>
    </div>

    <div id="donorsMessage" class="form-message"></div>

    <div id="donorsGrid" class="donor-grid"></div>

    <div class="load-more-wrap">
        <button type="button" id="loadMoreBtn" class="btn-load-more" style="display:none;">
            Load More Donors
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
    </div>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/donors.js"></script>
</body>
</html>