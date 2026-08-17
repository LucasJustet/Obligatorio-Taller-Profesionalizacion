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
        
     
        const inputCedula = document.getElementById('cedula');
        if (inputCedula) {
            inputCedula.addEventListener('input', (e) => {
                this.aplicarFormatoCedula(e);
                this.validarCedula();
            });
        }
        document.getElementById('buscador-vendedores')?.addEventListener('input', (e) => this.filtrarLista(e.target.value));

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
    }

    listar(vendedoresFiltrados = null) {
        const lista = document.getElementById('lista-vendedores');
        if (!lista) return;
        lista.innerHTML = '';
        
        const datos = vendedoresFiltrados || this.repo.todos();
        for (let vendedor of datos) {
            let texto = `${vendedor.codigo} - ${vendedor.nombre} - CI: ${vendedor.cedula}`;
            lista.add(new Option(texto, vendedor.codigo));
        }
    }

    filtrarLista(filtro) {
        const texto = filtro.toLowerCase().trim();
        const todos = this.repo.todos();
        
        const filtrados = todos.filter(v => 
            v.codigo.toLowerCase().includes(texto) || 
            v.nombre.toLowerCase().includes(texto) || 
            v.cedula.toLowerCase().includes(texto)
        );

        this.listar(filtrados);
    }
}