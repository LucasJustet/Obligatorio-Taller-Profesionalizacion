import { LocalStorageRepository } from '../repository/LocalStorageRepository.js';

export class EstadisticaController {
    constructor() {
        this.ventaRepo = new LocalStorageRepository('ventas');
        this.jugueteRepo = new LocalStorageRepository('juguetes');
        this.vendedorRepo = new LocalStorageRepository('vendedores');
        this.container = document.getElementById('contenedor-stats');
        this.init();
    }

    init() {
        this.calcularEstadisticas();
        const btn = document.getElementById('btn-actualizar-stats');
        btn?.addEventListener('click', () => this.calcularEstadisticas());
    }

    calcularEstadisticas() {
        if (this.container) this.container.setAttribute('aria-busy', 'true');

        try {
            const ventas = this.ventaRepo.todos();
            const juguetes = this.jugueteRepo.todos();
            const vendedores = this.vendedorRepo.todos();

            const ingresos = ventas.reduce((acc, v) => {
                const total = v.total || (v.juguete?.precio * v.cantidad) || 0;
                return acc + Number(total);
            }, 0);

            this.actualizarTexto('stat-ingresos', `$${ingresos.toFixed(2)}`);
            this.actualizarTexto('stat-ventas', ventas.length);
            this.actualizarTexto('stat-stock', juguetes.reduce((acc, j) => acc + Number(j.stock || 0), 0));
            this.actualizarTexto('stat-juguetes', juguetes.length);
            this.actualizarTexto('stat-vendedores', vendedores.length);
            
        } catch (error) {
            console.error("Error al calcular estadísticas:", error);
        } finally {
       
            if (this.container) this.container.setAttribute('aria-busy', 'false');
        }
    }

    actualizarTexto(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.style.transition = "opacity 0.3s";
            elemento.style.opacity = "0";
            setTimeout(() => {
                elemento.textContent = valor;
                elemento.style.opacity = "1";
            }, 150);
        }
    }
}