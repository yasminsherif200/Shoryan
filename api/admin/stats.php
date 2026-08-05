<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, "Invalid Request Method");
}

// ===== Totals (headline numbers) =====
$totalUsers      = (int) $dsn->query("SELECT COUNT(*) FROM users")->fetchColumn();
$totalRequests   = (int) $dsn->query("SELECT COUNT(*) FROM blood_requests")->fetchColumn();
$totalDonations  = (int) $dsn->query("SELECT COUNT(*) FROM donations")->fetchColumn();
$openRequests    = (int) $dsn->query("SELECT COUNT(*) FROM blood_requests WHERE status = 'open'")->fetchColumn();
$availableDonors = (int) $dsn->query("SELECT COUNT(*) FROM users WHERE is_available = 1 AND role = 'user'")->fetchColumn();

// ===== Breakdowns (grouped counts) =====
// FETCH_KEY_PAIR returns { key => count }, e.g. { "open": 3, "fulfilled": 1 }
$requestsByStatus  = $dsn->query(
    "SELECT status, COUNT(*) FROM blood_requests GROUP BY status"
)->fetchAll(PDO::FETCH_KEY_PAIR);

$donationsByStatus = $dsn->query(
    "SELECT status, COUNT(*) FROM donations GROUP BY status"
)->fetchAll(PDO::FETCH_KEY_PAIR);

$usersByBloodType  = $dsn->query(
    "SELECT blood_type, COUNT(*) FROM users GROUP BY blood_type ORDER BY blood_type"
)->fetchAll(PDO::FETCH_KEY_PAIR);

$requestsByCity    = $dsn->query(
    "SELECT city, COUNT(*) FROM blood_requests GROUP BY city ORDER BY COUNT(*) DESC LIMIT 5"
)->fetchAll(PDO::FETCH_KEY_PAIR);

$stats = [
    'totals' => [
        'users'            => $totalUsers,
        'requests'         => $totalRequests,
        'donations'        => $totalDonations,
        'open_requests'    => $openRequests,
        'available_donors' => $availableDonors,
    ],
    'requests_by_status'  => $requestsByStatus,
    'donations_by_status' => $donationsByStatus,
    'users_by_blood_type' => $usersByBloodType,
    'requests_by_city'    => $requestsByCity,
];

jsonResponse(true, $stats, "Stats loaded");
