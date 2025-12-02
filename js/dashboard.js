/**
 * Controlador Principal del Dashboard - AGROFARM
 * @module Dashboard
 * @description Coordina la navegación, permisos de usuario y actualización de métricas.
 */

// 1. IMPORTACIONES (Nota el ./ para indicar la misma carpeta)
import { checkAuth } from './auth.js';
import { renderPigs } from './pigs.js';
import { renderCharts } from './charts.js';

// ==========================================
// 2. CONFIGURACIÓN DE ROLES
// ==========================================

// Define qué secciones puede ver cada rol
const ROLE_PERMISSIONS = {
    'Administrador': ['dashboard', 'pigs', 'reproduction', 'health', 'production', 'nutrition', 'users', 'reports'],
    'Veterinario': ['dashboard', 'reproduction', 'health', 'reports'],
    'Operario': ['dashboard', 'pigs', 'production', 'nutrition']
};

// ==========================================
// 3. LÓGICA DE INTERFAZ (UI)
// ==========================================

/**
 * Actualiza los contadores de las tarjetas del Dashboard
 * Lee desde LocalStorage para mostrar datos en tiempo real.
 */
export function updateCounts() {
    const pigs = JSON.parse(localStorage.getItem('pigs') || '[]').length;
    // Simulamos otros datos por ahora si no existen en localStorage
    const births = 5; 
    const alerts = 2;
    const feed = 1500;

    // Actualizar DOM si los elementos existen
    if(document.getElementById('pigCount')) document.getElementById('pigCount').textContent = pigs;
    if(document.getElementById('birthCount')) document.getElementById('birthCount').textContent = births;
    if(document.getElementById('alertsCount')) document.getElementById('alertsCount').textContent = alerts;
    if(document.getElementById('feedCount')) document.getElementById('feedCount').textContent = feed;
}

/**
 * Cambia la sección visible y actualiza el menú activo
 * @param {string} sectionName - El valor del data-section (ej: 'pigs')
 */
function navigateTo(sectionName) {
    // 1. Ocultar todas las secciones
    document.querySelectorAll('main section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('animate-fade-in'); // Resetear animación
    });

    // 2. Mostrar la sección seleccionada
    const targetSection = document.getElementById(`${sectionName}Section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('animate-fade-in');
        
        // Actualizar Título del Header
        const titles = {
            dashboard: 'Resumen General',
            pigs: 'Gestión de Cerdos',
            reproduction: 'Reproducción y Genética',
            health: 'Sanidad y Bioseguridad',
            production: 'Control de Producción',
            nutrition: 'Alimentación',
            users: 'Usuarios del Sistema',
            reports: 'Reportes y Analítica'
        };
        document.getElementById('sectionTitle').textContent = titles[sectionName] || 'Dashboard';
    }

    // 3. Actualizar estilo del menú lateral (Sidebar)
    document.querySelectorAll('.sidebar-link').forEach(btn => {
        btn.classList.remove('active', 'bg-green-800', 'border-l-4', 'border-green-400');
        // Estilos base inactivos
        btn.classList.add('hover:bg-green-800');
    });

    // Activar el botón correspondiente
    const activeBtn = document.querySelector(`button[data-section="${sectionName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-green-800', 'border-l-4', 'border-green-400');
    }
}

// ==========================================
// 4. INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // A. Verificar Seguridad
    const user = checkAuth(); // Si no está logueado, auth.js lo expulsa

    // B. Personalizar Header con datos del usuario
    // Buscamos el contenedor del perfil en el HTML Premium
    const profileName = document.querySelector('header p.text-sm.font-bold');
    const profileRole = document.querySelector('header p.text-xs.text-green-600');
    const profileImg = document.querySelector('header img[alt="User"]');

    if (profileName) profileName.textContent = user.username;
    if (profileRole) profileRole.textContent = user.role;
    // Generar avatar con las iniciales del usuario
    if (profileImg) profileImg.src = `https://ui-avatars.com/api/?name=${user.username}&background=166534&color=fff`;

    // C. Aplicar Permisos (Ocultar botones no permitidos)
    const userAllowedSections = ROLE_PERMISSIONS[user.role] || ['dashboard'];
    
    document.querySelectorAll('[data-section]').forEach(btn => {
        const section = btn.dataset.section;
        if (!userAllowedSections.includes(section)) {
            btn.remove(); // Elimina el botón del menú si no tiene permiso
        }
    });

    // D. Configurar Listeners de Navegación
    document.addEventListener('click', e => {
        // Detectar clic en botones del sidebar (incluso si hace clic en el icono)
        const btn = e.target.closest('[data-section]'); 
        if (btn) {
            navigateTo(btn.dataset.section);
        }
    });

    // E. Botón Cerrar Sesión
    document.getElementById('logout')?.addEventListener('click', () => {
        Swal.fire({
            title: '¿Cerrar Sesión?',
            text: "Tendrás que ingresar tus credenciales nuevamente.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#15803d',
            confirmButtonText: 'Sí, salir'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear();
                window.location.href = 'index.html';
            }
        });
    });

    // F. Toggle del Menú en Móviles
    document.getElementById('menuToggle')?.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('absolute'); // Para que flote sobre el contenido
        sidebar.classList.toggle('h-full');
    });

    // G. Carga Inicial de Datos
    renderPigs();      // Cargar tabla de cerdos
    renderCharts();    // Cargar gráficos
    updateCounts();    // Actualizar tarjetas
});