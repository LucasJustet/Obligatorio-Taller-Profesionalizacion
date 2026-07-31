// Arrays principales del sistema
let juguetes = [];
let vendedores = [];
let ventas = [];

// Objeto que permite leer y escribir en localStorage
const memoria = new Memoria();

//#region Funciones generales

function LeerDatos() {
    juguetes = memoria.leer('juguetes');
    vendedores = memoria.leer('vendedores');
    ventas = memoria.leer('ventas');

    if (!juguetes) {
        juguetes = [];
    }

    if (!vendedores) {
        vendedores = [];
    }

    if (!ventas) {
        ventas = [];
    }
}

function GuardarJuguetes() {
    memoria.escribir('juguetes', juguetes);
}

function GuardarVendedores() {
    memoria.escribir('vendedores', vendedores);
}

function GuardarVentas() {
    memoria.escribir('ventas', ventas);
}

function BuscarJuguete(codigo) {
    for (let juguete of juguetes) {
        if (juguete.codigo == codigo) {
            return juguete;
        }
    }
    return null;
}

function BuscarVendedor(codigo) {
    for (let vendedor of vendedores) {
        if (vendedor.codigo == codigo) {
            return vendedor;
        }
    }
    return null;
}

function BuscarVenta(codigo) {
    for (let venta of ventas) {
        if (venta.codigo == codigo) {
            return venta;
        }
    }
    return null;
}

function BuscarPosicionVenta(codigo) {
    for (let i = 0; i < ventas.length; i++) {
        if (ventas[i].codigo == codigo) {
            return i;
        }
    }
    return -1;
}

function Numero(valor) {
    return Number(valor);
}

//#endregion

//#region Juguetes

function CargarDatosJuguetes() {
    LeerDatos();
    InicializarJuguete();
    ListarJuguetes();
}

function InicializarJuguete() {
    document.getElementById('codigo').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('codigo').disabled = false;
    document.getElementById('codigo').focus();
}

function AgregarJuguete() {
    let codigo = document.getElementById('codigo').value;
    let nombre = document.getElementById('nombre').value;
    let precio = Numero(document.getElementById('precio').value);
    let stock = Numero(document.getElementById('stock').value);

    if (codigo == '' || nombre == '' || precio <= 0 || stock < 0) {
        alert('Debe ingresar código, nombre, precio mayor a 0 y stock válido.');
        return;
    }

    if (BuscarJuguete(codigo) != null) {
        alert('Ya existe un juguete con ese código.');
        return;
    }

    let juguete = new Juguete(codigo, nombre, '', precio, stock);
    juguetes.push(juguete);

    GuardarJuguetes();
    InicializarJuguete();
    ListarJuguetes();
}

function SeleccionarJuguete() {
    let codigo = document.getElementById('lista-juguetes').value;
    let juguete = BuscarJuguete(codigo);

    if (juguete != null) {
        document.getElementById('codigo').value = juguete.codigo;
        document.getElementById('nombre').value = juguete.nombre;
        document.getElementById('precio').value = juguete.precio;
        document.getElementById('stock').value = juguete.stock;
        document.getElementById('codigo').disabled = true;
    }
}

function ModificarJuguete() {
    let codigo = document.getElementById('codigo').value;
    let nombre = document.getElementById('nombre').value;
    let precio = Numero(document.getElementById('precio').value);
    let stock = Numero(document.getElementById('stock').value);

    let juguete = BuscarJuguete(codigo);

    if (juguete == null) {
        alert('Debe seleccionar un juguete.');
        return;
    }

    if (nombre == '' || precio <= 0 || stock < 0) {
        alert('Debe ingresar datos válidos.');
        return;
    }

    juguete.nombre = nombre;
    juguete.precio = precio;
    juguete.stock = stock;

    GuardarJuguetes();
    InicializarJuguete();
    ListarJuguetes();
}

function EliminarJuguete() {
    let codigo = document.getElementById('lista-juguetes').value;

    if (codigo == '') {
        alert('Debe seleccionar un juguete.');
        return;
    }

    for (let i = 0; i < juguetes.length; i++) {
        if (juguetes[i].codigo == codigo) {
            juguetes.splice(i, 1);
            break;
        }
    }

    GuardarJuguetes();
    InicializarJuguete();
    ListarJuguetes();
}

function ListarJuguetes() {
    let lista = document.getElementById('lista-juguetes');
    lista.innerHTML = '';

    for (let juguete of juguetes) {
        let texto = juguete.codigo + ' - ' + juguete.nombre + ' - $' + juguete.precio + ' - Stock: ' + juguete.stock;
        let opcion = new Option(texto, juguete.codigo);
        lista.add(opcion);
    }
}

