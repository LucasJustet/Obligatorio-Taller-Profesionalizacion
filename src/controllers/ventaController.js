import { Venta } from '../models/venta.js';
import { LocalStorageRepository } from '../repository/LocalStorageRepository.js';
import { UIService } from '../services/ui.js';

export class VentaController {
    constructor() {
        this.ventaRepo = new LocalStorageRepository('ventas');
        this.vendedorRepo = new LocalStorageRepository('vendedores');
        this.jugueteRepo = new LocalStorageRepository('juguetes');
        this.init();
    }

    init() {
        document.getElementById('btn-agregar')?.addEventListener('click', () => this.agregar());
        document.getElementById('btn-modificar')?.addEventListener('click', () => this.modificar());
        document.getElementById('btn-eliminar')?.addEventListener('click', () => this.eliminar());
        document.getElementById('btn-limpiar')?.addEventListener('click', () => this.inicializarFormulario());
        document.getElementById('lista-ventas')?.addEventListener('change', () => this.seleccionar());
        
        // --- VALIDACIÓN EN TIEMPO REAL ---
        document.getElementById('fecha')?.addEventListener('change', () => this.validarFecha());
        document.getElementById('vendedor')?.addEventListener('change', () => this.validarVendedor());
        document.getElementById('juguete')?.addEventListener('change', () => {
            this.validarJuguete();
            this.calcularTotal();
        });
        document.getElementById('cantidad')?.addEventListener('input', () => {
            this.validarCantidad();
            this.calcularTotal();
        });

        document.getElementById('buscador-ventas')?.addEventListener('input', (e) => this.filtrarLista(e.target.value));
        this.cargarSelects();
        this.inicializarFormulario();
        this.listar();
    }

    generarSiguienteCodigo() {
        const ventas = this.ventaRepo.todos();
        if (!ventas || ventas.length === 0) return "1";
        const numeros = ventas.map(v => parseInt(v.codigo, 10)).filter(n => !isNaN(n));
        const maxNumero = numeros.length > 0 ? Math.max(...numeros) : 0;
        return String(maxNumero + 1);
    }

    cargarSelects() {
        const selectVendedor = document.getElementById('vendedor');
        const selectJuguete = document.getElementById('juguete');

        if (selectVendedor) {
            selectVendedor.innerHTML = '<option value="" selected disabled>Seleccione un vendedor...</option>';
            this.vendedorRepo.todos().forEach(v => {
                selectVendedor.add(new Option(`${v.nombre} (Cédula: ${v.cedula})`, v.codigo));
            });
        }

        if (selectJuguete) {
            selectJuguete.innerHTML = '<option value="" selected disabled>Seleccione un juguete...</option>';
            this.jugueteRepo.todos().forEach(j => {
                selectJuguete.add(new Option(`${j.nombre} - $${j.precio} (Stock: ${j.stock})`, j.codigo));
            });
        }
    }

    calcularTotal() {
        const jugueteCodigo = document.getElementById('juguete')?.value;
        const cantidad = Number(document.getElementById('cantidad')?.value) || 0;
        const txtTotal = document.getElementById('total');

        if (!jugueteCodigo) {
            if (txtTotal) txtTotal.value = '0.00';
            return;
        }

        const juguete = this.jugueteRepo.todos().find(j => j.codigo === jugueteCodigo);
        if (juguete && txtTotal) {
            const total = juguete.precio * cantidad;
            txtTotal.value = total.toFixed(2);
        }
    }

    inicializarFormulario() {
        const txtCodigo = document.getElementById('codigoVenta');
        const txtFecha = document.getElementById('fecha');
        const selectVendedor = document.getElementById('vendedor');
        const selectJuguete = document.getElementById('juguete');
        const txtCantidad = document.getElementById('cantidad');
        const txtTotal = document.getElementById('total');
        const form = document.getElementById('form-venta') || document.querySelector('form');

        if (form) UIService.limpiarErrores(form);

        if (txtCodigo) txtCodigo.value = this.generarSiguienteCodigo(); 
        if (txtFecha) txtFecha.value = new Date().toISOString().split('T')[0];
        if (selectVendedor) selectVendedor.selectedIndex = 0;
        if (selectJuguete) selectJuguete.selectedIndex = 0;
        if (txtCantidad) txtCantidad.value = '1';
        if (txtTotal) txtTotal.value = '0.00';

        this.calcularTotal();
        this.listar(); // Recarga la lista completa por si había filtro activo
    }

