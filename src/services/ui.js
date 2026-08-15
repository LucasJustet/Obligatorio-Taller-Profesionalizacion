export class UIService {
    static mostrarNotificacion(mensaje, tipo = 'danger') {
        let contenedor = document.getElementById('toast-container');
        
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.id = 'toast-container';
            contenedor.className = 'position-fixed bottom-0 end-0 p-3';
            contenedor.style.zIndex = '1100';
            document.body.appendChild(contenedor);
        }

        const iconos = {
            success: '✅',
            danger: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        const icono = iconos[tipo] || 'ℹ️';

        const toastId = 'toast-' + Date.now();
        const html = `
            <div id="${toastId}" class="toast align-items-center text-bg-${tipo} border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex align-items-center">
                    <div class="toast-body fw-semibold fs-6">
                        <span class="me-2" aria-hidden="true">${icono}</span>
                        <span>${mensaje}</span>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar notificación"></button>
                </div>
            </div>
        `;

        contenedor.insertAdjacentHTML('beforeend', html);
        const toastElement = document.getElementById(toastId);
        
        if (window.bootstrap) {
            const toast = new bootstrap.Toast(toastElement, { delay: 3500 });
            toast.show();
        }

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
     
    static marcarInvalido(inputElement, mensajeError = 'Campo requerido') {
        if (!inputElement) return;
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid');
        
        let feedback = inputElement.nextElementSibling;
        if (!feedback || (!feedback.classList.contains('invalid-feedback') && !feedback.classList.contains('valid-feedback'))) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback fw-semibold mt-1';
            inputElement.parentNode.insertBefore(feedback, inputElement.nextSibling);
        } else {
            feedback.className = 'invalid-feedback fw-semibold mt-1';
        }
        
        feedback.innerHTML = `${mensajeError}`;
    }

    static marcarValido(inputElement, mensajeExito = '¡Correcto!') {
        if (!inputElement) return;
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        
        let feedback = inputElement.nextElementSibling;
        if (!feedback || (!feedback.classList.contains('invalid-feedback') && !feedback.classList.contains('valid-feedback'))) {
            feedback = document.createElement('div');
            feedback.className = 'valid-feedback fw-semibold mt-1';
            inputElement.parentNode.insertBefore(feedback, inputElement.nextSibling);
        } else {
            feedback.className = 'valid-feedback fw-semibold mt-1';
        }
        
        feedback.innerHTML = `${mensajeExito}`;
    }
     
    static limpiarErrores(formElement) {
        if (!formElement) return;
        
        const inputsInvalidos = formElement.querySelectorAll('.is-invalid');
        inputsInvalidos.forEach(input => input.classList.remove('is-invalid'));

        const inputsValidos = formElement.querySelectorAll('.is-valid');
        inputsValidos.forEach(input => input.classList.remove('is-valid'));

        const feedbacks = formElement.querySelectorAll('.invalid-feedback, .valid-feedback');
        feedbacks.forEach(f => {
            if (!f.id) {
                f.remove();
            } else {
                f.innerHTML = '';
            }
        });
    }

    static activarNavegacion() {
        const navLinks = document.querySelectorAll('.nav-link, [data-view]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
}