<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_admin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $dsn->prepare(
        "SELECT d.id, d.status, d.donation_date, d.created_at,
                r.id AS request_id, r.patient_name, r.blood_type AS request_blood_type, r.hospital_name, r.city,
                donor.id AS donor_id, donor.full_name AS donor_name, donor.phone AS donor_phone, donor.blood_type AS donor_blood_type
         FROM donations d
         JOIN blood_requests r ON r.id = d.request_id
         JOIN users donor ON donor.id = d.donor_id
         ORDER BY d.created_at DESC"
    );
    $stmt->execute();
    $donations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse(true, $donations, count($donations) . " donation(s) found");
}

if ($method === 'POST') {
    $donation_id = $_POST['donation_id'] ?? '';

    if (!isRequired($donation_id)) jsonResponse(false, null, "Donation ID is required");
    if (!ctype_digit((string)$donation_id)) jsonResponse(false, null, "Invalid Donation ID");

    // نتأكد إن التبرع ده موجود فعلا قبل ما نمسحه
    $checkDonation = $dsn->prepare("SELECT id FROM donations WHERE id = :id");
    $checkDonation->execute(['id' => $donation_id]);
    if (!$checkDonation->fetch()) {
        jsonResponse(false, null, "Donation not found");
    }

    $delete = $dsn->prepare("DELETE FROM donations WHERE id = :id");
    $delete->execute(['id' => $donation_id]);

    jsonResponse(true, null, "Donation record deleted successfully");
}

jsonResponse(false, null, "Invalid Request Method");