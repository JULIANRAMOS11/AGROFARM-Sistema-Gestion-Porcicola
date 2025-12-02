/**
 * Módulo de Gestión de Cerdos - AGROFARM
 * Maneja el registro, edición, eliminación y visualización de cerdos.
 */

import { updateCounts } from './dashboard.js';

// Array global que almacena todos los cerdos registrados en el sistema
// Los datos se cargan desde localStorage al iniciar la aplicación
let pigs = JSON.parse(localStorage.getItem('pigs') || '[]');

// Índice del cerdo que se está editando actualmente (null si no hay edición activa)
let editIndex = null;

/**
 * Guarda el array de cerdos en localStorage.
 * Persiste los datos para que no se pierdan al recargar la página.
 */
function savePigs() {
  localStorage.setItem('pigs', JSON.stringify(pigs));
}

/**
 * Renderiza la tabla de cerdos en el DOM.
 * @param {string} filter - Texto para filtrar cerdos por nombre (opcional).
 * @description Muestra todos los cerdos o los filtra según el parámetro.
 *              Cada fila incluye botones de editar y eliminar.
 */
export function renderPigs(filter = '') {
  const tbody = document.querySelector('#pigTable tbody');
  if (!tbody) return;
  
  // Limpiar la tabla antes de renderizar
  tbody.innerHTML = '';
  
  // Filtrar y mostrar los cerdos
  pigs
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((pig, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="p-2 border">${pig.name}</td>
        <td class="p-2 border">${pig.stage}</td>
        <td class="p-2 border text-center">
          <button class="text-blue-600 mr-2" data-edit="${index}">Editar</button>
          <button class="text-red-600" data-del="${index}">Eliminar</button>
        </td>`;
      tbody.appendChild(tr);
    });
}

/**
 * Carga los datos de un cerdo en el formulario para editarlo.
 * @param {number} index - Índice del cerdo en el array.
 */
function handleEdit(index) {
  const pig = pigs[index];
  // Llenar los campos del formulario con los datos del cerdo
  document.getElementById('pigName').value = pig.name;
  document.getElementById('pigStage').value = pig.stage;
  // Marcar que estamos en modo edición
  editIndex = index;
}

/**
 * Elimina un cerdo del sistema.
 * @param {number} index - Índice del cerdo a eliminar.
 */
function handleDelete(index) {
  // Eliminar del array
  pigs.splice(index, 1);
  // Guardar cambios en localStorage
  savePigs();
  // Actualizar la vista
  renderPigs();
  // Actualizar contadores del dashboard
  updateCounts();
}

// Listener global para capturar clics en botones de editar y eliminar
document.addEventListener('click', e => {
  if (e.target.matches('[data-edit]')) {
    handleEdit(Number(e.target.dataset.edit));
  }
  if (e.target.matches('[data-del]')) {
    handleDelete(Number(e.target.dataset.del));
  }
});

// Manejo del formulario de registro/edición de cerdos
const pigForm = document.getElementById('pigForm');
if (pigForm) {
  pigForm.addEventListener('submit', e => {
    // Prevenir el envío tradicional del formulario
    e.preventDefault();
    
    // Obtener datos del formulario
    const name = document.getElementById('pigName').value.trim();
    const stage = document.getElementById('pigStage').value;
    
    // Validar que el nombre no esté vacío
    if (!name) return;
    
    // Si estamos editando, actualizar el cerdo existente
    if (editIndex !== null) {
      pigs[editIndex] = { name, stage };
      editIndex = null;
    } else {
      // Si no, agregar un nuevo cerdo
      pigs.push({ name, stage });
    }
    
    // Guardar en localStorage
    savePigs();
    // Actualizar la tabla
    renderPigs();
    // Actualizar contadores
    updateCounts();
    // Limpiar el formulario
    pigForm.reset();
    // Mostrar mensaje de confirmación
    Swal.fire('Guardado', '', 'success');
  });
}

// Filtro de búsqueda en tiempo real
const searchInput = document.getElementById('searchPig');
searchInput?.addEventListener('input', () => renderPigs(searchInput.value));

// Renderizar la tabla al cargar la página
window.addEventListener('DOMContentLoaded', () => renderPigs());
