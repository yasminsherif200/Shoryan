<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';
require_once __DIR__ . '/../../includes/auth_check.php';

require_admin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // هات كل المستخدمين لعرضهم في لوحة تحكم الأدمن
    $stmt = $dsn->prepare(
        "SELECT id, full_name, email, phone, blood_type, city, role,
                is_available, created_at
         FROM users
         ORDER BY created_at DESC"
    );
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse(true, $users, count($users) . " user(s) found");
}

if ($method === 'POST') {
    $user_id = $_POST['user_id'] ?? '';

    if (!isRequired($user_id)) jsonResponse(false, null, "User ID is required");
    if (!ctype_digit((string)$user_id)) jsonResponse(false, null, "Invalid User ID");

    // الأدمن مينفعش يمسح نفسه بالغلط
    if ((int)$user_id === (int)$_SESSION['user_id']) {
        jsonResponse(false, null, "You can't delete your own account");
    }

    $delete = $dsn->prepare("DELETE FROM users WHERE id = :id");
    $delete->execute(['id' => $user_id]);

    jsonResponse(true, null, "User deleted successfully");
}

jsonResponse(false, null, "Invalid Request Method");
