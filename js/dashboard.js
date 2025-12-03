/**
 * Dashboard controller - AGROFARM (SPA + Mobile sidebar)
 */
import { checkAuth } from './auth.js';
import { renderPigs } from './pigs.js';
import { renderCharts } from './charts.js';
import { updateCounts } from './stats.js';

const STORAGE_KEYS = {
  reproduction: 'reproductionRecords',
  health: 'healthTreatments',
  nutrition: 'nutritionStock',
  users: 'users'
};

const ROLE_PERMISSIONS = {
  Administrador: ['dashboard', 'pigs', 'reproduction', 'health', 'production', 'nutrition', 'profile', 'users', 'reports'],
  Veterinario: ['dashboard', 'reproduction', 'health', 'production', 'profile', 'reports'],
  Operario: ['dashboard', 'pigs', 'production', 'nutrition', 'profile']
};

const SECTION_TITLES = {
  dashboard: 'Resumen General',
  pigs: 'Gestion de Cerdos',
  reproduction: 'Reproduccion y Genetica',
  health: 'Sanidad y Bioseguridad',
  production: 'Control de Produccion',
  nutrition: 'Alimentacion',
  profile: 'Perfil del Usuario',
  users: 'Usuarios del Sistema',
  reports: 'Reportes y Analitica'
};

// --- Sidebar mobile control ---
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar?.classList.remove('-translate-x-full');
  overlay?.classList.remove('pointer-events-none');
  overlay?.classList.remove('opacity-0');
  overlay?.classList.add('opacity-100');
}
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar?.classList.add('-translate-x-full');
  overlay?.classList.add('pointer-events-none');
  overlay?.classList.add('opacity-0');
  overlay?.classList.remove('opacity-100');
}

