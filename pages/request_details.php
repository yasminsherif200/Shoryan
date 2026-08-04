<?php
require_once __DIR__ . '/../includes/auth_check.php';
require_login();
$request_id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>تفاصيل طلب الدم - شريان</title>
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="container" id="request-container" data-id="<?= $request_id ?>">
  <p>جارٍ التحميل...</p>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>
<script src="/assets/js/requests.js"></script>
<script>
(async () => {
  const container = document.getElementById('request-container');
  const id = container.dataset.id;

  if (!id || id === '0') {
    container.innerHTML = '<p>رقم الطلب غير صالح.</p>';
    return;
  }

  const result = await RequestsAPI.view(id);

  if (!result.success) {
    container.innerHTML = `<p>${result.message}</p>`;
    return;
  }

  const r = result.data;
  container.innerHTML = `
    <h1>${r.patient_name}</h1>
    <p>فصيلة الدم: <strong>${r.blood_type}</strong></p>
    <p>المدينة: ${r.city}</p>
    <p>المستشفى: ${r.hospital_name || '-'}</p>
    <p>عدد الوحدات المطلوبة: ${r.units_needed}</p>
    <p>الأولوية: ${r.urgency}</p>
    <p>الحالة: ${r.status}</p>
    <p>ملاحظات: ${r.notes || '-'}</p>
    <p>مقدّم الطلب: ${r.requester_name} - ${r.requester_phone}</p>

    <h2>المتبرعون المتقدمون</h2>
    <div id="donations-list"></div>
  `;

  const donationsContainer = document.getElementById('donations-list');
  if (r.donations.length === 0) {
    donationsContainer.innerHTML = '<p>لا يوجد متبرعون حتى الآن.</p>';
  } else {
    r.donations.forEach((d) => {
      const div = document.createElement('div');
      div.className = 'donation-item';
      div.innerHTML = `<p>${d.donor_name} - ${d.donor_phone} - الحالة: ${d.status}</p>`;
      donationsContainer.appendChild(div);
    });
  }
})();
</script>
</body>
</html>
