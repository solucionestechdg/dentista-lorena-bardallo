// ========== BOTÓN FLOTANTE DE WHATSAPP ==========
document.addEventListener('DOMContentLoaded', function() {
    // Crear el botón de WhatsApp
    const whatsappBtn = document.createElement('a');
    whatsappBtn.id = 'whatsapp-btn';
    whatsappBtn.href = 'https://wa.me/34608836456?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20sus%20servicios%20dentales';
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener';
    whatsappBtn.title = 'Contactar por WhatsApp';
    whatsappBtn.innerHTML = '💬';
    
    document.body.appendChild(whatsappBtn);
    
    // Mostrar animación de entrada
    setTimeout(() => whatsappBtn.classList.add('show'), 500);
});