function navigateTo(sectionName) {
  document.querySelectorAll('main section').forEach(sec => {
    sec.classList.add('hidden');
    sec.classList.remove('animate-fade-in');
  });

  const target = document.getElementById(`${sectionName}Section`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('animate-fade-in');
    const title = document.getElementById('sectionTitle');
    if (title) title.textContent = SECTION_TITLES[sectionName] || 'Dashboard';
  }

  document.querySelectorAll('.sidebar-link').forEach(btn => {
    btn.classList.remove('active', 'bg-white/10', 'border-l-4', 'border-green-400');
  });
  const activeBtn = document.querySelector(`button[data-section="${sectionName}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-white/10', 'border-l-4', 'border-green-400');
  }

  closeSidebar(); // Cierra sidebar en mobile al navegar
}

// Helpers de almacenamiento
const readList = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const saveList = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Renderers de tablas simples
function renderReproduction() {
  const tbody = document.querySelector('#reproductionTable tbody');
  if (!tbody) return;
  const records = readList(STORAGE_KEYS.reproduction);
  tbody.innerHTML = records.length
    ? records.map(r => `
      <tr class="border-b border-gray-100">
        <td class="p-3">${r.male}</td>
        <td class="p-3">${r.female}</td>
        <td class="p-3 text-sm text-gray-500">${r.date}</td>
      </tr>
    `).join('')
    : `<tr><td colspan="3" class="p-4 text-center text-gray-400">Sin montas registradas</td></tr>`;
}

function renderHealth() {
  const tbody = document.querySelector('#healthTable tbody');
  if (!tbody) return;
  const records = readList(STORAGE_KEYS.health);
  tbody.innerHTML = records.length
    ? records.map(r => `
      <tr class="border-b border-gray-100">
        <td class="p-3">${r.pig}</td>
        <td class="p-3">${r.med}</td>
        <td class="p-3 text-sm text-gray-500">${r.date}</td>
      </tr>
    `).join('')
    : `<tr><td colspan="3" class="p-4 text-center text-gray-400">Sin tratamientos registrados</td></tr>`;
}

function renderNutrition() {
  const tbody = document.querySelector('#nutritionTable tbody');
  if (!tbody) return;
  const records = readList(STORAGE_KEYS.nutrition);
  tbody.innerHTML = records.length
    ? records.map(r => `
      <tr class="border-b border-gray-100">
        <td class="p-3">${r.feed}</td>
        <td class="p-3 text-sm text-gray-700">${r.qty} kg</td>
      </tr>
    `).join('')
    : `<tr><td colspan="2" class="p-4 text-center text-gray-400">Sin inventario cargado</td></tr>`;
}

function renderProfile(user) {
  const map = {
    profileFullName: user.fullName || '',
    profileUsername: user.username || '',
    profilePhone: user.phone || '',
    profileFarm: user.farm || '',
    profileLocation: user.location || ''
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
  const roleSel = document.getElementById('profileRole');
  if (roleSel) {
    roleSel.value = user.role || 'Operario';
    roleSel.disabled = true; // rol no editable
    roleSel.classList.add('opacity-70', 'cursor-not-allowed');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const user = checkAuth();

  // Header info
  const profileName = document.getElementById('headerUserName');
  const profileRole = document.getElementById('headerUserRole');
  const profileImg = document.querySelector('header img[alt="User"]');
  if (profileName) profileName.textContent = user.username;
  if (profileRole) profileRole.textContent = user.role;
  if (profileImg) profileImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=166534&color=fff&size=128`;

  // Permisos
  const allowed = ROLE_PERMISSIONS[user.role] || ['dashboard'];
  document.querySelectorAll('[data-section]').forEach(btn => {
    if (!allowed.includes(btn.dataset.section)) btn.remove();
  });

  // Navegacion (click en sidebar y overlay)
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-section]');
    if (btn) navigateTo(btn.dataset.section);
  });
  document.getElementById('menuToggle')?.addEventListener('click', openSidebar);
  document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebar);

  // Logout
  document.getElementById('logout')?.addEventListener('click', () => {
    Swal.fire({
      title: 'Cerrar sesion?',
      text: 'Tendras que ingresar tus credenciales nuevamente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#15803d',
      confirmButtonText: 'Si, salir'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        window.location.href = 'index.html';
      }
    });
  });

  // Formularios simples
  document.getElementById('reproductionForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const male = document.getElementById('repMale').value.trim();
    const female = document.getElementById('repFemale').value.trim();
    const date = document.getElementById('repDate').value;
    if (!male || !female || !date) return;
    const list = readList(STORAGE_KEYS.reproduction);
    list.push({ male, female, date });
    saveList(STORAGE_KEYS.reproduction, list);
    e.target.reset();
    renderReproduction();
  });

  document.getElementById('healthForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pig = document.getElementById('healthPig').value.trim();
    const med = document.getElementById('healthMed').value.trim();
    const date = document.getElementById('healthDate').value;
    if (!pig || !med || !date) return;
    const list = readList(STORAGE_KEYS.health);
    list.push({ pig, med, date });
    saveList(STORAGE_KEYS.health, list);
    e.target.reset();
    renderHealth();
  });

  document.getElementById('nutritionForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const feed = document.getElementById('feedType').value.trim();
    const qty = document.getElementById('feedQty').value.trim();
    if (!feed || !qty) return;
    const list = readList(STORAGE_KEYS.nutrition);
    list.push({ feed, qty });
    saveList(STORAGE_KEYS.nutrition, list);
    e.target.reset();
    renderNutrition();
  });

  document.getElementById('profileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      fullName: document.getElementById('profileFullName').value.trim(),
      username: document.getElementById('profileUsername').value.trim(),
      phone: document.getElementById('profilePhone').value.trim(),
      farm: document.getElementById('profileFarm').value.trim(),
      location: document.getElementById('profileLocation').value.trim(),
      role: user.role // rol permanece fijo
    };

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
    const idx = users.findIndex(u => u.username === user.username);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updated };
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    }
    sessionStorage.setItem('user', JSON.stringify(updated));

    const profileNameEl = document.getElementById('headerUserName');
    const profileRoleEl = document.getElementById('headerUserRole');
    const profileImgEl = document.querySelector('header img[alt="User"]');
    if (profileNameEl) profileNameEl.textContent = updated.username;
    if (profileRoleEl) profileRoleEl.textContent = updated.role;
    if (profileImgEl) profileImgEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(updated.username)}&background=166534&color=fff&size=128`;

    Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1200, showConfirmButton: false });
  });

  // Inicializacion
  renderPigs();
  renderCharts();
  updateCounts();
  renderReproduction();
  renderHealth();
  renderNutrition();
  renderProfile(user);
});
