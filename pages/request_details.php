<?php
require_once __DIR__ . '/../includes/auth_check.php';

require_login();

$request_id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

$currentPage = 'browse-requests';
$pageTitle = 'Request Details';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?> - Shoryan</title>
    <link rel="stylesheet" href="/Shoryan/assets/css/navbar.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/footer.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/request_details.css">
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-sidebar"
      id="requestDetailContainer"
      data-id="<?= $request_id ?>"
      data-current-user-id="<?= (int) $_SESSION['user_id'] ?>"
      data-current-user-role="<?= htmlspecialchars($_SESSION['role']) ?>">

    <a href="/Shoryan/pages/browse_requests.php" class="back-link">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Requests
    </a>

    <div id="detailMessage" class="form-message"></div>

    <div id="detailContent" style="display:none;">

        <div class="detail-header">
            <div class="detail-header-left">
                <h1 id="detailPatientName"></h1>
                <span id="detailUrgencyBadge" class="urgency-badge"></span>
            </div>
            <button type="button" id="volunteerBtn" class="btn-primary btn-volunteer" style="display:none;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"/></svg>
                Volunteer to Donate
            </button>
        </div>

        <div class="detail-stats-row">
            <div class="detail-stat-card">
                <p class="detail-stat-label">Blood Type</p>
                <span id="detailBloodType" class="blood-type-pill"></span>
            </div>
            <div class="detail-stat-card">
                <p class="detail-stat-label">Quantity</p>
                <p id="detailUnitsNeeded" class="detail-stat-value"></p>
            </div>
            <div class="detail-stat-card detail-stat-card-wide">
                <div class="fulfillment-header">
                    <p class="detail-stat-label">Fulfillment Progress</p>
                    <span id="detailProgressText"></span>
                </div>
                <div class="progress-bar-track">
                    <div id="detailProgressBar" class="progress-bar-fill"></div>
                </div>
            </div>
        </div>

        <div class="detail-main-grid">
            <div class="detail-info-card">
                <div class="requester-row">
                    <div class="requester-avatar" id="detailRequesterInitials"></div>
                    <div>
                        <p class="requester-name" id="detailRequesterName"></p>
                        <p class="requester-date">Requested <span id="detailCreatedAt"></span></p>
                    </div>
                </div>

                <div class="info-grid">
                    <div>
                        <p class="info-label">Hospital</p>
                        <p id="detailHospital"></p>
                    </div>
                    <div>
                        <p class="info-label">Contact</p>
                        <p id="detailPhone"></p>
                    </div>
                </div>

                <div class="medical-notes-box" id="detailNotesBox" style="display:none;">
                    <p class="medical-notes-label">Additional Details</p>
                    <p id="detailNotes"></p>
                </div>
            </div>

            <div class="donation-offers-card">
                <h2>Donation Offers <span id="detailOffersCount" class="offers-count-badge"></span></h2>
                <div id="donationOffersList"></div>
            </div>
        </div>

    </div>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/matching.js"></script>
<script src="/Shoryan/assets/js/requests.js"></script>
</body>
</html>