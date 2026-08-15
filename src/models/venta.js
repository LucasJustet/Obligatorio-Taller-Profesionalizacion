export class Venta {
    constructor(codigo, fecha, vendedor, juguete, cantidad) {
        this.codigo = codigo ? codigo.trim() : "";
        this.fecha = fecha;
        this.vendedor = vendedor; 
        this.juguete = juguete;   
        this.cantidad = Number(cantidad) || 0;
        const precioUnitario = this.juguete && this.juguete.precio ? Number(this.juguete.precio) : 0;
        this.total = precioUnitario * this.cantidad;
    }

    esValida() {
        if (!this.codigo) {
            return { esValida: false, mensaje: 'El código de venta es obligatorio.' };
        }
        if (!this.fecha) {
            return { esValida: false, mensaje: 'La fecha es obligatoria.' };
        }
        if (!this.vendedor) {
            return { esValida: false, mensaje: 'Debe seleccionar un vendedor.' };
        }
        if (!this.juguete) {
            return { esValida: false, mensaje: 'Debe seleccionar un juguete.' };
        }
        if (this.cantidad <= 0) {
            return { esValida: false, mensaje: 'La cantidad debe ser mayor a 0.' };
        }
        if (this.juguete.stock !== undefined && this.juguete.stock < this.cantidad) {
            return { esValida: false, mensaje: `Stock insuficiente. Quedan ${this.juguete.stock} unidades.` };
        }

        return { esValida: true, mensaje: 'Venta válida.' };
    }
}