import { Vendedor } from '../models/vendedor.js';
import { LocalStorageRepository } from '../repository/LocalStorageRepository.js';
import { UIService } from '../services/ui.js';

export class VendedorController {
    constructor() {
        this.repo = new LocalStorageRepository('vendedores');
        this.guardando = false; 
        this.codigoEnEdicion = null;
        this.init();
    }

    init() {
        const form = document.getElementById('form-vendedor');
        if (form) {
            form.addEventListener('submit', (e) => e.preventDefault());
        }

        document.getElementById('btn-agregar')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.agregar();
        });
        document.getElementById('btn-modificar')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.modificar();
        });
        document.getElementById('btn-eliminar')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.eliminar();
        });
        document.getElementById('btn-limpiar')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.inicializarFormulario();
        });

        document.getElementById('codigo')?.addEventListener('input', () => this.validarCodigo());
        document.getElementById('nombre')?.addEventListener('input', () => this.validarNombre());

        const inputCedula = document.getElementById('cedula');
        if (inputCedula) {
            inputCedula.addEventListener('input', (e) => {
                this.aplicarFormatoCedula(e);
                this.validarCedula();
            });
        }

        document.getElementById('buscador-vendedores')?.addEventListener('input', (e) => this.filtrarLista(e.target.value));

        this.inicializarFormulario();
    }

    inicializarFormulario() {
        const txtCodigo = document.getElementById('codigo');
        const txtNombre = document.getElementById('nombre');
        const txtCedula = document.getElementById('cedula');
        const btnAgregar = document.getElementById('btn-agregar');
        const btnModificar = document.getElementById('btn-modificar');
        const btnEliminar = document.getElementById('btn-eliminar');
        const form = document.getElementById('form-vendedor') || document.querySelector('form');

        if (txtCodigo) { txtCodigo.value = ''; txtCodigo.disabled = false; }
        if (txtNombre) txtNombre.value = '';
        if (txtCedula) txtCedula.value = '';

        this.codigoEnEdicion = null;

        if (btnAgregar) btnAgregar.disabled = false;
        if (btnModificar) btnModificar.disabled = true;
        if (btnEliminar) btnEliminar.disabled = true;

        if (form && typeof UIService.limpiarErrores === 'function') {
            UIService.limpiarErrores(form);
        } else {
            [txtCodigo, txtNombre, txtCedula].forEach(input => {
                if (input) input.classList.remove('is-invalid', 'is-valid');
            });
        }

        this.listar(); 
    }

    validarCodigo() {
        const txtCodigo = document.getElementById('codigo');
        const valor = txtCodigo?.value.trim();
        if (!valor) {
            UIService.marcarInvalido(txtCodigo, '❌ El código es obligatorio.');
            return false;
        } else {
            UIService.marcarValido(txtCodigo, '✅ Código correcto.');
            return true;
        }
    }

    validarNombre() {
        const txtNombre = document.getElementById('nombre');
        const valor = txtNombre?.value.trim();
        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (!valor || !regexNombre.test(valor)) {
            UIService.marcarInvalido(txtNombre, '❌ El nombre solo debe contener letras y no puede estar vacío.');
            return false;
        } else {
            UIService.marcarValido(txtNombre, '✅ Nombre correcto.');
            return true;
        }
    }

    aplicarFormatoCedula(e) {
        let valor = e.target.value.replace(/\D/g, ''); 
        if (valor.length > 8) valor = valor.slice(0, 8); 

        let formateado = '';
        if (valor.length > 0) {
            if (valor.length <= 3) {
                formateado = valor;
            } else if (valor.length <= 6) {
                formateado = `${valor.slice(0, 1)}.${valor.slice(1)}`;
            } else if (valor.length <= 7) {
                formateado = `${valor.slice(0, 1)}.${valor.slice(1, 4)}.${valor.slice(4)}`;
            } else {
                formateado = `${valor.slice(0, 1)}.${valor.slice(1, 4)}.${valor.slice(4, 7)}-${valor.slice(7)}`;
            }
        }
        e.target.value = formateado;
    }

    validarCedula() {
        const txtCedula = document.getElementById('cedula');
        const valor = txtCedula?.value.trim();
        const regexCedula = /^\d\.\d{3}\.\d{3}-\d$/; 

        if (!regexCedula.test(valor)) {
            UIService.marcarInvalido(txtCedula, '❌ La cédula debe tener el formato 1.234.567-8.');
            return false;
        } else {
            UIService.marcarValido(txtCedula, '✅ Cédula válida.');
            return true;
        }
    }

    agregar() {
        if (this.guardando) return;
        this.guardando = true;

        const cValido = this.validarCodigo();
        const nValido = this.validarNombre();
        const ceValido = this.validarCedula();

        if (!cValido || !nValido || !ceValido) {
            UIService.mostrarNotificacion('Por favor, corrija los errores en el formulario.', 'danger');
            this.guardando = false;
            return;
        }

        const codigo = document.getElementById('codigo').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const cedula = document.getElementById('cedula').value.trim();

        const existente = this.repo.todos().find(v => v.codigo === codigo);
        if (existente) {
            UIService.mostrarNotificacion('Ya existe un vendedor con ese código.', 'warning');
            UIService.marcarInvalido(document.getElementById('codigo'), '❌ Código duplicado');
            this.guardando = false;
            return;
        }

        const vendedor = new Vendedor(codigo, nombre, cedula);
        this.repo.guardar(vendedor);

        UIService.mostrarNotificacion('¡Vendedor agregado con éxito!', 'success');
        this.inicializarFormulario();

        setTimeout(() => { this.guardando = false; }, 100);
    }

    seleccionar(codigo) {
        const vendedor = this.repo.todos().find(v => v.codigo === codigo);

        if (vendedor) {
            this.codigoEnEdicion = codigo;
            const txtCodigo = document.getElementById('codigo');
            const txtNombre = document.getElementById('nombre');
            const txtCedula = document.getElementById('cedula');
            const btnAgregar = document.getElementById('btn-agregar');
            const btnModificar = document.getElementById('btn-modificar');
            const btnEliminar = document.getElementById('btn-eliminar');

            if (txtCodigo) { txtCodigo.value = vendedor.codigo; txtCodigo.disabled = true; }
            if (txtNombre) txtNombre.value = vendedor.nombre;
            if (txtCedula) txtCedula.value = vendedor.cedula;

            if (btnAgregar) btnAgregar.disabled = true;
            if (btnModificar) btnModificar.disabled = false;
            if (btnEliminar) btnEliminar.disabled = false;

            const form = document.getElementById('form-vendedor') || document.querySelector('form');
            if (form && typeof UIService.limpiarErrores === 'function') {
                UIService.limpiarErrores(form);
            }

            this.validarCodigo();
            this.validarNombre();
            this.validarCedula();
            this.listar(); 
        }
    }

    modificar() {
        if (!this.codigoEnEdicion) {
            UIService.mostrarNotificacion('Debe seleccionar un vendedor para modificar.', 'warning');
            return;
        }

        const nValido = this.validarNombre();
        const ceValido = this.validarCedula();

        if (!nValido || !ceValido) {
            UIService.mostrarNotificacion('Por favor, corrija los errores antes de guardar.', 'danger');
            return;
        }

        const nombre = document.getElementById('nombre').value.trim();
        const cedula = document.getElementById('cedula').value.trim();

        const vendedorActualizado = new Vendedor(this.codigoEnEdicion, nombre, cedula);
        this.repo.guardar(vendedorActualizado);

        UIService.mostrarNotificacion('¡Vendedor modificado con éxito!', 'success');
        this.inicializarFormulario();
    }

    eliminar(codigoEliminar = null) {
        const codigo = codigoEliminar || this.codigoEnEdicion;
        if (!codigo) {
            UIService.mostrarNotificacion('Debe seleccionar un vendedor para eliminar.', 'warning');
            return;
        }

        if (confirm(`¿Está seguro de que desea eliminar el vendedor ${codigo}?`)) {
            this.repo.eliminar(codigo);
            UIService.mostrarNotificacion('¡Vendedor eliminado correctamente!', 'success');
            this.inicializarFormulario();
        }
    }

    listar(vendedoresFiltrados = null) {
        const tbody = document.getElementById('tabla-vendedores-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        const datos = vendedoresFiltrados || this.repo.todos();

        if (datos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No hay vendedores registrados.</td></tr>`;
            return;
        }

        datos.forEach(vendedor => {
            const tr = document.createElement('tr');
            if (this.codigoEnEdicion === vendedor.codigo) {
                tr.classList.add('table-primary');
            }

            tr.innerHTML = `
                <td class="fw-bold">${vendedor.codigo}</td>
                <td>${vendedor.nombre}</td>
                <td>${vendedor.cedula}</td>
                <td class="text-end pe-3">
                    <button type="button" class="btn btn-sm btn-outline-primary me-1 btn-editar-fila" data-codigo="${vendedor.codigo}" title="Editar" aria-label="Editar vendedor ${vendedor.nombre}">
                        <i class="bi bi-pencil-fill" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-item" data-codigo="${vendedor.codigo}" title="Eliminar vendedor" aria-label="Eliminar vendedor ${vendedor.nombre}">
                        <i class="bi bi-trash-fill" aria-hidden="true"></i>
                    </button>
                </td>
            `;

            tr.querySelector('.btn-editar-fila').addEventListener('click', () => this.seleccionar(vendedor.codigo));
            tr.querySelector('.btn-eliminar-item').addEventListener('click', () => this.eliminar(vendedor.codigo));

            tbody.appendChild(tr);
        });
    }

    filtrarLista(filtro) {
        const texto = (filtro || '').toLowerCase().trim();
        const todos = this.repo.todos();

        const filtrados = todos.filter(v => 
            (v.codigo && v.codigo.toLowerCase().includes(texto)) || 
            (v.nombre && v.nombre.toLowerCase().includes(texto)) || 
            (v.cedula && v.cedula.toLowerCase().includes(texto))
        );

        this.listar(filtrados);
    }
}