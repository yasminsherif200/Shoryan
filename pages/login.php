<?php

session_start();

if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

$currentPage = 'login';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - شريان</title>
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

            <h1 class="auth-title">Welcome Back</h1>
            <p class="auth-subtitle">Log in to continue saving lives.</p>

            <div id="formMessage" class="form-message"></div>

            <form id="loginForm" method="POST">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <div class="input-icon-wrap">
                        <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                        <input type="email" id="email" name="email" placeholder="example@gmail.com" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="input-icon-wrap">
                        <svg class="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                        <input type="password" id="password" name="password" placeholder="***********" required>
                    </div>
                </div>

                <button type="submit" class="btn-primary btn-full">Log In</button>
            </form>

            <p class="auth-switch">Don't have an account? <a href="register.php">Register</a></p>
        </div>
    </main>

    <?php include '../includes/footer.php'; ?>

    <script src="../assets/js/auth.js"></script>
</body>
</html>