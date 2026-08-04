<?php

require_once __DIR__ . '/../../config/db.php';
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

// نتأكد إن الطلب ده موجود فعلا ونعرف مين صاحبه
$stmt = $dsn->prepare("SELECT requester_id FROM blood_requests WHERE id = :id");
$stmt->execute(['id' => $request_id]);
$request = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$request) jsonResponse(false, null, "Request not found");

// بس صاحب الطلب أو الأدمن يقدر يمسحه
$is_owner = (int)$request['requester_id'] === (int)$user_id;
$is_admin = $_SESSION['role'] === 'admin';

if (!$is_owner && !$is_admin) {
    jsonResponse(false, null, "You are not allowed to delete this request");
}

$delete = $dsn->prepare("DELETE FROM blood_requests WHERE id = :id");
$delete->execute(['id' => $request_id]);

jsonResponse(true, null, "Request deleted successfully");
