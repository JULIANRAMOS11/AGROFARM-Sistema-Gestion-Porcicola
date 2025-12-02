import { checkAuth } from '../js/auth.js';
import { renderPigs } from './pigs.js';
import { renderCharts } from './charts.js';

export function updateCounts() {
  const pigs = JSON.parse(localStorage.getItem('pigs') || '[]').length;
  const reps = JSON.parse(localStorage.getItem('reproductions') || '[]').length;
  const vacs = JSON.parse(localStorage.getItem('vaccines') || '[]').length;
  const foods = JSON.parse(localStorage.getItem('foods') || '[]').length;
  document.getElementById('pigCount')?.textContent = pigs;
  document.getElementById('birthCount')?.textContent = reps;
  document.getElementById('alertsCount')?.textContent = vacs;
  document.getElementById('feedCount')?.textContent = foods;
}

function showSection(name) {
  document.querySelectorAll('main section').forEach(s => s.classList.add('hidden'));
  document.getElementById(`${name}Section`)?.classList.remove('hidden');
  const title = name.charAt(0).toUpperCase() + name.slice(1);
  document.getElementById('sectionTitle').textContent = title;
  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb) {
    breadcrumb.textContent = name === 'dashboard' ? 'Estás en: Dashboard' : `Estás en: Dashboard > ${title}`;
  }
}

document.addEventListener('click', e => {
  if (e.target.dataset.section) showSection(e.target.dataset.section);
});

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
}

const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('hidden');
  });
}

const logout = document.getElementById('logout');
logout?.addEventListener('click', () => {
  sessionStorage.clear();
  window.location.href = 'index.html';
});

window.addEventListener('DOMContentLoaded', () => {
  const user = checkAuth();
  const allowed = {
    Administrador: ['dashboard','pigs','reproduction','health','production','nutrition','users','reports'],
    Veterinario: ['dashboard','reproduction','health','reports'],
    Operario: ['dashboard','production','nutrition']
  }[user.role] || ['dashboard'];
  document.querySelectorAll('[data-section]').forEach(btn => {
    if (!allowed.includes(btn.dataset.section)) {
      btn.classList.add('hidden');
      document.getElementById(`${btn.dataset.section}Section`)?.classList.add('hidden');
    }
  });
  renderPigs();
  renderCharts();
  updateCounts();
});
