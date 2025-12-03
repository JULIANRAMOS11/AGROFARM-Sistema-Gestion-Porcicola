/**
 * Modulo de Autenticacion - AGROFARM
 * Gestiona registro, login, seguridad y acceso social usando localStorage/sessionStorage.
 */

// ================================
// 1. CONFIGURACION Y UTILIDADES
// ================================

// Base de datos simulada en LocalStorage
const users = JSON.parse(localStorage.getItem('users') || '[]');

// Configuracion de Toast (SweetAlert2)
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Verifica sesion activa; si no existe, redirige al login.
 */
export function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = 'index.html';
    }
    return user;
}

// ================================
// 2. LOGIN (usuario y contrasena)
// ================================

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = loginForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

        setTimeout(() => {
            const u = document.getElementById('username').value.trim();
            const p = document.getElementById('password').value.trim();

            const user = users.find(us => us.username === u && us.password === p);

            if (user) {
                sessionStorage.setItem('user', JSON.stringify(user));
                Toast.fire({ icon: 'success', title: `Bienvenido de nuevo, ${user.username}` });
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                btn.disabled = false;
                btn.innerHTML = originalText;
                Toast.fire({ icon: 'error', title: 'Usuario o contrasena incorrectos' });
            }
        }, 800);
    });
}

// ================================
// 3. REGISTRO (nuevos campos)
// ================================

const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('newUser').value.trim();
        const password = document.getElementById('newPass').value.trim();
        const role = document.getElementById('role').value;
        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const farm = document.getElementById('farm').value.trim();
        const location = document.getElementById('location').value.trim();

        if (users.some(u => u.username === username)) {
            Toast.fire({ icon: 'warning', title: 'El usuario ya esta en uso' });
            return;
        }

        if (password.length < 4) {
            Toast.fire({ icon: 'warning', title: 'La contrasena es muy corta (min 4 caracteres)' });
            return;
        }

        if (!fullName || !phone || !farm || !location) {
            Toast.fire({ icon: 'warning', title: 'Completa todos los datos personales' });
            return;
        }

        users.push({ username, password, role, fullName, phone, farm, location });
        saveUsers();

        Swal.fire({
            title: 'Cuenta creada',
            text: 'Ya puedes iniciar sesion con tus credenciales.',
            icon: 'success',
            confirmButtonText: 'Ir al login',
            confirmButtonColor: '#15803d'
        }).then(() => {
            window.location.href = 'index.html';
        });
    });
}

// ================================
// 4. LOGIN SOCIAL (simulado)
// ================================

const googleBtn = document.getElementById('googleBtn');
const facebookBtn = document.getElementById('facebookBtn');

function simulateSocialLogin(provider) {
    Swal.fire({
        title: `Conectando con ${provider}`,
        html: 'Autenticando credenciales seguras...',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => Swal.showLoading()
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            const socialUser = {
                username: `Usuario ${provider}`,
                role: 'Veterinario',
                provider,
                fullName: `Usuario ${provider}`,
                phone: 'N/D',
                farm: 'Granja Demo',
                location: 'N/D'
            };
            sessionStorage.setItem('user', JSON.stringify(socialUser));
            Toast.fire({ icon: 'success', title: 'Autenticacion exitosa' });
            setTimeout(() => window.location.href = 'dashboard.html', 800);
        }
    });
}

if (googleBtn) googleBtn.addEventListener('click', () => simulateSocialLogin('Google'));
if (facebookBtn) facebookBtn.addEventListener('click', () => simulateSocialLogin('Facebook'));
