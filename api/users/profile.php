<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, "Invalid Request Method");
}

// Default to the logged-in user; allow ?id= to view another user's profile
$id = $_GET['id'] ?? $_SESSION['user_id'];


// Make sure the ID is a valid integer to prevent SQL injection and other issues
if (!ctype_digit((string)$id)) {
    jsonResponse(false, null, "Invalid user ID");
}

// Fetch user profile from the database (id is placeholder)
$stmt = $dsn->prepare(
    "SELECT id, full_name, email, phone, blood_type, city, address, gender,
            is_available, last_donation_date, role, created_at
     FROM users
     WHERE id = :id"
);
// Execute the query with the provided ID
$stmt->execute(['id' => $id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);


// If no user is found, return an error response
if (!$user) {
    jsonResponse(false, null, "User not found");
}

jsonResponse(true, $user, "Profile loaded");
