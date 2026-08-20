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
        const ventas = this.ventaRepo.todos() || [];
        if (ventas.length === 0) return "1";
        const numeros = ventas.map(v => parseInt(v.codigo ?? v.id, 10)).filter(n => !isNaN(n));
        const maxNumero = numeros.length > 0 ? Math.max(...numeros) : 0;
        return String(maxNumero + 1);
    }

    cargarSelects() {
        const selectVendedor = document.getElementById('vendedor');
        const selectJuguete = document.getElementById('juguete');

        const vendedores = this.vendedorRepo.todos() || [];
        const juguetes = this.jugueteRepo.todos() || [];

        if (selectVendedor) {
            selectVendedor.innerHTML = '<option value="" selected disabled>Seleccione un vendedor...</option>';
            vendedores.forEach(v => {
                const idVendedor = String(v.codigo ?? v.id);
                selectVendedor.add(new Option(`${v.nombre} (Cédula: ${v.cedula || 'N/A'})`, idVendedor));
            });
        }

        if (selectJuguete) {
            selectJuguete.innerHTML = '<option value="" selected disabled>Seleccione un juguete...</option>';
            juguetes.forEach(j => {
                const idJuguete = String(j.codigo ?? j.id);
                selectJuguete.add(new Option(`${j.nombre} - $${j.precio} (Stock: ${j.stock})`, idJuguete));
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

        const juguetes = this.jugueteRepo.todos() || [];
        const juguete = juguetes.find(j => String(j.codigo ?? j.id) === String(jugueteCodigo));
        
        if (juguete && txtTotal) {
            const total = Number(juguete.precio) * cantidad;
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
        const form = document.getElementById('form-venta');

        if (form) UIService.limpiarErrores(form);

        if (txtCodigo) txtCodigo.value = this.generarSiguienteCodigo(); 
        if (txtFecha) txtFecha.value = new Date().toISOString().split('T')[0];
        if (selectVendedor) selectVendedor.selectedIndex = 0;
        if (selectJuguete) selectJuguete.selectedIndex = 0;
        if (txtCantidad) txtCantidad.value = '1';
        if (txtTotal) txtTotal.value = '0.00';

        this.calcularTotal();
        this.listar();
    }

    validarFecha() {
        const txtFecha = document.getElementById('fecha');
        if (!txtFecha?.value?.trim()) {
            UIService.marcarInvalido(txtFecha, '❌ Seleccione una fecha válida.');
            return false;
        }
        UIService.marcarValido(txtFecha, '✅ Fecha correcta.');
        return true;
    }

    validarVendedor() {
        const selectVendedor = document.getElementById('vendedor');
        const val = selectVendedor?.value?.trim();
        if (!val) {
            UIService.marcarInvalido(selectVendedor, '❌ Debe seleccionar un vendedor.');
            return false;
        }
        UIService.marcarValido(selectVendedor, '✅ Vendedor seleccionado.');
        return true;
    }

    validarJuguete() {
        const selectJuguete = document.getElementById('juguete');
        const val = selectJuguete?.value?.trim();
        if (!val) {
            UIService.marcarInvalido(selectJuguete, '❌ Debe seleccionar un juguete.');
            return false;
        }
        UIService.marcarValido(selectJuguete, '✅ Juguete seleccionado.');
        return true;
    }

    validarCantidad() {
        const txtCantidad = document.getElementById('cantidad');
        const cantidad = Number(txtCantidad?.value);
        if (txtCantidad?.value === '' || isNaN(cantidad) || cantidad < 1) {
            UIService.marcarInvalido(txtCantidad, '❌ La cantidad debe ser al menos 1.');
            return false;
        }
        UIService.marcarValido(txtCantidad, '✅ Cantidad correcta.');
        return true;
    }

    agregar() {
        const fValida = this.validarFecha();
        const vValido = this.validarVendedor();
        const jValido = this.validarJuguete();
        const cValida = this.validarCantidad();

        if (!fValida || !vValido || !jValido || !cValida) {
            UIService.mostrarNotificacion('Por favor, complete todos los campos obligatorios.', 'danger');
            return;
        }

        const codigoVenta = this.generarSiguienteCodigo();
        const fecha = document.getElementById('fecha').value;
        const vendedorCodigo = document.getElementById('vendedor').value;
        const jugueteCodigo = document.getElementById('juguete').value;
        const cantidad = Number(document.getElementById('cantidad').value);

        const vendedor = (this.vendedorRepo.todos() || []).find(v => String(v.codigo ?? v.id) === String(vendedorCodigo));
        const juguete = (this.jugueteRepo.todos() || []).find(j => String(j.codigo ?? j.id) === String(jugueteCodigo));

        if (!vendedor || !juguete) {
            UIService.mostrarNotificacion('El vendedor o el juguete seleccionado no existen.', 'danger');
            return;
        }

        if (Number(juguete.stock) < cantidad) {
            UIService.mostrarNotificacion(`Stock insuficiente. Disponible: ${juguete.stock}`, 'danger');
            UIService.marcarInvalido(document.getElementById('cantidad'), '❌ Stock insuficiente');
            return;
        }

        const venta = new Venta(codigoVenta, fecha, vendedor, juguete, cantidad);
        
        juguete.stock = Number(juguete.stock) - cantidad;
        this.jugueteRepo.guardar(juguete);
        this.ventaRepo.guardar(venta);
        
        UIService.mostrarNotificacion('¡Venta registrada con éxito!', 'success');
        this.cargarSelects(); 
        this.inicializarFormulario();
    }

    cargarParaEditar(codigo) {
        const venta = (this.ventaRepo.todos() || []).find(v => String(v.codigo ?? v.id) === String(codigo));

        if (venta) {
            document.getElementById('codigoVenta').value = venta.codigo ?? venta.id;
            document.getElementById('fecha').value = venta.fecha;
            document.getElementById('vendedor').value = venta.vendedor?.codigo ?? venta.vendedor?.id ?? '';
            document.getElementById('juguete').value = venta.juguete?.codigo ?? venta.juguete?.id ?? '';
            document.getElementById('cantidad').value = venta.cantidad;
            
            this.calcularTotal();
            const form = document.getElementById('form-venta');
            if (form) UIService.limpiarErrores(form);

            this.validarFecha();
            this.validarVendedor();
            this.validarJuguete();
            this.validarCantidad();
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

  modificar() {
        const fValida = this.validarFecha();
        const vValido = this.validarVendedor();
        const jValido = this.validarJuguete();
        const cValida = this.validarCantidad();

        if (!fValida || !vValido || !jValido || !cValida) {
            UIService.mostrarNotificacion('Por favor, corrija los errores antes de guardar.', 'danger');
            return;
        }

        const codigoVenta = document.getElementById('codigoVenta').value;
        const fecha = document.getElementById('fecha').value;
        const vendedorCodigo = document.getElementById('vendedor').value;
        const jugueteCodigo = document.getElementById('juguete').value;
        const nuevaCantidad = Number(document.getElementById('cantidad').value);
        const ventaExistente = (this.ventaRepo.todos() || []).find(v => String(v.codigo ?? v.id) === String(codigoVenta));
        if (!ventaExistente) {
            UIService.mostrarNotificacion('No se encontró la venta a modificar.', 'danger');
            return;
        }

        const vendedor = (this.vendedorRepo.todos() || []).find(v => String(v.codigo ?? v.id) === String(vendedorCodigo));
        const jugueteAntiguoId = String(ventaExistente.juguete?.codigo ?? ventaExistente.juguete?.id);
        const cantidadAntigua = Number(ventaExistente.cantidad);
        let juguetes = this.jugueteRepo.todos() || [];
        const jugueteAntiguo = juguetes.find(j => String(j.codigo ?? j.id) === jugueteAntiguoId);
        const jugueteNuevo = juguetes.find(j => String(j.codigo ?? j.id) === String(jugueteCodigo));

        if (!vendedor || !jugueteNuevo) {
            UIService.mostrarNotificacion('El vendedor o el juguete seleccionado no existen.', 'danger');
            return;
        }

      
        if (jugueteAntiguo) {
            jugueteAntiguo.stock = Number(jugueteAntiguo.stock) + cantidadAntigua;
        }

        if (Number(jugueteNuevo.stock) < nuevaCantidad) {
            UIService.mostrarNotificacion(`Stock insuficiente. Disponible: ${jugueteNuevo.stock}`, 'danger');
          
            if (jugueteAntiguo) {
                jugueteAntiguo.stock = Number(jugueteAntiguo.stock) - cantidadAntigua;
                this.jugueteRepo.guardar(jugueteAntiguo);
            }
            return;
        }

        if (jugueteAntiguo && jugueteAntiguoId === String(jugueteNuevo.codigo ?? jugueteNuevo.id)) {
          
            jugueteAntiguo.stock = Number(jugueteAntiguo.stock) - nuevaCantidad;
            this.jugueteRepo.guardar(jugueteAntiguo);
        } else {
        
            if (jugueteAntiguo) this.jugueteRepo.guardar(jugueteAntiguo);
            jugueteNuevo.stock = Number(jugueteNuevo.stock) - nuevaCantidad;
            this.jugueteRepo.guardar(jugueteNuevo);
        }
        const ventaActualizada = new Venta(codigoVenta, fecha, vendedor, jugueteNuevo, nuevaCantidad);
        this.ventaRepo.guardar(ventaActualizada);

        UIService.mostrarNotificacion('¡Cambios guardados con éxito!', 'success');
        this.cargarSelects();
        this.inicializarFormulario();
    }

    eliminar(codigo) {
        if (!codigo) return;
        
        if (!confirm('¿Está seguro de que desea eliminar esta venta?')) return;

        const venta = (this.ventaRepo.todos() || []).find(v => String(v.codigo ?? v.id) === String(codigo));
        if (venta && venta.juguete) {
            const juguete = (this.jugueteRepo.todos() || []).find(j => String(j.codigo ?? j.id) === String(venta.juguete.codigo ?? venta.juguete.id));
            if (juguete) {
                juguete.stock = Number(juguete.stock) + Number(venta.cantidad);
                this.jugueteRepo.guardar(juguete);
            }
        }

        this.ventaRepo.eliminar(codigo);
        UIService.mostrarNotificacion('¡Venta eliminada correctamente!', 'success');
        this.cargarSelects();
        this.inicializarFormulario();
    }

    listar(ventasFiltradas = null) {
        const tbody = document.getElementById('tabla-ventas-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const datos = ventasFiltradas || this.ventaRepo.todos() || [];
        
        if (datos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No hay ventas registradas.</td></tr>`;
            return;
        }

        datos.forEach(venta => {
            let vendedorNombre = venta.vendedor?.nombre || 'Desconocido';
            let jugueteNombre = venta.juguete?.nombre || 'Desconocido';
            let total = venta.total || (venta.juguete?.precio * venta.cantidad) || 0;
            let cod = String(venta.codigo ?? venta.id);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="fw-bold ps-3">${cod}</td>
                <td>${venta.fecha}</td>
                <td>${vendedorNombre}</td>
                <td>${jugueteNombre}</td>
                <td>${venta.cantidad}</td>
                <td class="fw-bold text-success">$${Number(total).toFixed(2)}</td>
                <td class="text-center pe-3">
                   <button type="button" class="btn btn-sm btn-outline-primary me-1 btn-editar" title="Editar venta" data-codigo="${cod}" aria-label="Editar venta ${cod}">
                   <i class="bi bi-pencil-fill" aria-hidden="true"></i>
                   </button>
                    <button type="button" class="btn btn-outline-danger btn-sm btn-borrar" title="Eliminar venta" data-codigo="${cod}">
                        <i class="bi bi-trash" aria-hidden="true"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });

      
        tbody.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const codigo = e.currentTarget.getAttribute('data-codigo');
                this.cargarParaEditar(codigo);
            });
        });

        tbody.querySelectorAll('.btn-borrar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const codigo = e.currentTarget.getAttribute('data-codigo');
                this.eliminar(codigo);
            });
        });
    }

    filtrarLista(filtro) {
        const texto = filtro.toLowerCase().trim();
        const todos = this.ventaRepo.todos() || [];
        
        const filtrados = todos.filter(venta => {
            let vendedorNombre = venta.vendedor?.nombre || '';
            let jugueteNombre = venta.juguete?.nombre || '';
            let total = String(venta.total || (venta.juguete?.precio * venta.cantidad) || 0);
            let cod = String(venta.codigo ?? venta.id);

            return (
                cod.toLowerCase().includes(texto) ||
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