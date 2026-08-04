
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
 
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});
 
// ===== Shared helpers =====
 
function showFormMessage(type, message) {
    const box = document.getElementById('formMessage');
    if (!box) return;
 
    box.textContent = message;
    box.classList.remove('message-error', 'message-success');
    box.classList.add(type === 'success' ? 'message-success' : 'message-error');
}
 
function clearFormMessage() {
    const box = document.getElementById('formMessage');
    if (!box) return;
 
    box.textContent = '';
    box.classList.remove('message-error', 'message-success');
}
 
function setSubmitDisabled(form, disabled) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = disabled;
}
 
// ========================================================
// Login
// ========================================================
function handleLogin(e) {
    e.preventDefault();
    clearFormMessage();
 
    const form = e.target;
    const formData = new URLSearchParams(new FormData(form));
 
    setSubmitDisabled(form, true);
 
    fetch('/Shoryan/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                showFormMessage('error', data.message);
                setSubmitDisabled(form, false);
                return;
            }
 
            showFormMessage('success', data.message);
 
            // Send admins to the admin dashboard, everyone else to the user dashboard
            const role = data.data && data.data.role;
            window.location.href = role === 'admin' ? 'admin/dashboard.php' : 'dashboard.php';
        })
        .catch(function (err) {
            console.error(err);
            showFormMessage('error', 'Something went wrong. Please try again.');
            setSubmitDisabled(form, false);
        });
}
 
// ========================================================
// Register
// ========================================================
function handleRegister(e) {
    e.preventDefault();
    clearFormMessage();
 
    const form = e.target;
 
    // Quick client-side check before hitting the server (server re-validates anyway)
    const password = form.querySelector('#password').value;
    const confirmPassword = form.querySelector('#confirm_password').value;
 
    if (password.length < 8) {
        showFormMessage('error', 'Password must be at least 8 characters');
        return;
    }
 
    if (password !== confirmPassword) {
        showFormMessage('error', "Passwords don't match");
        return;
    }
 
    const formData = new URLSearchParams(new FormData(form));
 
    setSubmitDisabled(form, true);
 
    fetch('/Shoryan/api/auth/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                showFormMessage('error', data.message);
                setSubmitDisabled(form, false);
                return;
            }
 
            showFormMessage('success', data.message);
            form.reset();
 
            setTimeout(function () {
                window.location.href = 'login.php';
            }, 1500);
        })
        .catch(function (err) {
            console.error(err);
            showFormMessage('error', 'Something went wrong. Please try again.');
            setSubmitDisabled(form, false);
        });
}