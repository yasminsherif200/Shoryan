<?php
require_once __DIR__ . '/../includes/auth_check.php';
require_once __DIR__ . '/../config/constants.php';

require_login();

$currentPage = 'my-requests';
$pageTitle = 'Create Blood Request';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?> - Shoryan</title>
    <link rel="stylesheet" href="/Shoryan/assets/css/navbar.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/footer.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/forms.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/request_create.css">
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-sidebar auth-page">
    <div class="auth-card request-create-card">

        <div class="auth-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"/>
            </svg>
        </div>

        <h1 class="auth-title">Create Blood Request</h1>
        <p class="auth-subtitle">Fill out the details below to broadcast an urgent request to nearby donors.</p>

        <div id="formMessage" class="form-message"></div>

        <form id="requestForm">

            <div class="form-group">
                <label for="patient_name">Patient Name</label>
                <input type="text" id="patient_name" name="patient_name" placeholder="Enter patient's full name" required>
            </div>

            <div class="medical-details-box">
                <p class="medical-details-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                    Medical Details
                </p>

                <div class="form-row">
                    <div class="form-group">
                        <label>Blood Type Needed</label>
                        <div class="blood-type-grid">
                            <?php foreach (BLOOD_TYPES as $bt): ?>
                                <label class="blood-type-tile">
                                    <input type="radio" name="blood_type" value="<?= $bt ?>" required>
                                    <span><?= $bt ?></span>
                                </label>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="units_needed">Quantity (Bags)</label>
                        <select id="units_needed" name="units_needed" required>
                            <?php for ($i = 1; $i <= 10; $i++): ?>
                                <option value="<?= $i ?>"><?= $i ?> Bag<?= $i > 1 ? 's' : '' ?></option>
                            <?php endfor; ?>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="city">City</label>
                    <input type="text" id="city" name="city" placeholder="e.g. Cairo" required>
                </div>
                <div class="form-group">
                    <label for="urgency">Urgency</label>
                    <select id="urgency" name="urgency" required>
                        <?php foreach (URGENCY_LEVELS as $u): ?>
                            <option value="<?= $u ?>"><?= ucfirst($u) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="hospital_name">Hospital Name</label>
                <input type="text" id="hospital_name" name="hospital_name" placeholder="E.g., Al Kasr Al Ainy">
            </div>

            <div class="form-group">
                <label for="notes">Additional Details</label>
                <textarea id="notes" name="notes" rows="3" placeholder="Any specific instructions, floor number, or urgency level details..."></textarea>
            </div>

            <div class="form-footer-row">
                <p class="form-disclaimer">By submitting, you confirm that this request is genuine and needed immediately.</p>
                <button type="submit" class="btn-primary btn-broadcast">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>
                    Broadcast Request
                </button>
            </div>
        </form>

    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script src="/Shoryan/assets/js/requests.js"></script>
</body>
</html>