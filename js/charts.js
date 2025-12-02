/**
 * Módulo de Gráficos y Reportes - AGROFARM
 * @module Charts
 * @description Gestiona visualización de datos (Chart.js) y exportación (PDF/Excel)
 * con estilos modernos y feedback al usuario.
 */

// ==========================================
// 1. CONFIGURACIÓN Y DATOS
// ==========================================

// Datos simulados (Mock Data) para Producción
// En el futuro, esto vendría de la base de datos o localStorage
const productionData = [
    { mes: 'Enero', nacimientos: 12, meta: 10 },
    { mes: 'Febrero', nacimientos: 19, meta: 15 },
    { mes: 'Marzo', nacimientos: 15, meta: 15 },
    { mes: 'Abril', nacimientos: 22, meta: 18 },
    { mes: 'Mayo', nacimientos: 20, meta: 20 },
    { mes: 'Junio', nacimientos: 25, meta: 22 },
];

// Variable para la instancia del gráfico
let prodChart;

// Configuración de Notificaciones (Toast)
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
});

// ==========================================
// 2. LÓGICA DE GRÁFICOS (Chart.js)
// ==========================================

/**
 * Renderiza el gráfico de producción con estilos avanzados.
 */
export function renderCharts() {
    const ctx = document.getElementById('productionChart');
    if (!ctx) return; // Si no existe el canvas, salir

    // Destruir gráfico previo si existe para evitar superposiciones
    if (prodChart) prodChart.destroy();

    // Crear degradado para las barras (Efecto Premium)
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#16a34a'); // Green-600
    gradient.addColorStop(1, '#14532d'); // Green-900

    prodChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productionData.map(d => d.mes),
            datasets: [
                {
                    label: 'Nacimientos Reales',
                    data: productionData.map(d => d.nacimientos),
                    backgroundColor: gradient,
                    borderRadius: 6, // Bordes redondeados
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Meta Esperada',
                    data: productionData.map(d => d.meta),
                    type: 'line', // Gráfico mixto (Línea + Barras)
                    borderColor: '#fbbf24', // Amber-400
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#fbbf24',
                    pointRadius: 4,
                    tension: 0.4 // Curva suave
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { family: "'Inter', sans-serif", size: 12 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 83, 45, 0.9)', // Tooltip verde oscuro
                    titleFont: { family: "'Inter', sans-serif", size: 14 },
                    bodyFont: { family: "'Inter', sans-serif" },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f3f4f6', borderDash: [5, 5] }, // Grid sutil
                    ticks: { font: { family: "'Inter', sans-serif" } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { family: "'Inter', sans-serif" } }
                }
            }
        }
    });
}

// ==========================================
// 3. LÓGICA DE EXPORTACIÓN (PDF / Excel)
// ==========================================

/**
 * Genera nombre de archivo con fecha actual
 * Ej: reporte_produccion_2025-10-21
 */
const getFileName = (type) => {
    const date = new Date().toISOString().split('T')[0];
    return `Agrofarm_Produccion_${date}.${type}`;
};

// Exportar PDF
const btnPdf = document.getElementById('exportPdf');
if (btnPdf) {
    btnPdf.addEventListener('click', async () => {
        try {
            // Feedback visual
            btnPdf.disabled = true;
            btnPdf.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Encabezado del PDF
            doc.setFontSize(20);
            doc.setTextColor(22, 163, 74); // Verde
            doc.text('AGROFARM - Reporte de Producción', 15, 20);
            
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 15, 30);
            doc.line(15, 35, 195, 35); // Línea separadora

            // Contenido (Lista simple simulada)
            let y = 50;
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('Resumen Mensual:', 15, 45);
            
            doc.setFontSize(12);
            productionData.forEach((item) => {
                doc.text(`• ${item.mes}: ${item.nacimientos} nacimientos (Meta: ${item.meta})`, 20, y);
                y += 10;
            });

            // Pie de página
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text('Generado automáticamente por el sistema Agrofarm.', 15, 280);

            // Guardar
            doc.save(getFileName('pdf'));

            // Notificación Éxito
            Toast.fire({ icon: 'success', title: 'Reporte PDF descargado' });

        } catch (error) {
            console.error(error);
            Toast.fire({ icon: 'error', title: 'Error al generar PDF' });
        } finally {
            // Restaurar botón
            btnPdf.disabled = false;
            btnPdf.innerHTML = '<i class="fas fa-file-pdf mr-1"></i> PDF';
        }
    });
}

// Exportar Excel
const btnXls = document.getElementById('exportXls');
if (btnXls) {
    btnXls.addEventListener('click', () => {
        try {
            // Feedback visual
            btnXls.disabled = true;
            btnXls.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...';

            // Crear libro y hoja
            const wb = XLSX.utils.book_new();
            
            // Convertir datos (Mapear nombres de columnas para que se vea bien)
            const dataToExport = productionData.map(d => ({
                "Mes": d.mes,
                "Nacimientos Totales": d.nacimientos,
                "Meta Establecida": d.meta,
                "Cumplimiento": d.nacimientos >= d.meta ? "SÍ" : "NO"
            }));

            const ws = XLSX.utils.json_to_sheet(dataToExport);

            // Ajustar ancho de columnas (Cosmético)
            const wscols = [
                {wch: 15}, // Mes
                {wch: 20}, // Nacimientos
                {wch: 20}, // Meta
                {wch: 15}  // Cumplimiento
            ];
            ws['!cols'] = wscols;

            XLSX.utils.book_append_sheet(wb, ws, 'Producción 2025');
            
            // Descargar
            XLSX.writeFile(wb, getFileName('xlsx'));

            Toast.fire({ icon: 'success', title: 'Reporte Excel descargado' });

        } catch (error) {
            console.error(error);
            Toast.fire({ icon: 'error', title: 'Error al generar Excel' });
        } finally {
            // Restaurar botón
            btnXls.disabled = false;
            btnXls.innerHTML = '<i class="fas fa-file-excel mr-1"></i> Excel';
        }
    });
}