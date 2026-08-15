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
                { codigo: '3', nombre: 'Ana Martínez', cedula: '3.111.222-3' }
            ];
            vendedores.forEach(v => repoVendedores.guardar(v));
        }

        if (repoJuguetes.todos().length === 0) {
            const juguetes = [
                { codigo: 'J1', nombre: 'Oso de Peluche Gigante', precio: 850, stock: 10 },
                { codigo: 'J2', nombre: 'Auto a Control Remoto', precio: 1200, stock: 5 },
                { codigo: 'J3', nombre: 'Juego de Caja - Rompecabezas', precio: 450, stock: 20 }
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
            contenedor.innerHTML = '<p class="text-white text-center">No hay juguetes disponibles por el momento.</p>';
            return;
        }
        const iconos = ['🧸', '🏎️', '🧩', '🚀', '🎨', '🎲'];

        contenedor.innerHTML = juguetes.map((juguete, index) => {
            const icono = iconos[index % iconos.length];
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