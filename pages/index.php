<?php

require_once __DIR__ . '/../includes/auth_check.php'; // starts the session (for the navbar)

$currentPage = 'home';
$pageTitle = 'Home';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?> - Shoryan</title>
    <link rel="stylesheet" href="/Shoryan/assets/css/style.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/navbar.css">
    <link rel="stylesheet" href="/Shoryan/assets/css/footer.css">

    <style>
        /* Page-scoped styles for the landing page (kept here so no shared CSS is touched) */
        .hero {
            text-align: center;
            padding: 80px 20px 60px;
            background: linear-gradient(180deg, var(--primary-light) 0%, var(--background) 100%);
        }
        .hero-badge {
            display: inline-block;
            background: var(--surface);
            color: var(--primary);
            font-size: 13px;
            font-weight: 700;
            padding: 6px 14px;
            border-radius: 999px;
            margin-bottom: 20px;
            box-shadow: 0 1px 6px rgba(0,0,0,0.05);
        }
        .hero h1 {
            font-size: 40px;
            font-weight: 800;
            color: var(--on-surface);
            margin: 0 0 16px;
            line-height: 1.2;
        }
        .hero h1 span { color: var(--primary); }
        .hero p {
            font-size: 17px;
            color: var(--on-surface-variant);
            max-width: 620px;
            margin: 0 auto 32px;
        }
        .hero-actions {
            display: flex;
            gap: 14px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .hero-btn {
            display: inline-block;
            padding: 13px 28px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 700;
            text-decoration: none;
        }
        .hero-btn-primary { background: var(--primary); color: var(--on-primary); }
        .hero-btn-primary:hover { opacity: 0.9; }
        .hero-btn-outline {
            background: var(--surface);
            color: var(--primary);
            border: 1px solid var(--outline-variant);
        }
        .hero-btn-outline:hover { border-color: var(--primary); }

        .features {
            max-width: 1080px;
            margin: 0 auto;
            padding: 60px 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 24px;
        }
        .feature-card {
            background: var(--surface);
            border: 1px solid var(--outline-variant);
            border-radius: 12px;
            padding: 28px;
            text-align: center;
        }
        .feature-icon {
            width: 52px;
            height: 52px;
            margin: 0 auto 16px;
            border-radius: 50%;
            background: var(--primary-light);
            color: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .feature-card h3 {
            font-size: 18px;
            font-weight: 700;
            color: var(--on-surface);
            margin: 0 0 8px;
        }
        .feature-card p {
            font-size: 14px;
            color: var(--on-surface-variant);
            margin: 0;
            line-height: 1.6;
        }
        .steps {
            background: var(--surface-variant);
            padding: 60px 20px;
        }
        .steps-inner {
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
        }
        .steps-inner h2 {
            font-size: 28px;
            font-weight: 800;
            color: var(--on-surface);
            margin: 0 0 40px;
        }
        .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 28px;
        }
        .step-num {
            width: 44px;
            height: 44px;
            margin: 0 auto 14px;
            border-radius: 50%;
            background: var(--primary);
            color: var(--on-primary);
            font-weight: 800;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .step h4 { font-size: 16px; color: var(--on-surface); margin: 0 0 6px; }
        .step p { font-size: 14px; color: var(--on-surface-variant); margin: 0; }
    </style>
</head>
<body>

<?php include __DIR__ . '/../includes/navbar.php'; ?>

<main class="page-with-topbar">

    <!-- ===== Hero ===== -->
    <section class="hero">
        <span class="hero-badge">شريان — Every drop counts</span>
        <h1>Connect blood <span>donors</span> with people in <span>need</span></h1>
        <p>
            In an emergency, every minute matters. Shoryan matches patients with nearby,
            compatible donors by blood type and city — no more searching through social media.
        </p>
        <div class="hero-actions">
            <?php if (!isset($_SESSION['user_id'])): ?>
                <a class="hero-btn hero-btn-primary" href="/Shoryan/pages/register.php">Become a Donor</a>
                <a class="hero-btn hero-btn-outline" href="/Shoryan/pages/search_donors.php">Find a Donor</a>
            <?php else: ?>
                <a class="hero-btn hero-btn-primary" href="/Shoryan/pages/request_create.php">Request Blood</a>
                <a class="hero-btn hero-btn-outline" href="/Shoryan/pages/search_donors.php">Find a Donor</a>
            <?php endif; ?>
        </div>
    </section>

    <!-- ===== Features ===== -->
    <section class="features">
        <div class="feature-card">
            <div class="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"/></svg>
            </div>
            <h3>Register as a Donor</h3>
            <p>Create a profile with your blood type and city so patients can reach you when it matters.</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            </div>
            <h3>Search &amp; Match</h3>
            <p>Filter available donors by blood type and location, with compatibility handled for you.</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20v-16M4 12h16"/></svg>
            </div>
            <h3>Create Requests</h3>
            <p>Post an urgent blood request and track its status as donors volunteer to help.</p>
        </div>
    </section>

    <!-- ===== How it works ===== -->
    <section class="steps">
        <div class="steps-inner">
            <h2>How it works</h2>
            <div class="steps-grid">
                <div class="step">
                    <div class="step-num">1</div>
                    <h4>Sign up</h4>
                    <p>Register with your blood type, city, and contact details.</p>
                </div>
                <div class="step">
                    <div class="step-num">2</div>
                    <h4>Request or Donate</h4>
                    <p>Post a blood request, or volunteer for one near you.</p>
                </div>
                <div class="step">
                    <div class="step-num">3</div>
                    <h4>Get Matched</h4>
                    <p>We connect compatible donors and requesters, fast.</p>
                </div>
                <div class="step">
                    <div class="step-num">4</div>
                    <h4>Save a Life</h4>
                    <p>Coordinate the donation and track it to completion.</p>
                </div>
            </div>
        </div>
    </section>

</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

</body>
</html>
