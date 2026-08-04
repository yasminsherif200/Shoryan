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
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Merriweather:wght@700;900&display=swap" rel="stylesheet">
    <style>
        /* ========== CSS مدمج ========== */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Cairo', sans-serif;
            background: #f8fafc;
            color: #1e293b;
        }
        .container { max-width: 900px; margin: 40px auto; padding: 0 20px; }
        .card {
            background: #fff;
            border-radius: 28px;
            border: 1px solid #f1f5f9;
            box-shadow: 0 12px 40px rgba(0,0,0,0.06);
            overflow: hidden;
        }
        .card-header {
            background: linear-gradient(135deg, #b91c1c, #be123c, #881337);
            padding: 28px 32px;
            color: white;
        }
        .card-header .blood-badge {
            display: inline-block;
            background: rgba(255,255,255,0.15);
            padding: 6px 18px;
            border-radius: 40px;
            font-weight: 900;
            font-size: 20px;
            margin-bottom: 8px;
        }
        .card-header h1 { font-size: 28px; font-weight: 900; font-family: 'Merriweather', serif; }
        .card-header .sub { font-size: 14px; opacity: 0.85; display: flex; gap: 16px; flex-wrap: wrap; margin-top: 6px; }
        .card-body { padding: 32px; }
        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 28px;
        }
        @media (max-width: 600px) { .detail-grid { grid-template-columns: 1fr; } }
        .detail-item {
            background: #f8fafc;
            padding: 16px 20px;
            border-radius: 16px;
            border: 1px solid #e9edf2;
        }
        .detail-item .label { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .detail-item .value { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px; }
        .detail-item .value .urgent-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 30px;
            font-size: 13px;
        }
        .urgent-CRITICAL .urgent-badge { background: #fecaca; color: #991b1b; }
        .urgent-URGENT .urgent-badge { background: #fde68a; color: #92400e; }
        .urgent-MODERATE .urgent-badge { background: #bfdbfe; color: #1e3a8a; }
        .urgent-SCHEDULED .urgent-badge { background: #e5e7eb; color: #374151; }
        .section-title {
            font-size: 18px;
            font-weight: 800;
            margin: 28px 0 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #f1f5f9;
        }
        .donor-item {
            background: #f8fafc;
            border: 1px solid #e9edf2;
            border-radius: 16px;
            padding: 16px 20px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        .donor-item .name { font-weight: 700; font-size: 16px; }
        .donor-item .phone { color: #64748b; font-size: 14px; }
        .donor-item .status {
            padding: 4px 14px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 700;
        }
        .status-ACCEPTED { background: #dcfce7; color: #166534; }
        .status-PENDING { background: #fef3c7; color: #92400e; }
        .status-COMPLETED { background: #dbeafe; color: #1e3a8a; }
        .status-CANCELLED { background: #fee2e2; color: #991b1b; }
        .btn-back {
            display: inline-block;
            background: #f1f5f9;
            padding: 10px 24px;
            border-radius: 14px;
            color: #1e293b;
            font-weight: 700;
            text-decoration: none;
            transition: 0.2s;
        }
        .btn-back:hover { background: #e2e8f0; }
        .btn-pledge {
            background: linear-gradient(135deg, #dc2626, #be123c);
            color: white;
            border: none;
            padding: 12px 28px;
            border-radius: 14px;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: 0.2s;
            box-shadow: 0 4px 14px rgba(220,38,38,0.3);
        }
        .btn-pledge:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(220,38,38,0.4); }
        .actions { display: flex; gap: 16px; margin-top: 24px; flex-wrap: wrap; }
        .empty { color: #94a3b8; font-style: italic; }
    </style>
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<div class="container">
    <div id="details-container" class="card">
        <p style="padding:40px; text-align:center;">جارٍ تحميل التفاصيل...</p>
    </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script>
    // ========== JavaScript مدمج ==========
    const container = document.getElementById('details-container');
    const requestId = <?= json_encode($request_id) ?>;

    if (!requestId || requestId === '0') {
        container.innerHTML = `<div class="card-body"><p style="color:red;">رقم الطلب غير صالح.</p></div>`;
    } else {
        loadDetails();
    }

    async function loadDetails() {
        try {
            const res = await fetch(`/api/requests/view.php?id=${requestId}`);
            const result = await res.json();

            if (!result.success) {
                container.innerHTML = `<div class="card-body"><p style="color:red;">${result.message || 'حدث خطأ'}</p></div>`;
                return;
            }

            const r = result.data;
            const urgencyClass = 'urgent-' + (r.urgency || 'SCHEDULED');
            const statusMap = {
                'ACCEPTED': 'مقبول',
                'PENDING': 'قيد الانتظار',
                'COMPLETED': 'مكتمل',
                'CANCELLED': 'ملغي'
            };

            let donorsHtml = '';
            if (r.donations && r.donations.length > 0) {
                r.donations.forEach(d => {
                    const statusClass = 'status-' + (d.status || 'PENDING');
                    donorsHtml += `
                        <div class="donor-item">
                            <div>
                                <div class="name">${d.donor_name}</div>
                                <div class="phone">${d.donor_phone || '-'}</div>
                            </div>
                            <span class="status ${statusClass}">${statusMap[d.status] || d.status}</span>
                        </div>
                    `;
                });
            } else {
                donorsHtml = '<p class="empty">لا يوجد متبرعون حتى الآن.</p>';
            }

            container.innerHTML = `
                <div class="card-header">
                    <div class="blood-badge">${r.blood_type}</div>
                    <h1>${r.patient_name}</h1>
                    <div class="sub">
                        <span>🚑 ${r.hospital_name || 'مستشفى غير محدد'}</span>
                        <span>📍 ${r.city}</span>
                        <span>🆔 ${r.code || ''}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="label">فصيلة الدم</div>
                            <div class="value">${r.blood_type}</div>
                        </div>
                        <div class="detail-item ${urgencyClass}">
                            <div class="label">درجة الإلحاح</div>
                            <div class="value"><span class="urgent-badge">${r.urgency}</span></div>
                        </div>
                        <div class="detail-item">
                            <div class="label">عدد الأكياس المطلوبة</div>
                            <div class="value">${r.units_needed} كيس</div>
                        </div>
                        <div class="detail-item">
                            <div class="label">الأكياس الموفرة</div>
                            <div class="value">${r.units_fulfilled || 0} كيس</div>
                        </div>
                        <div class="detail-item">
                            <div class="label">المستشفى</div>
                            <div class="value">${r.hospital_name || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="label">المدينة</div>
                            <div class="value">${r.city}</div>
                        </div>
                        <div class="detail-item">
                            <div class="label">جهة التواصل</div>
                            <div class="value">${r.contact_name || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="label">رقم الهاتف</div>
                            <div class="value">${r.contact_phone || '-'}</div>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <div class="label">ملاحظات طبية</div>
                            <div class="value">${r.notes || 'لا توجد ملاحظات'}</div>
                        </div>
                    </div>

                    <div class="section-title">🩸 المتبرعون المتقدمون</div>
                    <div id="donors-list">${donorsHtml}</div>

                    <div class="actions">
                        <a href="/pages/browse_requests.php" class="btn-back">← العودة للقائمة</a>
                        <button class="btn-pledge" onclick="window.location.href='/pages/request_create.php?pledge=${r.id}'">تطوع بالتبرع</button>
                    </div>
                </div>
            `;
        } catch (e) {
            container.innerHTML = `<div class="card-body"><p style="color:red;">فشل الاتصال بالخادم.</p></div>`;
            console.error(e);
        }
    }
</script>

</body>
</html>
