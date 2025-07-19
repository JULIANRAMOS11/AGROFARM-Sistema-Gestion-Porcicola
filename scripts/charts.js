let prodChart;

export function renderCharts() {
  const ctx = document.getElementById('productionChart');
  if (!ctx) return;
  prodChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Enero', 'Feb', 'Mar', 'Abr'],
      datasets: [{
        label: 'Nacimientos',
        data: [3, 4, 2, 5],
        backgroundColor: '#2E7D32'
      }]
    }
  });
}

document.getElementById('exportPdf')?.addEventListener('click', () => {
  const doc = new jspdf.jsPDF();
  doc.text('Reporte de Producción', 10, 10);
  doc.save('reporte.pdf');
});

document.getElementById('exportXls')?.addEventListener('click', () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([
    { mes: 'Enero', valor: 3 },
    { mes: 'Feb', valor: 4 },
    { mes: 'Mar', valor: 2 },
    { mes: 'Abr', valor: 5 }
  ]);
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  XLSX.writeFile(wb, 'reporte.xlsx');
});
