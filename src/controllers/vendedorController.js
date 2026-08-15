import { Vendedor } from '../models/vendedor.js';
import { LocalStorageRepository } from '../repository/LocalStorageRepository.js';
import { UIService } from '../services/ui.js';

export class VendedorController {
    constructor() {
        this.repo = new LocalStorageRepository('vendedores');
        this.init();
    }

    init() {
        document.getElementById('btn-agregar')?.addEventListener('click', () => this.agregar());
        document.getElementById('btn-modificar')?.addEventListener('click', () => this.modificar());
        document.getElementById('btn-eliminar')?.addEventListener('click', () => this.eliminar());
        document.getElementById('btn-limpiar')?.addEventListener('click', () => this.inicializarFormulario());
        document.getElementById('lista-vendedores')?.addEventListener('change', () => this.seleccionar());

        // --- VALIDACIÓN EN TIEMPO REAL ---
        document.getElementById('codigo')?.addEventListener('input', () => this.validarCodigo());
        document.getElementById('nombre')?.addEventListener('input', () => this.validarNombre());
        document.getElementById('cedula')?.addEventListener('input', () => this.validarCedula());

        this.inicializarFormulario();
        this.listar();
    }

    inicializarFormulario() {
        const txtCodigo = document.getElementById('codigo');
        const txtNombre = document.getElementById('nombre');
        const txtCedula = document.getElementById('cedula');
        const form = document.getElementById('form-vendedor') || document.querySelector('form');

        if (form) UIService.limpiarErrores(form);

        if (txtCodigo) { txtCodigo.value = ''; txtCodigo.disabled = false; txtCodigo.focus(); }
        if (txtNombre) txtNombre.value = '';
        if (txtCedula) txtCedula.value = '';
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
        
        // No puede estar vacío y NO puede ser puramente numérico
        if (!valor || /^\d+$/.test(valor)) {
            UIService.marcarInvalido(txtNombre, '❌ El nombre no puede ser solo números ni estar vacío.');
            return false;
        } else {
            UIService.marcarValido(txtNombre, '✅ Nombre correcto.');
            return true;
        }
    }

    validarCedula() {
        const txtCedula = document.getElementById('cedula');
        const valor = txtCedula?.value.trim();
        const regexCedula = /^\d{8}$/; // Exactamente 8 dígitos numéricos

        if (!regexCedula.test(valor)) {
            UIService.marcarInvalido(txtCedula, '❌ La cédula debe tener exactamente 8 dígitos numéricos.');
            return false;
        } else {
            UIService.marcarValido(txtCedula, '✅ Cédula válida.');
            return true;
        }
    }

    agregar() {
        const cValido = this.validarCodigo();
        const nValido = this.validarNombre();
        const ceValido = this.validarCedula();

        if (!cValido || !nValido || !ceValido) {
            UIService.mostrarNotificacion('Por favor, corrija los errores en el formulario.', 'danger');
            return;
        }

        const codigo = document.getElementById('codigo').value;
        const nombre = document.getElementById('nombre').value;
        const cedula = document.getElementById('cedula').value;

        const vendedor = new Vendedor(codigo, nombre, cedula);
        const existente = this.repo.todos().find(v => v.codigo === vendedor.codigo);
        if (existente) {
            UIService.mostrarNotificacion('Ya existe un vendedor con ese código.', 'warning');
            UIService.marcarInvalido(document.getElementById('codigo'), '❌ Código duplicado');
            return;
        }

        this.repo.guardar(vendedor);
        UIService.mostrarNotificacion('¡Vendedor agregado con éxito!', 'success');
        this.inicializarFormulario();
        this.listar();
    }

    seleccionar() {
        const codigo = document.getElementById('lista-vendedores')?.value;
        const vendedor = this.repo.todos().find(v => v.codigo === codigo);

        if (vendedor) {
            const txtCodigo = document.getElementById('codigo');
            const txtNombre = document.getElementById('nombre');
            const txtCedula = document.getElementById('cedula');

            if (txtCodigo) { txtCodigo.value = vendedor.codigo; txtCodigo.disabled = true; }
            if (txtNombre) txtNombre.value = vendedor.nombre;
            if (txtCedula) txtCedula.value = vendedor.cedula;

            const form = document.querySelector('form');
            if (form) UIService.limpiarErrores(form);

            this.validarCodigo();
            this.validarNombre();
            this.validarCedula();
        }
    }

    modificar() {
        const cValido = this.validarCodigo();
        const nValido = this.validarNombre();
        const ceValido = this.validarCedula();

        if (!cValido || !nValido || !ceValido) {
            UIService.mostrarNotificacion('Por favor, corrija los errores antes de modificar.', 'danger');
            return;
        }

        const codigo = document.getElementById('codigo').value;
        const nombre = document.getElementById('nombre').value;
        const cedula = document.getElementById('cedula').value;

        const vendedorActualizado = new Vendedor(codigo, nombre, cedula);
        this.repo.guardar(vendedorActualizado);
        
        UIService.mostrarNotificacion('¡Vendedor modificado con éxito!', 'success');
        this.inicializarFormulario();
        this.listar();
    }

    eliminar() {
        const codigo = document.getElementById('lista-vendedores')?.value;
        if (!codigo) {
            UIService.mostrarNotificacion('Debe seleccionar un vendedor para eliminar.', 'warning');
            return;
        }
        this.repo.eliminar(codigo);
        UIService.mostrarNotificacion('¡Vendedor eliminado correctamente!', 'success');
        this.inicializarFormulario();
        this.listar();
    }

    listar() {
        const lista = document.getElementById('lista-vendedores');
        if (!lista) return;
        lista.innerHTML = '';
        for (let vendedor of this.repo.todos()) {
            let texto = `${vendedor.codigo} - ${vendedor.nombre} - CI: ${vendedor.cedula}`;
            lista.add(new Option(texto, vendedor.codigo));
        }
    }
}