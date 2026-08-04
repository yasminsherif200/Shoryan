<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, "Invalid Request Method");
}

$user_id = $_SESSION['user_id'];
$donation_id = $_POST['donation_id'] ?? '';
$new_status = sanitize($_POST['new_status'] ?? '');

if (!isRequired($donation_id)) jsonResponse(false, null, "Donation ID is required");
if (!ctype_digit((string)$donation_id)) jsonResponse(false, null, "Invalid Donation ID");
if (!in_array($new_status, DONATION_STATUSES, true)) jsonResponse(false, null, "Invalid status");

// هات التبرع مع بيانات الطلب المرتبط بيه (محتاجين نعرف صاحب الطلب الأصلي)
$stmt = $dsn->prepare(
    "SELECT d.id, d.status AS current_status, d.request_id, d.donor_id,
            r.requester_id, r.units_needed
     FROM donations d
     JOIN blood_requests r ON d.request_id = r.id
     WHERE d.id = :donation_id"
);
$stmt->execute(['donation_id' => $donation_id]);
$donation = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$donation) jsonResponse(false, null, "Donation not found");

// بس صاحب الطلب (اللي محتاج الدم) هو اللي مسموح له يقبل/يرفض/يأكد التبرع
$is_requester = (int)$donation['requester_id'] === (int)$user_id;
if (!$is_requester) {
    jsonResponse(false, null, "Only the request owner can update this donation status");
}

// القواعد المسموحة للانتقال بين الحالات: مينفعش تروح من أي حالة لأي حالة
$current = $donation['current_status'];
$allowedTransitions = [
    'pending'  => ['accepted', 'rejected'], // إما تقبل المتبرع أو ترفضه
    'accepted' => ['completed'],            // بعد القبول، تأكد إن التبرع حصل فعلاً
];

if (!isset($allowedTransitions[$current]) || !in_array($new_status, $allowedTransitions[$current], true)) {
    jsonResponse(false, null, "Can't change status from '$current' to '$new_status'");
}

// تحديث حالة التبرع، ولو "completed" نسجل تاريخ التبرع كمان
if ($new_status === 'completed') {
    $update = $dsn->prepare("UPDATE donations SET status = :status, donation_date = CURDATE() WHERE id = :id");
} else {
    $update = $dsn->prepare("UPDATE donations SET status = :status WHERE id = :id");
}
$update->execute(['status' => $new_status, 'id' => $donation_id]);

// لو التبرع اكتمل، نشوف هل الطلب وصل لعدد الوحدات المطلوبة عشان نقفله تلقائيًا
if ($new_status === 'completed') {
    $countStmt = $dsn->prepare(
        "SELECT COUNT(*) FROM donations WHERE request_id = :request_id AND status = 'completed'"
    );
    $countStmt->execute(['request_id' => $donation['request_id']]);
    $completedCount = (int)$countStmt->fetchColumn();

    if ($completedCount >= (int)$donation['units_needed']) {
        $closeRequest = $dsn->prepare("UPDATE blood_requests SET status = 'fulfilled' WHERE id = :id");
        $closeRequest->execute(['id' => $donation['request_id']]);
    }
}

jsonResponse(true, null, "Status updated successfully");
