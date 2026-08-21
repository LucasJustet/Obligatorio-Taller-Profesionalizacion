# Juguetería El Osito - Sistema de Gestión

Este proyecto es una aplicación web desarrollada para la gestión integral de una juguetería, incluyendo la administración de inventario de juguetes, vendedores, registro de ventas y visualización de estadísticas.

El sistema funciona de forma totalmente local en el cliente, organizando su arquitectura en vistas (HTML), controladores, modelos, repositorios de almacenamiento y servicios (MVC).

---

* **Enlace al Repositorio GitHub:** https://github.com/LucasJustet/Obligatorio-Taller-Profesionalizacion.git
* **URL del Sitio Publicado:** https://lucasjustet.github.io/Obligatorio-Taller-Profesionalizacion/
---

## Informe de Estado (Requisito de Entrega)

* **Tareas realizadas:** Refactorización inicial de la aplicación, estructuración modular con clases y módulos ES6, integración de Bootstrap, diseño responsivo, manejo del DOM y persistencia mediante LocalStorage.
* **Problemas encontrados:** Contraste de elementos interactivos (`input` y `select`) durante la navegación por teclado y optimización del rendimiento inicial (LCP).
* **Soluciones implementadas:** Ajuste de estilos CSS específicos para los indicadores de foco (`focus-visible` con sombras y contornos destacados) y optimización de recursos críticos de la interfaz.
* **Funcionalidades pendientes:** Ajustes finales de validación y optimización de SEO para la entrega definitiva.

---

## Archivos y Estructura del Proyecto

### Vistas (`/src/views` e `index.html`)
* **index.html**: Pantalla principal y de inicio del sistema.
* **src/views/juguetes.html**: Módulo de gestión para alta, baja y modificación (ABM) del catálogo de juguetes.
* **src/views/vendedores.html**: Módulo de gestión para alta, baja y modificación (ABM) de vendedores.
* **src/views/ventas.html**: Módulo comercial para el registro, modificación y eliminación de ventas realizadas.
* **src/views/estadisticas.html**: Módulo de reportes y estadísticas de ventas.

### Estilos (`/assets/css`)
* **assets/css/estilos.css**: Hoja de estilos centralizada que define la interfaz visual y componentes del proyecto.

### Controladores (`/src/controllers`)
* **src/controllers/jugueteController.js**: Manejo de eventos e interacción con la vista de juguetes.
* **src/controllers/vendedorController.js**: Manejo de eventos e interacción con la vista de vendedores.
* **src/controllers/ventaController.js**: Lógica de interacción para la gestión de ventas.
* **src/controllers/estadisticaController.js**: Procesamiento y presentación de datos estadísticos del sistema.

### Modelos (`/src/models`)
* **src/models/juguete.js**: Clase y entidad que define la estructura del juguete.
* **src/models/vendedor.js**: Clase y entidad que define la estructura del vendedor.
* **src/models/venta.js**: Clase y entidad que define la estructura de una transacción de venta.

### Repositorio y Servicios (`/src/repository` y `/src/services`)
* **src/repository/LocalStorageRepository.js**: Capa encargada de la persistencia de datos mediante `localStorage`.
* **src/services/api.js**: Servicios para la gestión e intercambio de datos.
* **src/services/ui.js**: Funciones auxiliares para la manipulación y renderizado de la interfaz de usuario.
* **src/services/app.js**: Punto de entrada principal e inicialización de la aplicación.

---

## Conceptos Técnicos Aplicados

* **HTML Semántico**: Uso estructurado de etiquetas estándar en todas las vistas.
* **Arquitectura de Software**: Separación de responsabilidades mediante patrón MVC (Modelos, Vistas, Controladores, Repositorios y Servicios).
* **CSS Externo y Modular**: Manejo de clases reutilizables en assets/css.
* **JavaScript Moderno (ES6+)**:
  * Programación Orientada a Objetos (Clases y Objetos).
  * Modulación de archivos JS (Imports/Exports).
  * Manejo de estructuras de datos (Arrays, Filtros y Métodos de iteración).
* **Persistencia de Datos**: Almacenamiento local utilizando la API de localStorage en la capa de repositorio.
* **Manipulación del DOM**: Eventos dinámicos y representación reactiva de la interfaz a través de los controladores y servicios.

---

## Limpieza y Reinicio de Datos

Debido a que la información se almacena localmente en el navegador del usuario:

* Para restablecer la aplicación a su estado inicial, abra la Consola de Desarrollador (F12) y ejecute:
  ```javascript
  localStorage.clear();
