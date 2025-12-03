/**
 * Utilidades de metricas para el Dashboard
 * Separamos este modulo para evitar dependencias circulares entre dashboard y pigs.
 */

/**
 * Actualiza los contadores visibles en el dashboard usando datos persistidos.
 * Lee desde localStorage y deja valores simulados para metricas que aun no existen.
 */
export function updateCounts() {
    const pigs = JSON.parse(localStorage.getItem('pigs') || '[]').length;
    const births = 5;
    const alerts = 2;
    const feed = 1500;

    const pigCount = document.getElementById('pigCount');
    const birthCount = document.getElementById('birthCount');
    const alertsCount = document.getElementById('alertsCount');
    const feedCount = document.getElementById('feedCount');

    if (pigCount) pigCount.textContent = pigs;
    if (birthCount) birthCount.textContent = births;
    if (alertsCount) alertsCount.textContent = alerts;
    if (feedCount) feedCount.textContent = feed;
}
