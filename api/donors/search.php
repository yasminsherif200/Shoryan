<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Must be logged in to search donors
if (!isset($_SESSION['user_id'])) {
    jsonResponse(false, null, "Please log in first");
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, "Invalid request method");
}

$blood_type = sanitize($_GET['blood_type'] ?? '');
$city       = sanitize($_GET['city'] ?? '');

// Validate only if the filter was actually provided (both are optional)
if ($blood_type !== '' && !isValidBloodType($blood_type)) {
    jsonResponse(false, null, "Invalid blood type");
}


$sql = "SELECT id, full_name, blood_type, city, phone, last_donation_date
        FROM users
        WHERE role = 'user' AND is_available = 1";
$params = [];

if ($blood_type !== '') {
    $sql .= " AND blood_type = :blood_type";
    $params['blood_type'] = $blood_type;
}

if ($city !== '') {
    $sql .= " AND city = :city";
    $params['city'] = $city;
}

$sql .= " ORDER BY last_donation_date ASC"; // prioritize donors who haven't donated recently

$stmt = $dsn->prepare($sql);
$stmt->execute($params);
$donors = $stmt->fetchAll();

jsonResponse(true, $donors, count($donors) . " donor(s) found");