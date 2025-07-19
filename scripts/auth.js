// autenticación y registro
const users = JSON.parse(localStorage.getItem('users') || '[]');

export function checkAuth() {
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  if (!user) {
    window.location.href = 'index.html';
  }
  return user;
}

function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    const user = users.find(us => us.username === u && us.password === p);
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      Swal.fire('Error', 'Credenciales incorrectas', 'error');
    }
  });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('newUser').value.trim();
    const password = document.getElementById('newPass').value.trim();
    const role = document.getElementById('role').value;
    if (users.some(u => u.username === username)) {
      Swal.fire('Error', 'El usuario ya existe', 'error');
      return;
    }
    users.push({ username, password, role });
    saveUsers();
    Swal.fire('Éxito', 'Cuenta creada', 'success').then(() => {
      window.location.href = 'index.html';
    });
  });
}
