import { updateCounts } from './dashboard.js';

let pigs = JSON.parse(localStorage.getItem('pigs') || '[]');
let editIndex = null;

function savePigs() {
  localStorage.setItem('pigs', JSON.stringify(pigs));
}

export function renderPigs(filter = '') {
  const tbody = document.querySelector('#pigTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
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

function handleEdit(index) {
  const pig = pigs[index];
  document.getElementById('pigName').value = pig.name;
  document.getElementById('pigStage').value = pig.stage;
  editIndex = index;
}

function handleDelete(index) {
  pigs.splice(index, 1);
  savePigs();
  renderPigs();
  updateCounts();
}

document.addEventListener('click', e => {
  if (e.target.matches('[data-edit]')) {
    handleEdit(Number(e.target.dataset.edit));
  }
  if (e.target.matches('[data-del]')) {
    handleDelete(Number(e.target.dataset.del));
  }
});

const pigForm = document.getElementById('pigForm');
if (pigForm) {
  pigForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('pigName').value.trim();
    const stage = document.getElementById('pigStage').value;
    if (!name) return;
    if (editIndex !== null) {
      pigs[editIndex] = { name, stage };
      editIndex = null;
    } else {
      pigs.push({ name, stage });
    }
    savePigs();
    renderPigs();
    updateCounts();
    pigForm.reset();
    Swal.fire('Guardado', '', 'success');
  });
}

const searchInput = document.getElementById('searchPig');
searchInput?.addEventListener('input', () => renderPigs(searchInput.value));

window.addEventListener('DOMContentLoaded', () => renderPigs());
