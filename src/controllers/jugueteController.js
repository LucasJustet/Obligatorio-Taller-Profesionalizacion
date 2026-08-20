import { Juguete } from '../models/juguete.js';
import { LocalStorageRepository } from '../repository/LocalStorageRepository.js';
import { UIService } from '../services/ui.js';

export class JugueteController {
    constructor() {
        this.repo = new LocalStorageRepository('juguetes');
        this.init();
    }

    init() {
        document.getElementById('btn-agregar')?.addEventListener('click', () => this.agregar());
        document.getElementById('btn-modificar')?.addEventListener('click', () => this.modificar());
        document.getElementById('btn-eliminar')?.addEventListener('click', () => this.eliminar());
        document.getElementById('btn-limpiar')?.addEventListener('click', () => this.inicializarFormulario());
        document.getElementById('codigo')?.addEventListener('input', () => this.validarCodigo());
        document.getElementById('nombre')?.addEventListener('input', () => this.validarNombre());
        document.getElementById('precio')?.addEventListener('input', () => this.validarPrecio());
        document.getElementById('stock')?.addEventListener('input', () => this.validarStock());
        document.getElementById('buscador')?.addEventListener('input', (e) => this.filtrarLista(e.target.value));
        document.getElementById('tabla-juguetes-body')?.addEventListener('click', (e) => {
            const btnEditar = e.target.closest('.btn-editar-fila');
            const btnEliminar = e.target.closest('.btn-eliminar-fila');

            if (btnEditar) {
                const codigo = btnEditar.dataset.codigo;
                this.seleccionarPorCodigo(codigo);
            }

            if (btnEliminar) {
                const codigo = btnEliminar.dataset.codigo;
                this.eliminarPorCodigo(codigo);
            }
        });

        this.inicializarFormulario();
        this.listar();
    }

    inicializarFormulario() {
        const txtCodigo = document.getElementById('codigo');
        const txtNombre = document.getElementById('nombre');
        const txtPrecio = document.getElementById('precio');
        const txtStock = document.getElementById('stock');
        const buscador = document.getElementById('buscador');
        const btnModificar = document.getElementById('btn-modificar');
        const btnEliminar = document.getElementById('btn-eliminar');
        const btnAgregar = document.getElementById('btn-agregar');
        const form = document.getElementById('form-juguete') || document.querySelector('form');

        if (form) UIService.limpiarErrores(form);
        if (txtCodigo) { txtCodigo.value = ''; txtCodigo.disabled = false; txtCodigo.focus(); }
        if (txtNombre) txtNombre.value = '';
        if (txtPrecio) txtPrecio.value = '';
        if (txtStock) txtStock.value = '';
        if (buscador) buscador.value = '';
        if (btnModificar) btnModificar.disabled = true;
        if (btnEliminar) btnEliminar.disabled = true;
        if (btnAgregar) btnAgregar.disabled = false;

        this.listar();
    }

    validarCodigo() {
        const txtCodigo = document.getElementById('codigo');
        const valor = txtCodigo?.value.trim();
        if (!valor) {
            UIService.marcarInvalido(txtCodigo, '❌ El código es obligatorio.');
            return false;
        } else {
            UIService.marcarValido(txtCodigo, '✅ ¡Código correcto!');
            return true;
        }
    }

    validarNombre() {
        const txtNombre = document.getElementById('nombre');
        const valor = txtNombre?.value.trim();
        
        if (!valor || /^\d+$/.test(valor)) {
            UIService.marcarInvalido(txtNombre, '❌ El nombre no puede ser solo números ni estar vacío.');
            return false;
        } else {
            UIService.marcarValido(txtNombre, '✅ ¡Nombre correcto!');
            return true;
        }
    }

    validarPrecio() {
        const txtPrecio = document.getElementById('precio');
        const valor = Number(txtPrecio?.value);
        if (txtPrecio?.value === '' || isNaN(valor) || valor < 0) {
            UIService.marcarInvalido(txtPrecio, '❌ Precio no válido.');
            return false;
        } else {
            UIService.marcarValido(txtPrecio, '✅ Precio correcto.');
            return true;
        }
    }

    validarStock() {
        const txtStock = document.getElementById('stock');
        const valor = Number(txtStock?.value);
        if (txtStock?.value === '' || isNaN(valor) || valor < 0) {
            UIService.marcarInvalido(txtStock, '❌ Stock no válido.');
            return false;
        } else {
            UIService.marcarValido(txtStock, '✅ Stock correcto.');
            return true;
        }
    }

