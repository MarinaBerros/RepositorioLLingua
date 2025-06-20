// templates.js - Colócalo en la misma carpeta que tu index.html
function cargarHeader() {
    return `
        <header>
        <div class="logo-titulo">
            <a href="../index.html" class="logo-link">
                <img src="../img/logo-llingua.png" alt="Logo Llingua Alluga">
                <h1>LA LLINGUA ALLUGA</h1>
            </a>
        </div>
        </header>
         <nav class="menu-principal">

           <div class="menu-item">
                <button class="menu-btn">BLOQUES</button>
                <div class="submenu">
                    <a href="bloques/bloque1.html">Bloque 1: Comunicación oral</a>
                    <a href="bloques/bloque2.html">Bloque 2: Comunicación escrita</a>
                    <a href="bloques/bloque3.html">Bloque 3: Dialectología</a>
                    <a href="bloques/bloque4.html">Bloque 4: Educación lliteraria</a>
                </div>
            </div>
            
        <div class="menu-item">
                <button class="menu-btn">SOBRE EL PROYECTO</button>
                <div class="submenu">
                    <a href="materiales/autoria.html">Autoria</a>
                    <a href="#">TFG</a>
                </div>
            </div>
            
          
            
            <div class="menu-item">
                <button class="menu-btn">RECURSOS DIGITALES</button>
                <div class="submenu">
                    <a href="#">Vídeos</a>
                    <a href="#">Otros blogs</a>
                    <a href="#">Diccionarios</a>
                </div>
            </div>
                </nav>
    `;
}

function cargarFooter() {
    return `
        <footer>
        <p>Repositoriu de la Llingua Alluga © 2025</p>
        <p>Proyeutu desarrolláu pola comunidá asturiana</p>
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