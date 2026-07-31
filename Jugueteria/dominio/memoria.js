class Memoria {
    constructor(){}
    leer(clave){
        const datos = localStorage.getItem(clave);
        if (datos) {
            return JSON.parse(datos);
        }
        return null;
    }
    escribir(clave, dato){
        localStorage.setItem(clave, JSON.stringify(dato));
    }
}