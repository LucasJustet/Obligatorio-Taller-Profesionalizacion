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
        document.getElementById('lista-juguetes')?.addEventListener('change', () => this.seleccionar());

        document.getElementById('codigo')?.addEventListener('input', () => this.validarCodigo());
        document.getElementById('nombre')?.addEventListener('input', () => this.validarNombre());
        document.getElementById('precio')?.addEventListener('input', () => this.validarPrecio());
        document.getElementById('stock')?.addEventListener('input', () => this.validarStock());

        this.inicializarFormulario();
        this.listar();
    }

    inicializarFormulario() {
        const txtCodigo = document.getElementById('codigo');
        const txtNombre = document.getElementById('nombre');
        const txtPrecio = document.getElementById('precio');
        const txtStock = document.getElementById('stock');
        const form = document.getElementById('form-juguete') || document.querySelector('form');

        if (form) UIService.limpiarErrores(form);

        if (txtCodigo) { txtCodigo.value = ''; txtCodigo.disabled = false; txtCodigo.focus(); }
        if (txtNombre) txtNombre.value = '';
        if (txtPrecio) txtPrecio.value = '';
        if (txtStock) txtStock.value = '';
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
        
        // No vacío y no compuesto únicamente por números
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
        this.listar();
    }

    seleccionar() {
        const codigo = document.getElementById('lista-juguetes')?.value;
        const juguete = this.repo.todos().find(j => j.codigo === codigo);

        if (juguete) {
            const txtCodigo = document.getElementById('codigo');
            const txtNombre = document.getElementById('nombre');
            const txtPrecio = document.getElementById('precio');
            const txtStock = document.getElementById('stock');

            if (txtCodigo) { txtCodigo.value = juguete.codigo; txtCodigo.disabled = true; }
            if (txtNombre) txtNombre.value = juguete.nombre;
            if (txtPrecio) txtPrecio.value = juguete.precio;
            if (txtStock) txtStock.value = juguete.stock;
            
            const form = document.querySelector('form');
            if (form) UIService.limpiarErrores(form);

            this.validarCodigo();
            this.validarNombre();
            this.validarPrecio();
            this.validarStock();
        }
    }

    modificar() {
        const cValido = this.validarCodigo();
        const nValido = this.validarNombre();
        const pValido = this.validarPrecio();
        const sValido = this.validarStock();

        if (!cValido || !nValido || !pValido || !sValido) {
            UIService.mostrarNotificacion('Por favor, corrija los errores antes de modificar.', 'danger');
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
        this.listar();
    }

    eliminar() {
        const codigo = document.getElementById('lista-juguetes')?.value;
        if (!codigo) {
            UIService.mostrarNotificacion('Debe seleccionar un juguete para eliminar.', 'warning');
            return;
        }
        this.repo.eliminar(codigo);
        UIService.mostrarNotificacion('¡Juguete eliminado correctamente!', 'success');
        this.inicializarFormulario();
        this.listar();
    }

    listar() {
        const lista = document.getElementById('lista-juguetes');
        if (!lista) return;
        lista.innerHTML = '';
        for (let juguete of this.repo.todos()) {
            let texto = `${juguete.codigo} - ${juguete.nombre} - $${juguete.precio} - Stock: ${juguete.stock}`;
            lista.add(new Option(texto, juguete.codigo));
        }
    }
}