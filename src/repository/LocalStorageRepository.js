export class LocalStorageRepository {
    constructor(clave) {
        this.clave = clave;
    }

    todos() {
        try {
            return JSON.parse(localStorage.getItem(this.clave)) ?? [];
        } catch {
            return [];
        }
    }

    reemplazarTodos(datos) {
        localStorage.setItem(this.clave, JSON.stringify(datos));
    }

    guardar(objeto, id = 'codigo') {
        const datos = this.todos();
        const i = datos.findIndex(x => String(x[id]).trim() === String(objeto[id]).trim());
        
        if (i >= 0) {
            datos[i] = objeto; 
        } else {
            datos.push(objeto); 
        }
        
        this.reemplazarTodos(datos);
        return objeto;
    }

    eliminar(valor, id = 'codigo') {
        const datosFiltrados = this.todos().filter(x => String(x[id]).trim() !== String(valor).trim());
        this.reemplazarTodos(datosFiltrados);
    }
}