    validarFecha() {
        const txtFecha = document.getElementById('fecha');
        if (!txtFecha?.value) {
            UIService.marcarInvalido(txtFecha, '❌ Seleccione una fecha válida.');
            return false;
        } else {
            UIService.marcarValido(txtFecha, '✅ Fecha correcta.');
            return true;
        }
    }

    validarVendedor() {
        const selectVendedor = document.getElementById('vendedor');
        if (!selectVendedor?.value) {
            UIService.marcarInvalido(selectVendedor, '❌ Debe seleccionar un vendedor.');
            return false;
        } else {
            UIService.marcarValido(selectVendedor, '✅ Vendedor seleccionado.');
            return true;
        }
    }

    validarJuguete() {
        const selectJuguete = document.getElementById('juguete');
        if (!selectJuguete?.value) {
            UIService.marcarInvalido(selectJuguete, '❌ Debe seleccionar un juguete.');
            return false;
        } else {
            UIService.marcarValido(selectJuguete, '✅ Juguete seleccionado.');
            return true;
        }
    }

    validarCantidad() {
        const txtCantidad = document.getElementById('cantidad');
        const cantidad = Number(txtCantidad?.value);
        if (txtCantidad?.value === '' || isNaN(cantidad) || cantidad < 1) {
            UIService.marcarInvalido(txtCantidad, '❌ La cantidad debe ser al menos 1.');
            return false;
        } else {
            UIService.marcarValido(txtCantidad, '✅ Cantidad correcta.');
            return true;
        }
    }

    agregar() {
        const fValida = this.validarFecha();
        const vValido = this.validarVendedor();
        const jValido = this.validarJuguete();
        const cValida = this.validarCantidad();

        if (!fValida || !vValido || !jValido || !cValida) {
            UIService.mostrarNotificacion('Por favor, corrija los errores en el formulario.', 'danger');
            return;
        }

        const codigoVenta = this.generarSiguienteCodigo();
        const fecha = document.getElementById('fecha').value;
        const vendedorCodigo = document.getElementById('vendedor').value;
        const jugueteCodigo = document.getElementById('juguete').value;
        const cantidad = Number(document.getElementById('cantidad').value);

        const vendedor = this.vendedorRepo.todos().find(v => v.codigo === vendedorCodigo);
        const juguete = this.jugueteRepo.todos().find(j => j.codigo === jugueteCodigo);

        if (juguete.stock < cantidad) {
            UIService.mostrarNotificacion(`Stock insuficiente. Disponible: ${juguete.stock}`, 'danger');
            UIService.marcarInvalido(document.getElementById('cantidad'), '❌ Stock insuficiente');
            return;
        }

        const venta = new Venta(codigoVenta, fecha, vendedor, juguete, cantidad);
        
        juguete.stock -= cantidad;
        this.jugueteRepo.guardar(juguete);
        this.ventaRepo.guardar(venta);
        
        UIService.mostrarNotificacion('¡Venta registrada con éxito!', 'success');
        this.cargarSelects(); 
        this.inicializarFormulario();
    }

    seleccionar() {
        const codigo = document.getElementById('lista-ventas')?.value;
        const venta = this.ventaRepo.todos().find(v => String(v.codigo) === String(codigo));

        if (venta) {
            document.getElementById('codigoVenta').value = venta.codigo;
            document.getElementById('fecha').value = venta.fecha;
            document.getElementById('vendedor').value = venta.vendedor?.codigo || '';
            document.getElementById('juguete').value = venta.juguete?.codigo || '';
            document.getElementById('cantidad').value = venta.cantidad;
            
            this.calcularTotal();
            const form = document.querySelector('form');
            if (form) UIService.limpiarErrores(form);

            this.validarFecha();
            this.validarVendedor();
            this.validarJuguete();
            this.validarCantidad();
        }
    }

