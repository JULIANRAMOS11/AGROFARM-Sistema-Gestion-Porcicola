/**
 * Módulo de Gestión de Cerdos - AGROFARM
 * @module Pigs
 * @description CRUD completo de animales con interfaz mejorada y persistencia.
 */

import { updateCounts } from './dashboard.js';

// ==========================================
// 1. CONFIGURACIÓN Y ESTADO
// ==========================================

// Cargar datos o iniciar vacío
let pigs = JSON.parse(localStorage.getItem('pigs') || '[]');
let editIndex = null; // Controla si estamos editando (null) o creando

// Configuración de Notificaciones (Toast) para mantener consistencia visual
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
});

/**
 * Guarda los cambios en el navegador
 */
function savePigs() {
    localStorage.setItem('pigs', JSON.stringify(pigs));
}

/**
 * Retorna clases de color según la etapa productiva
 * @param {string} stage - Etapa del cerdo
 */
function getStageBadge(stage) {
    const styles = {
        'Lechón': 'bg-blue-100 text-blue-700',
        'Ceba': 'bg-orange-100 text-orange-700',
        'Gestación': 'bg-pink-100 text-pink-700',
        'Lactancia': 'bg-purple-100 text-purple-700'
    };
    return styles[stage] || 'bg-gray-100 text-gray-700';
}

// ==========================================
// 2. LÓGICA DE RENDERIZADO (Visual)
// ==========================================

/**
 * Dibuja la tabla de cerdos con estilo Premium
 * @param {string} filter - Texto de búsqueda
 */
export function renderPigs(filter = '') {
    const tbody = document.querySelector('#pigTable tbody');
    if (!tbody) return;

    tbody.innerHTML = ''; // Limpiar tabla

    // Filtrar datos
    const filteredPigs = pigs.filter(p => 
        p.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredPigs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-gray-400">No se encontraron registros</td></tr>`;
        return;
    }

    filteredPigs.forEach((pig, index) => {
        // Encontrar el índice real en el array original (importante para editar/borrar correctamente al filtrar)
        const realIndex = pigs.indexOf(pig);

        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 transition border-b border-gray-100 group";
        
        tr.innerHTML = `
            <td class="p-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                        <i class="fas fa-piggy-bank"></i>
                    </div>
                    <span class="font-bold text-gray-700">${pig.name}</span>
                </div>
            </td>
            <td class="p-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${getStageBadge(pig.stage)}">
                    ${pig.stage}
                </span>
            </td>
            <td class="p-4 text-right">
                <button class="text-blue-500 hover:text-blue-700 mx-2 p-2 rounded-lg hover:bg-blue-50 transition" 
                        data-edit="${realIndex}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition" 
                        data-del="${realIndex}" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// 3. LÓGICA DE GESTIÓN (Acciones)
// ==========================================

/**
 * Prepara el formulario para editar
 */
function handleEdit(index) {
    const pig = pigs[index];
    document.getElementById('pigName').value = pig.name;
    document.getElementById('pigStage').value = pig.stage;
    
    // Cambiar visualmente el botón para indicar edición
    const submitBtn = document.querySelector('#pigForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i> Actualizar';
    submitBtn.classList.replace('bg-green-700', 'bg-blue-600');
    
    editIndex = index;
    
    // Scroll suave hacia el formulario (útil en móviles)
    document.getElementById('pigForm').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Elimina con confirmación
 */
function handleDelete(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            pigs.splice(index, 1);
            savePigs();
            renderPigs();
            updateCounts(); // Actualizar tarjetas del dashboard
            
            Toast.fire({ icon: 'success', title: 'Registro eliminado' });
        }
    });
}

// ==========================================
// 4. EVENT LISTENERS
// ==========================================

// Click delegado para la tabla (Mejor rendimiento)
document.addEventListener('click', e => {
    // Buscar el botón más cercano (por si hace clic en el icono <i>)
    const editBtn = e.target.closest('[data-edit]');
    const delBtn = e.target.closest('[data-del]');

    if (editBtn) handleEdit(Number(editBtn.dataset.edit));
    if (delBtn) handleDelete(Number(delBtn.dataset.del));
});

// Manejo del Formulario
const pigForm = document.getElementById('pigForm');
if (pigForm) {
    pigForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const name = document.getElementById('pigName').value.trim();
        const stage = document.getElementById('pigStage').value;
        
        if (!name) return;

        if (editIndex !== null) {
            // EDICIÓN
            pigs[editIndex] = { name, stage };
            Toast.fire({ icon: 'success', title: 'Cerdo actualizado correctamente' });
            
            // Restaurar botón
            const submitBtn = document.querySelector('#pigForm button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Guardar Registro';
            submitBtn.classList.replace('bg-blue-600', 'bg-green-700');
            editIndex = null;
        } else {
            // CREACIÓN
            // Validar duplicados
            if (pigs.some(p => p.name.toLowerCase() === name.toLowerCase())) {
                Toast.fire({ icon: 'error', title: 'Ya existe un cerdo con este ID' });
                return;
            }
            pigs.push({ name, stage });
            Toast.fire({ icon: 'success', title: 'Nuevo cerdo registrado' });
        }
        
        savePigs();
        renderPigs();
        updateCounts();
        pigForm.reset();
    });
}

// Búsqueda en tiempo real
const searchInput = document.getElementById('searchPig');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderPigs(e.target.value);
    });
}