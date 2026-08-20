import { LocalStorageRepository } from '../repository/LocalStorageRepository.js';

export class EstadisticaController {
    constructor() {
        this.repoVentas = new LocalStorageRepository('ventas');
        this.repoJuguetes = new LocalStorageRepository('juguetes');
        this.repoVendedores = new LocalStorageRepository('vendedores');

        this.init();
    }

    init() {
        this.calcularYRenderizar();

        const btnActualizar = document.getElementById('btn-actualizar-stats');
        btnActualizar?.addEventListener('click', () => {
            this.calcularYRenderizar();
        });
    }
    
    obtenerNombreLimpio(valor) {
        if (!valor) return 'Desconocido';
        if (typeof valor === 'string') return valor;
        if (typeof valor === 'object') {
            return valor.nombre || valor.nombreVendedor || valor.nombreJuguete || valor.codigo || 'Desconocido';
        }
        return String(valor);
    }

    calcularYRenderizar() {
        const ventas = this.repoVentas.todos();
        const juguetes = this.repoJuguetes.todos();
        const vendedores = this.repoVendedores.todos();
        
        const totalVentas = ventas.length;
        let totalIngresos = 0;
        
        const ventasPorVendedor = {};
        const ventasPorJuguete = {};

   
        ventas.forEach(v => {
            totalIngresos += Number(v.total) || Number(v.precio) || 0;

            const vNombre = this.obtenerNombreLimpio(v.vendedorNombre || v.vendedor);
            ventasPorVendedor[vNombre] = (ventasPorVendedor[vNombre] || 0) + 1;

            const jNombre = this.obtenerNombreLimpio(v.jugueteNombre || v.juguete);
            const cantidad = Number(v.cantidad) || 1;
            ventasPorJuguete[jNombre] = (ventasPorJuguete[jNombre] || 0) + cantidad;
        });

    
        const stockTotal = juguetes.reduce((acc, j) => acc + (Number(j.stock) || 0), 0);
        const ticketPromedio = totalVentas > 0 ? (totalIngresos / totalVentas) : 0;
        
        let topVendedor = 'Sin ventas';
        let maxVentasVend = 0;
        Object.entries(ventasPorVendedor).forEach(([nombre, cant]) => {
            if (cant > maxVentasVend) {
                maxVentasVend = cant;
                topVendedor = nombre;
            }
        });

        let topJuguete = 'Sin ventas';
        let maxCantJuguete = 0;
        Object.entries(ventasPorJuguete).forEach(([nombre, cant]) => {
            if (cant > maxCantJuguete) {
                maxCantJuguete = cant;
                topJuguete = nombre;
            }
        });


        this.setTexto('stat-ingresos', `$${totalIngresos.toLocaleString('es-UY', { minimumFractionDigits: 2 })}`);
        this.setTexto('stat-ventas', totalVentas);
        this.setTexto('stat-stock', stockTotal);
        this.setTexto('stat-juguetes', juguetes.length);
        this.setTexto('stat-vendedores', vendedores.length);
        this.setTexto('stat-ticket-promedio', `$${ticketPromedio.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        this.setTexto('stat-top-vendedor', topVendedor);
        this.setTexto('stat-top-vendedor-info', `${maxVentasVend} ventas realizadas`);
        
        this.setTexto('stat-top-juguete', topJuguete);
        this.setTexto('stat-top-juguete-info', `${maxCantJuguete} unidades vendidas`);
    }

    setTexto(id, valor) {
        const el = document.getElementById(id);
        if (el) el.textContent = valor;
    }
}