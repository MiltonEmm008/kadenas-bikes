// /js/admin-dashboardScript.js

//PARA TODAS
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const mainContentShell = document.getElementById("main-content"); // The div that slides relative to sidebar
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkModeIcon = document.getElementById("darkModeIcon");
  const darkModeText = document.getElementById("darkModeText");

  const mainContentArea = document.getElementById("page-content-area"); // Target for dynamic content
  const pageTitleElement = document.querySelector("#main-content header h2"); // Target for dynamic page title

  const navLinks = sidebar.querySelectorAll("nav a");

  // --- Initializations for static shell ---
  AOS.init({ duration: 800, once: false }); // once:false if content reloads trigger aos too
  feather.replace();

  // --- Sidebar Toggle for Mobile ---
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("-translate-x-full");
    });
  }

  // --- Dark Mode Logic ---
  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      darkModeIcon.setAttribute("data-feather", "sun");
      darkModeText.textContent = "Modo Claro";
    } else {
      document.documentElement.classList.remove("dark");
      darkModeIcon.setAttribute("data-feather", "moon");
      darkModeText.textContent = "Modo Oscuro";
    }
    feather.replace(); // Re-render icons like sun/moon
  };

  let isDarkModeUserPref = localStorage.getItem("darkMode") === "true";
  if (
    localStorage.getItem("darkMode") === null &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    isDarkModeUserPref = true; // Default to system preference if no user pref
  }
  applyDarkMode(isDarkModeUserPref);

  darkModeToggle.addEventListener("click", () => {
    const currentIsDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("darkMode", !currentIsDark);
    applyDarkMode(!currentIsDark);
  });

  // --- Dynamic Content Loading Logic ---
  async function loadSectionContent(sectionName) {
    if (!sectionName) sectionName = "inicio"; // Default section

    if (
      window.adminSections &&
      window.adminSections.sections &&
      window.adminSections.sections[sectionName]
    ) {
      const sectionData = window.adminSections.sections[sectionName];

      if (mainContentArea) {
        // Si la función html es async, espera el resultado
        const htmlResult =
          sectionData.html.constructor.name === "AsyncFunction"
            ? await sectionData.html()
            : sectionData.html();
        mainContentArea.innerHTML = htmlResult;
        // Ejecutar la función init después de inyectar el HTML
        if (typeof sectionData.init === "function") {
          await sectionData.init();
        }
      } else {
        console.error(
          'Error: mainContentArea (id="page-content-area") not found.'
        );
        return;
      }

      if (pageTitleElement && sectionData.title) {
        pageTitleElement.textContent = sectionData.title;
      }

      // Highlight active link in sidebar
      navLinks.forEach((navLink) => {
        navLink.classList.remove("bg-orange-500", "text-white");
        if (navLink.getAttribute("href") === `#${sectionName}`) {
          navLink.classList.add("bg-orange-500", "text-white");
        }
      });

      // Re-initialize Feather Icons and AOS for the new content
      if (typeof feather !== "undefined") {
        feather.replace();
      }
      if (typeof AOS !== "undefined") {
        AOS.refreshHard(); // Use refreshHard for potentially completely new DOM structures
      }

      // Scroll to the top of the newly loaded content area
      if (mainContentArea) mainContentArea.scrollTop = 0;
      document.documentElement.scrollTop = 0; // Also scroll window to top
    } else {
      if (mainContentArea) {
        mainContentArea.innerHTML = `<div class="container mx-auto text-center py-10"><p class="text-xl text-red-500">Error: La sección '${sectionName}' no se encontró.</p></div>`;
      }
      if (pageTitleElement) {
        pageTitleElement.textContent = "Error";
      }
      console.error(
        `Error: Section '${sectionName}' not defined in window.adminSections.sections.`
      );
    }
  }

  // --- Navigation Event Handling ---
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const sectionName = this.getAttribute("href").substring(1);

      // For SPA-like behavior, prevent full page reload if it's just a hash
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        window.location.hash = sectionName; // This will trigger the 'hashchange' event
      }
      // If it were a full URL, let the browser handle it:
      // else { return true; }

      // Close sidebar on mobile after click
      if (window.innerWidth < 768) {
        // Tailwind's 'md' breakpoint
        sidebar.classList.add("-translate-x-full");
      }
    });
  });

  // --- Handle Hash Changes for Navigation ---
  function handleHashChange() {
    const sectionNameFromHash = window.location.hash.substring(1) || "inicio";
    loadSectionContent(sectionNameFromHash);
  }

  window.addEventListener("hashchange", handleHashChange);

  // --- Initial Page Load ---
  // Load content based on the initial hash or default to 'inicio'
  handleHashChange();
});

// Función para abrir el modal
function toggleModal() {
  const modal = document.getElementById("customModal");
  modal.classList.toggle("hidden");
}

// Asocia el botón de cierre
document.getElementById("modalClose").addEventListener("click", toggleModal);
