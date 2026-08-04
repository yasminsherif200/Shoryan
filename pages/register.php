<?php

session_start();

if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

require_once __DIR__ . '/../config/constants.php';

$currentPage = 'register';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register - شريان</title>
    <link rel="stylesheet" href="../assets/css/navbar.css">
    <link rel="stylesheet" href="../assets/css/footer.css">
    <link rel="stylesheet" href="../assets/css/forms.css">
</head>
<body>

    <?php include '../includes/navbar.php'; ?>

    <main class="page-with-topbar auth-page">
        <div class="auth-card">

            <div class="auth-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                    <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"/>
                </svg>
            </div>

            <h1 class="auth-title">Join the Shoryan Community</h1>
            <p class="auth-subtitle">Every drop counts. Register today to start saving lives.</p>

            <div id="formMessage" class="form-message"></div>

            <form id="registerForm" method="POST">

                <div class="form-group">
                    <label for="full_name">Full Name</label>
                    <div class="input-icon-wrap">
                        <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
                        <input type="text" id="full_name" name="full_name" placeholder="Yasmin Sherif Eid" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <div class="input-icon-wrap">
                        <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                        <input type="email" id="email" name="email" placeholder="example@gmail.com" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="input-icon-wrap">
                            <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                            <input type="password" id="password" name="password" placeholder="**********" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirm_password">Confirm Password</label>
                        <div class="input-icon-wrap">
                            <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                            <input type="password" id="confirm_password" name="confirm_password" placeholder="**********" required>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="blood_type">Blood Type</label>
                        <div class="input-icon-wrap">
                            <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2s7 8.5 7 13a7 7 0 0 1-14 0c0-4.5 7-13 7-13z"/></svg>
                            <select id="blood_type" name="blood_type" required>
                                <option value="">Select</option>
                                <?php foreach (BLOOD_TYPES as $bt): ?>
                                    <option value="<?= $bt ?>"><?= $bt ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="city">City</label>
                        <div class="input-icon-wrap">
                            <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                            <input type="text" id="city" name="city" placeholder="Cairo" required>
                        </div>
                    </div>
                </div>

                <!-- Not in the Stitch design, but required by the database -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <div class="input-icon-wrap">
                            <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2z"/></svg>
                            <input type="text" id="phone" name="phone" placeholder="01xxxxxxxxx" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="gender">Gender</label>
                        <div class="input-icon-wrap">
                            <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>
                            <select id="gender" name="gender" required>
                                <option value="">Select</option>
                                <?php foreach (GENDERS as $g): ?>
                                    <option value="<?= $g ?>"><?= ucfirst($g) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                </div>

                <button type="submit" class="btn-primary btn-full">Register to Save Lives</button>
            </form>

            <p class="auth-switch">Already have an account? <a href="login.php">Log in</a></p>
        </div>
    </main>

    <?php include '../includes/footer.php'; ?>

    <script src="../assets/js/auth.js"></script>
</body>
</html>