//#endregion

//#region Vendedores

function CargarDatosVendedores() {
    LeerDatos();
    InicializarVendedor();
    ListarVendedores();
}

function InicializarVendedor() {
    document.getElementById('codigo').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('cedula').value = '';
    document.getElementById('codigo').disabled = false;
    document.getElementById('codigo').focus();
}

function AgregarVendedor() {
    let codigo = document.getElementById('codigo').value;
    let nombre = document.getElementById('nombre').value;
    let cedula = document.getElementById('cedula').value;

    if (codigo == '' || nombre == '' || cedula == '') {
        alert('Debe ingresar todos los campos.');
        return;
    }

    if (BuscarVendedor(codigo) != null) {
        alert('Ya existe un vendedor con ese código.');
        return;
    }

    let vendedor = new Vendedor(codigo, nombre, cedula);
    vendedores.push(vendedor);

    GuardarVendedores();
    InicializarVendedor();
    ListarVendedores();
}

function SeleccionarVendedor() {
    let codigo = document.getElementById('lista-vendedores').value;
    let vendedor = BuscarVendedor(codigo);

    if (vendedor != null) {
        document.getElementById('codigo').value = vendedor.codigo;
        document.getElementById('nombre').value = vendedor.nombre;
        document.getElementById('cedula').value = vendedor.cedula;
        document.getElementById('codigo').disabled = true;
    }
}

function ModificarVendedor() {
    let codigo = document.getElementById('codigo').value;
    let nombre = document.getElementById('nombre').value;
    let cedula = document.getElementById('cedula').value;

    let vendedor = BuscarVendedor(codigo);

    if (vendedor == null) {
        alert('Debe seleccionar un vendedor.');
        return;
    }

    if (nombre == '' || cedula == '') {
        alert('Debe ingresar datos válidos.');
        return;
    }

    vendedor.nombre = nombre;
    vendedor.cedula = cedula;

    GuardarVendedores();
    InicializarVendedor();
    ListarVendedores();
}

function EliminarVendedor() {
    let codigo = document.getElementById('lista-vendedores').value;

    if (codigo == '') {
        alert('Debe seleccionar un vendedor.');
        return;
    }

    for (let i = 0; i < vendedores.length; i++) {
        if (vendedores[i].codigo == codigo) {
            vendedores.splice(i, 1);
            break;
        }
    }

    GuardarVendedores();
    InicializarVendedor();
    ListarVendedores();
}

function ListarVendedores() {
    let lista = document.getElementById('lista-vendedores');
    lista.innerHTML = '';

    for (let vendedor of vendedores) {
        let texto = vendedor.codigo + ' - ' + vendedor.nombre + ' - CI: ' + vendedor.cedula;
        let opcion = new Option(texto, vendedor.codigo);
        lista.add(opcion);
    }
}

//#endregion

//#region Ventas

function CargarDatosVentas() {
    LeerDatos();
    CargarCombosVenta();
    InicializarVenta();
    ListarVentas();
}

function InicializarVenta() {
    document.getElementById('codigoVenta').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('total').value = '';

    if (document.getElementById('vendedor').options.length > 0) {
        document.getElementById('vendedor').selectedIndex = 0;
    }

    if (document.getElementById('juguete').options.length > 0) {
        document.getElementById('juguete').selectedIndex = 0;
    }
}

function CargarCombosVenta() {
    let comboVendedor = document.getElementById('vendedor');
    let comboJuguete = document.getElementById('juguete');

    comboVendedor.innerHTML = '';
    comboJuguete.innerHTML = '';

    for (let vendedor of vendedores) {
        let opcion = new Option(vendedor.nombre, vendedor.codigo);
        comboVendedor.add(opcion);
    }

    for (let juguete of juguetes) {
        let texto = juguete.nombre + ' - $' + juguete.precio + ' - Stock: ' + juguete.stock;
        let opcion = new Option(texto, juguete.codigo);
        comboJuguete.add(opcion);
    }
}

function CalcularTotal() {
    let codigoJuguete = document.getElementById('juguete').value;
    let cantidad = Numero(document.getElementById('cantidad').value);
    let juguete = BuscarJuguete(codigoJuguete);

    if (juguete != null && cantidad > 0) {
        document.getElementById('total').value = juguete.precio * cantidad;
    } else {
        document.getElementById('total').value = '';
    }
}

