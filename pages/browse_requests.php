<?php require_once __DIR__ . '/../includes/auth_check.php'; require_login(); ?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>تصفح طلبات الدم - شريان</title>
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="container">
  <h1>طلبات الدم المتاحة</h1>

  <form id="filter-form" class="filters">
    <select name="blood_type">
      <option value="">كل الفصائل</option>
      <option>A+</option><option>A-</option>
      <option>B+</option><option>B-</option>
      <option>AB+</option><option>AB-</option>
      <option>O+</option><option>O-</option>
    </select>

    <input type="text" name="city" placeholder="المدينة">

    <select name="status">
      <option value="">كل الحالات</option>
      <option value="open">مفتوح</option>
      <option value="fulfilled">مكتمل</option>
    </select>

    <button type="submit">تصفية</button>
  </form>

  <div id="requests-list" class="requests-grid">
    <p>جارٍ التحميل...</p>
  </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>
<script src="/assets/js/requests.js"></script>
<script>
async function renderRequests(filters = {}) {
  const container = document.getElementById('requests-list');
  container.innerHTML = '<p>جارٍ التحميل...</p>';

  const result = await RequestsAPI.list(filters);

  if (!result.success) {
    container.innerHTML = `<p>${result.message}</p>`;
    return;
  }

  if (result.data.length === 0) {
    container.innerHTML = '<p>لا توجد طلبات مطابقة.</p>';
    return;
  }

  container.innerHTML = '';
  result.data.forEach((r) => {
    const card = document.createElement('a');
    card.href = `/pages/request_details.php?id=${r.id}`;
    card.className = `request-card urgency-${r.urgency}`;
    card.innerHTML = `
      <h3>${r.patient_name}</h3>
      <p>فصيلة الدم: <strong>${r.blood_type}</strong></p>
      <p>المدينة: ${r.city}</p>
      <p>الوحدات المطلوبة: ${r.units_needed}</p>
      <span class="badge">${r.urgency}</span>
    `;
    container.appendChild(card);
  });
}

document.getElementById('filter-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  renderRequests(data);
});

renderRequests();
</script>
</body>
</html>
