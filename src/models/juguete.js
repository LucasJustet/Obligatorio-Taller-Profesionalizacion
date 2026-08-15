export class Juguete {
    constructor(codigo, nombre, precio, stock, descripcion = "") {
        this.codigo = codigo ? codigo.trim() : "";
        this.nombre = nombre ? nombre.trim() : "";
        this.precio = Number(precio) || 0;
        this.stock = Number(stock) || 0; 
        this.descripcion = descripcion ? descripcion.trim() : "";
    }
    
    esValido() {
        if (!this.codigo) {
            return { esValido: false, mensaje: "El código es obligatorio." };
        }
        if (!this.nombre) {
            return { esValido: false, mensaje: "El nombre es obligatorio." };
        }
        if (this.precio <= 0) {
            return { esValido: false, mensaje: "El precio debe ser mayor a 0." };
        }
        if (this.stock < 0) {
            return { esValido: false, mensaje: "El stock no puede ser negativo." };
        }

        return { esValido: true, mensaje: "Juguete válido." };
    }
}