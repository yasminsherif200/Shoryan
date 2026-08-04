<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, "Invalid Request Method");
}

$user_id = $_SESSION['user_id'];

// نجيب كل طلبات الدم اللي أنشأها المستخدم الحالي بس
$stmt = $dsn->prepare(
    "SELECT id, patient_name, blood_type, units_needed, hospital_name,
            city, urgency, status, created_at
     FROM blood_requests
     WHERE requester_id = :user_id
     ORDER BY created_at DESC"
);
$stmt->execute(['user_id' => $user_id]);
$requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

jsonResponse(true, $requests, count($requests) . " request(s) found");
