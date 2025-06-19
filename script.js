// Configuración robusta de PDF.js
const initPDFViewer = () => {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    // Base URL para los PDFs (usando GitHub raw content)
    const BASE_URL = 'https://raw.githubusercontent.com/MarinaBerros/RepositorioLlingua/main/';

    // Documentos con rutas absolutas
    const documentos = [
        {
            nombre: "Xuegu animales espresión oral",
            archivo: "xuegu_animales_expresion_oral.pdf",
            bloque: "bloque1",
            ruta: BASE_URL + "pdfs/bloque1/xuegu_animales_expresion_oral.pdf"
        },
        {
            nombre: "Madreñes - Comprensión y espresión escrita",
            archivo: "madrenes_comprension_expresion_escrita.pdf",
            bloque: "bloque3",
            ruta: BASE_URL + "pdfs/bloque3/madrenes_comprension_expresion_escrita.pdf"
        }
    ];

    // Función mejorada para mostrar miniaturas
    const mostrarMiniaturas = async (bloque) => {
        const contenedor = document.getElementById('contenedor-documentos');
        if (!contenedor) {
            console.error('Contenedor no encontrado');
            return;
        }

        contenedor.innerHTML = '<div class="loading-state">Cargando documentos...</div>';
        
        const docs = documentos.filter(doc => doc.bloque === bloque);
        if (docs.length === 0) {
            contenedor.innerHTML = '<div class="empty-state">No hay documentos en este bloque</div>';
            return;
        }

        contenedor.innerHTML = '';
        
        for (const doc of docs) {
            const card = document.createElement('div');
            card.className = 'doc-card';
            
            card.innerHTML = `
                <div class="doc-preview">
                    <div class="doc-thumbnail" id="thumb-${doc.archivo.replace('.pdf', '')}">
                        <div class="thumbnail-loader">
                            <div class="spinner"></div>
                            <span>Cargando vista previa</span>
                        </div>
                    </div>
                    <div class="doc-info">
                        <h3>${doc.nombre}</h3>
                        <a href="${doc.ruta}" class="btn-descargar" target="_blank" rel="noopener noreferrer">
                            Descargar PDF
                        </a>
                    </div>
                </div>
            `;
            
            contenedor.appendChild(card);

            try {
                console.log('Cargando PDF desde:', doc.ruta);
                const pdf = await pdfjsLib.getDocument({
                    url: doc.ruta,
                    withCredentials: false
                }).promise;
                
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
                
                console.log('Miniatura generada con éxito');
            } catch (error) {
                console.error('Error al generar miniatura:', error);
                const thumbContainer = document.getElementById(`thumb-${doc.archivo.replace('.pdf', '')}`);
                if (thumbContainer) {
                    thumbContainer.innerHTML = `
                        <div class="error-state">
                            <p>Vista previa no disponible</p>
                            <a href="${doc.ruta}" target="_blank" class="btn-descargar">
                                Descargar PDF directamente
                            </a>
                        </div>
                    `;
                }
            }
        }
    };

    // Inicialización mejorada
    const init = () => {
        const path = window.location.pathname;
        console.log('Ruta actual:', path);
        
        const bloqueMatch = path.match(/bloque(\d)\.html/);
        if (bloqueMatch) {
            const bloqueNum = bloqueMatch[1];
            console.log(`Cargando bloque ${bloqueNum}`);
            mostrarMiniaturas(`bloque${bloqueNum}`);
        } else if (path.includes('index.html') || path === '/') {
            console.log('Página principal cargada');
            // Inicializar contenido de la página principal si es necesario
        }
    };

    // Verificar que el DOM está listo
    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
};

// Carga segura de PDF.js
if (typeof window['pdfjs-dist/build/pdf'] === 'undefined') {
    console.log('Cargando PDF.js dinámicamente...');
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
    script.onload = initPDFViewer;
    script.onerror = () => console.error('Error al cargar PDF.js');
    document.head.appendChild(script);
} else {
    initPDFViewer();
}