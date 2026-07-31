Juguetería El Osito - Ejemplo para clase básica

Archivos principales:
- principal.html: pantalla inicial.
- juguetes.html: alta, baja y modificación de juguetes.
- vendedores.html: alta, baja y modificación de vendedores.
- ventas.html: registro, modificación y eliminación de ventas.
- css/estilos.css: estilos visuales del proyecto.
- dominio/*.js: clases, memoria localStorage y funciones del sistema.

Orden sugerido para explicar en clase:
1) Mostrar principal.html y explicar la estructura básica.
2) Abrir css/estilos.css y explicar clases como .contenedor, .tarjeta, .boton.
3) Cargar vendedores y juguetes.
4) Mostrar que al cerrar y abrir el navegador los datos siguen guardados gracias a localStorage.
5) Registrar una venta y mostrar que se descuenta el stock del juguete.
6) Modificar o eliminar una venta y mostrar que el stock se actualiza.

Conceptos trabajados:
- HTML semántico: header, nav, main, section.
- CSS externo.
- Clases CSS.
- JavaScript externo.
- Arrays.
- Objetos.
- Funciones.
- localStorage.
- Validaciones básicas.
- Selectores y eventos onclick, onchange, onload.

Importante:
Los datos se guardan en el navegador del alumno. Para borrar todos los datos, se puede limpiar el localStorage desde las herramientas del navegador o ejecutar:
localStorage.clear()