function AgregarVenta() {
    let fecha = document.getElementById('fecha').value;
    let codigoVendedor = document.getElementById('vendedor').value;
    let codigoJuguete = document.getElementById('juguete').value;
    let cantidad = Numero(document.getElementById('cantidad').value);

    let juguete = BuscarJuguete(codigoJuguete);
    let vendedor = BuscarVendedor(codigoVendedor);

    if (fecha == '' || vendedor == null || juguete == null || cantidad <= 0) {
        alert('Debe ingresar fecha, vendedor, juguete y cantidad válida.');
        return;
    }

    if (cantidad > juguete.stock) {
        alert('No hay stock suficiente para realizar la venta.');
        return;
    }

    let total = juguete.precio * cantidad;
    let codigoVenta = 'V' + Date.now();

    let venta = new Venta(codigoVenta, fecha, codigoJuguete, codigoVendedor, cantidad, total);
    ventas.push(venta);

    juguete.stock = juguete.stock - cantidad;

    GuardarVentas();
    GuardarJuguetes();

    CargarCombosVenta();
    InicializarVenta();
    ListarVentas();
}

function SeleccionarVenta() {
    let codigo = document.getElementById('lista-ventas').value;
    let venta = BuscarVenta(codigo);

    if (venta != null) {
        document.getElementById('codigoVenta').value = venta.codigo;
        document.getElementById('fecha').value = venta.fecha;
        document.getElementById('vendedor').value = venta.vendedor;
        document.getElementById('juguete').value = venta.juguete;
        document.getElementById('cantidad').value = venta.cantidad;
        document.getElementById('total').value = venta.total;
    }
}

function ModificarVenta() {
    let codigo = document.getElementById('codigoVenta').value;
    let fecha = document.getElementById('fecha').value;
    let codigoVendedor = document.getElementById('vendedor').value;
    let codigoJuguete = document.getElementById('juguete').value;
    let cantidadNueva = Numero(document.getElementById('cantidad').value);

    let venta = BuscarVenta(codigo);
    let jugueteNuevo = BuscarJuguete(codigoJuguete);

    if (venta == null) {
        alert('Debe seleccionar una venta.');
        return;
    }

    if (fecha == '' || codigoVendedor == '' || jugueteNuevo == null || cantidadNueva <= 0) {
        alert('Debe ingresar datos válidos.');
        return;
    }

    let jugueteAnterior = BuscarJuguete(venta.juguete);

    if (jugueteAnterior != null) {
        jugueteAnterior.stock = jugueteAnterior.stock + Numero(venta.cantidad);
    }

    if (cantidadNueva > jugueteNuevo.stock) {
        alert('No hay stock suficiente para modificar la venta.');

        if (jugueteAnterior != null) {
            jugueteAnterior.stock = jugueteAnterior.stock - Numero(venta.cantidad);
        }
        return;
    }

    jugueteNuevo.stock = jugueteNuevo.stock - cantidadNueva;

    venta.fecha = fecha;
    venta.vendedor = codigoVendedor;
    venta.juguete = codigoJuguete;
    venta.cantidad = cantidadNueva;
    venta.total = jugueteNuevo.precio * cantidadNueva;

    GuardarVentas();
    GuardarJuguetes();

    CargarCombosVenta();
    InicializarVenta();
    ListarVentas();
}

function EliminarVenta() {
    let codigo = document.getElementById('lista-ventas').value;
    let posicion = BuscarPosicionVenta(codigo);

    if (posicion == -1) {
        alert('Debe seleccionar una venta.');
        return;
    }

    let venta = ventas[posicion];
    let juguete = BuscarJuguete(venta.juguete);

    if (juguete != null) {
        juguete.stock = juguete.stock + Numero(venta.cantidad);
    }

    ventas.splice(posicion, 1);

    GuardarVentas();
    GuardarJuguetes();

    CargarCombosVenta();
    InicializarVenta();
    ListarVentas();
}

function ListarVentas() {
    let lista = document.getElementById('lista-ventas');
    lista.innerHTML = '';

    for (let venta of ventas) {
        let juguete = BuscarJuguete(venta.juguete);
        let vendedor = BuscarVendedor(venta.vendedor);

        let nombreJuguete = 'Juguete eliminado';
        let nombreVendedor = 'Vendedor eliminado';

        if (juguete != null) {
            nombreJuguete = juguete.nombre;
        }

        if (vendedor != null) {
            nombreVendedor = vendedor.nombre;
        }

        let texto = venta.fecha + ' - ' + nombreVendedor + ' - ' + nombreJuguete + ' - Cant: ' + venta.cantidad + ' - Total: $' + venta.total;
        let opcion = new Option(texto, venta.codigo);
        lista.add(opcion);
    }
}

//#endregion
