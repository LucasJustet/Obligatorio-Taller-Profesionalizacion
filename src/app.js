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

    static renderizarCatalogoDestacado() {
        const contenedor = document.getElementById('catalogo-destacado');
        if (!contenedor) return;

        const repoJuguetes = new LocalStorageRepository('juguetes');
        const juguetes = repoJuguetes.todos();

        if (juguetes.length === 0) {
            contenedor.innerHTML = '<div class="carousel-item active"><p class="text-white text-center py-4">No hay juguetes disponibles por el momento.</p></div>';
            return;
        }

        const iconos = ['🧸', '🏎️', '🧩', '🧱', '👸', '🛤️']; 
        const gruposJuguetes = [];
        for (let i = 0; i < juguetes.length; i += 3) {
            gruposJuguetes.push(juguetes.slice(i, i + 3));
        }

        contenedor.innerHTML = gruposJuguetes.map((grupo, indexGrupo) => {
            const claseActive = indexGrupo === 0 ? 'active' : '';
            
            const tarjetasHtml = grupo.map((juguete) => {
                const indiceReal = juguetes.findIndex(j => j.codigo === juguete.codigo);
                const icono = iconos[indiceReal % iconos.length];

                return `
                    <div class="col-md-4">
                        <div class="card shadow border-0 rounded-4 p-4 bg-white bg-opacity-95 h-100 border-top border-warning border-4 text-center d-flex flex-column">
                            <div class="display-4 mb-2">${icono}</div>
                            <span class="badge bg-primary align-self-center mb-2 font-monospace">Código: ${juguete.codigo}</span>
                            <h3 class="h5 fw-bold text-dark">${juguete.nombre}</h3>
                            <p class="text-success fw-bold fs-4 mb-1">$${juguete.precio}</p>
                            <p class="text-secondary small mb-3">Stock disponible: <strong>${juguete.stock}</strong> u.</p>
                            <a href="./views/ventas.html" class="btn btn-warning text-dark fw-semibold btn-sm mt-auto shadow-sm">
                                <i class="bi bi-cart-plus me-1"></i> Comprar / Vender
                            </a>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="carousel-item ${claseActive}">
                    <div class="row g-4">
                        ${tarjetasHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    static init() {
        this.precargarDatosIniciales();
        UIService.activarNavegacion();
        this.renderizarCatalogoDestacado();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});