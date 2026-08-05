<?php

if (!isset($currentPage)) {
    $currentPage = '';
}

?>

<?php if (!isset($_SESSION['user_id'])): ?>

    <!-- navbar for home and logged out users -->
    <header class="navbar-public">
        <div class="navbar-container">
            <div class="navbar-logo">Shoryan</div>
            <nav class="navbar-links">
                <a class="nav-link <?= $currentPage === 'home' ? 'active' : '' ?>" href="/Shoryan/pages/index.php">Home</a>
                <a class="nav-link <?= $currentPage === 'find-donor' ? 'active' : '' ?>" href="/Shoryan/pages/search_donors.php">Find Donor</a>
                <a class="nav-link <?= $currentPage === 'register' ? 'active' : '' ?>" href="/Shoryan/pages/register.php">Register</a>
                <a class="nav-link <?= $currentPage === 'login' ? 'active' : '' ?>" href="/Shoryan/pages/login.php">Login</a>
            </nav>
        </div>
    </header>

<?php elseif ($_SESSION['role'] === 'admin'): ?>

    <!-- admin sidebar -->
    <aside class="sidebar sidebar-admin">
        <div class="sidebar-logo">Shoryan Admin</div>
        <nav class="sidebar-links">
            <a class="sidebar-link <?= $currentPage === 'dashboard' ? 'active' : '' ?>" href="/Shoryan/pages/admin/dashboard.php">Dashboard</a>
            <a class="sidebar-link <?= $currentPage === 'users' ? 'active' : '' ?>" href="/Shoryan/pages/admin/manage_users.php">Users</a>
            <a class="sidebar-link <?= $currentPage === 'requests' ? 'active' : '' ?>" href="/Shoryan/pages/admin/manage_requests.php">Requests</a>
            <a class="sidebar-link <?= $currentPage === 'donations' ? 'active' : '' ?>" href="/Shoryan/pages/admin/manage_donations.php">Donations</a>
        </nav>
        <div class="sidebar-footer">
            <a class="sidebar-link logout-link" href="/Shoryan/api/auth/logout.php">Logout</a>
        </div>
    </aside>

<?php else: ?>

    <!-- logged in user sidebar -->
    <aside class="sidebar sidebar-user">
        <div class="sidebar-logo">Shoryan</div>
        <nav class="sidebar-links">
            <a class="sidebar-link <?= $currentPage === 'dashboard' ? 'active' : '' ?>" href="/Shoryan/pages/dashboard.php">Dashboard</a>
            <a class="sidebar-link <?= $currentPage === 'profile' ? 'active' : '' ?>" href="/Shoryan/pages/profile.php">My Profile</a>
            <a class="sidebar-link <?= $currentPage === 'my-requests' ? 'active' : '' ?>" href="/Shoryan/pages/my_requests.php">My Requests</a>
            <a class="sidebar-link <?= $currentPage === 'browse-requests' ? 'active' : '' ?>" href="/Shoryan/pages/browse_requests.php">Browse Requests</a>
            <a class="sidebar-link <?= $currentPage === 'find-donors' ? 'active' : '' ?>" href="/Shoryan/pages/search_donors.php">Find Donors</a>
            <a class="sidebar-link <?= $currentPage === 'my-donations' ? 'active' : '' ?>" href="/Shoryan/pages/my_donations.php">My Donations</a>
        </nav>
        <div class="sidebar-footer">
            <p class="sidebar-username"><?= htmlspecialchars($_SESSION['full_name']) ?></p>
            <a class="sidebar-link logout-link" href="/Shoryan/api/auth/logout.php">Logout</a>
        </div>
    </aside>

<?php endif; ?>