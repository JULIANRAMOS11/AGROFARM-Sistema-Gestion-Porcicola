# AGROFARM – Sistema de Gestión Porcícola (Módulo Web)

Proyecto académico desarrollado como parte de la evidencia **GA7-220501096-AA3-EV01** del programa **Análisis y Desarrollo de Software – SENA**.

Este módulo implementa una interfaz web para la gestión básica de una granja porcícola:

- Autenticación de usuarios (login y registro).
- Control de acceso por roles: `Administrador`, `Veterinario`, `Operario`.
- Panel de control (dashboard) con tarjetas de resumen.
- Gestión de cerdos (registro, edición, eliminación, búsqueda).
- Módulo de producción con gráfico básico y exportación a **PDF** y **Excel**.

## Tecnologías utilizadas

- **HTML5** y **ES Modules (JavaScript)**
- **TailwindCSS** (via CDN) para estilos.
- **SweetAlert2** para mensajes.
- **Chart.js** para gráficos.
- **jsPDF** y **SheetJS (xlsx)** para exportación de reportes.
- **localStorage** y **sessionStorage** para persistencia en el navegador.
- Control de versiones con **Git** y **GitHub**.

## Estructura del proyecto

```text
AGROFARM-Sistema-Gestion-Porcicola/
  index.html
  register.html
  dashboard.html
  img/
    logo.jpeg
  js/
    auth.js
  scripts/
    dashboard.js
    pigs.js
    charts.js
  docs/
    (informe técnico, diagramas, etc.)
```

## Uso

1. Abre `index.html` en tu navegador.
2. Registra un usuario indicando su rol y luego inicia sesión.
3. Desde el dashboard podrás gestionar cerdos, registrar eventos y generar reportes descargables.

Esta demostración no implementa un backend real; su propósito es mostrar la apariencia y estructura de un sistema de gestión porcícola.