    agregar() {
        const cValido = this.validarCodigo();
        const nValido = this.validarNombre();
        const pValido = this.validarPrecio();
        const sValido = this.validarStock();

        if (!cValido || !nValido || !pValido || !sValido) {
            UIService.mostrarNotificacion('Por favor, corrija los errores en el formulario.', 'danger');
            return;
        }

        const codigo = document.getElementById('codigo').value;
        const nombre = document.getElementById('nombre').value;
        const precio = Number(document.getElementById('precio').value);
        const stock = Number(document.getElementById('stock').value);

        const juguete = new Juguete(codigo, nombre, precio, stock);
        const existente = this.repo.todos().find(j => j.codigo === juguete.codigo);
        if (existente) {
            UIService.mostrarNotificacion('Ya existe un juguete con ese código.', 'warning');
            UIService.marcarInvalido(document.getElementById('codigo'), '❌ Código duplicado');
            return;
        }

        this.repo.guardar(juguete);
        UIService.mostrarNotificacion('¡Juguete agregado con éxito!', 'success');
        this.inicializarFormulario();
    }

    seleccionarPorCodigo(codigo) {
        const juguete = this.repo.todos().find(j => j.codigo === codigo);

        if (juguete) {
            const txtCodigo = document.getElementById('codigo');
            const txtNombre = document.getElementById('nombre');
            const txtPrecio = document.getElementById('precio');
            const txtStock = document.getElementById('stock');
            const btnModificar = document.getElementById('btn-modificar');
            const btnEliminar = document.getElementById('btn-eliminar');
            const btnAgregar = document.getElementById('btn-agregar');

            if (txtCodigo) { txtCodigo.value = juguete.codigo; txtCodigo.disabled = true; }
            if (txtNombre) txtNombre.value = juguete.nombre;
            if (txtPrecio) txtPrecio.value = juguete.precio;
            if (txtStock) txtStock.value = juguete.stock;
            
            if (btnModificar) btnModificar.disabled = false;
            if (btnEliminar) btnEliminar.disabled = false;
            if (btnAgregar) btnAgregar.disabled = true;

            const form = document.querySelector('form');
            if (form) UIService.limpiarErrores(form);

            this.validarCodigo();
            this.validarNombre();
            this.validarPrecio();
            this.validarStock();
            
            txtNombre?.focus();
        }
    }

    modificar() {
        const cValido = this.validarCodigo();
        const nValido = this.validarNombre();
        const pValido = this.validarPrecio();
        const sValido = this.validarStock();

        if (!cValido || !nValido || !pValido || !sValido) {
            UIService.mostrarNotificacion('Por favor, corrija los errores antes de guardar.', 'danger');
            return;
        }

        const codigo = document.getElementById('codigo').value;
        const nombre = document.getElementById('nombre').value;
        const precio = Number(document.getElementById('precio').value);
        const stock = Number(document.getElementById('stock').value);

        const jugueteActualizado = new Juguete(codigo, nombre, precio, stock);
        this.repo.guardar(jugueteActualizado);
        
        UIService.mostrarNotificacion('¡Juguete modificado con éxito!', 'success');
        this.inicializarFormulario();
    }

    eliminar() {
        const codigo = document.getElementById('codigo')?.value;
        if (!codigo) {
            UIService.mostrarNotificacion('Debe seleccionar un juguete para eliminar.', 'warning');
            return;
        }
        this.eliminarPorCodigo(codigo);
    }

    eliminarPorCodigo(codigo) {
        if (confirm(`¿Está seguro de que desea eliminar el juguete ${codigo}?`)) {
            this.repo.eliminar(codigo);
            UIService.mostrarNotificacion('¡Juguete eliminado correctamente!', 'success');
            this.inicializarFormulario();
        }
    }

    listar(juguetesFiltrados = null) {
        const tbody = document.getElementById('tabla-juguetes-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const datos = juguetesFiltrados || this.repo.todos();
        
        if (datos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No hay juguetes registrados</td></tr>`;
            return;
        }

        for (let juguete of datos) {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td class="fw-bold text-secondary">${juguete.codigo}</td>
                <td>${juguete.nombre}</td>
                <td>$${juguete.precio}</td>
                <td><span class="badge ${juguete.stock > 0 ? 'bg-success' : 'bg-danger'}">${juguete.stock}</span></td>
                <td class="text-end">
                    <button type="button" class="btn btn-sm btn-outline-primary me-1 btn-editar-fila" data-codigo="${juguete.codigo}" title="Editar" aria-label="Editar juguete ${juguete.nombre}">
                        <i class="bi bi-pencil-fill" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-fila" data-codigo="${juguete.codigo}" title="Eliminar" aria-label="Eliminar juguete ${juguete.nombre}">
                        <i class="bi bi-trash-fill" aria-hidden="true"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        }
    }

    filtrarLista(filtro) {
        const texto = (filtro || '').toLowerCase().trim();
        const todos = this.repo.todos();
        
        const filtrados = todos.filter(j =>
            (j.codigo && j.codigo.toLowerCase().includes(texto)) ||
            (j.nombre && j.nombre.toLowerCase().includes(texto)) ||
            String(j.precio).toLowerCase().includes(texto) ||
            String(j.stock).toLowerCase().includes(texto)
        );

        this.listar(filtrados);
    }
}