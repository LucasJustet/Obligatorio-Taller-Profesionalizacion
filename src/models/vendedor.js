export class Vendedor {
    constructor(codigo, nombre, cedula) {
        this.codigo = codigo ? codigo.trim() : "";
        this.nombre = nombre ? nombre.trim() : "";
        this.cedula = cedula ? cedula.trim() : "";
    }
    esValido() {
        if (!this.codigo) {
            return { esValido: false, mensaje: "El código es obligatorio." };
        }
        if (!this.nombre) {
            return { esValido: false, mensaje: "El nombre es obligatorio." };
        }
        if (!this.cedula) {
            return { esValido: false, mensaje: "La cédula es obligatoria." };
        }

        return { esValido: true, mensaje: "Vendedor válido." };
    }
}