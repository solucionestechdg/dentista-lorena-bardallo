// ========== CONFIGURACIÓN DE EmailJS ==========
const EMAILJS_SERVICE_ID = 'service_gpg7exa';
const EMAILJS_TEMPLATE_ID = 'template_l28757g'; // Email al dentista
const EMAILJS_TEMPLATE_CONFIRMACION = 'template_bc34sgu'; // Email de confirmación al cliente

// ========== SISTEMA DE NOTIFICACIONES (Toast) ==========
function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== VALIDACIÓN EN TIEMPO REAL ==========
function validarCampo(campo) {
    const valor = campo.value.trim();
    const container = campo.parentElement;
    let error = '';
    
    if (campo.id === 'nombre') {
        if (!valor) error = 'El nombre es requerido';
        else if (valor.length < 3) error = 'Mínimo 3 caracteres';
    }
    
    if (campo.id === 'email') {
        if (!valor) error = 'El email es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) error = 'Email inválido';
    }
    
    if (campo.id === 'mensaje') {
        if (!valor) error = 'El mensaje es requerido';
        else if (valor.length < 10) error = 'Mínimo 10 caracteres';
    }
    
    // Mostrar/ocultar error
    let errorDiv = container.querySelector('.error-message');
    if (error) {
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            container.appendChild(errorDiv);
        }
        errorDiv.textContent = error;
        campo.classList.add('is-invalid');
    } else {
        if (errorDiv) errorDiv.remove();
        campo.classList.remove('is-invalid');
    }
    
    return error === '';
}

// Función para esperar a que EmailJS esté disponible
function esperarEmailJS(callback, intentos = 0) {
    if (typeof emailjs !== 'undefined') {
        console.log('✅ EmailJS disponible');
        callback();
    } else if (intentos < 50) {
        setTimeout(() => esperarEmailJS(callback, intentos + 1), 100);
    } else {
        console.error('❌ EmailJS no se cargó después de 5 segundos');
        mostrarToast('Error: No se pudo conectar con el servicio de email', 'error');
    }
}

// Esperar a que EmailJS esté disponible y luego inicializar el formulario
esperarEmailJS(function() {
    const form = document.getElementById('contactForm');
    
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }
    
    console.log('✅ Formulario encontrado y listo');
    
    // ========== EVENTOS DE VALIDACIÓN EN TIEMPO REAL ==========
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    const terminos = document.getElementById('terminos');
    
    if (nombre) nombre.addEventListener('blur', () => validarCampo(nombre));
    if (email) email.addEventListener('blur', () => validarCampo(email));
    if (mensaje) mensaje.addEventListener('blur', () => validarCampo(mensaje));
    
    // ========== ENVÍO DEL FORMULARIO ==========
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Intenta enviar formulario');
        
        // Obtener los valores del formulario
        const nombreVal = nombre.value.trim();
        const emailVal = email.value.trim();
        const telefonoVal = document.getElementById('telefono').value.trim() || 'No proporcionado';
        const asuntoVal = document.getElementById('asunto').value;
        const mensajeVal = mensaje.value.trim();
        const aceptaTerminos = terminos ? terminos.checked : true;
        
        console.log('📋 Datos:', { nombreVal, emailVal, telefonoVal, asuntoVal, mensajeVal });
        
        // Validar campos
        const validNombre = validarCampo(nombre);
        const validEmail = validarCampo(email);
        const validMensaje = validarCampo(mensaje);
        
        if (!validNombre || !validEmail || !validMensaje) {
            mostrarToast('Por favor completa todos los campos correctamente', 'warning');
            return;
        }
        
        if (!asuntoVal) {
            mostrarToast('Por favor selecciona un asunto', 'warning');
            return;
        }
        
        if (!aceptaTerminos) {
            mostrarToast('Debes aceptar los términos y privacidad', 'warning');
            return;
        }
        
        // Mostrar carga
        const boton = document.querySelector('.contact-form button');
        const textoOriginal = boton.textContent;
        boton.textContent = 'Enviando...';
        boton.disabled = true;
        
        // Parámetros del email
        const templateParams = {
            to_email: 'info@dentista-lorena.com',
            user_name: nombreVal,
            user_email: emailVal,
            user_phone: telefonoVal,
            subject: asuntoVal,
            message: mensajeVal,
            reply_to: emailVal
        };
        
        console.log('📬 Enviando...');
        
        // Enviar email con timeout
        const timeoutId = setTimeout(function() {
            console.error('❌ Timeout: El envío tardó demasiado');
            mostrarToast('El envío tardó demasiado. Por favor intenta de nuevo', 'error');
            boton.textContent = textoOriginal;
            boton.disabled = false;
        }, 10000);
        
        // Enviar email a la clínica
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function(response) {
                clearTimeout(timeoutId);
                console.log('✅ Email enviado al dentista:', response);
                
                // Enviar confirmación al cliente
                const confirmacionParams = {
                    user_email: emailVal,
                    user_name: nombreVal,
                    subject: asuntoVal,
                    message: mensajeVal,
                    reply_to: emailVal
                };
                
                console.log('📬 Enviando confirmación al cliente:', emailVal);
                return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONFIRMACION, confirmacionParams);
            })
            .then(function(response) {
                console.log('✅ Confirmación enviada al cliente:', response);
                
                // Mostrar mensaje de éxito
                mostrarToast('¡Mensaje enviado! 📧 Te enviaremos confirmación a tu correo', 'success');
                
                // Mostrar resumen
                const resumen = document.createElement('div');
                resumen.className = 'envio-confirmado';

                const titulo = document.createElement('h3');
                titulo.textContent = '✅ Tu mensaje ha sido enviado';

                const de = document.createElement('p');
                const deStrong = document.createElement('strong');
                deStrong.textContent = 'De:';
                de.appendChild(deStrong);
                de.appendChild(document.createTextNode(` ${nombreVal} (${emailVal})`));

                const asunto = document.createElement('p');
                const asuntoStrong = document.createElement('strong');
                asuntoStrong.textContent = 'Asunto:';
                asunto.appendChild(asuntoStrong);
                asunto.appendChild(document.createTextNode(` ${asuntoVal}`));

                const mensajeLabel = document.createElement('p');
                const mensajeStrong = document.createElement('strong');
                mensajeStrong.textContent = 'Mensaje:';
                mensajeLabel.appendChild(mensajeStrong);

                const mensaje = document.createElement('p');
                mensaje.textContent = `"${mensajeVal}"`;
                mensaje.style.background = '#f0f0f0';
                mensaje.style.padding = '10px';
                mensaje.style.borderRadius = '5px';
                mensaje.style.maxHeight = '100px';
                mensaje.style.overflow = 'auto';

                const nota = document.createElement('p');
                nota.textContent = `Revisa tu email (${emailVal}) para la confirmación. La clínica se pondrá en contacto contigo pronto.`;
                nota.style.color = '#666';
                nota.style.fontSize = '0.9em';
                nota.style.marginTop = '15px';

                resumen.appendChild(titulo);
                resumen.appendChild(de);
                resumen.appendChild(asunto);
                resumen.appendChild(mensajeLabel);
                resumen.appendChild(mensaje);
                resumen.appendChild(nota);
                form.after(resumen);
                
                setTimeout(() => resumen.remove(), 10000);
                form.reset();
                boton.textContent = textoOriginal;
                boton.disabled = false;
            })
            .catch(function(error) {
                clearTimeout(timeoutId);
                console.error('❌ Error:', error);
                mostrarToast('Error al enviar. Por favor intenta de nuevo', 'error');
                boton.textContent = textoOriginal;
                boton.disabled = false;
            });
    });
});