    modificar() {
        const fValida = this.validarFecha();
        const vValido = this.validarVendedor();
        const jValido = this.validarJuguete();
        const cValida = this.validarCantidad();

        if (!fValida || !vValido || !jValido || !cValida) {
            UIService.mostrarNotificacion('Por favor, corrija los errores antes de modificar.', 'danger');
            return;
        }

        const codigoVenta = document.getElementById('codigoVenta').value;
        const fecha = document.getElementById('fecha').value;
        const vendedorCodigo = document.getElementById('vendedor').value;
        const jugueteCodigo = document.getElementById('juguete').value;
        const cantidad = Number(document.getElementById('cantidad').value);

        const ventaExistente = this.ventaRepo.todos().find(v => String(v.codigo) === String(codigoVenta));
        if (!ventaExistente) {
            UIService.mostrarNotificacion('Debe seleccionar una venta de la lista para modificar.', 'warning');
            return;
        }

        const vendedor = this.vendedorRepo.todos().find(v => v.codigo === vendedorCodigo);
        const jugueteNuevo = this.jugueteRepo.todos().find(j => j.codigo === jugueteCodigo);
        const jugueteAntiguo = this.jugueteRepo.todos().find(j => j.codigo === ventaExistente.juguete?.codigo);

        if (jugueteAntiguo) {
            jugueteAntiguo.stock += Number(ventaExistente.cantidad);
            if (jugueteAntiguo.codigo !== jugueteNuevo.codigo) {
                this.jugueteRepo.guardar(jugueteAntiguo);
            }
        }

        if (jugueteNuevo.stock < cantidad) {
            UIService.mostrarNotificacion(`Stock insuficiente. Disponible: ${jugueteNuevo.stock}`, 'danger');
            UIService.marcarInvalido(document.getElementById('cantidad'), '❌ Stock insuficiente');
            return;
        }

        jugueteNuevo.stock -= cantidad;
        this.jugueteRepo.guardar(jugueteNuevo);

        const ventaActualizada = new Venta(codigoVenta, fecha, vendedor, jugueteNuevo, cantidad);
        this.ventaRepo.guardar(ventaActualizada);

        UIService.mostrarNotificacion('¡Venta modificada con éxito!', 'success');
        this.cargarSelects();
        this.inicializarFormulario();
    }

    eliminar() {
        const codigo = document.getElementById('lista-ventas')?.value;
        if (!codigo) {
            UIService.mostrarNotificacion('Debe seleccionar una venta para eliminar.', 'warning');
            return;
        }

        const venta = this.ventaRepo.todos().find(v => String(v.codigo) === String(codigo));
        if (venta && venta.juguete) {
            const juguete = this.jugueteRepo.todos().find(j => j.codigo === venta.juguete.codigo);
            if (juguete) {
                juguete.stock += Number(venta.cantidad);
                this.jugueteRepo.guardar(juguete);
            }
        }

        this.ventaRepo.eliminar(codigo);
        UIService.mostrarNotificacion('¡Venta eliminada correctamente!', 'success');
        this.cargarSelects();
        this.inicializarFormulario();
    }

    listar(ventasFiltradas = null) {
        const lista = document.getElementById('lista-ventas');
        if (!lista) return;
        lista.innerHTML = '';
        
        const datos = ventasFiltradas || this.ventaRepo.todos();
        for (let venta of datos) {
            let vendedorNombre = venta.vendedor?.nombre || 'Desconocido';
            let jugueteNombre = venta.juguete?.nombre || 'Desconocido';
            let total = venta.total || (venta.juguete?.precio * venta.cantidad) || 0;
            let texto = `Venta #${venta.codigo} | ${venta.fecha} - ${vendedorNombre} - ${jugueteNombre} (Cant: ${venta.cantidad}) - Total: $${total}`;
            lista.add(new Option(texto, venta.codigo));
        }
    }

    filtrarLista(filtro) {
        const texto = filtro.toLowerCase().trim();
        const todos = this.ventaRepo.todos();
        
        const filtrados = todos.filter(venta => {
            let vendedorNombre = venta.vendedor?.nombre || '';
            let jugueteNombre = venta.juguete?.nombre || '';
            let total = String(venta.total || (venta.juguete?.precio * venta.cantidad) || 0);

            return (
                String(venta.codigo).toLowerCase().includes(texto) ||
                String(venta.fecha).toLowerCase().includes(texto) ||
                vendedorNombre.toLowerCase().includes(texto) ||
                jugueteNombre.toLowerCase().includes(texto) ||
                String(venta.cantidad).toLowerCase().includes(texto) ||
                total.toLowerCase().includes(texto)
            );
        });

        this.listar(filtrados);
    }
}