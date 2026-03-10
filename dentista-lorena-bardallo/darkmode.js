// ========== DARK MODE ==========
document.addEventListener('DOMContentLoaded', function() {
    // Crear botón de dark mode
    const darkModeBtn = document.createElement('button');
    darkModeBtn.id = 'dark-mode-toggle';
    darkModeBtn.title = 'Cambiar tema';
    darkModeBtn.innerHTML = '🌙';
    darkModeBtn.type = 'button';
    
    // Agregar a la navegación
    const nav = document.querySelector('nav');
    if (nav) {
        nav.appendChild(darkModeBtn);
    } else {
        document.body.appendChild(darkModeBtn);
    }
    
    // Verificar si el usuario prefiere dark mode (desde localStorage o sistema)
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode === 'true' || (savedMode === null && prefersDark)) {
        enableDarkMode();
    }
    
    // Event listener para el botón
    darkModeBtn.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '☀️';
        localStorage.setItem('darkMode', 'true');
        console.log('🌙 Dark mode activado');
    }
    
    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        darkModeBtn.innerHTML = '🌙';
        localStorage.setItem('darkMode', 'false');
        console.log('☀️ Light mode activado');
    }
});
