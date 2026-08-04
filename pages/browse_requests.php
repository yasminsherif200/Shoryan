<?php require_once __DIR__ . '/../includes/auth_check.php'; require_login(); ?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تصفح طلبات الدم - شريان</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Merriweather:wght@700;900&display=swap" rel="stylesheet">
    <style>
        /* ========== CSS مدمج ========== */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Cairo', sans-serif;
            background: #f8fafc;
            color: #1e293b;
        }
        .container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
        .page-header {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            padding: 20px 28px;
            border-radius: 24px;
            border: 1px solid #f1f5f9;
            margin-bottom: 24px;
        }
        .page-header h1 { font-size: 26px; font-weight: 900; font-family: 'Merriweather', serif; }
        .page-header p { font-size: 13px; color: #64748b; margin-top: 4px; }
        .btn-create {
            background: linear-gradient(135deg, #dc2626, #be123c);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 16px;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(220,38,38,0.3);
            transition: 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .btn-create:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(220,38,38,0.4); }

        .filter-bar {
            background: #fff;
            padding: 20px 24px;
            border-radius: 20px;
            border: 1px solid #f1f5f9;
            margin-bottom: 28px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr auto;
            gap: 16px;
            align-items: end;
        }
        .filter-bar .group label { display: block; font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 4px; }
        .filter-bar .group select, .filter-bar .group input {
            width: 100%;
            padding: 10px 14px;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            font-family: 'Cairo', sans-serif;
            background: #f8fafc;
            outline: none;
            transition: 0.2s;
            font-size: 14px;
        }
        .filter-bar .group select:focus, .filter-bar .group input:focus {
            border-color: #dc2626;
            box-shadow: 0 0 0 4px rgba(220,38,38,0.1);
        }
        .filter-bar .btn-filter {
            background: #dc2626;
            color: white;
            border: none;
            padding: 10px 24px;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s;
        }
        .filter-bar .btn-filter:hover { background: #b91c1c; }

        .requests-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px;
        }
        .request-card {
            background: #fff;
            border-radius: 20px;
            border: 1px solid #f1f5f9;
            padding: 20px;
            text-decoration: none;
            color: inherit;
            transition: 0.25s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .request-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 40px rgba(0,0,0,0.08);
        }
        .request-card .top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .request-card .blood-badge {
            background: linear-gradient(135deg, #dc2626, #be123c);
            color: white;
            font-weight: 900;
            font-size: 18px;
            padding: 8px 14px;
            border-radius: 14px;
            min-width: 52px;
            text-align: center;
        }
        .request-card .patient { font-weight: 800; font-size: 18px; }
        .request-card .meta { font-size: 13px; color: #64748b; display: flex; gap: 8px; flex-wrap: wrap; }
        .request-card .meta span { background: #f1f5f9; padding: 2px 10px; border-radius: 20px; font-weight: 600; }
        .request-card .badge-urgency {
            display: inline-block;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 20px;
        }
        .urgency-CRITICAL .badge-urgency { background: #fecaca; color: #991b1b; }
        .urgency-URGENT .badge-urgency { background: #fde68a; color: #92400e; }
        .urgency-MODERATE .badge-urgency { background: #bfdbfe; color: #1e3a8a; }
        .urgency-SCHEDULED .badge-urgency { background: #e5e7eb; color: #374151; }
        .request-card .progress { background: #f1f5f9; border-radius: 20px; height: 8px; width: 100%; }
        .request-card .progress .bar {
            height: 8px;
            border-radius: 20px;
            background: linear-gradient(to right, #dc2626, #be123c);
            transition: width 0.5s;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: #fff;
            border-radius: 24px;
            border: 1px solid #f1f5f9;
        }
        .empty-state .icon { font-size: 48px; color: #cbd5e1; }
        .empty-state p { font-weight: 700; color: #475569; margin-top: 12px; }
        .empty-state button { background: none; border: none; color: #dc2626; font-weight: 700; text-decoration: underline; cursor: pointer; }
    </style>
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<div class="container">
    <div class="page-header">
        <div>
            <h1>استعراض الحالات</h1>
            <p id="requests-count">عرض 0 حالة تحتاج تبرع بالدم</p>
        </div>
        <button class="btn-create" onclick="window.location.href='/pages/request_create.php'">➕ إنشاء طلب دم</button>
    </div>

    <div class="filter-bar" id="filter-bar">
        <div class="group">
            <label>فصيلة الدم</label>
            <select id="filter-blood">
                <option value="ALL">كل الفصائل</option>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option>
                <option>O+</option><option>O-</option>
            </select>
        </div>
        <div class="group">
            <label>المدينة</label>
            <select id="filter-city">
                <option value="ALL">كل المدن</option>
                <option>Cairo</option><option>Giza</option>
                <option>Alexandria</option><option>Mansoura</option>
                <option>Tanta</option><option>Asyut</option>
                <option>Luxor</option><option>Aswan</option>
            </select>
        </div>
        <div class="group">
            <label>درجة الطوارئ</label>
            <select id="filter-urgency">
                <option value="ALL">كل المستويات</option>
                <option value="CRITICAL">حرج جداً 🚨</option>
                <option value="URGENT">عاجل ⚡</option>
                <option value="MODERATE">متوسط ⏳</option>
                <option value="SCHEDULED">مجدول 🗓️</option>
            </select>
        </div>
        <button class="btn-filter" id="apply-filter">تصفية</button>
    </div>

    <div id="requests-container" class="requests-grid">
        <p>جارٍ التحميل...</p>
    </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script>
    // ========== JavaScript مدمج ==========
    const container = document.getElementById('requests-container');
    const countLabel = document.getElementById('requests-count');

    // دالة لعرض البطاقات
    function renderRequests(requests) {
        if (!requests || requests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">🩸</div>
                    <p>لا توجد طلبات تطابق معايير البحث الحالية</p>
                    <button onclick="resetFilters()">إعادة ضبط الفلاتر</button>
                </div>
            `;
            countLabel.textContent = 'عرض 0 حالة تحتاج تبرع بالدم';
            return;
        }

        let html = '';
        requests.forEach(r => {
            const percent = Math.round((r.units_fulfilled || 0) / (r.units_needed || 1) * 100);
            const urgencyClass = 'urgency-' + (r.urgency || 'SCHEDULED');
            html += `
                <a href="/pages/request_details.php?id=${r.id}" class="request-card ${urgencyClass}">
                    <div class="top">
                        <div>
                            <div class="patient">${r.patient_name}</div>
                            <div class="meta">
                                <span>${r.city}</span>
                                <span>${r.hospital_name || '-'}</span>
                            </div>
                        </div>
                        <div class="blood-badge">${r.blood_type}</div>
                    </div>
                    <div>
                        <span class="badge-urgency">${r.urgency}</span>
                        <span style="font-size:13px; color:#475569; margin-right:12px;">${r.units_fulfilled || 0}/${r.units_needed} أكياس</span>
                    </div>
                    <div class="progress"><div class="bar" style="width:${Math.min(100, percent)}%"></div></div>
                </a>
            `;
        });
        container.innerHTML = html;
        countLabel.textContent = `عرض ${requests.length} حالة تحتاج تبرع بالدم`;
    }

    // جلب البيانات من الـ API
    async function fetchRequests(filters = {}) {
        container.innerHTML = '<p>جارٍ التحميل...</p>';
        try {
            const query = new URLSearchParams(filters).toString();
            const url = '/api/requests/list.php' + (query ? '?' + query : '');
            const res = await fetch(url);
            const result = await res.json();
            if (result.success) {
                renderRequests(result.data);
            } else {
                container.innerHTML = `<p style="color:red;">${result.message || 'حدث خطأ'}</p>`;
            }
        } catch (e) {
            container.innerHTML = '<p style="color:red;">فشل الاتصال بالخادم.</p>';
            console.error(e);
        }
    }

    // تطبيق الفلاتر
    function applyFilters() {
        const blood = document.getElementById('filter-blood').value;
        const city = document.getElementById('filter-city').value;
        const urgency = document.getElementById('filter-urgency').value;
        const filters = {};
        if (blood !== 'ALL') filters.blood_type = blood;
        if (city !== 'ALL') filters.city = city;
        if (urgency !== 'ALL') filters.urgency = urgency;
        fetchRequests(filters);
    }

    function resetFilters() {
        document.getElementById('filter-blood').value = 'ALL';
        document.getElementById('filter-city').value = 'ALL';
        document.getElementById('filter-urgency').value = 'ALL';
        applyFilters();
    }

    document.getElementById('apply-filter').addEventListener('click', applyFilters);

    // تحميل أولي
    applyFilters();
</script>

</body>
</html>
