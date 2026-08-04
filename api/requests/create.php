<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

$user_id = require_login();

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$missing = validate_required(['patient_name', 'blood_type', 'city', 'units_needed', 'urgency'], $input);
if ($missing) {
    json_response(false, "Missing required field: $missing", null, 400);
}

if (!valid_blood_type($input['blood_type'])) {
    json_response(false, 'Invalid blood type.', null, 400);
}

if (!valid_urgency($input['urgency'])) {
    json_response(false, 'Invalid urgency level.', null, 400);
}

$units = (int) $input['units_needed'];
if ($units < 1) {
    json_response(false, 'Units needed must be at least 1.', null, 400);
}

$patient_name  = sanitize($input['patient_name']);
$blood_type    = sanitize($input['blood_type']);
$city          = sanitize($input['city']);
$hospital_name = sanitize($input['hospital_name'] ?? '');
$urgency       = sanitize($input['urgency']);
$notes         = sanitize($input['notes'] ?? '');

$sql = "INSERT INTO blood_requests
            (requester_id, patient_name, blood_type, city, hospital_name, units_needed, urgency, status, notes, created_at)
        VALUES
            (:requester_id, :patient_name, :blood_type, :city, :hospital_name, :units_needed, :urgency, 'open', :notes, NOW())";

try {
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':requester_id'  => $user_id,
        ':patient_name'  => $patient_name,
        ':blood_type'    => $blood_type,
        ':city'          => $city,
        ':hospital_name' => $hospital_name,
        ':units_needed'  => $units,
        ':urgency'       => $urgency,
        ':notes'         => $notes,
    ]);

    json_response(true, 'Blood request created successfully.', ['request_id' => (int) $conn->lastInsertId()]);
} catch (PDOException $e) {
    json_response(false, 'Failed to create request: ' . $e->getMessage(), null, 500);
}
