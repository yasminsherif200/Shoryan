<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_admin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $dsn->prepare(
        "SELECT r.id, r.patient_name, r.blood_type, r.units_needed, r.hospital_name,
                r.city, r.urgency, r.status, r.created_at,
                u.full_name AS requester_name, u.phone AS requester_phone
         FROM blood_requests r
         JOIN users u ON u.id = r.requester_id
         ORDER BY r.created_at DESC"
    );
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse(true, $requests, count($requests) . " request(s) found");
}

if ($method === 'POST') {
    $request_id = $_POST['request_id'] ?? '';

    if (!isRequired($request_id)) jsonResponse(false, null, "Request ID is required");
    if (!ctype_digit((string)$request_id)) jsonResponse(false, null, "Invalid Request ID");

    $checkRequest = $dsn->prepare("SELECT id FROM blood_requests WHERE id = :id");
    $checkRequest->execute(['id' => $request_id]);
    if (!$checkRequest->fetch()) {
        jsonResponse(false, null, "Request not found");
    }

    $delete = $dsn->prepare("DELETE FROM blood_requests WHERE id = :id");
    $delete->execute(['id' => $request_id]);

    jsonResponse(true, null, "Request deleted successfully");
}

jsonResponse(false, null, "Invalid Request Method");