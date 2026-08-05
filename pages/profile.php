<?php

require_once __DIR__ . '/../includes/auth_check.php';
require_once __DIR__ . '/../config/constants.php';

require_login();

$currentPage = 'profile';
$pageTitle = 'My Profile';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?> - Shoryan</title>
    <link rel="stylesheet" href="/Shoryan/assets/css/navbar.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/footer.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/forms.css">

    <style>
        .profile-card {
            background: var(--surface);
            border: 1px solid var(--outline-variant);
            border-radius: 12px;
            padding: 32px;
            max-width: 640px;
        }
        .profile-card h1 {
            font-size: 22px;
            font-weight: 700;
            color: var(--on-surface);
            margin: 0 0 4px;
        }
        .profile-card .subtitle {
            font-size: 14px;
            color: var(--on-surface-variant);
            margin: 0 0 24px;
        }
        input[type="date"] {
            width: 100%;
            height: 44px;
            padding: 0 14px;
            border: 1px solid var(--outline-variant);
            border-radius: 8px;
            font-size: 14px;
            color: var(--on-surface);
            background: var(--background);
        }
        input:disabled { opacity: 0.7; cursor: not-allowed; }
    </style>
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-sidebar">
    <div class="profile-card">
        <h1>My Profile</h1>
        <p class="subtitle">Keep your details up to date so donors and requesters can reach you.</p>

        <div id="formMessage" class="form-message"></div>

        <form id="profileForm" method="POST">

            <div class="form-group">
                <label for="full_name">Full Name</label>
                <input type="text" id="full_name" name="full_name" required>
            </div>

            <div class="form-group">
                <label for="email">Email (read-only)</label>
                <input type="email" id="email" name="email" disabled>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="text" id="phone" name="phone" placeholder="01xxxxxxxxx" required>
                </div>
                <div class="form-group">
                    <label for="blood_type">Blood Type</label>
                    <select id="blood_type" name="blood_type" required>
                        <?php foreach (BLOOD_TYPES as $bt): ?>
                            <option value="<?= $bt ?>"><?= $bt ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="city">City</label>
                    <input type="text" id="city" name="city" required>
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender" name="gender" required>
                        <?php foreach (GENDERS as $g): ?>
                            <option value="<?= $g ?>"><?= ucfirst($g) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="address">Address (optional)</label>
                <input type="text" id="address" name="address">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="is_available">Availability</label>
                    <select id="is_available" name="is_available">
                        <option value="1">Available to donate</option>
                        <option value="0">Not available</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="last_donation_date">Last Donation Date (optional)</label>
                    <input type="date" id="last_donation_date" name="last_donation_date">
                </div>
            </div>

            <button type="submit" class="btn-primary btn-full">Save Changes</button>
        </form>
    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script>
// ========================================================
// Profile page — loads the current user's data into the form
// and saves changes through the users API. Kept inline because
// this page owns its own small behaviour (Person 5).
// ========================================================
document.addEventListener('DOMContentLoaded', function () {
    loadProfile();

    document.getElementById('profileForm').addEventListener('submit', saveProfile);
});

function showMessage(type, text) {
    var box = document.getElementById('formMessage');
    box.textContent = text;
    box.classList.remove('message-error', 'message-success');
    box.classList.add(type === 'success' ? 'message-success' : 'message-error');
}

function loadProfile() {
    fetch('/Shoryan/api/users/profile.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                showMessage('error', data.message);
                return;
            }
            var u = data.data;
            document.getElementById('full_name').value = u.full_name || '';
            document.getElementById('email').value = u.email || '';
            document.getElementById('phone').value = u.phone || '';
            document.getElementById('blood_type').value = u.blood_type || '';
            document.getElementById('city').value = u.city || '';
            document.getElementById('gender').value = u.gender || '';
            document.getElementById('address').value = u.address || '';
            document.getElementById('is_available').value = String(u.is_available);
            document.getElementById('last_donation_date').value = u.last_donation_date || '';
        })
        .catch(function (err) {
            console.error(err);
            showMessage('error', 'Failed to load your profile. Please try again.');
        });
}

function saveProfile(e) {
    e.preventDefault();

    var form = e.target;
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    var formData = new URLSearchParams(new FormData(form));

    fetch('/Shoryan/api/users/update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            showMessage(data.success ? 'success' : 'error', data.message);
            btn.disabled = false;
        })
        .catch(function (err) {
            console.error(err);
            showMessage('error', 'Something went wrong. Please try again.');
            btn.disabled = false;
        });
}
</script>

</body>
</html>
