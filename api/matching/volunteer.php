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
$checkRequest = $dsn->prepare("SELECT id, requester_id, status, blood_type FROM blood_requests WHERE id = :id");
$checkRequest->execute(['id' => $request_id]);
$request = $checkRequest->fetch(PDO::FETCH_ASSOC);

if (!$request) jsonResponse(false, null, "Request not found");
if ($request['status'] !== 'open') jsonResponse(false, null, "This request is no longer open for donations");

// 2) مينفعش حد يتطوع لطلبه هو نفسه
if ((int)$request['requester_id'] === (int)$donor_id) {
    jsonResponse(false, null, "You can't volunteer for your own request");
}

// 3) لازم تكون متاح للتبرع (المتاحية اللي في بروفايلك) عشان تتطوع
$checkDonor = $dsn->prepare("SELECT blood_type, is_available FROM users WHERE id = :id");
$checkDonor->execute(['id' => $donor_id]);
$donor = $checkDonor->fetch(PDO::FETCH_ASSOC);

if (!$donor['is_available']) {
    jsonResponse(false, null, "You're currently marked as unavailable to donate.");
}

// 4) أهم حاجة: فصيلة دمك لازم تكون متوافقة طبيًا مع فصيلة اللي محتاج الطلب
$compatibleDonors = BLOOD_COMPATIBILITY[$request['blood_type']] ?? [];
if (!in_array($donor['blood_type'], $compatibleDonors, true)) {
    jsonResponse(false, null,
        "Your blood type ({$donor['blood_type']}) isn't compatible with what this request needs ({$request['blood_type']})."
    );
}

// 5) مينفعش يتطوع مرتين لنفس الطلب
$checkExisting = $dsn->prepare(
    "SELECT id FROM donations WHERE request_id = :request_id AND donor_id = :donor_id AND status IN ('pending', 'accepted')"
);
$checkExisting->execute(['request_id' => $request_id, 'donor_id' => $donor_id]);
if ($checkExisting->fetch()) {
    jsonResponse(false, null, "You already volunteered for this request");
}

// 6) كله تمام؟ يبقى نسجل التطوع كـ "pending" لحد ما صاحب الطلب يقبل أو يرفض
$insert = $dsn->prepare(
    "INSERT INTO donations (request_id, donor_id, status) VALUES (:request_id, :donor_id, 'pending')"
);
$insert->execute(['request_id' => $request_id, 'donor_id' => $donor_id]);

jsonResponse(true, null, "Volunteered successfully. Waiting for the requester to confirm.");