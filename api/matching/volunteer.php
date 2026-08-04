<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login(); // لازم تكون مسجل دخول عشان تتطوع

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, "Invalid Request Method");
}

$donor_id = $_SESSION['user_id'];
$request_id = $_POST['request_id'] ?? '';

if (!isRequired($request_id)) jsonResponse(false, null, "Request ID is required");
if (!ctype_digit((string)$request_id)) jsonResponse(false, null, "Invalid Request ID");

// 1) نتأكد إن الطلب موجود وحالته لسه "open" (يعني لسه محتاج متبرعين)
$checkRequest = $dsn->prepare("SELECT id, requester_id, status FROM blood_requests WHERE id = :id");
$checkRequest->execute(['id' => $request_id]);
$request = $checkRequest->fetch(PDO::FETCH_ASSOC);

if (!$request) jsonResponse(false, null, "Request not found");
if ($request['status'] !== 'open') jsonResponse(false, null, "This request is no longer open for donations");

// 2) مينفعش حد يتطوع لطلبه هو نفسه
if ((int)$request['requester_id'] === (int)$donor_id) {
    jsonResponse(false, null, "You can't volunteer for your own request");
}

// 3) مينفعش يتطوع مرتين لنفس الطلب
$checkExisting = $dsn->prepare(
    "SELECT id FROM donations WHERE request_id = :request_id AND donor_id = :donor_id AND status IN ('pending', 'accepted')"
);
$checkExisting->execute(['request_id' => $request_id, 'donor_id' => $donor_id]);
if ($checkExisting->fetch()) {
    jsonResponse(false, null, "You already volunteered for this request");
}

// 4) كله تمام؟ يبقى نسجل التطوع كـ "pending" لحد ما صاحب الطلب يقبل أو يرفض
$insert = $dsn->prepare(
    "INSERT INTO donations (request_id, donor_id, status) VALUES (:request_id, :donor_id, 'pending')"
);
$insert->execute(['request_id' => $request_id, 'donor_id' => $donor_id]);

jsonResponse(true, null, "Volunteered successfully. Waiting for the requester to confirm.");
