// templates.js - Colócalo en la misma carpeta que tu index.html
function cargarHeader() {
    // Obtener la ruta base dinámicamente
    const basePath = window.location.pathname.includes('/bloques/') || 
                    window.location.pathname.includes('/proyecto/') || 
                    window.location.pathname.includes('/recursos/') ? '../' : '';
    
    return `
    <header>
        <div class="logo-titulo">
            <a href="${basePath}index.html" class="logo-link">
                <img src="${basePath}img/logo-llingua.png" alt="Logo Llingua Alluga">
                <h1>LA LLINGUA ALLUGA</h1>
            </a>
        </div>

        <div class="buscador-avanzado">
            <div class="search-box">
                <input 
                    type="text" 
                    id="input-busqueda" 
                    class="buscador"
                    placeholder="Buscar documentos..." 
                    autocomplete="off"
                >
                <button id="btn-buscar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#555">
                        <path d="M11 3a8 8 0 0 1 6.32 12.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 1 1 11 3z"/>
                    </svg>
                </button>
            </div>
            <div id="sugerencias" class="sugerencias-container"></div>
        </div>
    </header>

    <nav class="menu-principal">
        <div class="menu-item">
            <button class="menu-btn">BLOQUES</button>
            <div class="submenu">
                <a href="${basePath}bloques/bloque1.html">Bloque 1: Comunicación oral</a>
                <a href="${basePath}bloques/bloque2.html">Bloque 2: Comunicación escrita</a>
                <a href="${basePath}bloques/bloque3.html">Bloque 3: Comunicación escrita</a>
                <a href="${basePath}bloques/bloque4.html">Bloque 4: Conocimiento de la llingua</a>
                <a href="${basePath}bloques/bloque5.html">Bloque 5: Educación lliteraria</a>
            </div>
        </div>

        <div class="menu-item">
            <button class="menu-btn">SOBRE EL PROYECTO</button>
            <div class="submenu">
                <a href="${basePath}proyecto/autoria.html">Autoria</a>
                <a href="${basePath}proyecto/TFG.html">TFG</a>
            </div>
        </div>
        
        <div class="menu-item">
            <button class="menu-btn">RECURSOS DIGITALES</button>
            <div class="submenu">
                <a href="${basePath}recursos/videos.html">Vídeos</a>
                <a href="${basePath}recursos/blogs.html">Otros blogs</a>
                <a href="${basePath}recursos/diccionarios.html">Diccionarios</a>
            </div>
        </div>
    </nav>
    `;
}
function cargarFooter() {
    return `
        <footer>
        <p>Repositoriu de la Llingua Alluga © 2025</p>
        <p>Marina Berros González</p>
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