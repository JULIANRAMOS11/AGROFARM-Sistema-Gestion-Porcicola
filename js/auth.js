/**
 * Módulo de Autenticación - AGROFARM
 * @module Auth
 * @description Gestiona registro, login, seguridad y acceso social.
 * @author Julián Ramos
 */

// ==========================================
// 1. CONFIGURACIÓN Y UTILIDADES
// ==========================================

// Base de datos simulada en LocalStorage
const users = JSON.parse(localStorage.getItem('users') || '[]');

// Configuración de Alerta tipo "Toast" (Notificación elegante en la esquina)
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

/**
 * Guarda los cambios de usuarios en el navegador
 */
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Función de Seguridad (Exportada)
 * Verifica si hay sesión al entrar al Dashboard
 */
export function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = 'index.html';
    }
    return user;
}

// ==========================================
// 2. LÓGICA DE LOGIN (Correo y Contraseña)
// ==========================================

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = loginForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Efecto de carga en el botón
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

        // Simular pequeño retraso de red
        setTimeout(() => {
            const u = document.getElementById('username').value.trim();
            const p = document.getElementById('password').value.trim();

            const user = users.find(us => us.username === u && us.password === p);

            if (user) {
                // Guardar sesión
                sessionStorage.setItem('user', JSON.stringify(user));
                
                Toast.fire({
                    icon: 'success',
                    title: `Bienvenido de nuevo, ${user.username}`
                });

                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                // Restaurar botón y mostrar error
                btn.disabled = false;
                btn.innerHTML = originalText;
                
                Toast.fire({
                    icon: 'error',
                    title: 'Usuario o contraseña incorrectos'
                });
            }
        }, 1000);
    });
}

// ==========================================
// 3. LÓGICA DE REGISTRO (Nueva Cuenta)
// ==========================================

const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('newUser').value.trim();
        const password = document.getElementById('newPass').value.trim();
        const role = document.getElementById('role').value;

        // Validaciones básicas
        if (users.some(u => u.username === username)) {
            Toast.fire({ icon: 'warning', title: 'El nombre de usuario ya está en uso' });
            return;
        }

        if (password.length < 4) {
            Toast.fire({ icon: 'warning', title: 'La contraseña es muy corta (min 4 caracteres)' });
            return;
        }

        // Crear y guardar
        users.push({ username, password, role });
        saveUsers();

        // Alerta de éxito grande
        Swal.fire({
            title: '¡Cuenta Creada!',
            text: 'Ya puedes iniciar sesión con tus credenciales.',
            icon: 'success',
            confirmButtonText: 'Ir al Login',
            confirmButtonColor: '#15803d'
        }).then(() => {
            window.location.href = 'index.html';
        });
    });
}

// ==========================================
// 4. LÓGICA DE LOGIN SOCIAL (Google/Facebook)
// ==========================================

const googleBtn = document.getElementById('googleBtn');
const facebookBtn = document.getElementById('facebookBtn');

function simulateSocialLogin(provider) {
    let iconHtml = provider === 'Google' ? '<i class="fab fa-google"></i>' : '<i class="fab fa-facebook"></i>';
    
    Swal.fire({
        title: `Conectando con ${provider}`,
        html: 'Autenticando credenciales seguras...',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            // Crear usuario temporal
            const socialUser = {
                username: `Usuario ${provider}`,
                role: 'Veterinario', // Rol por defecto
                provider: provider
            };
            
            sessionStorage.setItem('user', JSON.stringify(socialUser));
            
            Toast.fire({
                icon: 'success',
                title: '¡Autenticación Exitosa!'
            });

            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        }
    });
}

// Listeners de Redes Sociales
if (googleBtn) googleBtn.addEventListener('click', () => simulateSocialLogin('Google'));
if (facebookBtn) facebookBtn.addEventListener('click', () => simulateSocialLogin('Facebook'));