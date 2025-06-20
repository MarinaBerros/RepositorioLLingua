// Verificar carga de PDF.js
if (typeof window['pdfjs-dist/build/pdf'] === 'undefined') {
    console.error('PDF.js no se cargó correctamente');
    // Cargar manualmente si falla
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
    script.onload = initPDFViewer;
    document.head.appendChild(script);
} else {
    initPDFViewer();
}

const documentos = [
    {
        nombre: "Xuegu animales espresión oral",
        archivo: "xuegu_animales_expresion_oral.pdf",
        bloque: "bloque1",
        ruta: "/RepositorioLLingua/pdfs/bloque1/xuegu_animales_expresion_oral.pdf"
    },
    {
        nombre: "Madreñes - Comprensión y espresión escrita",
        archivo: "madrenes_comprension_expresion_escrita.pdf",
        bloque: "bloque3",
        ruta: "/RepositorioLLingua/pdfs/bloque3/madrenes_comprension_expresion_escrita.pdf"
    }
];


function verPDF(ruta) {
    // Abre el PDF en una nueva pestaña con el visor nativo
    window.open(ruta, '_blank');
}

function initPDFViewer() {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    // Documentos disponibles (versión simplificada)
    const documentos = [
        {
            nombre: "Xuegu animales espresión oral",
            archivo: "xuegu_animales_expresion_oral.pdf",
            bloque: "bloque1",
            ruta: "/RepositorioLLingua/pdfs/bloque1/xuegu_animales_expresion_oral.pdf"
        },
        {
            nombre: "Madreñes - Comprensión y espresión escrita",
            archivo: "madrenes_comprension_expresion_escrita.pdf",
            bloque: "bloque3",
            ruta: "/RepositorioLLingua/pdfs/bloque3/madrenes_comprension_expresion_escrita.pdf"
          },

    ];

    // Función principal mejorada
    async function mostrarMiniaturas(bloque) {
        console.log(`Mostrando documentos para bloque: ${bloque}`);
        const contenedor = document.getElementById('contenedor-documentos');
        
        if (!contenedor) {
            console.error('Contenedor no encontrado');
            return;
        }

        contenedor.innerHTML = '<p class="cargando">Cargando documentos...</p>';
        
        const docs = documentos.filter(doc => doc.bloque === bloque);
        if (docs.length === 0) {
            contenedor.innerHTML = '<p class="aviso">No hay documentos en este bloque</p>';
            return;
        }

        contenedor.innerHTML = '';
        
        for (const doc of docs) {
            const card = document.createElement('div');
            card.className = 'doc-card';
            
            // Vista previa del PDF
            const previewDiv = document.createElement('div');
            previewDiv.className = 'doc-preview';
            previewDiv.innerHTML = `
                <div class="doc-thumbnail" id="thumb-${doc.archivo.replace('.pdf', '')}">
                    <span class="loading-text">Generando vista previa...</span>
                </div>
                <div class="doc-info">
                    <h3>${doc.nombre}</h3>
                    <button class="ver-btn" onclick="verPDF('${doc.ruta}')">Ver en navegador</button>
                    <a href="${doc.ruta}" class="btn-descargar" target="_blank">Descargar PDF</a>
                   
                </div>
            `;
            
            card.appendChild(previewDiv);
            contenedor.appendChild(card);

            // Intento de generar miniatura
            try {
                const pdf = await pdfjsLib.getDocument(doc.ruta).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.35 });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                const thumbContainer = document.getElementById(`thumb-${doc.archivo.replace('.pdf', '')}`);
                thumbContainer.innerHTML = '';
                thumbContainer.appendChild(canvas);
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                console.log(`Miniatura generada para: ${doc.nombre}`);
            } catch (error) {
                console.error(`Error al generar miniatura para ${doc.nombre}:`, error);
                const thumbContainer = document.getElementById(`thumb-${doc.archivo.replace('.pdf', '')}`);
                if (thumbContainer) {
                    thumbContainer.innerHTML = '<span class="error-text">Vista previa no disponible</span>';
                }
            }
        }
    }

    // Inicialización automática mejorada
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM completamente cargado');
        
        // Determinar bloque actual
        const path = window.location.pathname;
        let bloqueActual = '';
        
        if (path.includes('bloque1')) bloqueActual = 'bloque1';
        if (path.includes('bloque2')) bloqueActual = 'bloque2';
        if (path.includes('bloque3')) bloqueActual = 'bloque3';
        if (path.includes('bloque4')) bloqueActual = 'bloque4';
        
        if (bloqueActual) {
            console.log(`Inicializando bloque: ${bloqueActual}`);
            mostrarMiniaturas(bloqueActual);
        } else {
            console.log('Página principal detectada');
            // Inicializar buscador o destacados si es necesario
        }
        
        // Verificar que todo funciona
        console.log('Documentos disponibles:', documentos);
        console.log('PDF.js cargado correctamente:', typeof pdfjsLib !== 'undefined');
    });
}

