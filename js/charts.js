/**
 * Módulo de Gráficos y Reportes - AGROFARM
 * Gestiona la visualización de datos mediante gráficos y la exportación de reportes.
 */

// Variable global que almacena la instancia del gráfico de producción
// Se utiliza para poder actualizar o destruir el gráfico posteriormente
let prodChart;

/**
 * Renderiza el gráfico de producción en el dashboard.
 * @description Crea un gráfico de barras que muestra los nacimientos mensuales.
 *              Utiliza la librería Chart.js para la visualización.
 */
export function renderCharts() {
  const ctx = document.getElementById('productionChart');
  if (!ctx) return;
  
  // Crear gráfico de barras con datos de nacimientos mensuales
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

// Listener para exportar reporte en formato PDF
// Utiliza la librería jsPDF para generar el documento
document.getElementById('exportPdf')?.addEventListener('click', () => {
  // Crear nuevo documento PDF
  const doc = new jspdf.jsPDF();
  // Añadir título al documento
  doc.text('Reporte de Producción', 10, 10);
  // Descargar el archivo PDF
  doc.save('reporte.pdf');
});

// Listener para exportar reporte en formato Excel
// Utiliza la librería SheetJS (XLSX) para generar la hoja de cálculo
document.getElementById('exportXls')?.addEventListener('click', () => {
  // Crear nuevo libro de Excel
  const wb = XLSX.utils.book_new();
  // Convertir datos JSON a formato de hoja de cálculo
  const ws = XLSX.utils.json_to_sheet([
    { mes: 'Enero', valor: 3 },
    { mes: 'Feb', valor: 4 },
    { mes: 'Mar', valor: 2 },
    { mes: 'Abr', valor: 5 }
  ]);
  // Añadir la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  // Descargar el archivo Excel
  XLSX.writeFile(wb, 'reporte.xlsx');
});
