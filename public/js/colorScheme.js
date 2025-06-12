// Función para aplicar el tema
function applyTheme(isDark) {
  console.log('Aplicando tema:', isDark ? 'oscuro' : 'claro');
  
  // Remover clases existentes primero
  document.documentElement.classList.remove('dark', 'light');
  
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  }

  // Actualizar los iconos de Feather
  if (typeof feather !== 'undefined') {
    console.log('Actualizando iconos Feather');
    feather.replace();
  }

  // Actualizar el botón de tema si existe
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const sunIcon = themeToggle.querySelector('[data-feather="sun"]');
    const moonIcon = themeToggle.querySelector('[data-feather="moon"]');
    
    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
    }
  }
}

// Función para obtener el tema actual
function getCurrentTheme() {
  // Primero verificar si hay una preferencia guardada
  const savedTheme = localStorage.getItem('theme');
  console.log('Tema guardado:', savedTheme);
  
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  
  // Si no hay preferencia guardada, usar la preferencia del sistema
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log('Preferencia del sistema:', systemPrefersDark ? 'oscuro' : 'claro');
  return systemPrefersDark;
}

// Función para alternar el tema
function toggleTheme() {
  console.log('Cambiando tema');
  const isDark = !document.documentElement.classList.contains('dark');
  applyTheme(isDark);
}

// Inicializar el tema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, inicializando tema');
  const isDark = getCurrentTheme();
  applyTheme(isDark);

  // Escuchar cambios en la preferencia del sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    console.log('Cambio en preferencia del sistema:', e.matches ? 'oscuro' : 'claro');
    // Solo aplicar si no hay una preferencia guardada
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches);
    }
  });

  // Agregar listener al botón de tema si existe
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    console.log('Botón de tema encontrado');
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  } else {
    console.log('Botón de tema no encontrado');
  }
});

// Exportar las funciones para uso global
window.toggleTheme = toggleTheme;
window.getCurrentTheme = getCurrentTheme;
window.applyTheme = applyTheme;

// Aplicar tema inmediatamente si el DOM ya está cargado
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log('DOM ya cargado, aplicando tema inmediatamente');
  const isDark = getCurrentTheme();
  applyTheme(isDark);
}
