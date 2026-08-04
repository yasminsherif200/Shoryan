<?php require_once __DIR__ . '/../includes/auth_check.php'; require_login(); ?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إنشاء طلب دم - شريان</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Merriweather:wght@700;900&display=swap" rel="stylesheet">
    <style>
        /* ========== CSS مدمج ========== */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Cairo', sans-serif;
            background: #f8fafc;
            color: #1e293b;
        }
        .container {
            max-width: 720px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .card {
            background: #fff;
            border-radius: 28px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08);
            border: 1px solid #f1f5f9;
            overflow: hidden;
        }
        .card-header {
            background: linear-gradient(135deg, #b91c1c, #be123c, #881337);
            padding: 28px 32px;
            color: white;
        }
        .card-header .icon-wrap {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 52px;
            background: rgba(255,255,255,0.15);
            border-radius: 16px;
            margin-left: 16px;
        }
        .card-header h1 { font-size: 26px; font-weight: 900; font-family: 'Merriweather', serif; }
        .card-header p { font-size: 13px; opacity: 0.85; margin-top: 4px; }
        .card-body { padding: 32px; }
        .form-section { margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; }
        .form-section:last-of-type { border-bottom: none; }
        .form-section-title { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px; }
        .form-group label .required { color: #dc2626; margin-right: 4px; }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 12px 16px;
            border: 1.5px solid #e2e8f0;
            border-radius: 14px;
            font-size: 14px;
            font-family: 'Cairo', sans-serif;
            background: #f8fafc;
            transition: 0.2s;
            outline: none;
            color: #1e293b;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            border-color: #dc2626;
            box-shadow: 0 0 0 4px rgba(220,38,38,0.1);
            background: #fff;
        }
        .form-group textarea { resize: vertical; min-height: 80px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

        .blood-type-grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 8px;
            margin-top: 4px;
        }
        @media (max-width: 600px) { .blood-type-grid { grid-template-columns: repeat(4, 1fr); } }
        .blood-type-btn {
            padding: 10px 0;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
            background: #f1f5f9;
            font-weight: 900;
            font-size: 14px;
            color: #475569;
            cursor: pointer;
            transition: 0.15s;
            text-align: center;
        }
        .blood-type-btn:hover { background: #e2e8f0; border-color: #cbd5e1; }
        .blood-type-btn.active {
            background: #dc2626;
            border-color: #b91c1c;
            color: white;
            box-shadow: 0 4px 12px rgba(220,38,38,0.35);
            transform: scale(1.02);
        }

        .rare-warning {
            display: none;
            align-items: flex-start;
            gap: 12px;
            background: #fffbeb;
            border: 1.5px solid #fcd34d;
            border-radius: 16px;
            padding: 14px 18px;
            margin-bottom: 20px;
        }
        .rare-warning.show { display: flex; }
        .rare-warning .icon { color: #d97706; flex-shrink: 0; margin-top: 2px; }
        .rare-warning .text { font-size: 13px; color: #92400e; }
        .rare-warning .text strong { display: block; font-weight: 800; }

        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding-top: 24px;
            border-top: 1px solid #f1f5f9;
            margin-top: 8px;
        }
        .btn-cancel {
            padding: 12px 28px;
            border-radius: 14px;
            border: 1.5px solid #e2e8f0;
            background: #fff;
            color: #475569;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
        }
        .btn-cancel:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .btn-submit {
            padding: 12px 32px;
            border-radius: 14px;
            border: none;
            background: linear-gradient(135deg, #dc2626, #be123c);
            color: white;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: 0.2s;
            box-shadow: 0 4px 14px rgba(220,38,38,0.35);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(220,38,38,0.4); }
        .btn-submit:active { transform: scale(0.97); }
        .btn-submit .sparkle { display: inline-block; animation: spin 2s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .alert { padding: 14px 18px; border-radius: 14px; font-size: 14px; font-weight: 600; margin-bottom: 20px; display: none; }
        .alert.error { display: block; background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }
        .alert.success { display: block; background: #ecfdf5; border: 1px solid #6ee7b7; color: #065f46; }
    </style>
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<div class="container">
    <div class="card">
        <div class="card-header">
            <div style="display:flex; align-items:center;">
                <span class="icon-wrap">🩸</span>
                <div>
                    <h1>إنشاء طلب دم جديد</h1>
                    <p>نشر استغاثة فورية وإرسال إشعارات للمتبرعين القريبين</p>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div id="alert-message" class="alert"></div>
            <form id="create-request-form">
                <!-- القسم 1: المريض والفصيلة -->
                <div class="form-section">
                    <div class="form-section-title">📋 ١. بيانات المريض وفصيلة الدم</div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>اسم المريض <span class="required">*</span></label>
                            <input type="text" name="patient_name" placeholder="مثال: منى أحمد" required>
                        </div>
                        <div class="form-group">
                            <label>العمر</label>
                            <input type="number" name="patient_age" placeholder="مثال: 30" min="1" max="100">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>فصيلة الدم <span class="required">*</span></label>
                        <div class="blood-type-grid" id="blood-type-grid">
                            <?php foreach (['A+','A-','B+','B-','AB+','AB-','O+','O-'] as $bt): ?>
                                <button type="button" class="blood-type-btn" data-value="<?= $bt ?>"><?= $bt ?></button>
                            <?php endforeach; ?>
                        </div>
                        <input type="hidden" name="blood_type" id="blood-type-input" value="">
                    </div>
                    <div class="rare-warning" id="rare-warning">
                        <span class="icon">⚠️</span>
                        <div class="text">
                            <strong>تنبيه: هذه الفصيلة نادرة!</strong>
                            سيتم إرسال إنذار أولوية عليا لكافة المتبرعين المسجلين بهذه الفصيلة بالمدينة.
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>عدد الأكياس المطلوبة <span class="required">*</span></label>
                            <input type="number" name="units_needed" value="2" min="1" max="10" required>
                        </div>
                        <div class="form-group">
                            <label>درجة الإلحاح <span class="required">*</span></label>
                            <select name="urgency">
                                <option value="CRITICAL">حرج جداً 🚨</option>
                                <option value="URGENT">عاجل ⚡</option>
                                <option value="MODERATE">متوسط ⏳</option>
                                <option value="SCHEDULED">مجدول 🗓️</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- القسم 2: المستشفى والموقع -->
                <div class="form-section">
                    <div class="form-section-title">🏥 ٢. المستشفى والموقع</div>
                    <div class="form-group">
                        <label>اسم المستشفى <span class="required">*</span></label>
                        <input type="text" name="hospital_name" placeholder="مثال: مستشفى القصر العيني" required>
                    </div>
                    <div class="form-group">
                        <label>المدينة / المحافظة <span class="required">*</span></label>
                        <select name="city" required id="city-select">
                            <option value="">اختر المدينة...</option>
                            <option value="Cairo">القاهرة</option>
                            <option value="Giza">الجيزة</option>
                            <option value="Alexandria">الإسكندرية</option>
                            <option value="Mansoura">المنصورة</option>
                            <option value="Tanta">طنطا</option>
                            <option value="Asyut">أسيوط</option>
                            <option value="Luxor">الأقصر</option>
                            <option value="Aswan">أسوان</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>عنوان المستشفى / القسم / الغرفة</label>
                        <input type="text" name="hospital_address" placeholder="مثال: قسم الجراحة، الدور الثالث، غرفة 302">
                    </div>
                </div>

                <!-- القسم 3: التواصل والتشخيص -->
                <div class="form-section">
                    <div class="form-section-title">📞 ٣. التواصل والتشخيص الطبي</div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>جهة التواصل</label>
                            <input type="text" name="contact_name" placeholder="اسم المرافق أو الطبيب">
                        </div>
                        <div class="form-group">
                            <label>رقم الهاتف <span class="required">*</span></label>
                            <input type="text" name="contact_phone" placeholder="+20 100 000 0000" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>ملاحظات طبية / التشخيص</label>
                        <textarea name="notes" placeholder="اكتب تفاصيل الحالة الطبية أو اسم العملية لمساعدة المتبرعين..."></textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="window.history.back()">إلغاء</button>
                    <button type="submit" class="btn-submit">
                        <span class="sparkle">✨</span> نشر واستغاثة فورية
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<script>
    // ========== JavaScript مدمج (Views & Data) ==========
    const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
    const RARE_TYPES = ['O-','AB-','B-'];

    // منطق اختيار فصيلة الدم
    const bloodBtns = document.querySelectorAll('.blood-type-btn');
    const bloodInput = document.getElementById('blood-type-input');
    const rareWarning = document.getElementById('rare-warning');

    bloodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            bloodBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const val = this.dataset.value;
            bloodInput.value = val;
            if (RARE_TYPES.includes(val)) {
                rareWarning.classList.add('show');
            } else {
                rareWarning.classList.remove('show');
            }
        });
    });

    // إرسال النموذج
    const form = document.getElementById('create-request-form');
    const alertBox = document.getElementById('alert-message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        alertBox.className = 'alert';
        alertBox.textContent = '';

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        if (!data.blood_type) {
            alertBox.className = 'alert error';
            alertBox.textContent = 'يرجى اختيار فصيلة الدم من القائمة.';
            return;
        }
        data.units_needed = parseInt(data.units_needed);

        try {
            const res = await fetch('/api/requests/create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                alertBox.className = 'alert success';
                alertBox.textContent = '✅ تم نشر الطلب بنجاح! سيتم إشعار المتبرعين المطابقين.';
                form.reset();
                bloodBtns.forEach(b => b.classList.remove('active'));
                bloodInput.value = '';
                rareWarning.classList.remove('show');
                setTimeout(() => { window.location.href = '/pages/browse_requests.php'; }, 3000);
            } else {
                alertBox.className = 'alert error';
                alertBox.textContent = '❌ ' + (result.message || 'حدث خطأ أثناء نشر الطلب.');
            }
        } catch (error) {
            alertBox.className = 'alert error';
            alertBox.textContent = '❌ فشل الاتصال بالخادم. تأكد من اتصالك بالإنترنت.';
            console.error(error);
        }
    });
</script>

</body>
</html>
