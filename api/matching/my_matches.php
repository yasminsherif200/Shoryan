<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, null, "Invalid Request Method");
}

$donor_id = $_SESSION['user_id'];

// نجيب كل التبرعات اللي أنا (المستخدم الحالي) اتطوعت بيها، مع بيانات الطلب المرتبط
$stmt = $dsn->prepare(
    "SELECT
        d.id AS donation_id,
        d.status,
        d.donation_date,
        d.created_at,
        r.id AS request_id,
        r.patient_name,
        r.blood_type,
        r.hospital_name,
        r.city,
        r.urgency
     FROM donations d
     JOIN blood_requests r ON d.request_id = r.id
     WHERE d.donor_id = :donor_id
     ORDER BY d.created_at DESC"
);
$stmt->execute(['donor_id' => $donor_id]);
$matches = $stmt->fetchAll(PDO::FETCH_ASSOC);

jsonResponse(true, $matches, "Matches fetched successfully");