// Buscar documentos
function buscarDocumentos(termino) {
    return documentos.filter(doc => 
        doc.nombre.toLowerCase().includes(termino) || 
        doc.bloque.toLowerCase().includes(termino)
    );
}

// Mostrar sugerencias
document.getElementById('input-busqueda').addEventListener('input', function() {
    const termino = this.value.toLowerCase();
    const sugerenciasBox = document.getElementById('sugerencias');
    sugerenciasBox.innerHTML = '';

    if (termino.length < 2) {
        sugerenciasBox.style.display = 'none';
        return;
    }

    const resultados = buscarDocumentos(termino).slice(0, 5);
    
    if (resultados.length > 0) {
        resultados.forEach(doc => {
            const item = document.createElement('div');
            item.className = 'sugerencia-item';
            item.textContent = doc.nombre;
            item.addEventListener('click', () => {
                document.getElementById('input-busqueda').value = doc.nombre;
                mostrarResultados([doc]);
                sugerenciasBox.style.display = 'none';
            });
            sugerenciasBox.appendChild(item);
        });
        sugerenciasBox.style.display = 'block';
    } else {
        sugerenciasBox.style.display = 'none';
    }
});

// Función para mostrar resultados en formato lista
function mostrarResultados(resultados) {
    const contenedor = document.getElementById('resultados-busqueda');
    contenedor.innerHTML = '';

    if (resultados.length === 0) {
        contenedor.innerHTML = '<p class="aviso">No se encontraron documentos</p>';
        return;
    }

    resultados.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'item-lista';
        item.innerHTML = `
            <span class="item-texto">${doc.nombre}</span>
            <div class="botones-mini">
                <button class="btn-mini btn-ver" onclick="window.open('${doc.ruta}', '_blank')">Ver</button>
                <a href="${doc.ruta}" download class="btn-mini btn-descargar">Descargar</a>
            </div>
        `;
        contenedor.appendChild(item);
    });
}

// templates.js
function cargarHeader() {
    document.write(`
        <header>
        <div class="logo-titulo">
            <a href="index.html" class="logo-link">
                <img src="img/logo-llingua.png" alt="Logo Llingua Alluga">
                <h1>LA LLINGUA ALLUGA</h1>
            </a>
        </div>
        <!-- Reemplaza tu buscador actual con este -->
        <div class="buscador-container">
            <div class="buscador-box">
                <input 
                    type="text" 
                    id="busqueda" 
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
            <div class="menu-item">
                <button class="menu-btn">SOBRE EL PROYECTO</button>
                <div class="submenu">
                    <a href="materiales/autoria.html">Autoria</a>
                    <a href="#">TFG</a>
                </div>
            </div>
            
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
                <button class="menu-btn">RECURSOS DIGITALES</button>
                <div class="submenu">
                    <a href="#">Vídeos</a>
                    <a href="#">Otros blogs</a>
                    <a href="#">Diccionarios</a>
                </div>
            </div>
        </nav>
    `);
}

function cargarFooter() {
    document.write(`
        <footer>
            <p>© 2025 LA LLINGUA ALLUGA</p>
        </footer>
    `);
}