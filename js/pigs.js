/**
 * Modulo de Gestion de Cerdos - AGROFARM
 * CRUD de cerdos con persistencia en localStorage y feedback con SweetAlert2.
 */

import { updateCounts } from './stats.js';

let pigs = JSON.parse(localStorage.getItem('pigs') || '[]');
let editIndex = null;

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
});

function savePigs() {
    localStorage.setItem('pigs', JSON.stringify(pigs));
    try { updateCounts(); } catch (e) { console.warn('No se pudo actualizar el contador', e); }
}

function getStageBadge(stage) {
    const styles = {
        'Lechon': 'bg-blue-100 text-blue-800 border-blue-200',
        'Ceba': 'bg-orange-100 text-orange-800 border-orange-200',
        'Gestante': 'bg-pink-100 text-pink-800 border-pink-200',
        'Lactancia': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return styles[stage] || 'bg-gray-100 text-gray-800';
}

export function renderPigs(filter = '') {
    const tbody = document.querySelector('#pigTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const filtered = pigs.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-gray-400">No hay registros</td></tr>`;
        return;
    }

    filtered.forEach((pig) => {
        const originalIndex = pigs.indexOf(pig);
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-100 hover:bg-green-50 transition';
        tr.innerHTML = `
            <td class="p-4 font-medium text-gray-700">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <i class="fas fa-piggy-bank"></i>
                    </div>
                    ${pig.name}
                </div>
            </td>
            <td class="p-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold border ${getStageBadge(pig.stage)}">
                    ${pig.stage}
                </span>
            </td>
            <td class="p-4 text-right space-x-2">
                <button onclick="window.startEdit(${originalIndex})" class="text-blue-500 p-2 hover:bg-blue-50 rounded" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="window.deletePig(${originalIndex})" class="text-red-500 p-2 hover:bg-red-50 rounded" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.startEdit = (index) => {
    const pig = pigs[index];
    if (!pig) return;

    document.getElementById('pigName').value = pig.name;
    document.getElementById('pigStage').value = pig.stage;

    const btn = document.querySelector('#pigForm button[type="submit"]');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-sync mr-2"></i> Actualizar Cerdo';
        btn.classList.add('bg-blue-600');
        btn.classList.remove('bg-green-700');
        btn.dataset.mode = 'edit';
    }

    editIndex = index;
    document.getElementById('pigForm')?.scrollIntoView({ behavior: 'smooth' });
};

window.deletePig = (index) => {
    Swal.fire({
        title: 'Seguro de eliminar?',
        text: 'Se borrara este cerdo permanentemente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            pigs.splice(index, 1);
            savePigs();
            renderPigs();
            Toast.fire({ icon: 'success', title: 'Cerdo eliminado' });
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pigForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('pigName').value.trim();
            const stage = document.getElementById('pigStage').value;

            if (!name) {
                Toast.fire({ icon: 'warning', title: 'El nombre es obligatorio' });
                return;
            }

            if (editIndex !== null) {
                pigs[editIndex] = { name, stage };
                editIndex = null;
                const btn = form.querySelector('button[type="submit"]');
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-save mr-2"></i> Guardar Registro';
                    btn.classList.remove('bg-blue-600');
                    btn.classList.add('bg-green-700');
                    btn.dataset.mode = 'create';
                }
                Toast.fire({ icon: 'success', title: 'Registro actualizado' });
            } else {
                if (pigs.some(p => p.name.toLowerCase() === name.toLowerCase())) {
                    Toast.fire({ icon: 'error', title: 'Ya existe un cerdo con ese nombre' });
                    return;
                }
                pigs.push({ name, stage });
                Toast.fire({ icon: 'success', title: 'Nuevo cerdo guardado' });
            }

            savePigs();
            renderPigs();
            form.reset();
        });
    }

    const searchInput = document.getElementById('searchPig');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => renderPigs(e.target.value));
    }

    renderPigs();
});
