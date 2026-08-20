import { LocalStorageRepository } from './repository/LocalStorageRepository.js';
import { UIService } from './services/ui.js';

export class App {
    static precargarDatosIniciales() {
        const repoVendedores = new LocalStorageRepository('vendedores');
        const repoJuguetes = new LocalStorageRepository('juguetes');

        if (repoVendedores.todos().length === 0) {
            const vendedores = [
                { codigo: '1', nombre: 'Carlos Gómez', cedula: '1.234.567-8' },
                { codigo: '2', nombre: 'María Rodríguez', cedula: '4.567.890-1' },
                { codigo: '3', nombre: 'Ana Martínez', cedula: '3.111.222-3' },
                { codigo: '4', nombre: 'Lucía Fernández', cedula: '5.444.333-2' }
            ];
            vendedores.forEach(v => repoVendedores.guardar(v));
        }

        if (repoJuguetes.todos().length === 0) {
            const juguetes = [
                { codigo: 'J1', nombre: 'Oso de Peluche Gigante', precio: 850, stock: 10 },
                { codigo: 'J2', nombre: 'Auto a Control Remoto', precio: 1200, stock: 5 },
                { codigo: 'J3', nombre: 'Juego de Caja - Rompecabezas', precio: 450, stock: 20 },
                { codigo: 'J4', nombre: 'Set de Bloques de Construcción', precio: 990, stock: 8 },
                { codigo: 'J5', nombre: 'Muñeca Articulada con Accesorios', precio: 750, stock: 15 },
                { codigo: 'J6', nombre: 'Pista de Carreras de Madera', precio: 1850, stock: 4 }
            ];
            juguetes.forEach(j => repoJuguetes.guardar(j));
        }
    }

    static obtenerIcono(juguete) {
        if (!juguete) return '🎁';
        const txt = ((juguete.nombre || juguete.codigo || '')).toLowerCase();

        if (txt.includes('oso') || txt.includes('peluche') || txt.includes('j1')) return '🧸';
        if (txt.includes('auto') || txt.includes('carro') || txt.includes('remoto') || txt.includes('j2')) return '🏎️';
        if (txt.includes('rompecabezas') || txt.includes('juego') || txt.includes('puzzle') || txt.includes('j3')) return '🧩';
        if (txt.includes('bloque') || txt.includes('lego') || txt.includes('construccion') || txt.includes('j4')) return '🧱';
        if (txt.includes('muñeca') || txt.includes('princesa') || txt.includes('j5')) return '👸';
        if (txt.includes('pista') || txt.includes('tren') || txt.includes('j6')) return '🛤️';
        return '🎁';
    }

    static renderizarCatalogoDestacado() {
        const contenedor = document.getElementById('catalogo-destacado');
        if (!contenedor) return;

        const input = document.getElementById('input-buscar-index');
        const stockSel = document.getElementById('select-filtro-stock');

        const normalizarTexto = (str) => (str || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const term = normalizarTexto(input?.value || '');
        const filtroStock = stockSel?.value || 'todos';

        const repoJuguetes = new LocalStorageRepository('juguetes');
        let juguetes = repoJuguetes.todos();

        if (term) {
            juguetes = juguetes.filter(j => {
                const nombreNorm = normalizarTexto(j.nombre);
                const codigoNorm = normalizarTexto(j.codigo);
                const precioNorm = normalizarTexto(j.precio);
                return nombreNorm.includes(term) || codigoNorm.includes(term) || precioNorm.includes(term);
            });
        }

        if (filtroStock === 'disponible') {
            juguetes = juguetes.filter(j => j.stock !== undefined ? Number(j.stock) > 0 : true);
        } else if (filtroStock === 'agotado') {
            juguetes = juguetes.filter(j => j.stock !== undefined ? Number(j.stock) <= 0 : false);
        }

        if (juguetes.length === 0) {
            contenedor.innerHTML = `
                <div class="carousel-item active">
                    <p class="text-white text-center py-4 fs-5 mb-0">No se encontraron juguetes coincidentes.</p>
                </div>`;
            return;
        }

        const gruposJuguetes = [];
        for (let i = 0; i < juguetes.length; i += 3) {
            gruposJuguetes.push(juguetes.slice(i, i + 3));
        }

        contenedor.innerHTML = gruposJuguetes.map((grupo, indexGrupo) => {
            const claseActive = indexGrupo === 0 ? 'active' : '';

            const tarjetasHtml = grupo.map((juguete) => `
                <div class="col-md-4">
                    <div class="card shadow border-0 rounded-4 p-4 bg-white bg-opacity-95 h-100 border-top border-warning border-4 text-center d-flex flex-column">
                        <div class="display-4 mb-2">${App.obtenerIcono(juguete)}</div>
                        <span class="badge bg-primary align-self-center mb-2 font-monospace">Código: ${juguete.codigo}</span>
                        <h3 class="h5 fw-bold text-dark">${juguete.nombre}</h3>
                        <p class="text-success fw-bold fs-4 mb-1">$${juguete.precio}</p>
                        <p class="text-secondary small mb-3">Stock disponible: <strong>${juguete.stock !== undefined ? juguete.stock : '1+'}</strong> u.</p>
                        <a href="./vistas/ventas.html" class="btn btn-warning text-dark fw-semibold btn-sm mt-auto shadow-sm">
                            <i class="bi bi-cart-plus me-1"></i> Comprar / Vender
                        </a>
                    </div>
                </div>
            `).join('');

            return `
                <div class="carousel-item ${claseActive}">
                    <div class="row g-4">
                        ${tarjetasHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    static async cargarControladorPagina() {
        const path = window.location.pathname.toLowerCase();

        try {
            if (path.includes('estadisticas.html')) {
                const { EstadisticaController } = await import('./controllers/estadisticaController.js');
                if (EstadisticaController) new EstadisticaController();
            } else if (path.includes('ventas.html')) {
                if (!window.ventaControllerInstanciado) {
                    const { VentaController } = await import('./controllers/ventaController.js');
                    if (VentaController) {
                        new VentaController();
                        window.ventaControllerInstanciado = true;
                    }
                }
            } else if (path.includes('juguetes.html')) {
                const { JugueteController } = await import('./controllers/jugueteController.js');
                if (JugueteController) new JugueteController();
            } else if (path.includes('vendedores.html')) {
                const { VendedorController } = await import('./controllers/vendedorController.js');
                if (VendedorController) new VendedorController();
            }
        } catch (error) {
            console.error('Error al cargar dinámicamente el controlador:', error);
        }
    }

    static async init() {
        this.precargarDatosIniciales();

        if (typeof UIService?.activarNavegacion === 'function') {
            UIService.activarNavegacion();
        }

        this.renderizarCatalogoDestacado();
        await this.cargarControladorPagina();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});