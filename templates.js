// templates.js - Colócalo en la misma carpeta que tu index.html
function cargarHeader() {
    return `
        <header>
        <div class="logo-titulo">
            <a href="index.html" class="logo-link">
                <img src="img/logo-llingua.png" alt="Logo Llingua Alluga">
                <h1>LA LLINGUA ALLUGA</h1>
            </a>
        </div>
        <div class="buscador-container">
            <div class="buscador-box">
                <input 
                    type="text" 
                    id="busqueda" 
                    class="buscador"  <!-- Añade esta clase -->
                    placeholder="Buscar por nombre, bloque o palabra clave..." 
                    autocomplete="off"
                >
                <button class="btn-buscar" onclick="buscarPDF()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </button>
            </div>
            <div id="suggestions" class="suggestions-box"></div>
        </div>
        </header>
       
        <nav class="menu-principal">
            <!-- ... tu menú actual ... -->
        </nav>
    `;
}

function cargarFooter() {
    return `
        <footer>
            <p>© 2025 LA LLINGUA ALLUGA</p>
        </footer>
    `;
}

// Carga automática si se incluye directamente
if (typeof window !== 'undefined') {
    if (document.getElementById('header-container')) {
        document.getElementById('header-container').innerHTML = cargarHeader();
    }
    if (document.getElementById('footer-container')) {
        document.getElementById('footer-container').innerHTML = cargarFooter();
    }
}