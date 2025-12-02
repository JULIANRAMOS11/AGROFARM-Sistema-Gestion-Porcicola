// --- Lógica de Social Login (Simulación para Prototipo) ---

const googleBtn = document.getElementById('googleBtn');
const facebookBtn = document.getElementById('facebookBtn');

/**
 * Función genérica para simular login social
 * @param {string} provider - Nombre del proveedor (Google/Facebook)
 */
function simulateSocialLogin(provider) {
  Swal.fire({
    title: `Conectando con ${provider}...`,
    text: 'Por favor espere mientras autenticamos sus credenciales.',
    icon: 'info',
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    willClose: () => {
      // Crear un usuario simulado
      const socialUser = {
        username: `Usuario ${provider}`,
        role: 'Veterinario', // Rol por defecto para demos
        provider: provider
      };
      
      // Guardar sesión
      sessionStorage.setItem('user', JSON.stringify(socialUser));
      
      // Mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Autenticación Exitosa!',
        text: `Bienvenido, has iniciado sesión con ${provider}`,
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        window.location.href = 'dashboard.html';
      });
    }
  });
}

// Listeners para los botones
if (googleBtn) {
  googleBtn.addEventListener('click', () => simulateSocialLogin('Google'));
}

if (facebookBtn) {
  facebookBtn.addEventListener('click', () => simulateSocialLogin('Facebook'));
}