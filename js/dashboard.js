/**
 * Dashboard controller - AGROFARM
 * Maneja navegacion SPA, permisos por rol y modulos basicos del panel.
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
    'Administrador': ['dashboard', 'pigs', 'reproduction', 'health', 'production', 'nutrition', 'profile', 'users', 'reports'],
    'Veterinario': ['dashboard', 'reproduction', 'health', 'production', 'profile', 'reports'],
    'Operario': ['dashboard', 'pigs', 'production', 'nutrition', 'profile']
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

function navigateTo(sectionName) {
    document.querySelectorAll('main section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('animate-fade-in');
    });

    const targetSection = document.getElementById(`${sectionName}Section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('animate-fade-in');
        const title = document.getElementById('sectionTitle');
        if (title) title.textContent = SECTION_TITLES[sectionName] || 'Dashboard';
    }

    document.querySelectorAll('.sidebar-link').forEach(btn => {
        btn.classList.remove('active', 'bg-green-800', 'border-l-4', 'border-green-400');
        btn.classList.add('hover:bg-green-800');
    });
    const activeBtn = document.querySelector(`button[data-section="${sectionName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-green-800', 'border-l-4', 'border-green-400');
    }
}

function readList(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveList(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function renderReproduction() {
    const tbody = document.querySelector('#reproductionTable tbody');
    if (!tbody) return;
    const records = readList(STORAGE_KEYS.reproduction);
    tbody.innerHTML = '';
    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-gray-400">Sin montas registradas</td></tr>`;
        return;
    }
    records.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-100';
        tr.innerHTML = `
            <td class="p-3">${r.male}</td>
            <td class="p-3">${r.female}</td>
            <td class="p-3 text-sm text-gray-500">${r.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderHealth() {
    const tbody = document.querySelector('#healthTable tbody');
    if (!tbody) return;
    const records = readList(STORAGE_KEYS.health);
    tbody.innerHTML = '';
    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-gray-400">Sin tratamientos registrados</td></tr>`;
        return;
    }
    records.forEach((r) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-100';
        tr.innerHTML = `
            <td class="p-3">${r.pig}</td>
            <td class="p-3">${r.med}</td>
            <td class="p-3 text-sm text-gray-500">${r.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderNutrition() {
    const tbody = document.querySelector('#nutritionTable tbody');
    if (!tbody) return;
    const records = readList(STORAGE_KEYS.nutrition);
    tbody.innerHTML = '';
    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" class="p-4 text-center text-gray-400">Sin inventario cargado</td></tr>`;
        return;
    }
    records.forEach((r) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-100';
        tr.innerHTML = `
            <td class="p-3">${r.feed}</td>
            <td class="p-3 text-sm text-gray-700">${r.qty} kg</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderProfile(user) {
    const fullName = document.getElementById('profileFullName');
    const username = document.getElementById('profileUsername');
    const phone = document.getElementById('profilePhone');
    const farm = document.getElementById('profileFarm');
    const location = document.getElementById('profileLocation');
    const role = document.getElementById('profileRole');

    if (fullName) fullName.value = user.fullName || '';
    if (username) username.value = user.username || '';
    if (phone) phone.value = user.phone || '';
    if (farm) farm.value = user.farm || '';
    if (location) location.value = user.location || '';
    if (role) role.value = user.role || '';
}

document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();

    const profileName = document.querySelector('header p.text-sm.font-bold');
    const profileRole = document.querySelector('header p.text-xs.text-green-600');
    const profileImg = document.querySelector('header img[alt="User"]');
    if (profileName) profileName.textContent = user.username;
    if (profileRole) profileRole.textContent = user.role;
    if (profileImg) profileImg.src = `https://ui-avatars.com/api/?name=${user.username}&background=166534&color=fff`;

    const userAllowedSections = ROLE_PERMISSIONS[user.role] || ['dashboard'];
    document.querySelectorAll('[data-section]').forEach(btn => {
        const section = btn.dataset.section;
        if (!userAllowedSections.includes(section)) {
            btn.remove();
        }
    });

    document.addEventListener('click', e => {
        const btn = e.target.closest('[data-section]');
        if (btn) navigateTo(btn.dataset.section);
    });

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

    document.getElementById('menuToggle')?.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('absolute');
        sidebar.classList.toggle('h-full');
    });

    const reproductionForm = document.getElementById('reproductionForm');
    reproductionForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const male = document.getElementById('repMale').value.trim();
        const female = document.getElementById('repFemale').value.trim();
        const date = document.getElementById('repDate').value;
        if (!male || !female || !date) return;
        const records = readList(STORAGE_KEYS.reproduction);
        records.push({ male, female, date });
        saveList(STORAGE_KEYS.reproduction, records);
        reproductionForm.reset();
        renderReproduction();
    });

    const healthForm = document.getElementById('healthForm');
    healthForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const pig = document.getElementById('healthPig').value.trim();
        const med = document.getElementById('healthMed').value.trim();
        const date = document.getElementById('healthDate').value;
        if (!pig || !med || !date) return;
        const records = readList(STORAGE_KEYS.health);
        records.push({ pig, med, date });
        saveList(STORAGE_KEYS.health, records);
        healthForm.reset();
        renderHealth();
    });

    const nutritionForm = document.getElementById('nutritionForm');
    nutritionForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const feed = document.getElementById('feedType').value.trim();
        const qty = document.getElementById('feedQty').value.trim();
        if (!feed || !qty) return;
        const records = readList(STORAGE_KEYS.nutrition);
        records.push({ feed, qty });
        saveList(STORAGE_KEYS.nutrition, records);
        nutritionForm.reset();
        renderNutrition();
    });

    const profileForm = document.getElementById('profileForm');
    profileForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
            ...user,
            fullName: document.getElementById('profileFullName').value.trim(),
            username: document.getElementById('profileUsername').value.trim(),
            phone: document.getElementById('profilePhone').value.trim(),
            farm: document.getElementById('profileFarm').value.trim(),
            location: document.getElementById('profileLocation').value.trim(),
            role: document.getElementById('profileRole').value
        };

        // Actualizar en localStorage (users)
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
        const idx = users.findIndex(u => u.username === user.username);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...updated };
            localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
        }

        sessionStorage.setItem('user', JSON.stringify(updated));
        Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1200, showConfirmButton: false });

        if (profileName) profileName.textContent = updated.username;
        if (profileRole) profileRole.textContent = updated.role;
        if (profileImg) profileImg.src = `https://ui-avatars.com/api/?name=${updated.username}&background=166534&color=fff`;
    });

    renderPigs();
    renderCharts();
    updateCounts();
    renderReproduction();
    renderHealth();
    renderNutrition();
    renderProfile(user);
});
