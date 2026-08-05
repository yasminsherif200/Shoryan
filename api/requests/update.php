<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, "Invalid Request Method");
}

$user_id = $_SESSION['user_id'];
$request_id = $_POST['request_id'] ?? '';

if (!isRequired($request_id)) jsonResponse(false, null, "Request ID is required");
if (!ctype_digit((string)$request_id)) jsonResponse(false, null, "Invalid Request ID");

// نتأكد إن الطلب موجود ومين صاحبه
$stmt = $dsn->prepare("SELECT requester_id FROM blood_requests WHERE id = :id");
$stmt->execute(['id' => $request_id]);
$request = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$request) jsonResponse(false, null, "Request not found");

// بس صاحب الطلب أو الأدمن يقدر يعدله
$is_owner = (int)$request['requester_id'] === (int)$user_id;
$is_admin = $_SESSION['role'] === 'admin';

if (!$is_owner && !$is_admin) {
    jsonResponse(false, null, "You are not allowed to update this request");
}

$patient_name  = sanitize($_POST['patient_name'] ?? '');
$blood_type    = sanitize($_POST['blood_type'] ?? '');
$units_needed  = $_POST['units_needed'] ?? '';
$hospital_name = sanitize($_POST['hospital_name'] ?? '');
$city          = sanitize($_POST['city'] ?? '');
$urgency       = sanitize($_POST['urgency'] ?? '');
$status        = sanitize($_POST['status'] ?? '');

if (!isRequired($patient_name)) jsonResponse(false, null, "Patient name is required");
if (!isValidBloodType($blood_type)) jsonResponse(false, null, "Invalid blood type");
if (!ctype_digit((string)$units_needed) || (int)$units_needed < 1) jsonResponse(false, null, "Invalid units needed");
if (!isRequired($city)) jsonResponse(false, null, "City is required");
if (!isValidUrgency($urgency)) jsonResponse(false, null, "Invalid urgency level");
if (!in_array($status, REQUEST_STATUSES, true)) jsonResponse(false, null, "Invalid status");

$update = $dsn->prepare(
    "UPDATE blood_requests
     SET patient_name = :patient_name,
         blood_type = :blood_type,
         units_needed = :units_needed,
         hospital_name = :hospital_name,
         city = :city,
         urgency = :urgency,
         status = :status
     WHERE id = :id"
);
$update->execute([
    'patient_name'  => $patient_name,
    'blood_type'    => $blood_type,
    'units_needed'  => $units_needed,
    'hospital_name' => $hospital_name,
    'city'          => $city,
    'urgency'       => $urgency,
    'status'        => $status,
    'id'            => $request_id,
]);

jsonResponse(true, null, "Request updated successfully");
