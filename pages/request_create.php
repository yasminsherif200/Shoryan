<?php require_once __DIR__ . '/../includes/auth_check.php'; require_login(); ?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>إنشاء طلب دم - شريان</title>
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="container">
  <h1>إنشاء طلب دم جديد</h1>

  <form id="request-form">
    <label>اسم المريض
      <input type="text" name="patient_name" required>
    </label>

    <label>فصيلة الدم
      <select name="blood_type" required>
        <option value="">اختر الفصيلة</option>
        <option>A+</option><option>A-</option>
        <option>B+</option><option>B-</option>
        <option>AB+</option><option>AB-</option>
        <option>O+</option><option>O-</option>
      </select>
    </label>

    <label>المدينة
      <input type="text" name="city" required>
    </label>

    <label>المستشفى (اختياري)
      <input type="text" name="hospital_name">
    </label>

    <label>عدد الوحدات المطلوبة
      <input type="number" name="units_needed" min="1" required>
    </label>

    <label>درجة الأولوية
      <select name="urgency" required>
        <option value="normal">عادية</option>
        <option value="urgent">عاجلة</option>
        <option value="critical">حرجة</option>
      </select>
    </label>

    <label>ملاحظات (اختياري)
      <textarea name="notes"></textarea>
    </label>

    <button type="submit">إرسال الطلب</button>
  </form>

  <p id="form-message"></p>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>
<script src="/assets/js/requests.js"></script>
<script>
document.getElementById('request-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const msg = document.getElementById('form-message');

  submitBtn.disabled = true;
  msg.textContent = '';

  const data = Object.fromEntries(new FormData(e.target).entries());
  const result = await RequestsAPI.create(data);

  msg.textContent = result.message;
  msg.className = result.success ? 'success' : 'error';

  if (result.success) {
    setTimeout(() => {
      window.location.href = `/pages/request_details.php?id=${result.data.request_id}`;
    }, 800);
  } else {
    submitBtn.disabled = false;
  }
});
</script>
</body>
</html>
